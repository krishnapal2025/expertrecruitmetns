import { 
  users, User, InsertUser, 
  jobSeekers, JobSeeker, InsertJobSeeker, 
  employers, Employer, InsertEmployer,
  jobs, Job, InsertJob,
  applications, Application, InsertApplication,
  testimonials, Testimonial, InsertTestimonial
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserByEmployerId(employerId: number): Promise<User | undefined>;
  getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined>;
  
  // JobSeeker methods
  getJobSeeker(id: number): Promise<JobSeeker | undefined>;
  getJobSeekerByUserId(userId: number): Promise<JobSeeker | undefined>;
  createJobSeeker(jobSeeker: InsertJobSeeker): Promise<JobSeeker>;
  updateJobSeeker(jobSeeker: JobSeeker): Promise<JobSeeker>;
  
  // Employer methods
  getEmployer(id: number): Promise<Employer | undefined>;
  getEmployerByUserId(userId: number): Promise<Employer | undefined>;
  createEmployer(employer: InsertEmployer): Promise<Employer>;
  updateEmployer(employer: Employer): Promise<Employer>;
  
  // Job methods
  getJob(id: number): Promise<Job | undefined>;
  getJobs(filters?: {
    category?: string;
    location?: string;
    jobType?: string;
    specialization?: string;
    experience?: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }): Promise<Job[]>;
  getJobsByEmployerId(employerId: number): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(job: Job): Promise<Job>;
  deleteJob(id: number): Promise<boolean>;
  
  // Application methods
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  
  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobSeekers: Map<number, JobSeeker>;
  private employers: Map<number, Employer>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private testimonials: Map<number, Testimonial>;
  
  sessionStore: session.SessionStore;
  
  // ID counters
  private userIdCounter: number;
  private jobSeekerIdCounter: number;
  private employerIdCounter: number;
  private jobIdCounter: number;
  private applicationIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.jobSeekers = new Map();
    this.employers = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.testimonials = new Map();
    
    this.userIdCounter = 1;
    this.jobSeekerIdCounter = 1;
    this.employerIdCounter = 1;
    this.jobIdCounter = 1;
    this.applicationIdCounter = 1;
    this.testimonialIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add some demo testimonials
    this.createTestimonial({
      userId: null,
      name: "John Smith",
      role: "Software Developer",
      content: "Found my dream job through this platform. The process was smooth and professional.",
      rating: 5
    });
    
    this.createTestimonial({
      userId: null,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "As an employer, I've found exceptional talent here. The quality of candidates is outstanding.",
      rating: 5
    });
    
    this.createTestimonial({
      userId: null,
      name: "David Chen",
      role: "HR Director",
      content: "This platform has transformed our hiring process. Highly recommended for all businesses.",
      rating: 4
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUserByEmployerId(employerId: number): Promise<User | undefined> {
    const employer = await this.getEmployer(employerId);
    if (!employer) return undefined;
    
    return this.users.get(employer.userId);
  }
  
  async getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined> {
    const jobSeeker = await this.getJobSeeker(jobSeekerId);
    if (!jobSeeker) return undefined;
    
    return this.users.get(jobSeeker.userId);
  }

  // JobSeeker methods
  async getJobSeeker(id: number): Promise<JobSeeker | undefined> {
    return this.jobSeekers.get(id);
  }

  async getJobSeekerByUserId(userId: number): Promise<JobSeeker | undefined> {
    return Array.from(this.jobSeekers.values()).find(
      (jobSeeker) => jobSeeker.userId === userId
    );
  }

  async createJobSeeker(insertJobSeeker: InsertJobSeeker): Promise<JobSeeker> {
    const id = this.jobSeekerIdCounter++;
    const jobSeeker: JobSeeker = { 
      ...insertJobSeeker, 
      id,
      cvPath: null 
    };
    this.jobSeekers.set(id, jobSeeker);
    return jobSeeker;
  }
  
  async updateJobSeeker(jobSeeker: JobSeeker): Promise<JobSeeker> {
    // Check if the job seeker exists
    if (!this.jobSeekers.has(jobSeeker.id)) {
      throw new Error('Job seeker not found');
    }
    
    // Update in the Map
    this.jobSeekers.set(jobSeeker.id, jobSeeker);
    return jobSeeker;
  }

  // Employer methods
  async getEmployer(id: number): Promise<Employer | undefined> {
    return this.employers.get(id);
  }

  async getEmployerByUserId(userId: number): Promise<Employer | undefined> {
    return Array.from(this.employers.values()).find(
      (employer) => employer.userId === userId
    );
  }

  async createEmployer(insertEmployer: InsertEmployer): Promise<Employer> {
    const id = this.employerIdCounter++;
    const employer: Employer = { ...insertEmployer, id };
    this.employers.set(id, employer);
    return employer;
  }
  
  async updateEmployer(employer: Employer): Promise<Employer> {
    // Check if the employer exists
    if (!this.employers.has(employer.id)) {
      throw new Error('Employer not found');
    }
    
    // Update in the Map
    this.employers.set(employer.id, employer);
    return employer;
  }

  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(filters?: {
    category?: string;
    location?: string;
    jobType?: string;
    specialization?: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }): Promise<Job[]> {
    let allJobs = Array.from(this.jobs.values()).filter(job => job.isActive);
    
    if (!filters) return allJobs;
    
    return allJobs.filter(job => {
      // Filter by category
      if (filters.category && filters.category !== "All Categories" && job.category !== filters.category) return false;
      
      // Filter by location
      if (filters.location && filters.location !== "All Locations") {
        // Allow partial match on location
        if (!job.location.includes(filters.location)) return false;
      }
      
      // Filter by job type
      if (filters.jobType && filters.jobType !== "All Types" && job.jobType !== filters.jobType) return false;
      
      // Filter by specialization (checking in description)
      if (filters.specialization && filters.specialization !== "All Specializations") {
        if (!job.description.includes(filters.specialization)) return false;
      }
      
      // Filter by salary range
      if (filters.minSalary || filters.maxSalary) {
        // Extract numeric salary from string like "$120,000 - $150,000"
        const salaryMatch = job.salary?.match(/[\d,]+/g);
        if (salaryMatch && salaryMatch.length >= 1) {
          const minSalaryStr = salaryMatch[0].replace(/,/g, '');
          const minSalaryValue = parseInt(minSalaryStr);
          
          if (filters.minSalary && !isNaN(minSalaryValue) && minSalaryValue < filters.minSalary) {
            return false;
          }
          
          if (filters.maxSalary && salaryMatch.length >= 2) {
            const maxSalaryStr = salaryMatch[1].replace(/,/g, '');
            const maxSalaryValue = parseInt(maxSalaryStr);
            
            if (!isNaN(maxSalaryValue) && maxSalaryValue > filters.maxSalary) {
              return false;
            }
          }
        }
      }
      
      // Filter by keyword (search in title and description)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        if (!job.title.toLowerCase().includes(keyword) && 
            !job.description.toLowerCase().includes(keyword)) {
          return false;
        }
      }
      
      return true;
    });
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobIdCounter++;
    const now = new Date();
    const job: Job = { 
      ...insertJob, 
      id, 
      salary: insertJob.salary || null,
      postedDate: now,
      isActive: true,
      applicationCount: 0,
      createdAt: now
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async getJobsByEmployerId(employerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.employerId === employerId
    );
  }
  
  async updateJob(job: Job): Promise<Job> {
    // Check if the job exists
    if (!this.jobs.has(job.id)) {
      throw new Error('Job not found');
    }
    
    // Update in the Map
    this.jobs.set(job.id, job);
    return job;
  }
  
  async deleteJob(id: number): Promise<boolean> {
    // Check if the job exists
    if (!this.jobs.has(id)) {
      return false;
    }
    
    // Delete the job
    return this.jobs.delete(id);
  }

  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.jobId === jobId
    );
  }

  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.jobSeekerId === jobSeekerId
    );
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationIdCounter++;
    const now = new Date();
    const application: Application = { 
      ...insertApplication, 
      id, 
      appliedDate: now,
      coverLetter: insertApplication.coverLetter || null,
      status: "pending"
    };
    this.applications.set(id, application);
    return application;
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      userId: insertTestimonial.userId !== undefined ? insertTestimonial.userId : null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
