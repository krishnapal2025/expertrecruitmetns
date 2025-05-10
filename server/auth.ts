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
  // Detect environment for cookie configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const isFlyIo = process.env.FLY_APP_NAME !== undefined;
  const isReplit = process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
  
  // Cross-domain environments (e.g., Fly.io, Replit) need special cookie settings
  const isCrossDomainEnvironment = isFlyIo || isReplit;
  
  console.log(`Auth setup - Production mode: ${isProduction}, Fly.io: ${isFlyIo}, Replit: ${isReplit}`);
  
  // Determine correct sameSite policy:
  // - 'none': Allows cross-domain cookies (must be used with secure:true in production)
  // - 'lax': Restricted cross-domain but allows redirects (better default security)
  // - 'strict': Only same-site requests (most secure, but breaks many login flows)
  let cookieSameSite: 'none' | 'lax' | 'strict';
  
  if (isReplit) {
    // Replit is a special case where we want 'lax' even in production
    // As Replit apps usually don't use custom domains
    cookieSameSite = 'lax';
  } else if (isProduction && isCrossDomainEnvironment) {
    // Production cross-domain environments like Fly.io with custom domains 
    cookieSameSite = 'none';
  } else {
    // Default for development and non-cross-domain production
    cookieSameSite = 'lax';
  }
  
  // Domain might be needed for custom domain setups
  // For Fly.io deployments, domain should be set via COOKIE_DOMAIN env var
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  
  // Configure session for optimal security and cross-domain compatibility
  const sessionSettings: session.SessionOptions = {
    // Use environment variable for secret or a strong default
    // In production, always set SESSION_SECRET environment variable
    secret: process.env.SESSION_SECRET || "expert-recruitments-secure-session-secret-key",
    
    // resave: false means don't save session if unmodified
    resave: false,
    
    // saveUninitialized: true creates a session even if nothing stored
    // Important for login flows to ensure cookies are set properly
    saveUninitialized: true,
    
    // Use the database store for persistent sessions
    store: storage.sessionStore,
    
    // Cookie configuration
    cookie: {
      // Only set secure=true in production or when using HTTPS
      // Warning: secure=true won't work on HTTP connections
      secure: isProduction,
      
      // httpOnly prevents client-side JS from reading cookie
      httpOnly: true,
      
      // 30 days session lifetime
      maxAge: 1000 * 60 * 60 * 24 * 30,
      
      // Use the configured sameSite value based on environment
      sameSite: cookieSameSite,
      
      // Domain setting, typically needed for custom domains
      domain: cookieDomain,
      
      // Path limits where cookie is sent
      path: '/'
    },
    
    // Enable proxy header trust for reverse proxies (important for Fly.io, Replit)
    proxy: true,
    
    // Add rolling to renew session with each request (extends session lifetime)
    rolling: true,
    
    // Optional name for identifying the session cookie
    name: 'er_session_id'
  };
  
  // Log session cookie settings for debugging
  console.log("Session cookie settings:", {
    secure: sessionSettings.cookie?.secure,
    sameSite: sessionSettings.cookie?.sameSite,
    domain: sessionSettings.cookie?.domain,
    maxAge: sessionSettings.cookie?.maxAge,
    proxy: sessionSettings.proxy,
    environment: isCrossDomainEnvironment ? 'cross-domain' : 'same-origin'
  });

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
      // Check if user exists - if not, return null which will clear the session
      if (!user) {
        console.log(`User with ID ${id} not found during session deserialization. Session will be cleared.`);
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      console.error("Error during passport deserializeUser:", err);
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

      // Log user in with enhanced cross-domain handling
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Get deployment environment info
        const isProduction = process.env.NODE_ENV === 'production';
        const isFlyIo = process.env.FLY_APP_NAME !== undefined;
        const isReplit = process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
        const isCrossDomainEnvironment = isFlyIo || isReplit;
        
        // Ensure session is saved before responding
        req.session!.save((err) => {
          if (err) {
            console.error("Error saving session after login:", err);
            return res.status(500).json({ 
              message: "Account created, but session could not be saved",
              user: {
                id: user.id,
                email: user.email,
                userType: user.userType
              }
            });
          }
          
          // For cross-domain environments, add helpful info to response
          if (isCrossDomainEnvironment) {
            res.status(201).json({
              id: user.id,
              email: user.email,
              userType: user.userType,
              profile,
              environment: isCrossDomainEnvironment ? 'cross-domain' : 'same-origin',
              notes: {
                sessionInfo: "Your session has been created. In some deployment environments, you may need to log in again.",
                cookieSettings: {
                  secure: isProduction,
                  sameSite: isProduction && isCrossDomainEnvironment ? "none" : "lax",
                  domain: process.env.COOKIE_DOMAIN || undefined
                }
              }
            });
          } else {
            // Standard response for development environments
            res.status(201).json({
              id: user.id,
              email: user.email,
              userType: user.userType,
              profile
            });
          }
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

      // Log user in with cross-domain support
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Get deployment environment info
        const isProduction = process.env.NODE_ENV === 'production';
        const isFlyIo = process.env.FLY_APP_NAME !== undefined;
        const isReplit = process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
        const isCrossDomainEnvironment = isFlyIo || isReplit;
        
        // Ensure session is saved before responding
        req.session!.save((err) => {
          if (err) {
            console.error("Error saving session after login:", err);
            return res.status(500).json({ 
              message: "Account created, but session could not be saved",
              user,
              profile: jobSeeker
            });
          }
          
          // For cross-domain environments, add helpful info to response
          if (isCrossDomainEnvironment) {
            res.status(201).json({
              user,
              profile: jobSeeker,
              environment: isCrossDomainEnvironment ? 'cross-domain' : 'same-origin',
              notes: {
                sessionInfo: "Your session has been created. In some deployment environments, you may need to log in again.",
                cookieSettings: {
                  secure: isProduction,
                  sameSite: isProduction && isCrossDomainEnvironment ? "none" : "lax",
                  domain: process.env.COOKIE_DOMAIN || undefined
                }
              }
            });
          } else {
            // Standard response for development environments
            res.status(201).json({
              user,
              profile: jobSeeker
            });
          }
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

      // Log user in with cross-domain support
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Get deployment environment info
        const isProduction = process.env.NODE_ENV === 'production';
        const isFlyIo = process.env.FLY_APP_NAME !== undefined;
        const isReplit = process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
        const isCrossDomainEnvironment = isFlyIo || isReplit;
        
        // Ensure session is saved before responding
        req.session!.save((err) => {
          if (err) {
            console.error("Error saving session after login:", err);
            return res.status(500).json({ 
              message: "Account created, but session could not be saved",
              user,
              profile: employer
            });
          }
          
          // For cross-domain environments, add helpful info to response
          if (isCrossDomainEnvironment) {
            res.status(201).json({
              user,
              profile: employer,
              environment: isCrossDomainEnvironment ? 'cross-domain' : 'same-origin',
              notes: {
                sessionInfo: "Your session has been created. In some deployment environments, you may need to log in again.",
                cookieSettings: {
                  secure: isProduction,
                  sameSite: isProduction && isCrossDomainEnvironment ? "none" : "lax",
                  domain: process.env.COOKIE_DOMAIN || undefined
                }
              }
            });
          } else {
            // Standard response for development environments
            res.status(201).json({
              user,
              profile: employer
            });
          }
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
        
        // Get deployment environment info
        const isProduction = process.env.NODE_ENV === 'production';
        const isFlyIo = process.env.FLY_APP_NAME !== undefined;
        const isReplit = process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
        const isCrossDomainEnvironment = isFlyIo || isReplit;
        
        // Fetch appropriate profile based on user type
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
        
        // Ensure session is saved before responding
        req.session!.save((err) => {
          if (err) {
            console.error("Error saving session after login:", err);
            return res.status(500).json({ 
              message: "Login successful, but session could not be saved",
              user,
              profile
            });
          }
          
          // For cross-domain environments, add helpful info to response
          if (isCrossDomainEnvironment) {
            res.status(200).json({
              user,
              profile,
              environment: isCrossDomainEnvironment ? 'cross-domain' : 'same-origin',
              notes: {
                sessionInfo: "Your session has been created in a deployment environment.",
                cookieSettings: {
                  secure: isProduction,
                  sameSite: isProduction && isCrossDomainEnvironment ? "none" : "lax",
                  domain: process.env.COOKIE_DOMAIN || undefined
                }
              }
            });
          } else {
            // Standard response for development environments
            res.status(200).json({
              user,
              profile
            });
          }
        });
      });
    })(req, res, next);
  });
  
  // Admin-only login route
  app.post("/api/admin/login", (req, res, next) => {
    // For security reasons, admin login has been disabled
    console.log("Admin login attempt blocked - admin login is disabled");
    return res.status(403).json({ 
      message: "Administrator login is currently disabled for security reasons. Please contact system support."
    });
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
