import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Filter, X, Search, Briefcase, MapPin, Clock } from "lucide-react";
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
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Sales",
  "Hospitality",
  "All Categories"
];

// Specializations
const specializations = [
  // Technology
  "Software Development",
  "Data Science",
  "UX/UI Design",
  "DevOps Engineering",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence",
  "Machine Learning",
  "Blockchain Development",
  // Finance
  "Investment Banking",
  "Financial Analysis",
  "Risk Management",
  "Wealth Management",
  "Tax Advisory",
  "Corporate Finance",
  // Healthcare
  "Nursing",
  "Pharmacy",
  "Physical Therapy",
  "Medical Research",
  "Healthcare Administration",
  // Marketing
  "Digital Marketing",
  "Brand Management",
  "Content Marketing",
  "Social Media Marketing",
  "Market Research",
  // Engineering
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  // Education
  "Teaching",
  "Academic Research",
  "Educational Administration",
  // General
  "Project Management",
  "Customer Support",
  "Human Resources",
  "Operations Management",
  "All Specializations"
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
  // International
  "London, UK",
  "Toronto, Canada",
  "Sydney, Australia",
  "Paris, France",
  "Munich, Germany",
  "Dublin, Ireland",
  "Dubai, UAE",
  // Remote
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
  
  // Format salary for display
  const formatSalary = (value: number): string => {
    if (value >= 1000) {
      return `$${Math.floor(value/1000)}k`;
    }
    return `$${value}`;
  };
  
  // Update displayed salary when slider changes
  const handleSalaryChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setSalaryRange([min, max]);
    
    // Format for display
    let displayText = "";
    
    if (max >= 200000) {
      displayText = `${formatSalary(min)} - $200,000+`;
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
  
  return (
    <>
      {/* Keyword search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for job title, skills, or company..."
            className="pl-10 pr-4"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters();
              }
            }}
          />
        </div>
      </div>
      
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter Jobs
          </span>
          <span>
            {showFilters ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronIcon className="h-4 w-4" />
            )}
          </span>
        </Button>
      </div>
      
      {/* Active filters (desktop) */}
      <div className="hidden md:flex flex-wrap gap-2 mb-4">
        {selectedCategory !== "All Categories" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {selectedCategory}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => setSelectedCategory("All Categories")}
            />
          </Badge>
        )}
        
        {selectedLocation !== "All Locations" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {selectedLocation}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => setSelectedLocation("All Locations")}
            />
          </Badge>
        )}
        
        {selectedJobType !== "All Types" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {selectedJobType}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => setSelectedJobType("All Types")}
            />
          </Badge>
        )}
        
        {selectedSpecialization !== "All Specializations" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {selectedSpecialization}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => setSelectedSpecialization("All Specializations")}
            />
          </Badge>
        )}
        
        {(salaryRange[0] > 0 || salaryRange[1] < 200000) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {displaySalary}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => {
                setSalaryRange([0, 200000]);
                setDisplaySalary("$0 - $200,000+");
              }}
            />
          </Badge>
        )}
      </div>
    
      <Card className={`${showFilters ? 'block' : 'hidden'} md:block transition-all duration-300 ease-in-out`}>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-bold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Refine Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-5">
          {/* Job Categories */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
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
          
          {/* Job Location */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </h3>
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
          </div>
          
          {/* Job Type */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
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
          <div>
            <h3 className="font-medium mb-3">Specialization</h3>
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
          <div>
            <h3 className="font-medium mb-3">Experience Level</h3>
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
          
          {/* Salary Range with interactive display */}
          <div>
            <h3 className="font-medium mb-3">Salary Range</h3>
            <div className="pt-4">
              <div className="text-center mb-2 font-medium text-primary">
                {displaySalary}
              </div>
              <Slider 
                defaultValue={[0, 200000]}
                value={salaryRange}
                max={200000} 
                step={10000}
                minStepsBetweenThumbs={1}
                onValueChange={handleSalaryChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$0</span>
                <span>$50k</span>
                <span>$100k</span>
                <span>$150k</span>
                <span>$200k+</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 pt-4">
            <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Chevron icon component
function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
