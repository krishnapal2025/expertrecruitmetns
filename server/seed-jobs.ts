import { storage } from './storage';
import { InsertJob } from '@shared/schema';

// Create mock jobs for all categories
async function seedJobs() {
  // First check if we already have jobs to avoid duplicates
  const existingJobs = await storage.getJobs();
  if (existingJobs.length > 0) {
    console.log('Jobs already exist in the database, skipping seed.');
    return;
  }

  // FINANCE JOBS
  const financeJobs: InsertJob[] = [
    {
      title: 'Senior Financial Analyst at Goldman Sachs',
      location: 'New York, NY',
      jobType: 'Full-time',
      salary: '$120,000 - $150,000',
      category: 'Finance',
      description: "We are seeking a Senior Financial Analyst to join our Investment Banking Division at Goldman Sachs. The ideal candidate will have strong analytical skills, excellent communication abilities, and a deep understanding of financial markets.\n\nRequirements:\n- MBA or CFA, 5+ years in investment banking, financial modeling expertise\n\nBenefits:\n- Competitive salary, comprehensive benefits package, performance bonuses, 401(k) matching\n\nSkills Needed:\n- Financial Modeling, Valuation, M&A, Capital Markets, Excel, PowerPoint",
      employerId: 1,
    },
    {
      title: 'Investment Banking Associate at Morgan Stanley',
      location: 'London, UK',
      jobType: 'Full-time',
      salary: '£90,000 - £120,000',
      category: 'Finance',
      description: "Morgan Stanley is seeking an Investment Banking Associate to join our Global Capital Markets team. This role offers an opportunity to work on high-profile transactions for leading global companies.\n\nRequirements:\n- MBA required, 2-3 years investment banking experience, financial modeling expertise\n\nBenefits:\n- Competitive compensation, health insurance, retirement plan, training opportunities\n\nSkills Needed:\n- Financial Analysis, Valuation, Pitch Books, Excel, Deal Execution, Bloomberg",
      employerId: 2,
    }
  ];
  
  // TECHNOLOGY JOBS
  const techJobs: InsertJob[] = [
    {
      title: 'Senior Software Engineer at Google',
      location: 'Mountain View, CA',
      jobType: 'Full-time',
      salary: '$150,000 - $180,000',
      category: 'Technology',
      description: "We are looking for a Senior Software Engineer to join our Cloud Infrastructure team at Google. You will design, develop, and maintain critical backend services and infrastructure supporting Google's core products.\n\nRequirements:\n- BS/MS in Computer Science, 5+ years experience, proficiency in Java/Go/Python\n\nBenefits:\n- Competitive salary, comprehensive benefits, stock options, free meals, unlimited PTO\n\nSkills Needed:\n- Java, Go, Python, Kubernetes, Distributed Systems, Cloud Infrastructure",
      employerId: 1,
    },
    {
      title: 'Data Scientist at Meta',
      location: 'Menlo Park, CA',
      jobType: 'Full-time',
      salary: '$140,000 - $170,000',
      category: 'Technology',
      description: "Meta is seeking a Data Scientist to work with product teams to extract insights from our vast datasets. This role will help drive product decisions through data analysis and experimentation.\n\nRequirements:\n- MS/PhD in Statistics, Computer Science, or related field, 3+ years experience\n\nBenefits:\n- Competitive compensation, comprehensive benefits, remote work options\n\nSkills Needed:\n- Python, SQL, R, Machine Learning, Statistical Analysis, A/B Testing",
      employerId: 2,
    }
  ];

  // HEALTHCARE JOBS
  const healthcareJobs: InsertJob[] = [
    {
      title: 'Registered Nurse at Mayo Clinic',
      location: 'Rochester, MN',
      jobType: 'Full-time',
      salary: '$75,000 - $95,000',
      category: 'Healthcare',
      description: "Join our nursing team at Mayo Clinic, one of the top-ranked hospitals in the nation. As a Registered Nurse, you will provide direct patient care and support our mission of integrated clinical practice, education, and research.\n\nRequirements:\n- BSN required, RN license, BLS certification, 2+ years clinical experience\n\nBenefits:\n- Competitive salary, health benefits, pension plan, continuing education support\n\nSkills Needed:\n- Patient Care, Electronic Medical Records, Medication Administration, Critical Thinking",
      employerId: 3,
    },
    {
      title: 'Pharmacist at CVS Health',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      salary: '$120,000 - $140,000',
      category: 'Healthcare',
      description: "CVS Health is seeking a licensed Pharmacist to join our retail pharmacy team. You will be responsible for ensuring safe and accurate medication dispensing while providing excellent patient counseling.\n\nRequirements:\n- Doctor of Pharmacy degree, active pharmacist license, retail experience preferred\n\nBenefits:\n- Competitive pay, health insurance, retirement plans, employee discounts, paid time off\n\nSkills Needed:\n- Medication Dispensing, Patient Counseling, Pharmacy Law, Immunizations",
      employerId: 4,
    }
  ];

  // MARKETING JOBS
  const marketingJobs: InsertJob[] = [
    {
      title: 'Marketing Director at Procter & Gamble',
      location: 'Cincinnati, OH',
      jobType: 'Full-time',
      salary: '$130,000 - $160,000',
      category: 'Marketing',
      description: "Lead brand strategy and marketing initiatives for P&G's consumer products. Develop and execute comprehensive marketing plans to drive brand growth and market share.\n\nRequirements:\n- MBA preferred, 8+ years marketing experience, proven leadership skills\n\nBenefits:\n- Competitive salary, bonus structure, company car, comprehensive benefits package\n\nSkills Needed:\n- Brand Management, Market Research, Digital Marketing, Team Leadership",
      employerId: 5,
    },
    {
      title: 'Social Media Manager at Nike',
      location: 'Portland, OR',
      jobType: 'Full-time',
      salary: '$70,000 - $90,000',
      category: 'Marketing',
      description: "Nike is looking for a creative Social Media Manager to develop and implement social media strategies across multiple platforms. This role will help elevate our brand presence and engage with our global community.\n\nRequirements:\n- Bachelor's degree in Marketing or Communications, 3+ years social media experience\n\nBenefits:\n- Competitive salary, product discounts, health benefits, fitness center access\n\nSkills Needed:\n- Content Creation, Campaign Management, Analytics, Community Management",
      employerId: 6,
    }
  ];

  // SALES JOBS
  const salesJobs: InsertJob[] = [
    {
      title: 'Enterprise Sales Executive at Salesforce',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      salary: '$120,000 - $200,000 (Base + Commission)',
      category: 'Sales',
      description: "Drive new business and expand existing relationships within enterprise accounts at Salesforce. Develop and execute strategic sales plans to maximize revenue growth in assigned territory.\n\nRequirements:\n- Bachelor's degree, 5+ years enterprise software sales experience, proven track record\n\nBenefits:\n- Competitive base + uncapped commission, stock options, comprehensive benefits\n\nSkills Needed:\n- Solution Selling, Account Management, CRM, Contract Negotiation",
      employerId: 7,
    },
    {
      title: 'Inside Sales Representative at Adobe',
      location: 'San Jose, CA',
      jobType: 'Full-time',
      salary: '$60,000 - $85,000 (Base + Commission)',
      category: 'Sales',
      description: "Adobe is seeking an energetic Inside Sales Representative to drive sales of our Creative Cloud products to small and medium businesses through phone and web-based channels.\n\nRequirements:\n- Bachelor's degree, 1-3 years sales experience, strong communication skills\n\nBenefits:\n- Competitive base salary, commission structure, product discounts, health benefits\n\nSkills Needed:\n- Prospecting, Cold Calling, CRM Software, Consultative Selling",
      employerId: 8,
    }
  ];

  // Combine all job categories
  const allJobs: InsertJob[] = [
    ...financeJobs,
    ...techJobs,
    ...healthcareJobs,
    ...marketingJobs,
    ...salesJobs
  ];

  // Add all jobs to the database
  for (const job of allJobs) {
    await storage.createJob(job);
    console.log(`Created job: ${job.title} (${job.category})`);
  }

  console.log(`Successfully seeded ${allJobs.length} jobs across multiple categories!`);
}

export { seedJobs };