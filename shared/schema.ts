import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table - common fields for both types of users

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // 'employer', 'jobseeker', or 'admin'
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
  employerId: integer("employer_id").references(() => employers.id), // Made optional by removing notNull()
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
  status: text("status").default("new"), // 'new', 'viewed', 'shortlisted', 'rejected'
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

// Admin table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // 'super_admin', 'admin', 'content_manager', etc.
  phoneNumber: text("phone_number"),
  lastLogin: timestamp("last_login"),
  recoveryEmail: text("recovery_email"),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
});

// Invitation codes table for admin registration
export const invitationCodes = pgTable("invitation_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vacancies table (from vacancy form submissions)
export const vacancies = pgTable("vacancies", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  jobTitle: text("job_title").notNull(),
  jobDescription: text("job_description").notNull(),
  location: text("location").notNull(),
  industry: text("industry").notNull(),
  employmentType: text("employment_type").notNull(),
  salaryRange: text("salary_range"),
  requiredSkills: text("required_skills").notNull(),
  experienceLevel: text("experience_level").notNull(),
  applicationDeadline: timestamp("application_deadline").notNull(),
  additionalInformation: text("additional_information"),
  status: text("status").default("new"), // 'new', 'reviewed', 'contacted', 'rejected'
  submittedAt: timestamp("submitted_at").defaultNow(),
  assignedTo: text("assigned_to"), // Email of the recruiter
  assignedName: text("assigned_name"), // Name of the recruiter
  assignedAt: timestamp("assigned_at"), // When the vacancy was assigned
});

// Temporary Staffing Inquiries table
export const staffingInquiries = pgTable("staffing_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(), 
  phone: text("phone"),
  company: text("company"),
  inquiry_type: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  marketing: boolean("marketing").default(false),
  status: text("status").default("new"), // 'new', 'reviewed', 'contacted', 'closed'
  submittedAt: timestamp("submitted_at").defaultNow(),
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

// Create a modified schema to handle string dates from the frontend
export const insertJobSchema = createInsertSchema(jobs)
  .omit({
    id: true,
    postedDate: true,
    isActive: true,
    createdAt: true,
    applicationCount: true,
  })
  .extend({
    // Override the applicationDeadline field to accept string (YYYY-MM-DD format)
    applicationDeadline: z.string()
      .min(1, "Application deadline is required")
      .transform((val) => {
        try {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
          }
          return date;
        } catch (error) {
          // Fallback to current date + 30 days if parsing fails
          const date = new Date();
          date.setDate(date.getDate() + 30);
          return date;
        }
      }),
      
    // Make employerId optional
    employerId: z.number().optional().nullable(),
    
    // Ensure required fields with better validation
    title: z.string()
      .min(2, "Job title is required")
      .max(150, "Job title must be less than 150 characters")
      .transform(val => val?.trim()),
      
    company: z.string()
      .min(2, "Company name is required")
      .max(100, "Company name must be less than 100 characters")
      .transform(val => val?.trim()),
      
    description: z.string()
      .min(10, "Job description is required")
      .transform(val => val?.trim() || "No description provided"),
      
    requirements: z.string()
      .min(10, "Job requirements are required")
      .transform(val => val?.trim() || "Please contact for details"),
      
    benefits: z.string()
      .min(10, "Job benefits are required")
      .transform(val => val?.trim() || "Please contact for details"),
      
    category: z.string()
      .min(2, "Job category is required")
      .transform(val => val?.trim() || "General"),
      
    location: z.string()
      .min(2, "Job location is required")
      .transform(val => val?.trim() || "Remote"),
      
    jobType: z.string()
      .min(2, "Job type is required")
      .transform(val => val?.trim() || "Full-time"),
      
    experience: z.string()
      .min(2, "Experience level is required")
      .transform(val => val?.trim() || "Not specified"),
      
    // Ensure salary fields are numbers
    minSalary: z.preprocess(
      (val) => (val === '' || val === null || val === undefined) ? 0 : Number(val),
      z.number().min(0, "Minimum salary must be a positive number")
    ),
    
    maxSalary: z.preprocess(
      (val) => (val === '' || val === null || val === undefined) ? 0 : Number(val),
      z.number().min(0, "Maximum salary must be a positive number")
    ),
    
    contactEmail: z.string()
      .email("A valid contact email is required")
      .transform(val => val?.trim()),
      
    // Optional fields
    specialization: z.string().optional().nullable(),
    salary: z.string().optional().nullable()
  });

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedDate: true,
  status: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  lastLogin: true,
});

export const insertInvitationCodeSchema = createInsertSchema(invitationCodes).omit({
  id: true,
  isUsed: true,
  createdAt: true,
});

export const insertVacancySchema = createInsertSchema(vacancies).omit({
  id: true,
  status: true,
  submittedAt: true,
}).extend({
  // Override the applicationDeadline field to accept string
  applicationDeadline: z.string()
    .min(1, "Application deadline is required")
    .transform((val) => new Date(val))
});

export const insertStaffingInquirySchema = createInsertSchema(staffingInquiries).omit({
  id: true,
  status: true,
  submittedAt: true,
});

// Registration schemas
export const jobSeekerRegisterSchema = insertUserSchema.extend({
  // Update email validation to be more permissive
  email: z.string().email("Please enter a valid email")
    .refine(email => {
      // Accept any valid email format without domain restrictions
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "Please enter a valid email address"),
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
  // Update email validation to be more permissive
  email: z.string().email("Please enter a valid email")
    .refine(email => {
      // Accept any valid email format without domain restrictions
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "Please enter a valid email address"),
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

// Admin registration schema with invitation code
export const adminRegisterSchema = insertUserSchema.extend({
  // Update email validation to be more permissive
  email: z.string().email("Please enter a valid email")
    .refine(email => {
      // Accept any valid email format without domain restrictions
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["super_admin", "admin", "content_manager"], {
    invalid_type_error: "Please select a valid role",
  }),
  phoneNumber: z.string().min(5, "Please enter a valid phone number").optional(),
  invitationCode: z.string().min(8, "Invitation code is required"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Admin signup schema (without invitation code)
export const adminSignupSchema = z.object({
  // Use a more permissive email validator that accepts various business domains
  email: z.string().email("Please enter a valid email")
    .refine(email => {
      // This is a basic email format validator that accepts any valid email
      // We're intentionally not restricting by domain to allow business emails
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["super_admin", "admin", "content_manager"], {
    invalid_type_error: "Please select a valid role",
  }),
  phoneNumber: z.string().min(5, "Please enter a valid phone number").optional(),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  // Remove userType from the validation schema
  // It will be added by the server instead
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  // More permissive email validator for business emails
  email: z.string().email("Please enter a valid email")
    .refine(email => {
      // Accept any valid email format without domain restrictions
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  bannerImage: text("banner_image"),
  authorId: integer("author_id").references(() => users.id),
  publishDate: timestamp("publish_date").defaultNow(),
  published: boolean("published").default(false),
  category: text("category"),
  tags: text("tags").array(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  readTime: text("read_time")
});

// Create insert schema for blog posts
export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true, publishDate: true })
  .extend({
    // Handle tags as either string array or undefined
    tags: z.union([z.array(z.string()), z.undefined()]),
    // Make slug optional - we'll generate it if not provided
    slug: z.string().optional(),
    // Handle HTML content correctly
    content: z.string().min(10, "Content must be at least 10 characters"),
  });

// Notifications table for all user types
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // User who should receive the notification
  message: text("message").notNull(),
  type: text("type").notNull(), // 'application_status', 'inquiry_reply', 'staffing_inquiry', etc.
  read: boolean("read").default(false),
  entityId: integer("entity_id"), // ID of the related entity (application ID, inquiry ID, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schema for notifications
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type JobSeeker = typeof jobSeekers.$inferSelect;
export type Employer = typeof employers.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type InvitationCode = typeof invitationCodes.$inferSelect;
export type Vacancy = typeof vacancies.$inferSelect;
export type StaffingInquiry = typeof staffingInquiries.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type InsertInvitationCode = z.infer<typeof insertInvitationCodeSchema>;
export type InsertVacancy = z.infer<typeof insertVacancySchema>;
export type InsertStaffingInquiry = z.infer<typeof insertStaffingInquirySchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type JobSeekerRegister = z.infer<typeof jobSeekerRegisterSchema>;
export type EmployerRegister = z.infer<typeof employerRegisterSchema>;
export type AdminRegister = z.infer<typeof adminRegisterSchema>;
export type AdminSignup = z.infer<typeof adminSignupSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
