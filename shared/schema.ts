import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table - common fields for both types of users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // 'employer' or 'jobseeker'
  createdAt: timestamp("created_at").defaultNow(),
});

// JobSeeker profile table
export const jobSeekers = pgTable("job_seekers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  country: text("country").notNull(),
  phoneNumber: text("phone_number").notNull(),
  cvPath: text("cv_path"),
});

// Employer profile table
export const employers = pgTable("employers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  companyType: text("company_type").notNull(),
  phoneNumber: text("phone_number").notNull(),
  country: text("country").notNull(),
  website: text("website").notNull(),
});

// Job listings table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => employers.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  benefits: text("benefits").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(), // 'Full-time', 'Part-time', 'Contract', etc.
  specialization: text("specialization"),
  experience: text("experience").notNull(),
  minSalary: integer("min_salary").notNull(),
  maxSalary: integer("max_salary").notNull(),
  contactEmail: text("contact_email").notNull(),
  applicationDeadline: timestamp("application_deadline").notNull(),
  salary: text("salary"),
  postedDate: timestamp("posted_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  jobSeekerId: integer("job_seeker_id").notNull().references(() => jobSeekers.id),
  appliedDate: timestamp("applied_date").defaultNow(),
  status: text("status").default("pending"), // 'pending', 'reviewed', 'rejected', 'accepted'
  coverLetter: text("cover_letter"),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
});

// Create insert schemas using Zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertJobSeekerSchema = createInsertSchema(jobSeekers).omit({
  id: true,
  cvPath: true,
});

export const insertEmployerSchema = createInsertSchema(employers).omit({
  id: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedDate: true,
  isActive: true,
  createdAt: true,
  applicationCount: true,
}).transform((data) => {
  // Ensure applicationDeadline is a Date object
  if (data.applicationDeadline && !(data.applicationDeadline instanceof Date)) {
    data.applicationDeadline = new Date(data.applicationDeadline);
  }
  return data;
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedDate: true,
  status: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

// Registration schemas
export const jobSeekerRegisterSchema = insertUserSchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], {
    invalid_type_error: "Please select a gender",
  }),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid date"),
  country: z.string().min(2, "Please select a country"),
  phoneNumber: z.string().min(5, "Please enter a valid phone number"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const employerRegisterSchema = insertUserSchema.extend({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Please select an industry"),
  companyType: z.string().min(2, "Please select a company type"),
  phoneNumber: z.string().min(5, "Please enter a valid phone number"),
  country: z.string().min(2, "Please select a country"),
  website: z.string().url("Please enter a valid website URL"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Export types
export type User = typeof users.$inferSelect;
export type JobSeeker = typeof jobSeekers.$inferSelect;
export type Employer = typeof employers.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type JobSeekerRegister = z.infer<typeof jobSeekerRegisterSchema>;
export type EmployerRegister = z.infer<typeof employerRegisterSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
