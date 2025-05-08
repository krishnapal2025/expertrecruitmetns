import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isFlyIo = process.env.FLY_APP_NAME !== undefined;
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "robert-half-job-portal-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: isProduction, // Use secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days for longer sessions
      sameSite: isFlyIo ? 'none' : 'lax', // Critical fix for Fly.io
      domain: isFlyIo ? process.env.COOKIE_DOMAIN : undefined // Set domain in production
    },
    // These settings help with session persistence on Fly.io
    proxy: isFlyIo
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Invalid email or password" });
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Generic registration endpoint to match PHP API
  app.post("/api/register", async (req, res, next) => {
    try {
      const { 
        email, password, userType, 
        // Job seeker fields
        firstName, lastName, gender, dateOfBirth, country, phoneNumber,
        // Employer fields 
        companyName, industry, companySize, description, logoPath, websiteUrl
      } = req.body;

      if (!email || !password || !userType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!['jobseeker', 'employer'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create user first
      const user = await storage.createUser({
        email,
        password: await hashPassword(password),
        userType
      });

      let profile;
      if (userType === 'jobseeker') {
        // Create job seeker profile
        profile = await storage.createJobSeeker({
          userId: user.id,
          firstName: firstName || '',
          lastName: lastName || '',
          gender: gender || '',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
          country: country || '',
          phoneNumber: phoneNumber || ''
        });
      } else if (userType === 'employer') {
        // Create employer profile
        profile = await storage.createEmployer({
          userId: user.id,
          companyName: companyName || '',
          industry: industry || '',
          companySize: companySize || '',
          description: description || '',
          logoPath: logoPath || null,
          websiteUrl: websiteUrl || null
        });
      }

      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Jobseeker registration
  app.post("/api/register/jobseeker", async (req, res, next) => {
    try {
      const { 
        email, password, firstName, lastName, 
        gender, dateOfBirth, country, phoneNumber 
      } = req.body;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create user first
      const user = await storage.createUser({
        email,
        password: await hashPassword(password),
        userType: "jobseeker"
      });

      // Then create job seeker profile
      const jobSeeker = await storage.createJobSeeker({
        userId: user.id,
        firstName,
        lastName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        country,
        phoneNumber
      });

      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          user,
          profile: jobSeeker
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Employer registration
  app.post("/api/register/employer", async (req, res, next) => {
    try {
      const { 
        email, password, companyName, industry, 
        companyType, phoneNumber, country, website 
      } = req.body;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create user first
      const user = await storage.createUser({
        email,
        password: await hashPassword(password),
        userType: "employer"
      });

      // Then create employer profile
      const employer = await storage.createEmployer({
        userId: user.id,
        companyName,
        industry,
        companyType,
        phoneNumber,
        country,
        website
      });

      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          user,
          profile: employer
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message || "Invalid credentials" });
      
      req.login(user, async (err) => {
        if (err) return next(err);
        
        let profile;
        if (user.userType === "jobseeker") {
          profile = await storage.getJobSeekerByUserId(user.id);
        } else if (user.userType === "employer") {
          profile = await storage.getEmployerByUserId(user.id);
        } else if (user.userType === "admin") {
          // For admin users, we don't need to fetch additional profile data
          profile = { id: user.id, role: "admin" };
        }
        
        res.status(200).json({ user, profile });
      });
    })(req, res, next);
  });
  
  // Admin-only login route
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message || "Invalid credentials" });
      
      // Check if the user is an admin or super_admin
      if (user.userType !== "admin" && user.userType !== "super_admin") {
        return res.status(403).json({ 
          message: "Access denied. This login is for administrators only." 
        });
      }
      
      req.login(user, async (err) => {
        if (err) return next(err);
        
        // Get admin profile
        const admin = await storage.getAdminByUserId(user.id);
        
        if (!admin) {
          return res.status(404).json({ 
            message: "Admin profile not found. Please contact support." 
          });
        }
        
        // Update last login time
        await storage.updateAdminLastLogin(admin.id);
        
        res.status(200).json({ 
          user, 
          profile: { 
            id: admin.id, 
            role: admin.role,
            firstName: admin.firstName,
            lastName: admin.lastName
          } 
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Current user route
  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const user = req.user;
    let profile;
    
    if (user.userType === "jobseeker") {
      profile = await storage.getJobSeekerByUserId(user.id);
    } else if (user.userType === "employer") {
      profile = await storage.getEmployerByUserId(user.id);
    } else if (user.userType === "admin" || user.userType === "super_admin") {
      profile = await storage.getAdminByUserId(user.id);
      // If admin profile not found, use minimal profile
      if (!profile) {
        profile = { id: user.id, role: user.userType };
      }
    }
    
    res.json({ user, profile });
  });

  // Dedicated admin user route for separate admin sessions
  app.get("/api/admin/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const user = req.user;
    
    // Only allow admin or super_admin users to access this endpoint
    if (user.userType !== "admin" && user.userType !== "super_admin") {
      return res.status(403).json({ 
        message: "Access denied. This endpoint is for administrators only." 
      });
    }
    
    // Get admin profile with full details
    const adminProfile = await storage.getAdminByUserId(user.id);
    
    if (!adminProfile) {
      return res.status(404).json({ message: "Admin profile not found" });
    }
    
    // Return admin data with profile information optimized for type safety
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.email, // Use email as username for type safety
        userType: user.userType
      },
      profile: {
        id: adminProfile.id,
        firstName: adminProfile.firstName || "",
        lastName: adminProfile.lastName || "",
        role: adminProfile.role,
        lastLogin: adminProfile.lastLogin || new Date()
      }
    });
  });
}
