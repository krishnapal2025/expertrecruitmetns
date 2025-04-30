import { Helmet } from "react-helmet";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, DollarSign, TrendingUp, TrendingDown, BarChart, PieChart, Download, Info, Search, Building, MapPin, Briefcase, LineChart } from "lucide-react";

// Salary data by industry
const industrySalaries = {
  "Technology": [
    { role: "Software Engineer", entrySalary: 75000, midSalary: 110000, seniorSalary: 150000, trend: "up" },
    { role: "Product Manager", entrySalary: 85000, midSalary: 120000, seniorSalary: 165000, trend: "up" },
    { role: "UX/UI Designer", entrySalary: 70000, midSalary: 95000, seniorSalary: 130000, trend: "up" },
    { role: "Data Scientist", entrySalary: 90000, midSalary: 125000, seniorSalary: 170000, trend: "up" },
    { role: "DevOps Engineer", entrySalary: 80000, midSalary: 115000, seniorSalary: 155000, trend: "up" },
    { role: "Cybersecurity Analyst", entrySalary: 75000, midSalary: 105000, seniorSalary: 145000, trend: "up" },
  ],
  "Finance": [
    { role: "Financial Analyst", entrySalary: 65000, midSalary: 90000, seniorSalary: 130000, trend: "steady" },
    { role: "Investment Banker", entrySalary: 90000, midSalary: 150000, seniorSalary: 250000, trend: "steady" },
    { role: "Accountant", entrySalary: 60000, midSalary: 85000, seniorSalary: 110000, trend: "steady" },
    { role: "Financial Advisor", entrySalary: 55000, midSalary: 100000, seniorSalary: 150000, trend: "up" },
    { role: "Risk Manager", entrySalary: 70000, midSalary: 110000, seniorSalary: 160000, trend: "up" },
    { role: "Compliance Officer", entrySalary: 65000, midSalary: 95000, seniorSalary: 130000, trend: "steady" },
  ],
  "Healthcare": [
    { role: "Registered Nurse", entrySalary: 65000, midSalary: 85000, seniorSalary: 110000, trend: "up" },
    { role: "Physician Assistant", entrySalary: 95000, midSalary: 115000, seniorSalary: 140000, trend: "up" },
    { role: "Healthcare Administrator", entrySalary: 70000, midSalary: 100000, seniorSalary: 140000, trend: "up" },
    { role: "Physical Therapist", entrySalary: 75000, midSalary: 90000, seniorSalary: 115000, trend: "steady" },
    { role: "Medical Laboratory Technician", entrySalary: 50000, midSalary: 65000, seniorSalary: 85000, trend: "steady" },
    { role: "Radiologic Technologist", entrySalary: 55000, midSalary: 70000, seniorSalary: 90000, trend: "steady" },
  ],
  "Marketing": [
    { role: "Marketing Manager", entrySalary: 65000, midSalary: 95000, seniorSalary: 140000, trend: "steady" },
    { role: "Digital Marketing Specialist", entrySalary: 55000, midSalary: 75000, seniorSalary: 105000, trend: "up" },
    { role: "Content Strategist", entrySalary: 60000, midSalary: 85000, seniorSalary: 115000, trend: "up" },
    { role: "Brand Manager", entrySalary: 70000, midSalary: 100000, seniorSalary: 145000, trend: "steady" },
    { role: "SEO Specialist", entrySalary: 50000, midSalary: 75000, seniorSalary: 100000, trend: "steady" },
    { role: "Public Relations Specialist", entrySalary: 55000, midSalary: 80000, seniorSalary: 110000, trend: "steady" },
  ],
  "Legal": [
    { role: "Associate Attorney", entrySalary: 85000, midSalary: 130000, seniorSalary: 200000, trend: "steady" },
    { role: "Legal Assistant", entrySalary: 45000, midSalary: 60000, seniorSalary: 75000, trend: "steady" },
    { role: "Paralegal", entrySalary: 50000, midSalary: 65000, seniorSalary: 85000, trend: "steady" },
    { role: "Compliance Attorney", entrySalary: 90000, midSalary: 140000, seniorSalary: 190000, trend: "up" },
    { role: "Corporate Counsel", entrySalary: 100000, midSalary: 150000, seniorSalary: 230000, trend: "steady" },
    { role: "Legal Operations Manager", entrySalary: 80000, midSalary: 110000, seniorSalary: 150000, trend: "up" },
  ],
  "Human Resources": [
    { role: "HR Manager", entrySalary: 70000, midSalary: 100000, seniorSalary: 140000, trend: "steady" },
    { role: "Recruiter", entrySalary: 55000, midSalary: 75000, seniorSalary: 100000, trend: "steady" },
    { role: "Compensation Analyst", entrySalary: 65000, midSalary: 85000, seniorSalary: 110000, trend: "steady" },
    { role: "Training & Development Specialist", entrySalary: 60000, midSalary: 80000, seniorSalary: 105000, trend: "steady" },
    { role: "HR Business Partner", entrySalary: 75000, midSalary: 105000, seniorSalary: 145000, trend: "up" },
    { role: "Employee Relations Specialist", entrySalary: 60000, midSalary: 85000, seniorSalary: 115000, trend: "steady" },
  ]
};

// Salary adjustment by location (percentage)
const locationAdjustments = {
  "New York City, NY": 1.25,
  "San Francisco, CA": 1.35,
  "Washington, DC": 1.15,
  "Chicago, IL": 1.10,
  "Boston, MA": 1.20,
  "Seattle, WA": 1.20,
  "Austin, TX": 1.05,
  "Los Angeles, CA": 1.25,
  "Denver, CO": 1.05,
  "Atlanta, GA": 1.00,
  "Phoenix, AZ": 0.95,
  "Dallas, TX": 1.00,
  "Miami, FL": 1.00,
  "Philadelphia, PA": 1.05,
  "Detroit, MI": 0.90,
  "Dubai, UAE": 1.20,
  "London, UK": 1.15,
  "Other": 1.00
};

// Negotiation tips
const negotiationTips = [
  {
    title: "Research Thoroughly",
    description: "Know the salary range for your role, industry, and location before entering negotiations."
  },
  {
    title: "Quantify Your Value",
    description: "Prepare specific examples of your achievements and how they've benefited previous employers."
  },
  {
    title: "Consider the Full Package",
    description: "Evaluate the entire compensation package, including benefits, bonuses, equity, and flexibility."
  },
  {
    title: "Practice Your Delivery",
    description: "Rehearse your negotiation conversation to build confidence and clarity."
  },
  {
    title: "Start Higher Than Your Target",
    description: "Begin with a figure above your desired salary to leave room for compromise."
  },
  {
    title: "Focus on Win-Win Outcomes",
    description: "Frame the negotiation as a collaborative process to find a mutually beneficial arrangement."
  },
  {
    title: "Be Prepared to Walk Away",
    description: "Know your minimum acceptable offer and be willing to decline if it's not met."
  },
  {
    title: "Get It in Writing",
    description: "Once an agreement is reached, request a formal offer letter that includes all terms."
  }
];

// Benefits to consider
const benefitsToConsider = [
  {
    name: "Health Insurance",
    description: "Comprehensive medical, dental, and vision coverage for you and dependents",
    value: "High"
  },
  {
    name: "Retirement Plan",
    description: "401(k) or pension contributions, particularly with employer matching",
    value: "High"
  },
  {
    name: "Paid Time Off",
    description: "Vacation, sick days, personal days, and holidays",
    value: "Medium-High"
  },
  {
    name: "Flexible Schedule",
    description: "Ability to set your own hours or work remotely part/full-time",
    value: "Medium-High"
  },
  {
    name: "Professional Development",
    description: "Education reimbursement, training programs, and conference attendance",
    value: "Medium"
  },
  {
    name: "Bonuses & Incentives",
    description: "Performance bonuses, profit sharing, and commission structures",
    value: "Medium-High"
  },
  {
    name: "Equity/Stock Options",
    description: "Ownership stake in the company through stock options or grants",
    value: "Variable"
  },
  {
    name: "Wellness Programs",
    description: "Gym memberships, wellness incentives, and health programs",
    value: "Low-Medium"
  },
  {
    name: "Parental Leave",
    description: "Paid time off for new parents beyond legal requirements",
    value: "High (if applicable)"
  },
  {
    name: "Commuter Benefits",
    description: "Transit subsidies, parking allowances, or company transportation",
    value: "Low-Medium"
  }
];

export default function SalaryGuidesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("Technology");
  const [selectedLocation, setSelectedLocation] = useState("Dubai, UAE");
  const [searchQuery, setSearchQuery] = useState("");
  const [calculatedSalary, setCalculatedSalary] = useState<{min: number, max: number} | null>(null);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("mid");
  
  // Handle salary calculation
  const calculateSalary = () => {
    if (!role) {
      return;
    }
    
    const adjustmentFactor = locationAdjustments[selectedLocation as keyof typeof locationAdjustments] || 1;
    const roleData = industrySalaries[selectedIndustry as keyof typeof industrySalaries]?.find(
      r => r.role.toLowerCase() === role.toLowerCase()
    );
    
    if (roleData) {
      let baseSalary;
      switch (experience) {
        case "entry":
          baseSalary = roleData.entrySalary;
          break;
        case "mid":
          baseSalary = roleData.midSalary;
          break;
        case "senior":
          baseSalary = roleData.seniorSalary;
          break;
        default:
          baseSalary = roleData.midSalary;
      }
      
      const adjustedSalary = Math.round(baseSalary * adjustmentFactor);
      setCalculatedSalary({
        min: Math.round(adjustedSalary * 0.9),
        max: Math.round(adjustedSalary * 1.1)
      });
    } else {
      // If role not found, provide a rough estimate based on industry averages
      const industryRoles = industrySalaries[selectedIndustry as keyof typeof industrySalaries] || [];
      if (industryRoles.length > 0) {
        let avgSalary = 0;
        
        switch (experience) {
          case "entry":
            avgSalary = industryRoles.reduce((sum, r) => sum + r.entrySalary, 0) / industryRoles.length;
            break;
          case "mid":
            avgSalary = industryRoles.reduce((sum, r) => sum + r.midSalary, 0) / industryRoles.length;
            break;
          case "senior":
            avgSalary = industryRoles.reduce((sum, r) => sum + r.seniorSalary, 0) / industryRoles.length;
            break;
          default:
            avgSalary = industryRoles.reduce((sum, r) => sum + r.midSalary, 0) / industryRoles.length;
        }
        
        const adjustedSalary = Math.round(avgSalary * adjustmentFactor);
        setCalculatedSalary({
          min: Math.round(adjustedSalary * 0.85),
          max: Math.round(adjustedSalary * 1.15)
        });
      }
    }
  };
  
  // Filter roles based on search query
  const getFilteredRoles = () => {
    const industryRoles = industrySalaries[selectedIndustry as keyof typeof industrySalaries] || [];
    
    if (!searchQuery) {
      return industryRoles;
    }
    
    return industryRoles.filter(role => 
      role.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filteredRoles = getFilteredRoles();
  
  return (
    <>
      <Helmet>
        <title>Salary Guides | Expert Recruitments LLC</title>
        <meta name="description" content="Research competitive salary ranges by role, industry, and location. Get expert tips for successful salary negotiations." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#5372f1]">Salary Guides</h1>
          <p className="text-lg text-gray-600 mb-8">Research competitive compensation ranges by role, industry, and location to negotiate with confidence.</p>
          
          <Tabs defaultValue="calculator" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="calculator">Salary Calculator</TabsTrigger>
              <TabsTrigger value="industry-data">Industry Salary Data</TabsTrigger>
              <TabsTrigger value="negotiation">Negotiation Guidance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Salary Calculator</CardTitle>
                  <CardDescription>Estimate your market value based on role, experience, and location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <Select
                        value={selectedIndustry}
                        onValueChange={setSelectedIndustry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(industrySalaries).map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(locationAdjustments).map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Job Title/Role</label>
                      <Input 
                        placeholder="e.g., Software Engineer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience Level</label>
                      <Select
                        value={experience}
                        onValueChange={setExperience}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid-Level (3-7 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (8+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateSalary} 
                    className="w-full py-6 text-lg bg-[#5372f1] hover:bg-[#4060e0]"
                  >
                    Calculate Salary Range
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col">
                  {calculatedSalary ? (
                    <div className="w-full text-center">
                      <h3 className="text-xl font-semibold mb-2">Estimated Salary Range</h3>
                      <div className="bg-[#5372f1]/5 p-6 rounded-lg border border-[#5372f1]/20 mb-4">
                        <p className="text-3xl font-bold text-[#5372f1]">
                          ${calculatedSalary.min.toLocaleString()} - ${calculatedSalary.max.toLocaleString()}
                        </p>
                        <p className="text-gray-500 mt-2">Annual salary in USD for {role || "this role"} in {selectedLocation}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        This estimate is based on industry averages and may vary based on specific company, skills, and other factors.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500 space-x-2">
                      <Info className="h-4 w-4" />
                      <span>Enter your details and click Calculate to see an estimated salary range.</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              <Alert className="bg-[#5372f1]/5 border-[#5372f1]/20">
                <Info className="h-4 w-4 text-[#5372f1]" />
                <AlertTitle className="text-[#5372f1]">Looking for personalized guidance?</AlertTitle>
                <AlertDescription className="text-gray-700">
                  Our compensation specialists can provide tailored salary insights specific to your skills, experience, and target companies. <a href="/contact-us" className="text-[#5372f1] font-medium underline underline-offset-4">Contact us</a> to learn more.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="industry-data">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Industry Salary Data</CardTitle>
                  <CardDescription>Comprehensive salary data by industry, role, and experience level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <Select
                        value={selectedIndustry}
                        onValueChange={setSelectedIndustry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(industrySalaries).map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative flex-grow">
                      <label className="block text-sm font-medium mb-2">Search Roles</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          className="pl-10" 
                          placeholder="Search roles..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Entry Level</TableHead>
                          <TableHead className="text-right">Mid-Level</TableHead>
                          <TableHead className="text-right">Senior Level</TableHead>
                          <TableHead className="text-center">Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((role, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{role.role}</TableCell>
                              <TableCell className="text-right">${role.entrySalary.toLocaleString()}</TableCell>
                              <TableCell className="text-right">${role.midSalary.toLocaleString()}</TableCell>
                              <TableCell className="text-right">${role.seniorSalary.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                {role.trend === "up" ? (
                                  <TrendingUp className="h-5 w-5 text-green-500 mx-auto" />
                                ) : role.trend === "down" ? (
                                  <TrendingDown className="h-5 w-5 text-red-500 mx-auto" />
                                ) : (
                                  <LineChart className="h-5 w-5 text-gray-400 mx-auto" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                              No roles found matching your search criteria.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="text-sm text-gray-500 flex items-center space-x-4 justify-end">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span>Increasing Demand</span>
                    </div>
                    <div className="flex items-center">
                      <LineChart className="h-4 w-4 text-gray-400 mr-1" />
                      <span>Stable Demand</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      <span>Decreasing Demand</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      Salaries shown are average base salaries in USD and may vary based on company size, specific location, additional skills, and economic conditions.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                    <Card className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Salary Factors</CardTitle>
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ul className="text-sm space-y-1">
                          <li>• Company size and funding</li>
                          <li>• Industry reputation and growth</li>
                          <li>• Profit margins and revenue</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Location Impact</CardTitle>
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ul className="text-sm space-y-1">
                          <li>• Cost of living differences</li>
                          <li>• Local talent competition</li>
                          <li>• Regional industry clusters</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Experience Premium</CardTitle>
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ul className="text-sm space-y-1">
                          <li>• Industry-specific expertise</li>
                          <li>• Leadership responsibilities</li>
                          <li>• Specialized technical skills</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="negotiation">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Salary Negotiation Tips</CardTitle>
                        <CardDescription>Expert strategies to help you secure the compensation you deserve</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {negotiationTips.map((tip, index) => (
                            <div key={index} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                              <h3 className="font-semibold text-[#5372f1] mb-2 flex items-start">
                                <Badge className="mr-2 mt-1 bg-[#5372f1]">{index + 1}</Badge>
                                {tip.title}
                              </h3>
                              <p className="text-gray-600 text-sm">{tip.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="bg-[#5372f1]/5 border-[#5372f1]/20 h-full">
                      <CardHeader>
                        <CardTitle className="text-xl text-[#5372f1]">Common Negotiation Mistakes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white rounded-md p-3 border">
                          <p className="font-medium">Not doing salary research</p>
                          <p className="text-sm text-gray-600">Entering negotiations without knowing your market value puts you at a disadvantage.</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border">
                          <p className="font-medium">Revealing your number first</p>
                          <p className="text-sm text-gray-600">When possible, let the employer make the first offer to avoid undervaluing yourself.</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border">
                          <p className="font-medium">Focusing only on base salary</p>
                          <p className="text-sm text-gray-600">Consider the entire compensation package, including benefits, bonuses, and equity.</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border">
                          <p className="font-medium">Being unprepared for objections</p>
                          <p className="text-sm text-gray-600">Anticipate potential pushback and prepare thoughtful, value-focused responses.</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border">
                          <p className="font-medium">Accepting the first offer</p>
                          <p className="text-sm text-gray-600">Most employers expect negotiation and build that into their initial offers.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Beyond Salary: Benefits to Consider</CardTitle>
                    <CardDescription>Evaluate the total compensation package when negotiating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Benefit</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Relative Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {benefitsToConsider.map((benefit, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{benefit.name}</TableCell>
                              <TableCell>{benefit.description}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant={
                                  benefit.value.includes("High") ? "default" : 
                                  benefit.value.includes("Medium") ? "secondary" : 
                                  "outline"
                                }>
                                  {benefit.value}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="rounded-lg border p-6 bg-white">
                  <h2 className="text-xl font-semibold mb-4">Negotiation Script Template</h2>
                  <p className="text-gray-600 mb-6">Use this template as a starting point for your salary negotiation conversation.</p>
                  
                  <div className="bg-gray-50 p-5 rounded-md border mb-5">
                    <p className="mb-3 font-medium">When receiving an offer:</p>
                    <p className="text-gray-700 italic">
                      "Thank you for the offer. I'm excited about the opportunity to join [Company Name] and contribute to [specific project or team]. I appreciate you sharing the compensation details. Based on my research for similar roles in this market and my experience in [relevant expertise], I was expecting a salary in the range of [$X to $Y]. Could we discuss this further?"
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-md border mb-5">
                    <p className="mb-3 font-medium">When countering:</p>
                    <p className="text-gray-700 italic">
                      "I understand the constraints you're working with. Given my expertise in [specific skills] and my track record of [specific achievement], would you be able to consider [specific counter offer]? I'm confident I can bring significant value to the team through [specific contributions]."
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-md border">
                    <p className="mb-3 font-medium">When discussing the total package:</p>
                    <p className="text-gray-700 italic">
                      "I'd like to discuss other aspects of the compensation package as well. Would there be flexibility in [specific benefit area] to help bridge the gap between our salary expectations? I'm particularly interested in [specific benefit] which would be valuable to me."
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#5372f1] text-white p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 md:mr-6">
                      <h2 className="text-2xl font-bold mb-3">Need Personalized Negotiation Coaching?</h2>
                      <p className="text-white/90 mb-4">Our compensation specialists can help you prepare for your salary negotiation with personalized advice.</p>
                      <Button variant="outline" className="bg-white text-[#5372f1] hover:bg-gray-100">Request Consultation</Button>
                    </div>
                    <div className="flex-shrink-0">
                      <DollarSign className="h-24 w-24 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Salary Reports</CardTitle>
                  <BarChart className="h-5 w-5 text-[#5372f1]" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600 text-sm mb-4">Download our detailed salary reports by industry and function.</p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Compensation Trends</CardTitle>
                  <TrendingUp className="h-5 w-5 text-[#5372f1]" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600 text-sm mb-4">Stay informed about the latest compensation trends and forecasts.</p>
                <Button variant="outline" className="w-full">View Trends</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Benefits Calculator</CardTitle>
                  <PieChart className="h-5 w-5 text-[#5372f1]" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600 text-sm mb-4">Evaluate and compare the monetary value of different benefits packages.</p>
                <Button variant="outline" className="w-full">Calculate Value</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Expert Advice</CardTitle>
                  <DollarSign className="h-5 w-5 text-[#5372f1]" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600 text-sm mb-4">Schedule a consultation with our compensation specialists.</p>
                <Button variant="outline" className="w-full">Book Consultation</Button>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-gray-50 border-gray-200 mb-8">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <AlertTitle>Data Sources</AlertTitle>
            <AlertDescription className="text-gray-600">
              Salary data is compiled from industry surveys, market research, and proprietary recruitment data. Information is updated quarterly to reflect current market conditions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}