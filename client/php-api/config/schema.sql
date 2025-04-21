-- Database schema for Job Portal

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userType ENUM('jobseeker', 'employer') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Seekers table
CREATE TABLE IF NOT EXISTS job_seekers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    dateOfBirth DATE,
    country VARCHAR(100),
    phoneNumber VARCHAR(20),
    cvPath VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Employers table
CREATE TABLE IF NOT EXISTS employers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    companyName VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    companySize VARCHAR(50),
    description TEXT,
    logoPath VARCHAR(255),
    websiteUrl VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    jobType VARCHAR(50) NOT NULL,
    employerId INT NOT NULL,
    salary VARCHAR(100),
    postedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (employerId) REFERENCES employers(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobId INT NOT NULL,
    jobSeekerId INT NOT NULL,
    appliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'viewed', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
    coverLetter TEXT,
    FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (jobSeekerId) REFERENCES job_seekers(id) ON DELETE CASCADE
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    userId INT,
    role VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_jobType ON jobs(jobType);
CREATE INDEX idx_jobs_employerId ON jobs(employerId);
CREATE INDEX idx_applications_jobId ON applications(jobId);
CREATE INDEX idx_applications_jobSeekerId ON applications(jobSeekerId);