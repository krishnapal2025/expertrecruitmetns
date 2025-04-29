import { useState, useEffect } from "react";
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
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </Button>
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
        <CardContent className="space-y-6 pt-6 px-5 overflow-auto max-h-[calc(100vh-220px)]">
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
                  onClick={applyFilters} 
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
    </>
  );
}


