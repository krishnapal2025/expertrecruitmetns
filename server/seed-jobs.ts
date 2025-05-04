import { storage } from './storage';
import { InsertJob, InsertUser, InsertEmployer } from '@shared/schema';

// Create mock jobs for all categories
async function seedJobs() {
  // First check if we already have jobs to avoid duplicates
  try {
    const existingJobs = await storage.getJobs();
    if (existingJobs.length > 0) {
      console.log('Jobs already exist in the database, skipping seed.');
      return;
    }
  } catch (error) {
    console.log('Error checking for existing jobs, continuing with seed operation');
  }

  // Create a demo employer first
  let employerId: number = 1; // Default to 1, will be updated if we create a new employer

  // Check if employer already exists
  try {
    // Try to get the existing employer first
    const existingEmployer = await storage.getEmployer(1);
    if (!existingEmployer) {
      // Check if the user already exists
      let user = await storage.getUserByEmail('demo@employer.com');

      if (!user) {
        try {
          // Create demo user for employer
          user = await storage.createUser({
            email: 'demo@employer.com',
            password: await hashPassword(process.env.DEMO_EMPLOYER_PASSWORD || 'changeme'),
            userType: 'employer'
          });
          console.log('Created demo user for employer');
        } catch (userError) {
          console.error('Failed to create demo user:', userError);
          // Try to get the user again, it might have been created in a previous attempt
          user = await storage.getUserByEmail('demo@employer.com');
          if (!user) {
            // If still no user, we can't proceed with proper employer creation
            console.log('Using default employer ID:', employerId);
            throw new Error('Could not create or find demo user');
          }
        }
      } else {
        console.log('Using existing user for employer');
      }

      if (user) {
        try {
          // Create employer profile with proper error handling
          const employer = await storage.createEmployer({
            userId: user.id,
            companyName: 'Demo Recruiting Company',
            industry: 'Staffing & Recruiting',
            companyType: 'Corporation',
            phoneNumber: '+1234567890',
            country: 'United States',
            website: 'https://demorecruiter.example.com'
          });

          employerId = employer.id;
          console.log(`Created demo employer with ID: ${employerId}`);
        } catch (employerError) {
          console.error('Failed to create employer profile:', employerError);
          // Check if employer already exists for this user
          const existingEmployerByUser = await storage.getEmployerByUserId(user.id);
          if (existingEmployerByUser) {
            employerId = existingEmployerByUser.id;
            console.log(`Found existing employer for user with ID: ${employerId}`);
          } else {
            // Keep using default employerId = 1
            console.log('Using fallback employer ID:', employerId);
          }
        }
      }
    } else {
      employerId = existingEmployer.id;
      console.log(`Using existing employer with ID: ${employerId}`);
    }
  } catch (error) {
    console.error('Error in employer creation process:', error);
    // Keep using default employerId = 1
    console.log('Using default employer ID after error:', employerId);
  }

  // FINANCE JOBS
  const financeJobs: InsertJob[] = [
    {
      title: 'Senior Financial Analyst',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      jobType: 'Full-time',
      salary: '$120,000 - $150,000',
      category: 'Finance',
      description: "We are seeking a Senior Financial Analyst to join our Investment Banking Division at Goldman Sachs. The ideal candidate will have strong analytical skills, excellent communication abilities, and a deep understanding of financial markets.",
      requirements: "MBA or CFA, 5+ years in investment banking, financial modeling expertise. Proficiency in Excel, PowerPoint, and financial analysis tools.",
      benefits: "Competitive salary, comprehensive benefits package, performance bonuses, 401(k) matching, professional development opportunities.",
      employerId: 1,
      specialization: "Financial Analysis",
      experience: "Senior (5-10 years)",
      minSalary: 120000,
      maxSalary: 150000,
      contactEmail: "careers@goldmansachs.example.com",
      applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
    {
      title: 'Investment Banking Associate at Morgan Stanley',
      location: 'London, UK',
      jobType: 'Full-time',
      salary: '£90,000 - £120,000',
      category: 'Finance',
      description: "Morgan Stanley is seeking an Investment Banking Associate to join our Global Capital Markets team. This role offers an opportunity to work on high-profile transactions for leading global companies.\n\nRequirements:\n- MBA required, 2-3 years investment banking experience, financial modeling expertise\n\nBenefits:\n- Competitive compensation, health insurance, retirement plan, training opportunities\n\nSkills Needed:\n- Financial Analysis, Valuation, Pitch Books, Excel, Deal Execution, Bloomberg",
      employerId: 2,
    },
    {
      title: 'Risk Management Consultant at Deloitte',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      salary: '$95,000 - $125,000',
      category: 'Finance',
      description: "Deloitte's Risk Advisory practice is seeking a Risk Management Consultant to help clients identify, assess, and mitigate financial and operational risks. You will work with diverse clients across industries to implement effective risk management strategies.\n\nRequirements:\n- Bachelor's degree in Finance, Accounting, or related field, professional certifications (CPA, FRM) preferred\n\nBenefits:\n- Competitive salary, profit sharing, comprehensive benefits, professional development\n\nSkills Needed:\n- Risk Assessment, Regulatory Compliance, Financial Analysis, Client Management",
      employerId: 3,
    },
    {
      title: 'Tax Accountant at KPMG',
      location: 'Dubai, UAE',
      jobType: 'Full-time',
      salary: 'AED 25,000 - 35,000 monthly',
      category: 'Finance',
      description: "KPMG is looking for a Tax Accountant to join our growing Middle East team. This role will focus on providing tax advisory services to multinational corporations operating in the GCC region.\n\nRequirements:\n- Bachelor's degree in Accounting, CPA preferred, 2+ years experience in tax accounting\n\nBenefits:\n- Competitive tax-free salary, housing allowance, annual flights, medical insurance\n\nSkills Needed:\n- Corporate Taxation, International Tax Planning, Financial Reporting, VAT Compliance",
      employerId: 4,
    },
    {
      title: 'Wealth Management Advisor at JP Morgan',
      location: 'Boston, MA',
      jobType: 'Full-time',
      salary: '$85,000 - $110,000 plus commission',
      category: 'Finance',
      description: "JP Morgan Private Bank is seeking a Wealth Management Advisor to develop and maintain relationships with high-net-worth clients. You will provide comprehensive financial planning and investment advice.\n\nRequirements:\n- Bachelor's degree, Series 7 & 66 licenses, CFP preferred, 3+ years experience\n\nBenefits:\n- Base salary plus commission structure, comprehensive benefits, career development\n\nSkills Needed:\n- Financial Planning, Investment Management, Relationship Building, Estate Planning",
      employerId: 5,
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
    },
    {
      title: 'DevOps Engineer at Amazon Web Services',
      location: 'Seattle, WA',
      jobType: 'Full-time',
      salary: '$130,000 - $160,000',
      category: 'Technology',
      description: "AWS is seeking a DevOps Engineer to join our Cloud Infrastructure team. You will be responsible for building and maintaining scalable, reliable infrastructure for our cloud services.\n\nRequirements:\n- BS in Computer Science or equivalent, 3+ years experience in DevOps/SRE roles\n\nBenefits:\n- Competitive salary, RSUs, comprehensive benefits, relocation assistance\n\nSkills Needed:\n- AWS Services, Infrastructure as Code, CI/CD, Kubernetes, Terraform, Monitoring",
      employerId: 3,
    },
    {
      title: 'Product Manager at Microsoft',
      location: 'Redmond, WA',
      jobType: 'Full-time',
      salary: '$120,000 - $150,000',
      category: 'Technology',
      description: "Microsoft is looking for a Product Manager to join our Office 365 team. You will be responsible for defining product vision, strategy, and roadmap for new features and enhancements.\n\nRequirements:\n- Bachelor's degree in Business, Computer Science, or related field, 3+ years in product management\n\nBenefits:\n- Competitive salary, stock options, health benefits, 401(k) matching, work-life balance\n\nSkills Needed:\n- Product Strategy, User Research, Agile Methodologies, Data Analysis, Cross-functional Leadership",
      employerId: 4,
    },
    {
      title: 'UX/UI Designer at IBM',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '$95,000 - $120,000',
      category: 'Technology',
      description: "IBM is seeking a UX/UI Designer to create engaging user experiences for our enterprise software products. You will work closely with product managers and engineers to design intuitive interfaces.\n\nRequirements:\n- Bachelor's degree in Design or related field, 3+ years experience in UX/UI design\n\nBenefits:\n- Competitive salary, comprehensive benefits, remote work flexibility, professional development\n\nSkills Needed:\n- User Research, Wireframing, Prototyping, Visual Design, Figma, Adobe Creative Suite",
      employerId: 5,
    },
    {
      title: 'Cybersecurity Analyst at Accenture',
      location: 'Atlanta, GA',
      jobType: 'Full-time',
      salary: '$90,000 - $110,000',
      category: 'Technology',
      description: "Accenture is looking for a Cybersecurity Analyst to help our clients identify and address security vulnerabilities. You will conduct security assessments, implement security solutions, and respond to security incidents.\n\nRequirements:\n- Bachelor's degree in Cybersecurity or related field, security certifications (CISSP, CEH, etc.)\n\nBenefits:\n- Competitive salary, profit sharing, comprehensive benefits, training opportunities\n\nSkills Needed:\n- Vulnerability Assessment, Penetration Testing, Security Operations, Threat Intelligence, SIEM Tools",
      employerId: 6,
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
    },
    {
      title: 'Physical Therapist at Johns Hopkins',
      location: 'Baltimore, MD',
      jobType: 'Full-time',
      salary: '$80,000 - $95,000',
      category: 'Healthcare',
      description: "Johns Hopkins Hospital is seeking a Physical Therapist to join our rehabilitation team. You will evaluate, plan, and administer treatment to help patients improve mobility, relieve pain, and prevent or limit permanent physical disabilities.\n\nRequirements:\n- DPT degree, state license, 2+ years experience in inpatient rehabilitation\n\nBenefits:\n- Competitive salary, comprehensive benefits, tuition assistance, continuing education\n\nSkills Needed:\n- Manual Therapy, Therapeutic Exercise, Patient Assessment, Documentation, Interpersonal Skills",
      employerId: 5,
    },
    {
      title: 'Medical Laboratory Technician at LabCorp',
      location: 'Dallas, TX',
      jobType: 'Full-time',
      salary: '$55,000 - $65,000',
      category: 'Healthcare',
      description: "LabCorp is seeking a Medical Laboratory Technician to perform routine and specialized laboratory testing on patient specimens. This role is essential for providing accurate diagnostic information to healthcare providers.\n\nRequirements:\n- Associate's degree in Medical Laboratory Technology, MLT(ASCP) certification\n\nBenefits:\n- Competitive salary, health insurance, retirement plan, paid time off, tuition reimbursement\n\nSkills Needed:\n- Specimen Processing, Blood Banking, Chemistry Testing, Hematology, Quality Control",
      employerId: 6,
    },
    {
      title: 'Healthcare Administrator at Cleveland Clinic',
      location: 'Cleveland, OH',
      jobType: 'Full-time',
      salary: '$90,000 - $110,000',
      category: 'Healthcare',
      description: "Cleveland Clinic is seeking a Healthcare Administrator to oversee daily operations within our hospital system. You will be responsible for managing staff, budgets, and ensuring compliance with healthcare regulations.\n\nRequirements:\n- Master's degree in Healthcare Administration or related field, 5+ years experience\n\nBenefits:\n- Competitive salary, comprehensive benefits, retirement plan, professional development\n\nSkills Needed:\n- Healthcare Operations, Staff Management, Budgeting, Regulatory Compliance, Strategic Planning",
      employerId: 7,
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
    },
    {
      title: 'Digital Marketing Specialist at Coca-Cola',
      location: 'Atlanta, GA',
      jobType: 'Full-time',
      salary: '$65,000 - $85,000',
      category: 'Marketing',
      description: "Coca-Cola is seeking a Digital Marketing Specialist to develop and execute digital campaigns across multiple channels. You will help drive brand awareness, engagement, and consumer acquisition for our beverage portfolio.\n\nRequirements:\n- Bachelor's degree in Marketing or related field, 2+ years digital marketing experience\n\nBenefits:\n- Competitive salary, performance bonuses, health benefits, 401(k) matching, product discounts\n\nSkills Needed:\n- SEO/SEM, Paid Social, Email Marketing, Analytics, Content Strategy, CRM",
      employerId: 7,
    },
    {
      title: 'Market Research Analyst at Unilever',
      location: 'London, UK',
      jobType: 'Full-time',
      salary: '£45,000 - £60,000',
      category: 'Marketing',
      description: "Unilever is seeking a Market Research Analyst to gather and analyze data on consumers, competitors, and market conditions. You will help identify market opportunities and inform product development and marketing strategies.\n\nRequirements:\n- Bachelor's degree in Marketing, Statistics, or Economics, 2+ years experience in market research\n\nBenefits:\n- Competitive salary, performance bonuses, pension scheme, flexible working arrangements\n\nSkills Needed:\n- Quantitative Research, Survey Design, Data Analysis, Consumer Insights, Reporting",
      employerId: 8,
    },
    {
      title: 'Brand Manager at LOreal',
      location: 'Paris, France',
      jobType: 'Full-time',
      salary: '€60,000 - €75,000',
      category: 'Marketing',
      description: "L'Oréal is seeking a Brand Manager to develop and implement marketing strategies for our luxury beauty products. You will be responsible for increasing brand awareness, market share, and profitability.\n\nRequirements:\n- Master's degree in Marketing or Business, 4+ years experience in consumer goods marketing\n\nBenefits:\n- Competitive salary, performance bonuses, product allowance, healthcare, retirement plan\n\nSkills Needed:\n- Brand Strategy, Product Launch, Advertising, Market Analysis, Budget Management",
      employerId: 1,
    },
    {
      title: 'Content Marketing Manager at Shopify',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '$85,000 - $105,000',
      category: 'Marketing',
      description: "Shopify is seeking a Content Marketing Manager to develop and execute our content strategy. You will create compelling content that drives engagement, educates our audience, and supports our business objectives.\n\nRequirements:\n- Bachelor's degree in Marketing, Communications, or related field, 4+ years content marketing experience\n\nBenefits:\n- Competitive salary, equity compensation, health benefits, home office stipend, flexible PTO\n\nSkills Needed:\n- Content Strategy, SEO, Copywriting, Editorial Planning, Content Performance Analysis",
      employerId: 2,
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
    },
    {
      title: 'Sales Manager at Siemens',
      location: 'Munich, Germany',
      jobType: 'Full-time',
      salary: '€70,000 - €90,000 plus performance bonus',
      category: 'Sales',
      description: "Siemens is seeking a Sales Manager to lead our industrial automation solutions sales team in Central Europe. You will be responsible for developing and executing sales strategies to achieve revenue targets.\n\nRequirements:\n- Bachelor's degree in Engineering or Business, 5+ years B2B sales experience in industrial sector\n\nBenefits:\n- Competitive base salary, performance bonuses, company car, pension scheme, health insurance\n\nSkills Needed:\n- Technical Sales, Team Leadership, Account Planning, Sales Forecasting, Negotiation",
      employerId: 1,
    },
    {
      title: 'Pharmaceutical Sales Representative at Johnson & Johnson',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      salary: '$75,000 - $95,000 (Base + Commission)',
      category: 'Sales',
      description: "Johnson & Johnson is seeking a Pharmaceutical Sales Representative to promote our prescription products to healthcare professionals in assigned territory. You will build relationships with physicians and educate them about our products.\n\nRequirements:\n- Bachelor's degree, 2+ years sales experience preferably in pharmaceutical or healthcare industry\n\nBenefits:\n- Competitive base salary, commission structure, company car, comprehensive benefits package\n\nSkills Needed:\n- Relationship Building, Product Knowledge, Territory Management, Clinical Discussion, CRM",
      employerId: 2,
    },
    {
      title: 'Business Development Representative at HubSpot',
      location: 'Dublin, Ireland',
      jobType: 'Full-time',
      salary: '€45,000 - €55,000 plus commission',
      category: 'Sales',
      description: "HubSpot is seeking a Business Development Representative to identify and qualify sales opportunities for our inbound marketing and sales platform. You will be the first point of contact for potential customers.\n\nRequirements:\n- Bachelor's degree, 0-2 years experience in sales or customer service, fluency in English\n\nBenefits:\n- Competitive base salary, commission structure, health benefits, stock options, flexible work arrangements\n\nSkills Needed:\n- Lead Qualification, Cold Calling, Email Communication, CRM Use, Product Knowledge",
      employerId: 3,
    },
    {
      title: 'Regional Sales Director at Toyota',
      location: 'Dallas, TX',
      jobType: 'Full-time',
      salary: '$110,000 - $150,000 plus bonus',
      category: 'Sales',
      description: "Toyota is seeking a Regional Sales Director to oversee dealership performance and sales operations in the Southwest region. You will be responsible for achieving regional sales targets and supporting dealership development.\n\nRequirements:\n- Bachelor's degree in Business or related field, 7+ years automotive sales management experience\n\nBenefits:\n- Competitive base salary, performance bonuses, company car, executive benefits package\n\nSkills Needed:\n- Automotive Industry Knowledge, Sales Leadership, Dealer Relations, Market Analysis, Strategic Planning",
      employerId: 4,
    }
  ];

  // EDUCATION JOBS
  const educationJobs: InsertJob[] = [
    {
      title: 'High School Mathematics Teacher at Phillips Exeter Academy',
      location: 'Exeter, NH',
      jobType: 'Full-time',
      salary: '$65,000 - $85,000',
      category: 'Education',
      description: "Phillips Exeter Academy is seeking a passionate Mathematics Teacher to join our prestigious boarding school. You will teach advanced mathematics courses and mentor students in a collaborative learning environment.\n\nRequirements:\n- Master's degree in Mathematics or Education, 3+ years teaching experience, boarding school experience preferred\n\nBenefits:\n- Competitive salary, housing on campus, comprehensive benefits, summer break, professional development\n\nSkills Needed:\n- Mathematics Instruction, Curriculum Development, Student Engagement, Differentiated Learning, Harkness Method",
      employerId: 1,
    },
    {
      title: 'University Professor of Business at NYU Stern',
      location: 'New York, NY',
      jobType: 'Full-time',
      salary: '$120,000 - $180,000',
      category: 'Education',
      description: "NYU Stern School of Business is seeking a Professor of Business to teach undergraduate and graduate courses in Marketing. You will also conduct research and publish in top-tier academic journals.\n\nRequirements:\n- PhD in Marketing or related field, teaching experience at university level, strong research record\n\nBenefits:\n- Competitive salary, research funding, sabbatical opportunities, retirement benefits, tuition remission\n\nSkills Needed:\n- Research, Academic Publishing, Course Development, Classroom Instruction, Student Mentoring",
      employerId: 2,
    },
    {
      title: 'Elementary School Principal at Montgomery County Public Schools',
      location: 'Bethesda, MD',
      jobType: 'Full-time',
      salary: '$110,000 - $140,000',
      category: 'Education',
      description: "Montgomery County Public Schools is seeking an experienced Elementary School Principal to provide educational and administrative leadership. You will oversee curriculum implementation, staff development, and school operations.\n\nRequirements:\n- Master's degree in Educational Leadership, state administrative certification, 5+ years teaching experience, 3+ years as assistant principal\n\nBenefits:\n- Competitive salary, comprehensive benefits, retirement plan, summer schedule, professional development\n\nSkills Needed:\n- Educational Leadership, Staff Management, Curriculum Planning, Budget Management, Community Relations",
      employerId: 3,
    }
  ];

  // ENGINEERING JOBS
  const engineeringJobs: InsertJob[] = [
    {
      title: 'Civil Engineer at AECOM',
      location: 'Los Angeles, CA',
      jobType: 'Full-time',
      salary: '$75,000 - $95,000',
      category: 'Engineering',
      description: "AECOM is seeking a Civil Engineer to work on infrastructure projects including highways, bridges, and water systems. You will be responsible for design development, analysis, and project coordination.\n\nRequirements:\n- Bachelor's degree in Civil Engineering, PE license or EIT certification, 3+ years experience\n\nBenefits:\n- Competitive salary, performance bonuses, 401(k) matching, comprehensive benefits, professional development\n\nSkills Needed:\n- AutoCAD, Civil 3D, Structural Analysis, Project Management, Technical Documentation",
      employerId: 4,
    },
    {
      title: 'Mechanical Engineer at Boeing',
      location: 'Seattle, WA',
      jobType: 'Full-time',
      salary: '$85,000 - $115,000',
      category: 'Engineering',
      description: "Boeing is seeking a Mechanical Engineer to design and develop aircraft components and systems. You will ensure that designs meet safety requirements, performance specifications, and manufacturability constraints.\n\nRequirements:\n- Bachelor's degree in Mechanical Engineering, 3+ years aerospace experience, proficiency with CAD software\n\nBenefits:\n- Competitive salary, performance bonuses, retirement benefits, health insurance, flight benefits\n\nSkills Needed:\n- CATIA, FEA, GD&T, Technical Documentation, Problem Solving, Team Collaboration",
      employerId: 5,
    },
    {
      title: 'Electrical Engineer at Siemens',
      location: 'Munich, Germany',
      jobType: 'Full-time',
      salary: '€65,000 - €85,000',
      category: 'Engineering',
      description: "Siemens is seeking an Electrical Engineer to design and develop power distribution systems for industrial applications. You will work on projects from concept to implementation, ensuring compliance with international standards.\n\nRequirements:\n- Master's degree in Electrical Engineering, 3+ years experience in power systems, German and English proficiency\n\nBenefits:\n- Competitive salary, performance bonuses, retirement benefits, health insurance, flexible working arrangements\n\nSkills Needed:\n- Power Systems, AutoCAD Electrical, Circuit Design, Protection Systems, Technical Documentation",
      employerId: 6,
    }
  ];

  // HOSPITALITY JOBS
  const hospitalityJobs: InsertJob[] = [
    {
      title: 'Hotel General Manager at Marriott',
      location: 'Miami, FL',
      jobType: 'Full-time',
      salary: '$90,000 - $120,000 plus bonus',
      category: 'Hospitality',
      description: "Marriott International is seeking a Hotel General Manager to oversee all aspects of hotel operations for our luxury property in Miami. You will be responsible for guest satisfaction, staff management, and financial performance.\n\nRequirements:\n- Bachelor's degree in Hospitality Management, 7+ years hotel management experience, proven leadership abilities\n\nBenefits:\n- Competitive salary, performance bonuses, hotel discounts worldwide, comprehensive benefits, relocation assistance\n\nSkills Needed:\n- Hotel Operations, Staff Management, Budget Planning, Customer Service, Revenue Management",
      employerId: 7,
    },
    {
      title: 'Executive Chef at Hilton',
      location: 'Las Vegas, NV',
      jobType: 'Full-time',
      salary: '$85,000 - $110,000',
      category: 'Hospitality',
      description: "Hilton is seeking an Executive Chef to lead the culinary team at our flagship resort in Las Vegas. You will be responsible for menu development, food quality, kitchen operations, and budget management.\n\nRequirements:\n- Culinary degree, 8+ years progressive culinary experience, previous leadership experience in luxury hotels\n\nBenefits:\n- Competitive salary, performance bonuses, hotel discounts worldwide, comprehensive benefits, meals on duty\n\nSkills Needed:\n- Culinary Expertise, Menu Development, Kitchen Management, Food Cost Control, Team Leadership",
      employerId: 8,
    },
    {
      title: 'Event Coordinator at Hyatt',
      location: 'Chicago, IL',
      jobType: 'Full-time',
      salary: '$50,000 - $65,000',
      category: 'Hospitality',
      description: "Hyatt is seeking an Event Coordinator to plan and execute meetings, conferences, and social events at our downtown Chicago location. You will work with clients from initial inquiry through event execution.\n\nRequirements:\n- Bachelor's degree in Hospitality, Event Management, or related field, 2+ years event planning experience\n\nBenefits:\n- Competitive salary, hotel discounts worldwide, comprehensive benefits, career development opportunities\n\nSkills Needed:\n- Event Planning, Client Communication, Vendor Management, Attention to Detail, Problem Solving",
      employerId: 1,
    }
  ];

  // Combine all job categories
  const allJobs: InsertJob[] = [
    ...financeJobs,
    ...techJobs,
    ...healthcareJobs,
    ...marketingJobs,
    ...salesJobs,
    ...educationJobs,
    ...engineeringJobs,
    ...hospitalityJobs
  ];

  // Helper function to create a complete job from partial data
  const createCompleteJob = (job: Partial<InsertJob>): InsertJob => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(now.getDate() + 30);

    // Extract company name from title if not provided
    let company = job.company;
    if (!company && job.title?.includes("at ")) {
      const parts = job.title.split(" at ");
      if (parts.length >= 2) {
        company = parts[1];
      }
    }

    // Build default requirements and benefits from description
    const description = job.description || "";
    let requirements = job.requirements;
    let benefits = job.benefits;

    if (!requirements && description.includes("Requirements:")) {
      const reqParts = description.split("Requirements:");
      if (reqParts.length >= 2) {
        const reqSection = reqParts[1].split("\n\n")[0];
        requirements = reqSection.trim();
      }
    }

    if (!benefits && description.includes("Benefits:")) {
      const benParts = description.split("Benefits:");
      if (benParts.length >= 2) {
        const benSection = benParts[1].split("\n\n")[0];
        benefits = benSection.trim();
      }
    }

    // Parse salary range from text format
    let minSalary = job.minSalary;
    let maxSalary = job.maxSalary;

    if ((!minSalary || !maxSalary) && job.salary) {
      const salaryText = job.salary;
      const numbers = salaryText.match(/[\d,]+/g);
      if (numbers && numbers.length >= 2) {
        minSalary = parseInt(numbers[0].replace(/,/g, ''));
        maxSalary = parseInt(numbers[1].replace(/,/g, ''));
      } else if (numbers && numbers.length === 1) {
        const value = parseInt(numbers[0].replace(/,/g, ''));
        minSalary = Math.floor(value * 0.9);
        maxSalary = Math.floor(value * 1.1);
      }
    }

    // Set a default deadline if not provided
    const applicationDeadline = job.applicationDeadline || deadline;

    // Defaults for all required fields
    return {
      employerId: employerId,
      title: job.title || "Untitled Position",
      company: company || "Demo Recruiting Company",
      description: job.description || "No description provided",
      requirements: requirements || "Please contact employer for detailed requirements",
      benefits: benefits || "Please contact employer for detailed benefits information",
      category: job.category || "General",
      location: job.location || "Remote",
      jobType: job.jobType || "Full-time",
      experience: job.experience || "Not specified",
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      isActive: true,
      applicationCount: 0,
      postedDate: new Date(),
      applicationDeadline: applicationDeadline,
      contactEmail: job.contactEmail || "contact@example.com",
      specialization: job.specialization || null,
      salary: job.salary || null
    };
  };

  // Add all jobs to the database with complete data
  for (const jobData of allJobs) {
    const completeJob = createCompleteJob(jobData);
    await storage.createJob(completeJob);
    console.log(`Created job: ${completeJob.title} (${completeJob.category})`);
  }

  console.log(`Successfully seeded ${allJobs.length} jobs across multiple categories!`);
}

export { seedJobs };
