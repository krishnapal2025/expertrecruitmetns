import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

// Job filter props
interface JobFilterProps {
  onFilterChange: (filters: {
    category: string;
    location: string;
    jobType: string;
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
  "Legal",
  "Hospitality",
  "Retail",
  "All Categories"
];

// Job locations
const locations = [
  "New York",
  "San Francisco",
  "Chicago",
  "London",
  "Toronto",
  "Sydney",
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
  "All Types"
];

export default function JobFilter({ onFilterChange }: JobFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  
  // Handle filter application
  const applyFilters = () => {
    onFilterChange({
      category: selectedCategory === "All Categories" ? "" : selectedCategory,
      location: selectedLocation === "All Locations" ? "" : selectedLocation,
      jobType: selectedJobType === "All Types" ? "" : selectedJobType
    });
  };
  
  // Handle filter reset
  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSelectedJobType("All Types");
    
    onFilterChange({
      category: "",
      location: "",
      jobType: ""
    });
  };
  
  // Apply filters when values change
  useEffect(() => {
    // We can enable this for automatic filtering without button click
    // applyFilters();
  }, [selectedCategory, selectedLocation, selectedJobType]);
  
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
              <ChevronIcon className="h-4 w-4" />
            )}
          </span>
        </Button>
      </div>
    
      <Card className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Categories */}
          <div>
            <h3 className="font-medium mb-3">Job Category</h3>
            <div className="space-y-2">
              <RadioGroup 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={`category-${category}`} />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          {/* Job Location */}
          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <div className="space-y-2">
              <RadioGroup 
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <RadioGroupItem value={location} id={`location-${location}`} />
                    <Label htmlFor={`location-${location}`}>{location}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          {/* Job Type */}
          <div>
            <h3 className="font-medium mb-3">Job Type</h3>
            <div className="space-y-2">
              <RadioGroup 
                value={selectedJobType}
                onValueChange={setSelectedJobType}
              >
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          {/* Salary Range - Could be enhanced with a range slider */}
          <div>
            <h3 className="font-medium mb-3">Salary Range</h3>
            <div className="pt-4">
              <Slider 
                defaultValue={[50000]} 
                max={200000} 
                step={5000} 
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$0</span>
                <span>$200k+</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 pt-2">
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
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
