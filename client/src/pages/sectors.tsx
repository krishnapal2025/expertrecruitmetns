import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import cityscapeImage from "../assets/high-angle-beautiful-tall-buildings-landscape.jpg";

const sectors = [
  {
    id: "technology",
    name: "Technology",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    description: "Software development, IT infrastructure, cybersecurity, data science, and more.",
    roles: ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer"]
  },
  {
    id: "finance",
    name: "Finance & Banking",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    ),
    description: "Investment banking, financial analysis, accounting, risk management, and insurance.",
    roles: ["Financial Analyst", "Investment Banker", "Accountant", "Risk Manager", "Financial Advisor"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
    description: "Medical professionals, healthcare administration, pharmaceutical, and biotechnology.",
    roles: ["Physician", "Nurse", "Healthcare Administrator", "Pharmaceutical Sales", "Medical Researcher"]
  },
  {
    id: "engineering",
    name: "Engineering & Manufacturing",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    description: "Civil, mechanical, electrical engineering, manufacturing processes, and quality control.",
    roles: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Quality Assurance", "Manufacturing Manager"]
  },
  {
    id: "marketing",
    name: "Marketing & Communications",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    description: "Digital marketing, advertising, public relations, content creation, and brand management.",
    roles: ["Marketing Manager", "Social Media Specialist", "Content Writer", "PR Specialist", "Brand Manager"]
  },
  {
    id: "education",
    name: "Education",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    description: "Teaching, educational administration, curriculum development, and educational technology.",
    roles: ["Teacher", "Principal", "Curriculum Developer", "EdTech Specialist", "University Professor"]
  },
  {
    id: "legal",
    name: "Legal",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
        <line x1="12" y1="12" x2="20" y2="7.5"></line>
        <line x1="12" y1="12" x2="12" y2="21"></line>
        <line x1="12" y1="12" x2="4" y2="7.5"></line>
      </svg>
    ),
    description: "Legal practice, corporate law, intellectual property, compliance, and legal consultancy.",
    roles: ["Attorney", "Corporate Counsel", "Legal Consultant", "Compliance Officer", "Paralegal"]
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    description: "Hotel management, event planning, travel services, food and beverage, and tourism development.",
    roles: ["Hotel Manager", "Event Planner", "Chef", "Travel Agent", "Tourism Director"]
  },
  {
    id: "retail",
    name: "Retail & Sales",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
    description: "Retail management, sales operations, e-commerce, merchandising, and customer service.",
    roles: ["Retail Manager", "Sales Representative", "E-commerce Specialist", "Merchandiser", "Customer Service Manager"]
  }
];

export default function SectorsPage() {
  return (
    <>
      <Helmet>
        <title>Industry Sectors | Expert Recruitments</title>
        <meta name="description" content="Explore job opportunities across a wide range of industry sectors. Find your career in technology, finance, healthcare, and more." />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image with Black Tint */}
        <div className="absolute inset-0 bg-black/75 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: `url(${cityscapeImage})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            filter: 'brightness(0.85)'
          }}
        ></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-10"></div>
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-40 md:py-52">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 relative z-20">
            <div className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Specialized Recruitment</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight drop-shadow-md">
              Industry Sectors
            </h1>
            
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-4 max-w-3xl drop-shadow-md">
              Explore opportunities across various industries
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow">
              Find the perfect role for your skills and experience with our industry-specific expertise
            </p>
            
            {/* Scroll Down Button */}
            <a 
              href="#sectors-content" 
              className="flex flex-col items-center mt-8 text-white/80 hover:text-white transition-colors duration-300 animate-pulse"
            >
              <span className="text-sm font-medium mb-2">Explore Sectors</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div id="sectors-content" className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Find Jobs by Sector</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We specialize in recruiting for a wide range of industries, connecting talented professionals with leading organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector) => (
            <Card key={sector.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center pb-2">
                <div className="text-primary mb-3">{sector.icon}</div>
                <CardTitle className="text-xl">{sector.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{sector.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Popular Roles:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {sector.roles.map((role, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/job-board?category=${sector.id}`}>
                  <Button variant="outline" className="w-full">View {sector.name} Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't Find Your Industry?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            We work with organizations across many more sectors than listed here. Contact us to discuss your specific industry needs.
          </p>
          <Link href="/contact-us">
            <Button>Contact Us</Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Us For Your Industry</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Industry Expertise</h3>
              <p className="text-gray-600">
                Our specialized recruiters understand the nuances and requirements of each industry sector.
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Candidates</h3>
              <p className="text-gray-600">
                We rigorously screen candidates to ensure they meet the specific requirements of your industry.
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Network</h3>
              <p className="text-gray-600">
                Our extensive network allows us to connect with top talent across all industry sectors.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/job-board">
              <Button size="lg">Browse All Jobs</Button>
            </Link>
            <Link href="/auth?type=jobseeker">
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
