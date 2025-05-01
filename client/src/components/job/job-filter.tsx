import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Filter, X, Search, Briefcase, MapPin, Clock, DollarSign, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Job filter props
interface JobFilterProps {
  onFilterChange: (filters: {
    category: string;
    location: string;
    jobType: string;
    specialization: string;
    experience: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }) => void;
}

// Job categories
const categories = [
  "All Categories",
  "Accounting",
  "Administration",
  "Architecture",
  "Arts",
  "Banking",
  "Business",
  "Construction",
  "Consulting",
  "Customer Service",
  "Data Science",
  "Design",
  "Education",
  "Engineering",
  "Finance",
  "Healthcare",
  "Hospitality",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Logistics",
  "Maintenance",
  "Manufacturing",
  "Marketing",
  "Media",
  "Operations",
  "Procurement",
  "Production",
  "Quality Assurance",
  "Real Estate",
  "Research",
  "Retail",
  "Sales",
  "Science",
  "Security",
  "Software",
  "Support",
  "Supply Chain",
  "Teaching",
  "Telecommunications",
  "Transportation",
  "Writing",
  "Other",
];

// Specializations
const specializations = [
  
  "All Specializations",
  
  // Accounting
  "Auditor",
  "Bookkeeper",
  "Chartered Accountant",
  "Cost Accountant",
  "Financial Accountant",
  "Management Accountant",
  "Payroll Specialist",
  "Tax Consultant",
  "Tax Preparer",
  "Accounts Payable Clerk",
  "Accounts Receivable Clerk",

  // Administration
  "Administrative Assistant",
  "Executive Assistant",
  "Office Administrator",
  "Office Manager",
  "Receptionist",
  "Data Entry Clerk",
  "Clerical Assistant",
  "Front Desk Coordinator",
  "Secretary",
  "Administrative Coordinator",

  // Architecture
  "Architect",
  "Interior Designer",
  "Landscape Architect",
  "Urban Planner",
  "Architectural Drafter",
  "Project Architect",
  "Design Architect",
  "Construction Architect",
  "Architectural Technologist",
  "Building Designer",

  // Arts
  "Graphic Designer",
  "Illustrator",
  "Animator",
  "Art Director",
  "Fine Artist",
  "Multimedia Artist",
  "Photographer",
  "Creative Director",
  "Visual Designer",
  "Art Teacher",

  // Banking
  "Bank Teller",
  "Loan Officer",
  "Credit Analyst",
  "Branch Manager",
  "Investment Banker",
  "Mortgage Advisor",
  "Risk Analyst",
  "Relationship Manager",
  "Compliance Officer",
  "Financial Advisor",

  // Business
  "Business Analyst",
  "Business Development Manager",
  "Project Manager",
  "Operations Manager",
  "Strategy Consultant",
  "Management Consultant",
  "Entrepreneur",
  "Product Manager",
  "Business Consultant",
  "Business Coordinator",

  // Construction
  "Construction Manager",
  "Site Engineer",
  "Quantity Surveyor",
  "Civil Engineer",
  "Project Engineer",
  "Safety Officer",
  "Estimator",
  "Foreman",
  "Architectural Engineer",
  "Building Inspector",

  // Consulting
  "Management Consultant",
  "Strategy Consultant",
  "IT Consultant",
  "Financial Consultant",
  "HR Consultant",
  "Operations Consultant",
  "Risk Consultant",
  "Business Consultant",
  "Environmental Consultant",
  "Legal Consultant",

  // Customer Service
  "Customer Service Representative",
  "Call Center Agent",
  "Client Support Specialist",
  "Help Desk Associate",
  "Customer Success Manager",
  "Technical Support Specialist",
  "Customer Care Executive",
  "Support Analyst",
  "Service Advisor",
  "Customer Relations Manager",

  // Data Science
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "Business Intelligence Analyst",
  "Statistician",
  "Data Engineer",
  "Quantitative Analyst",
  "Data Architect",
  "AI Engineer",
  "Big Data Analyst",

  // Design
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Graphic Designer",
  "Visual Designer",
  "Interaction Designer",
  "Web Designer",
  "Industrial Designer",
  "Motion Designer",
  "Design Researcher",

  // Education
  "Teacher",
  "Professor",
  "Lecturer",
  "Academic Counselor",
  "Instructional Designer",
  "Curriculum Developer",
  "Education Coordinator",
  "School Principal",
  "Special Education Teacher",
  "Education Consultant",

  // Engineering
  "Mechanical Engineer",
  "Civil Engineer",
  "Electrical Engineer",
  "Chemical Engineer",
  "Software Engineer",
  "Industrial Engineer",
  "Environmental Engineer",
  "Structural Engineer",
  "Biomedical Engineer",
  "Aerospace Engineer",

  // Finance
  "Financial Analyst",
  "Investment Banker",
  "Portfolio Manager",
  "Risk Analyst",
  "Treasury Analyst",
  "Financial Planner",
  "Credit Analyst",
  "Budget Analyst",
  "Finance Manager",
  "Equity Analyst",

  // Healthcare
  "General Practitioner",
  "Registered Nurse",
  "Pharmacist",
  "Physiotherapist",
  "Lab Technician",
  "Radiologist",
  "Surgeon",
  "Dentist",
  "Medical Assistant",
  "Occupational Therapist",

  // Hospitality
  "Hotel Manager",
  "Chef",
  "Housekeeping Supervisor",
  "Front Desk Officer",
  "Concierge",
  "Event Coordinator",
  "Restaurant Manager",
  "Bartender",
  "Travel Agent",
  "Tour Guide",

  // Human Resources
  "HR Manager",
  "Recruiter",
  "Talent Acquisition Specialist",
  "HR Generalist",
  "HR Coordinator",
  "Compensation Analyst",
  "Training Manager",
  "Employee Relations Specialist",
  "HR Consultant",
  "Payroll Manager",

  // Information Technology
  "IT Support Specialist",
  "Network Administrator",
  "Systems Analyst",
  "Database Administrator",
  "IT Project Manager",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Technical Support Engineer",
  "IT Consultant",

  // Legal
  "Lawyer",
  "Paralegal",
  "Legal Advisor",
  "Legal Assistant",
  "Corporate Counsel",
  "Compliance Officer",
  "Legal Analyst",
  "Judge",
  "Notary Public",
  "Legal Secretary",

  // Logistics
  "Logistics Coordinator",
  "Supply Chain Manager",
  "Warehouse Manager",
  "Inventory Analyst",
  "Transportation Manager",
  "Procurement Specialist",
  "Shipping Coordinator",
  "Fleet Manager",
  "Distribution Manager",
  "Import/Export Coordinator",

  // Maintenance
  "Maintenance Technician",
  "Facility Manager",
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Maintenance Supervisor",
  "Building Maintenance Worker",
  "Equipment Technician",
  "Janitor",
  "Groundskeeper",

  // Manufacturing
  "Production Manager",
  "Quality Control Inspector",
  "Assembly Line Worker",
  "Manufacturing Engineer",
  "Machine Operator",
  "Plant Manager",
  "Process Engineer",
  "Industrial Engineer",
  "Maintenance Technician",
  "Supply Chain Analyst",

  // Marketing
  "Marketing Manager",
  "Digital Marketing Specialist",
  "SEO Analyst",
  "Content Strategist",
  "Brand Manager",
  "Social Media Manager",
  "Market Research Analyst",
  "Email Marketing Specialist",
  "Product Marketing Manager",
  "Advertising Coordinator",

  // Media
  "Journalist",
  "Editor",
  "Producer",
  "Photographer",
  "Videographer",
  "News Anchor",
  "Copywriter",
  "Broadcast Technician",
  "Media Planner",
  "Public Relations Specialist",

  // Operations
  "Operations Manager",
  "Operations Analyst",
  "Business Operations Specialist",
  "Process Improvement Manager",
  "Operations Coordinator",
  "Logistics Manager",
  "Supply Chain Analyst",
  "Production Planner",
  "Facilities Manager",
  "Inventory Control Specialist",

  // Procurement
  "Procurement Manager",
  "Purchasing Agent",
  "Buyer",
  "Supply Chain Manager",
  "Contract Manager",
  "Category Manager",
  "Vendor Manager",
  "Sourcing Specialist",
  "Procurement Analyst",
  "Materials Manager",

  // Production
  "Production Supervisor",
  "Manufacturing Technician",
  "Assembly Operator",
  "Quality Assurance Inspector",
  "Process Engineer",
  "Machine Operator",
  "Production Planner",
  "Line Leader",
  "Fabricator",
  "Packaging Operator",

  // Quality Assurance
  "Quality Assurance Analyst",
  "Quality Control Inspector",
  "Test Engineer",
  "QA Manager",
  "Compliance Officer",
  "Quality Auditor",
  "Validation Engineer",
  "Process Improvement Specialist",
  "Regulatory Affairs Specialist",
  "Product Tester",

  // Real Estate
  "Real Estate Agent",
  "Property Manager",
  "Leasing Consultant",
  "Real Estate Broker",
  "Appraiser",
  "Real Estate Analyst",
  "Mortgage Broker",
  "Title Examiner",
  "Real Estate Developer",
  "Escrow Officer",

  // Research
  "Research Scientist",
  "Clinical Research Associate",
  "Market Research Analyst",
  "Research Assistant",
  "Data Scientist",
  "Lab Technician",
  "Principal Investigator",
  "Research Coordinator",
  "Postdoctoral Fellow",
  "Research Analyst",

  // Retail
  "Retail Sales Associate",
  "Store Manager",
  "Cashier",
  "Visual Merchandiser",
  "Inventory Specialist",
  "Retail Buyer",
  "Assistant Store Manager",
  "Customer Service Representative",
  "Loss Prevention Officer",
  "Department Manager",

  // Sales
  "Sales Executive",
  "Account Manager",
  "Sales Representative",
  "Business Development Manager",
  "Territory Sales Manager",
  "Inside Sales Representative",
  "Sales Consultant",
  "Regional Sales Manager",
  "Key Account Manager",
  "Sales Coordinator",

  // Science
  "Biologist",
  "Chemist",
  "Physicist",
  "Laboratory Technician",
  "Environmental Scientist",
  "Research Scientist",
  "Microbiologist",
  "Data Scientist",
  "Geologist",
  "Pharmacologist",

  // Security
  "Security Guard",
  "Security Officer",
  "Loss Prevention Specialist",
  "Surveillance Operator",
  "Security Manager",
  "Cybersecurity Analyst",
  "Information Security Officer",
  "Patrol Officer",
  "Event Security Staff",
  "Security Consultant",

  // Software
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Systems Architect",

  // Support
  "Technical Support Specialist",
  "Customer Support Representative",
  "Help Desk Technician",
  "IT Support Analyst",
  "Support Engineer",
  "Application Support Analyst",
  "Product Support Specialist",
  "Service Desk Analyst",
  "Support Coordinator",
  "Technical Account Manager",

  // Supply Chain
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Inventory Analyst",
  "Procurement Specialist",
  "Demand Planner",
  "Warehouse Manager",
  "Transportation Manager",
  "Supply Planner",
  "Materials Manager",
  "Distribution Manager",

  // Teaching
  "Primary School Teacher",
  "Secondary School Teacher",
  "Special Education Teacher",
  "ESL Teacher",
  "Subject Matter Expert",
  "Teaching Assistant",
  "Curriculum Developer",
  "Online Instructor",
  "Education Consultant",
  "Lecturer",

  // Telecommunications
  "Telecom Engineer",
  "Network Engineer",
  "Field Technician",
  "Telecommunications Analyst",
  "VoIP Engineer",
  "Wireless Technician",
  "Telecom Project Manager",
  "Fiber Optic Technician",
  "Network Administrator",
  "Telecom Sales Executive",

  // Transportation
  "Truck Driver",
  "Delivery Driver",
  "Logistics Coordinator",
  "Fleet Manager",
  "Transportation Planner",
  "Bus Driver",
  "Courier",
  "Dispatcher",
  "Transport Manager",
  "Chauffeur",

  // Writing
  "Content Writer",
  "Copywriter",
  "Technical Writer",
  "Editor",
  "Proofreader",
  "Grant Writer",
  "Journalist",
  "Scriptwriter",
  "Blogger",
  "Creative Writer",

];

// Job locations
const locations = [
  // United States
  "New York, NY",
  "San Francisco, CA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Seattle, WA",
  "Boston, MA",
  "Austin, TX",
  "Miami, FL",
  "Denver, CO",
  "Washington, DC",
  // UAE
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE", 
  "Ajman, UAE", 
  "Umm al-Quwain, UAE",
  "Ras al-Khaimah, UAE",
  "Fujairah, UAE",
  // India
  "Ahmedabad, India",
  "Agra, India", 
  "Bangalore, India",
  "Bhubaneswar, India",
  "Chennai, India",
  "Coimbatore, India",
  "Calicut, India",
  "Delhi, India",
  "Faridabad, India",
  "Ghaziabad, India", 
  "Gurugram, India",
  "Guwahati, India",
  "Hyderabad, India",
  "Indore, India",
  "Jaipur, India" ,
  "Kanpur, India",
  "Pune, India",
  "Prayagraj, India",
  "Kochi, India",
  "Kollam, India",
  "Kolkata, India",
  "Trivandrum, India",
  "Lucknow, India",
  "Ludhiana, India",
  "Mumbai, India",
  "Madurai, India",
  "Mysuru, India",
  "Meerut, India",  
  "Nagpur, India",
  "Nashik, India",
  "Patna, India", 
  "Surat, India",
  "Visakhapatnam, India",
  "Vadodara, India",
  
  // Other International
  "London, UK",
  "Toronto, Canada",
  "Sydney, Australia",
  "Paris, France",
  "Munich, Germany",
  "Dublin, Ireland",
  "Remote",
  "All Locations"
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
  "All Types"
];

// Experience levels
const experienceLevels = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
  "All Experience Levels"
];

export default function JobFilter({ onFilterChange }: JobFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [selectedExperience, setSelectedExperience] = useState("All Experience Levels");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [keyword, setKeyword] = useState("");
  const [displaySalary, setDisplaySalary] = useState<string>("$0 - $200,000+");
  const [customCurrency, setCustomCurrency] = useState<string>("");
  
  // Get currency symbol based on custom entry or selected location
  const getCurrencySymbol = (): string => {
    // Return custom currency if set
    if (customCurrency.trim()) {
      return `${customCurrency} `;
    }
    
    // Otherwise determine by location
    if (selectedLocation.includes("India")) {
      return "₹"; // Indian Rupee
    } else if (selectedLocation.includes("UAE")) {
      return "AED "; // UAE Dirham
    } else if (selectedLocation.includes("UK")) {
      return "£"; // British Pound
    } else if (selectedLocation.includes("Europe") || selectedLocation.includes("France") || selectedLocation.includes("Germany")) {
      return "€"; // Euro
    } else if (selectedLocation.includes("Canada")) {
      return "C$"; // Canadian Dollar
    } else if (selectedLocation.includes("Australia")) {
      return "A$"; // Australian Dollar
    } else {
      return "$"; // Default to US Dollar
    }
  };
  
  // Format salary for display with appropriate currency
  const formatSalary = (value: number): string => {
    const currencySymbol = getCurrencySymbol();
    const isUAE = selectedLocation.includes("UAE");
    
    if (isUAE) {
      // For UAE, we don't abbreviate with 'k'
      return `${currencySymbol}${value.toLocaleString()}`;
    } else if (value >= 1000) {
      return `${currencySymbol}${Math.floor(value/1000)}k`;
    }
    return `${currencySymbol}${value}`;
  };
  
  // Update displayed salary when slider changes
  const handleSalaryChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setSalaryRange([min, max]);
    
    // Format for display
    let displayText = "";
    const currencySymbol = getCurrencySymbol();
    const isUAE = selectedLocation.includes("UAE");
    
    if (max >= 200000) {
      if (isUAE) {
        displayText = `${formatSalary(min)} - ${currencySymbol}200,000+`;
      } else {
        displayText = `${formatSalary(min)} - ${currencySymbol}200,000+`;
      }
    } else {
      displayText = `${formatSalary(min)} - ${formatSalary(max)}`;
    }
    
    setDisplaySalary(displayText);
  };
  
  // Handle filter application
  const applyFilters = () => {
    onFilterChange({
      category: selectedCategory === "All Categories" ? "" : selectedCategory,
      location: selectedLocation === "All Locations" ? "" : selectedLocation,
      jobType: selectedJobType === "All Types" ? "" : selectedJobType,
      specialization: selectedSpecialization === "All Specializations" ? "" : selectedSpecialization,
      experience: selectedExperience === "All Experience Levels" ? "" : selectedExperience,
      minSalary: salaryRange[0] > 0 ? salaryRange[0] : undefined,
      maxSalary: salaryRange[1] < 200000 ? salaryRange[1] : undefined,
      keyword: keyword.trim() || undefined
    });
  };
  
  // Handle filter reset
  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSelectedJobType("All Types");
    setSelectedSpecialization("All Specializations");
    setSelectedExperience("All Experience Levels");
    setSalaryRange([0, 200000]);
    setDisplaySalary("$0 - $200,000+");
    setKeyword("");
    setCustomCurrency("");
    
    onFilterChange({
      category: "",
      location: "",
      jobType: "",
      specialization: "",
      experience: ""
    });
  };
  
  // Apply filters when values change (optional - can be enabled for auto-filter)
  useEffect(() => {
    // We can enable this for automatic filtering without button click
    // applyFilters();
  }, [selectedCategory, selectedLocation, selectedJobType, selectedSpecialization, selectedExperience, salaryRange]);
  
  // Update salary display when location or custom currency changes
  useEffect(() => {
    // Update the display format with the new currency when location or custom currency changes
    handleSalaryChange(salaryRange);
  }, [selectedLocation, customCurrency]);
  
  return (
    <>      
      {/* Mobile filter toggle - only shown inside job board */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between bg-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </span>
          <span>
            {showFilters ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </Button>
        
        {/* Active filters summary - mobile */}
        {(selectedCategory !== "All Categories" || 
          selectedLocation !== "All Locations" || 
          selectedJobType !== "All Types" || 
          selectedSpecialization !== "All Specializations" || 
          salaryRange[0] > 0 || 
          salaryRange[1] < 200000) && (
            <div className="md:hidden mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-gray-700">Active Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-gray-500 hover:text-primary p-0"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCategory !== "All Categories" && (
                  <Badge variant="outline" className="bg-white text-xs px-2 py-0.5">
                    {selectedCategory}
                  </Badge>
                )}
                
                {selectedLocation !== "All Locations" && (
                  <Badge variant="outline" className="bg-white text-xs px-2 py-0.5">
                    {selectedLocation}
                  </Badge>
                )}
                
                {selectedJobType !== "All Types" && (
                  <Badge variant="outline" className="bg-white text-xs px-2 py-0.5">
                    {selectedJobType}
                  </Badge>
                )}
              </div>
            </div>
        )}
      </div>
      
      {/* Active filters (desktop) */}
      {(selectedCategory !== "All Categories" || 
        selectedLocation !== "All Locations" || 
        selectedJobType !== "All Types" || 
        selectedSpecialization !== "All Specializations" || 
        salaryRange[0] > 0 || 
        salaryRange[1] < 200000) && (
          <div className="hidden md:block mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-gray-500 hover:text-primary"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== "All Categories" && (
                <Badge variant="outline" className="bg-white flex items-center gap-1 px-3 py-1 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="mx-1">{selectedCategory}</span>
                  <X 
                    className="h-3 w-3 text-gray-400 hover:text-gray-700 cursor-pointer" 
                    onClick={() => setSelectedCategory("All Categories")}
                  />
                </Badge>
              )}
              
              {selectedLocation !== "All Locations" && (
                <Badge variant="outline" className="bg-white flex items-center gap-1 px-3 py-1 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="mx-1">{selectedLocation}</span>
                  <X 
                    className="h-3 w-3 text-gray-400 hover:text-gray-700 cursor-pointer" 
                    onClick={() => setSelectedLocation("All Locations")}
                  />
                </Badge>
              )}
              
              {selectedJobType !== "All Types" && (
                <Badge variant="outline" className="bg-white flex items-center gap-1 px-3 py-1 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="mx-1">{selectedJobType}</span>
                  <X 
                    className="h-3 w-3 text-gray-400 hover:text-gray-700 cursor-pointer" 
                    onClick={() => setSelectedJobType("All Types")}
                  />
                </Badge>
              )}
              
              {selectedSpecialization !== "All Specializations" && (
                <Badge variant="outline" className="bg-white flex items-center gap-1 px-3 py-1 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="mx-1">{selectedSpecialization}</span>
                  <X 
                    className="h-3 w-3 text-gray-400 hover:text-gray-700 cursor-pointer" 
                    onClick={() => setSelectedSpecialization("All Specializations")}
                  />
                </Badge>
              )}
              
              {(salaryRange[0] > 0 || salaryRange[1] < 200000) && (
                <Badge variant="outline" className="bg-white flex items-center gap-1 px-3 py-1 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <span className="mx-1">{displaySalary}</span>
                  <X 
                    className="h-3 w-3 text-gray-400 hover:text-gray-700 cursor-pointer" 
                    onClick={() => {
                      setSalaryRange([0, 200000]);
                      setDisplaySalary("$0 - $200,000+");
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
      )}
    
      <Card className={`${showFilters ? 'block' : 'hidden'} md:block transition-all duration-300 ease-in-out shadow-md border border-gray-200 rounded-xl overflow-hidden h-full`}>
        <CardContent className="space-y-6 pt-6 px-5 overflow-auto h-full scrollbar-hide">
          {/* Job Categories */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Job Category
            </h3>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Job Location with custom input option */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Location
            </h3>
            <div className="space-y-3">
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              
              {/* Add Custom Location */}
              <div className="border-t border-gray-200 pt-3">
                <label htmlFor="custom-location" className="text-xs text-gray-500 mb-1 block">
                  Add Custom Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-location"
                    placeholder="Enter custom location"
                    className="text-sm h-9 flex-1"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-9 bg-white hover:bg-gray-50"
                    onClick={() => {
                      const customLocation = (document.getElementById('custom-location') as HTMLInputElement).value;
                      if (customLocation.trim() && !locations.includes(customLocation)) {
                        // In a real app we'd update the locations array
                        // For now we can just set the selected location
                        setSelectedLocation(customLocation);
                        // Clear the input
                        (document.getElementById('custom-location') as HTMLInputElement).value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Type */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Job Type
            </h3>
            <div className="space-y-2">
              <RadioGroup 
                value={selectedJobType}
                onValueChange={setSelectedJobType}
              >
                <div className="grid grid-cols-2 gap-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Specialization */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Specialization
            </h3>
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {specializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          {/* Experience Level */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Experience Level
            </h3>
            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((experience) => (
                  <SelectItem key={experience} value={experience}>
                    {experience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Salary Range with improved interactive display */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold mb-3 text-gray-800">
              Salary Range (Monthly)
            </h3>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-4 font-semibold text-gray-700 text-base bg-gray-50 py-2 rounded-md border border-gray-100">
                {displaySalary}
              </div>
              
              {/* Custom Currency Input */}
              <div className="mb-4 border-b border-gray-200 pb-4">
                <label htmlFor="custom-currency" className="text-xs text-gray-500 mb-1 block">
                  Use Custom Currency Symbol
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-currency"
                    placeholder="Example: EUR, GBP, JPY"
                    className="text-sm h-9 flex-1"
                    value={customCurrency}
                    onChange={(e) => {
                      setCustomCurrency(e.target.value);
                      // Update the salary display with new currency
                      handleSalaryChange(salaryRange);
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-9 text-xs"
                    onClick={() => {
                      setCustomCurrency("");
                      // Update display with default currency
                      handleSalaryChange(salaryRange);
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Using: {getCurrencySymbol()} (based on {customCurrency ? "custom entry" : "location"})
                </p>
              </div>
              
              {/* Simple slider without custom markers */}
              <div className="py-4">
                <Slider 
                  defaultValue={[0, 200000]}
                  value={salaryRange}
                  max={200000} 
                  step={10000}
                  minStepsBetweenThumbs={1}
                  onValueChange={handleSalaryChange}
                  className="mb-4"
                />
              </div>
              
              {/* Salary scale */}
              <div className="grid grid-cols-5 text-xs text-gray-500">
                <div className="text-left">{getCurrencySymbol()}0</div>
                <div className="text-center">{getCurrencySymbol()}{selectedLocation.includes("UAE") ? "50,000" : "50k"}</div>
                <div className="text-center">{getCurrencySymbol()}{selectedLocation.includes("UAE") ? "100,000" : "100k"}</div>
                <div className="text-center">{getCurrencySymbol()}{selectedLocation.includes("UAE") ? "150,000" : "150k"}</div>
                <div className="text-right">{getCurrencySymbol()}{selectedLocation.includes("UAE") ? "200,000+" : "200k+"}</div>
              </div>
              
              {/* Salary input fields (optional for direct input) */}
              <div className="mt-4 flex items-center space-x-4">
                <div className="w-1/2">
                  <Label htmlFor="min-salary" className="text-xs text-gray-500 mb-1 block">Min Salary</Label>
                  <Input
                    id="min-salary"
                    type="number"
                    className="text-sm h-9"
                    value={salaryRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value < salaryRange[1]) {
                        handleSalaryChange([value, salaryRange[1]]);
                      }
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="max-salary" className="text-xs text-gray-500 mb-1 block">Max Salary</Label>
                  <Input
                    id="max-salary"
                    type="number"
                    className="text-sm h-9"
                    value={salaryRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > salaryRange[0] && value <= 200000) {
                        handleSalaryChange([salaryRange[0], value]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    applyFilters();
                    // On mobile, close the filter after applying
                    if (window.innerWidth < 768) {
                      setShowFilters(false);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-5 flex-1 transition-all duration-300"
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium flex-1 transition-all duration-300"
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mobile apply button - fixed at bottom */}
      {showFilters && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
          <Button
            onClick={() => {
              applyFilters();
              setShowFilters(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 font-medium py-5"
          >
            Apply Filters & View Jobs
          </Button>
        </div>
      )}
    </>
  );
}


