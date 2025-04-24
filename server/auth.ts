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

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "robert-half-job-portal-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
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
    } else if (user.userType === "admin") {
      // For admin users, we don't need to fetch additional profile data
      profile = { id: user.id, role: "admin" };
    }
    
    res.json({ user, profile });
  });
}
