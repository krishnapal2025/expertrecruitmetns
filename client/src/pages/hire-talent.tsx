import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BriefcaseIcon, Clock, DollarSign, FileCheck, FileText, Search, ShieldCheck, Users, Building2, UserPlus, Award } from "lucide-react";
import { motion } from "framer-motion";
import hireTalentHeroImage from "../assets/hire-talent-hero.jpg";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | Expert Recruitments</title>
        <meta name="description" content="Find the right talent for your business. Preview candidates, hire contract talent, or permanent staff with our specialist recruitment services." />
      </Helmet>

      {/* Hero Section with Team Collaboration Image */}
      <div className="relative py-32 md:py-40 overflow-hidden" id="hire-talent-hero-section">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black/75 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: `url(${hireTalentHeroImage})`,
            backgroundPosition: 'center',
            filter: 'brightness(0.85)'
          }}
        ></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-10"></div>
        
        <div className="container mx-auto px-4 relative">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto relative z-20">
            <motion.div 
              className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Premium Talent Solutions</span>
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Connect With Exceptional Talent
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/95 leading-relaxed mb-5 max-w-3xl drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Partner with Dubai's leading executive search specialists to find the talent that will drive your business forward
            </motion.p>
            
            <motion.p 
              className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Our specialist recruiters have a deep understanding of your industry and connect you with professionals who align with your values and goals
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center mt-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md" asChild>
                <Link href="/submit-vacancy">Post a Job</Link>
              </Button>
              <Button size="lg" className="bg-white/95 text-primary hover:bg-white border border-primary/20 shadow-md backdrop-blur-sm" asChild>
                <Link href="/contact-us">Speak to a Consultant</Link>
              </Button>
            </motion.div>
            
            {/* Talent Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-white/80" />
                <span>Expert Talent Acquisition</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-white/80" />
                <span>Industry-Specific Recruiting</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5 text-white/80" />
                <span>Executive Search</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5 text-white/80" />
                <span>Bespoke Talent Services</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Tabs */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Talent Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the talent solution that best fits your business needs</p>
        </div>
        
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="flex w-full justify-center gap-2 mb-12">
            <TabsTrigger 
              value="preview" 
              className="text-lg px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Preview Candidates
            </TabsTrigger>
            <TabsTrigger 
              value="contract" 
              className="text-lg px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Contract Talent
            </TabsTrigger>
            <TabsTrigger 
              value="permanent" 
              className="text-lg px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Permanent Talent
            </TabsTrigger>
          </TabsList>
          
          {/* Preview Candidates Tab */}
          <TabsContent value="preview" id="preview-candidates">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">Preview Our Candidate Pool</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Get immediate access to pre-screened, qualified candidates ready for their next opportunity. 
                  Our talent database includes professionals across all industries and experience levels.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Search className="mr-2 h-5 w-5 text-primary" />
                        Targeted Search
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Filter candidates by skills, experience level, location, and availability to find your perfect match.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileCheck className="mr-2 h-5 w-5 text-primary" />
                        Pre-Vetted Talent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>All candidates are thoroughly screened and interviewed by our industry specialists.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        Save Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>View detailed profiles, portfolios, and video introductions without lengthy initial screenings.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                        Confidential Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Browse anonymized profiles with the option to reveal details only when you're interested.</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href="/auth?type=employer">Request Candidate Access</Link>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Featured Candidates</h3>
                <div className="space-y-4">
                  {/* Sample candidate profiles */}
                  {[
                    {
                      title: "Senior Software Developer",
                      experience: "8+ years",
                      skills: "JavaScript, React, Node.js",
                      availability: "Available in 2 weeks"
                    },
                    {
                      title: "Financial Analyst",
                      experience: "5 years",
                      skills: "Financial Modeling, Excel, PowerBI",
                      availability: "Immediate start"
                    },
                    {
                      title: "Marketing Manager",
                      experience: "7 years",
                      skills: "Digital Marketing, SEO, Content Strategy",
                      availability: "Available in 4 weeks"
                    }
                  ].map((candidate, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{candidate.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-start">
                            <BriefcaseIcon className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{candidate.experience}</span>
                          </div>
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{candidate.skills}</span>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{candidate.availability}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link" className="text-primary flex items-center mx-auto">
                    View All Candidates
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Contract Talent Tab */}
          <TabsContent value="contract">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Flexible Contract Staffing Solutions</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Access specialized talent for project-based work, seasonal demands, or to fill temporary gaps. 
                  Our contract staffing solutions provide the flexibility your business needs to thrive.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex">
                    <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Rapid Deployment</h3>
                      <p className="text-gray-600">Get qualified contractors onboarded quickly to meet urgent business needs and project deadlines.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Specialized Expertise</h3>
                      <p className="text-gray-600">Access niche skills and industry experience without the commitment of permanent hires.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Scalable Workforce</h3>
                      <p className="text-gray-600">Adjust your team size up or down based on project demands and business cycles.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Compliance Management</h3>
                      <p className="text-gray-600">We handle contractual agreements, payments, and ensure all legal requirements are met.</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href="/contact-us?service=contract">Request Contract Talent</Link>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">Industries We Serve</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Technology", description: "Software development, IT support, cybersecurity, and data science professionals." },
                    { name: "Finance", description: "Accountants, financial analysts, risk management specialists, and compliance officers." },
                    { name: "Healthcare", description: "Medical professionals, healthcare administrators, and pharmaceutical specialists." },
                    { name: "Marketing", description: "Digital marketers, content creators, SEO specialists, and campaign managers." },
                    { name: "Engineering", description: "Civil, mechanical, electrical, and chemical engineers for project-based work." },
                    { name: "Creative", description: "Designers, UX/UI specialists, copywriters, and multimedia producers." }
                  ].map((industry, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{industry.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{industry.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Card className="bg-primary text-white">
                    <CardHeader>
                      <CardTitle>Get a Free Consultation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Discuss your contract staffing needs with our specialist recruiters.</p>
                      <Button variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
                        <Link href="/contact-us?service=contract">Schedule a Call</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Permanent Talent Tab */}
          <TabsContent value="permanent">
            <div>
              <h2 className="text-3xl font-bold mb-6">Build Your Dream Team with Permanent Hires</h2>
              <p className="text-lg text-gray-700 mb-8">
                Find exceptional talent who will contribute to your company's long-term success and growth. 
                Our permanent staffing solutions connect you with professionals who align with your company's culture and goals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Executive Search</CardTitle>
                    <CardDescription>Leadership talent acquisition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Our executive search service identifies and attracts top-tier leadership talent who will drive your organization forward.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>C-Suite and Director-level recruitment</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Leadership assessment and evaluation</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Succession planning</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact-us?service=executive">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <BriefcaseIcon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Professional Staffing</CardTitle>
                    <CardDescription>Mid to senior-level professionals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Find experienced professionals with the specialized skills and industry knowledge your business needs to excel.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Technical and specialized roles</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Industry-specific expertise</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Role customization and definition</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact-us?service=professional">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Volume Hiring</CardTitle>
                    <CardDescription>Scaling teams efficiently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Build entire teams or departments with our efficient volume hiring solutions designed for growth and expansion.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Multi-position filling strategies</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Streamlined assessment processes</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5">•</div>
                        <span>Onboarding coordination</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact-us?service=volume">Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-3xl font-bold mb-6 text-center text-blue-800">Comprehensive Recruitment Process</h3>
                  <p className="text-gray-600 mb-12 text-center">
                    Our structured approach ensures we find the perfect talent match for your organization's needs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* First row */}
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        UNDERSTANDING<br />CLIENT NEEDS
                      </div>
                      <div className="text-center mb-6">
                        <p className="text-gray-700">Starting the process with a thorough assessment of the client's specific recruitment requirements and strategic objectives</p>
                      </div>
                      <div className="flex justify-center w-full">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        CANDIDATE<br />ASSESSMENT
                      </div>
                      <div className="text-center mb-6">
                        <p className="text-gray-700">Conduct rigorous assessment focusing on skills evaluation and cultural fit to ensure ideal matches</p>
                      </div>
                      <div className="flex justify-center w-full">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        CANDIDATE<br />INTERVIEW
                      </div>
                      <div className="text-center mb-6">
                        <p className="text-gray-700">Facilitate structured interviews to evaluate the candidates and ensure alignment with the client's expectations</p>
                      </div>
                      <div className="flex justify-center w-full">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Second row - with reversed arrows */}
                    <div className="flex flex-col items-center mt-8">
                      <div className="flex justify-center w-full mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-135">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        CANDIDATE<br />SOURCING
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700">Utilizing multiple channels and in-house database to source a diverse pool of candidates tailored to client needs</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center mt-8">
                      <div className="flex justify-center w-full mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-135">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        CANDIDATE<br />SHORTLISTING
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700">Provide the client with a curated list of top candidates who align with their strategic goals, to choose from</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center mt-8">
                      <div className="flex justify-center w-full mb-6">
                        <div className="w-16 h-16 bg-white border-2 border-blue-300 border-dashed rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-yellow-300 text-blue-800 font-semibold rounded-full py-2 px-6 mb-4 text-center">
                        BACKGROUND<br />VERIFICATION
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700">Ensuring candidates meet necessary requirements and align with the company's expectations by verifying their background</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="lg" className="mt-8" asChild>
                    <Link href="/contact-us?service=permanent">Start Hiring Permanent Talent</Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Expert Recruitments LLC  helped us find exceptional talent quickly. Their understanding of our industry and company culture made all the difference.",
                author: "Sarah Johnson",
                title: "HR Director, Tech Innovations Inc."
              },
              {
                quote: "The quality of candidates provided by Expert Recruitments LLC exceeded our expectations. We've built a stronger team thanks to their recruitment expertise.",
                author: "Michael Chen",
                title: "CEO, Financial Solutions Group"
              },
              {
                quote: "Their contract staffing solutions allowed us to scale efficiently during our peak season. Professional service from start to finish.",
                author: "Priya Patel",
                title: "Operations Manager, Retail Excellence"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="pt-6">
                  <div className="text-4xl text-primary mb-4">"</div>
                  <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Hire?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you need contract professionals, permanent team members, or want to preview our candidate pool,
            we're here to help you find the right talent for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
              <Link href="/auth?type=employer">Create Employer Account</Link>
            </Button>
            <Button size="lg" className="bg-white/20 hover:bg-white/30" asChild>
              <Link href="/contact-us">Contact a Recruitment Specialist</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}