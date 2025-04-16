import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BriefcaseIcon, Clock, DollarSign, FileCheck, FileText, Search, ShieldCheck, Users, Zap, Award, BarChart4, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | RH Job Portal</title>
        <meta name="description" content="Find the right talent for your business. Preview candidates, hire contract talent, or permanent staff with our specialist recruitment services." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary text-white py-20 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Hire Top Talent For Your Business
              </motion.h1>
              <motion.p 
                className="text-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Connect with qualified professionals who will drive your business forward.
                Our specialist recruiters have a deep understanding of your industry's talent needs.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20" asChild>
                  <Link href="/contact-us">Speak to a Consultant</Link>
                </Button>
              </motion.div>
            </div>
            
            {/* Simple compact animation */}
            <div className="hidden lg:flex justify-center">
              <div className="relative h-64 w-64">
                {/* Center circle with icon */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/20 p-5 rounded-full w-24 h-24 flex items-center justify-center shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <Users className="h-12 w-12 text-white" />
                </motion.div>
                
                {/* Small floating icons */}
                <div className="absolute top-1/4 left-1/4">
                  <motion.div 
                    className="bg-white/20 p-2 rounded-lg shadow-md"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [-5, 5, -5], opacity: 1 }}
                    transition={{ y: { repeat: Infinity, duration: 2 }, opacity: { duration: 0.3 } }}
                  >
                    <Briefcase className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
                
                <div className="absolute bottom-1/4 left-1/4">
                  <motion.div 
                    className="bg-white/20 p-2 rounded-lg shadow-md"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [5, -5, 5], opacity: 1 }}
                    transition={{ y: { repeat: Infinity, duration: 2.5, delay: 0.5 }, opacity: { duration: 0.3, delay: 0.1 } }}
                  >
                    <Award className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
                
                <div className="absolute top-1/4 right-1/4">
                  <motion.div 
                    className="bg-white/20 p-2 rounded-lg shadow-md"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [-5, 5, -5], opacity: 1 }}
                    transition={{ y: { repeat: Infinity, duration: 2.2, delay: 0.3 }, opacity: { duration: 0.3, delay: 0.2 } }}
                  >
                    <BarChart4 className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
                
                <div className="absolute bottom-1/4 right-1/4">
                  <motion.div 
                    className="bg-white/20 p-2 rounded-lg shadow-md"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [5, -5, 5], opacity: 1 }}
                    transition={{ y: { repeat: Infinity, duration: 1.8, delay: 0.7 }, opacity: { duration: 0.3, delay: 0.3 } }}
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
                
                {/* Pulse circle */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/30"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 mb-8">
                <h2 className="text-3xl font-bold mb-6">Build Your Dream Team with Permanent Hires</h2>
                <p className="text-lg text-gray-700 mb-8 max-w-4xl">
                  Find exceptional talent who will contribute to your company's long-term success and growth. 
                  Our permanent staffing solutions connect you with professionals who align with your company's culture and goals.
                </p>
              </div>
              
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
                      <span>Industry-specific recruitment</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">•</div>
                      <span>Proven professional track records</span>
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
                  <CardDescription>Scale your team efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Quickly build teams of qualified professionals to support rapid growth, new projects, or expansion into new markets.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">•</div>
                      <span>Bulk hiring campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">•</div>
                      <span>Streamlined assessment processes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">•</div>
                      <span>Team cohesion and cultural alignment</span>
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
          </TabsContent>
        </Tabs>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your Dream Team?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Whether you need to preview our candidate pool, hire contract talent, or build your permanent team, 
              we're here to help you find the perfect match for your business needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth?type=employer">Create Employer Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact-us">Talk to a Recruitment Specialist</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}