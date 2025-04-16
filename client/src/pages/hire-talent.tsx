import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BriefcaseIcon, Clock, DollarSign, FileCheck, FileText, Search, ShieldCheck, Users, Zap, Award, BarChart4, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            
            <div className="hidden lg:flex justify-center">
              <div className="relative h-[450px] w-full max-w-[500px]">
                <AnimatePresence>
                  {/* Icon 1 - Briefcase */}
                  <motion.div 
                    className="absolute"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, 30, 0], 
                      y: [0, -30, 0], 
                      opacity: 1,
                      rotate: [0, 10, 0]
                    }}
                    transition={{ 
                      x: { 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      y: { 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      rotate: { 
                        duration: 10, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      opacity: { duration: 0.5 }
                    }}
                    style={{ top: '10%', left: '20%' }}
                  >
                    <div className="bg-white/20 p-4 rounded-xl shadow-lg">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Icon 2 - Award */}
                  <motion.div 
                    className="absolute"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, -20, 0], 
                      y: [0, 20, 0], 
                      opacity: 1,
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      x: { 
                        duration: 7, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      y: { 
                        duration: 7, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      rotate: { 
                        duration: 9, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      opacity: { duration: 0.5, delay: 0.1 }
                    }}
                    style={{ top: '20%', right: '20%' }}
                  >
                    <div className="bg-white/20 p-4 rounded-xl shadow-lg">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Icon 3 - BarChart */}
                  <motion.div 
                    className="absolute"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, 25, 0], 
                      y: [0, 25, 0], 
                      opacity: 1,
                      rotate: [0, 15, 0]
                    }}
                    transition={{ 
                      x: { 
                        duration: 9, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      y: { 
                        duration: 9, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      rotate: { 
                        duration: 11, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      opacity: { duration: 0.5, delay: 0.2 }
                    }}
                    style={{ bottom: '25%', left: '15%' }}
                  >
                    <div className="bg-white/20 p-4 rounded-xl shadow-lg">
                      <BarChart4 className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Icon 4 - Zap */}
                  <motion.div 
                    className="absolute"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, -15, 0], 
                      y: [0, -15, 0], 
                      opacity: 1,
                      rotate: [0, -10, 0]
                    }}
                    transition={{ 
                      x: { 
                        duration: 6.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      y: { 
                        duration: 6.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      rotate: { 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      },
                      opacity: { duration: 0.5, delay: 0.3 }
                    }}
                    style={{ bottom: '15%', right: '25%' }}
                  >
                    <div className="bg-white/20 p-4 rounded-xl shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                
                  {/* Center image */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/10 p-8 rounded-full w-40 h-40 flex items-center justify-center shadow-xl"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 90, damping: 10 }}
                  >
                    <Users className="h-20 w-20 text-white" />
                  </motion.div>
                  
                  {/* Pulse circles */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white/20"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ 
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      opacity: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                  
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-2 border-white/10"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ 
                      scale: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      },
                      opacity: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }
                    }}
                  />
                </AnimatePresence>
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
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">Our Recruitment Process</h3>
                  <p className="text-gray-600 mb-8">
                    We follow a thorough, transparent process to ensure we find the perfect match for your permanent positions.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                      <h4 className="font-semibold mb-2">Needs Analysis</h4>
                      <p className="text-sm text-gray-600">We thoroughly understand your requirements and company culture.</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                      <h4 className="font-semibold mb-2">Candidate Sourcing</h4>
                      <p className="text-sm text-gray-600">We identify qualified candidates through our extensive network.</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                      <h4 className="font-semibold mb-2">Screening & Assessment</h4>
                      <p className="text-sm text-gray-600">We evaluate technical skills, experience, and cultural fit.</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">4</div>
                      <h4 className="font-semibold mb-2">Placement & Support</h4>
                      <p className="text-sm text-gray-600">We assist with offers and provide ongoing support.</p>
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
                quote: "RH Job Portal helped us find exceptional talent quickly. Their understanding of our industry and company culture made all the difference.",
                author: "Sarah Johnson",
                title: "HR Director, Tech Innovations Inc."
              },
              {
                quote: "The quality of candidates provided by RH Job Portal exceeded our expectations. We've built a stronger team thanks to their recruitment expertise.",
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