import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, DollarSign, Shield, Users, Building2, UserPlus, Award, Target, Globe, CheckCircle2, Search, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import hireTalentHeroImage from "../assets/hire-talent-hero.jpg";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | Expert Recruitments</title>
        <meta name="description" content="Partner with Dubai's leading executive search specialists to find exceptional leadership talent that will drive your business forward." />
      </Helmet>

      {/* Hero Section */}
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
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 relative z-20">
            <motion.div 
              className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Executive Search Specialists</span>
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Connect With Exceptional Leadership Talent
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/95 leading-relaxed mb-5 max-w-3xl drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Partner with Dubai's premier headhunters to find the executive talent that will drive your organization's success
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center mt-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md" asChild>
                <Link href="/submit-vacancy">Request Executive Search</Link>
              </Button>
              <Button size="lg" className="bg-white/95 text-primary hover:bg-white border border-primary/20 shadow-md backdrop-blur-sm" asChild>
                <Link href="/contact-us">Speak to a Consultant</Link>
              </Button>
            </motion.div>
            
            {/* Scroll Down Indicator */}
            <motion.div
              className="flex flex-col items-center text-white/80 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="text-sm mb-2">Scroll to Learn More</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              >
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Overview Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">UAE's Premier Executive Search Firm</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Expert Recruitments specializes in connecting exceptional leaders with forward-thinking organizations across the UAE and beyond
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">C-Suite Executive Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our specialized recruitment services target senior leadership roles including CEOs, CFOs, CIOs, and other C-level executives for organizations across all sectors.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary flex items-center" asChild>
                  <Link href="/submit-vacancy">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Strategic Headhunting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We proactively identify and approach high-performing executives who aren't actively seeking new roles but may be open to the right opportunity.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary flex items-center" asChild>
                  <Link href="/submit-vacancy">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">International Talent Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Leverage our global network to attract world-class executive talent to the UAE, with comprehensive relocation and cultural integration support.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary flex items-center" asChild>
                  <Link href="/submit-vacancy">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Executive Search Process Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Executive Search Process</h2>
              <p className="text-lg text-gray-700 mb-8">
                Our systematic, data-driven approach ensures we identify leaders who will drive your organization's success. Through rigorous methodology and personal attention, we deliver exceptional results.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-lg">Strategic Consultation</h3>
                    <p className="text-gray-600">We begin with a deep dive into your organization's vision, challenges, and the specific leadership qualities you require.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-lg">Targeted Search Strategy</h3>
                    <p className="text-gray-600">Our headhunters deploy sophisticated research methods to identify potential candidates, including those not actively seeking new opportunities.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-lg">Comprehensive Assessment</h3>
                    <p className="text-gray-600">Rigorous interviews, leadership evaluations, and thorough reference checks validate candidate capabilities and cultural fit.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-lg">Precise Candidate Matching</h3>
                    <p className="text-gray-600">We present a shortlist of exceptional candidates with detailed assessments highlighting their leadership strengths and potential contributions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-semibold text-lg">Seamless Onboarding</h3>
                    <p className="text-gray-600">We provide expert guidance throughout negotiations and facilitate a smooth transition for your new executive.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href="/submit-vacancy">Start Your Executive Search</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <h3 className="text-2xl font-bold mb-6">Our Headhunting Advantage</h3>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Industry Specialization</h4>
                    <p className="text-gray-700">Our headhunters possess deep sector-specific knowledge enabling precise candidate matches for your industry.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Cultural Alignment</h4>
                    <p className="text-gray-700">We ensure leaders not only have the skills for the role but will thrive within your organizational culture.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Passive Candidate Access</h4>
                    <p className="text-gray-700">Our methodology targets exceptional talent who aren't actively seeking new opportunities but are open to the right offer.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Quality Guarantees</h4>
                    <p className="text-gray-700">Our commitment to excellence is backed by performance guarantees and replacement assurances.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border border-gray-100">
                <h4 className="font-semibold mb-3">Industries We Serve</h4>
                <div className="flex flex-wrap gap-2">
                  {["Financial Services", "Technology", "Healthcare", "Real Estate", "Energy", "Retail", "Manufacturing", "Hospitality"].map((industry) => (
                    <span key={industry} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{industry}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Expert Recruitments?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our executive search services deliver exceptional results through our proven methodology and deep market expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">Elite Talent Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access to exclusive pools of high-caliber leadership talent not available through traditional recruitment channels.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">UAE Market Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Deep understanding of the regional business landscape and leadership requirements specific to the UAE market.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">Quality Guarantees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our commitment to excellence is backed by performance guarantees and replacement assurances for each executive placement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">Success-Based Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our fee structure aligns with your successful hiring outcomes, demonstrating our confidence and commitment to results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from organizations who have partnered with Expert Recruitments for their executive hiring needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Expert Recruitments provided us with exceptional executive talent that perfectly matched our company culture and growth ambitions. Their headhunting approach delivered candidates we wouldn't have found elsewhere.",
                author: "Sarah Johnson",
                title: "CEO, Financial Services Group"
              },
              {
                quote: "The quality of executive candidates presented to us was outstanding. Expert Recruitments truly understands the nuances of leadership requirements in the UAE market.",
                author: "Mohammed Al-Farsi",
                title: "Managing Director, Technology Solutions"
              },
              {
                quote: "Their executive search methodology is thorough and precise. They identified and secured a CFO who has transformed our financial operations and contributed strategically to our growth.",
                author: "Jessica Chen",
                title: "Founder, Healthcare Innovations"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center text-amber-400 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" className="bg-white" asChild>
              <Link href="/case-studies">
                View Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Leadership Team?</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Partner with Expert Recruitments to secure the exceptional executive talent your organization needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md px-8" asChild>
              <Link href="/submit-vacancy">Start Executive Search</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 px-8" asChild>
              <Link href="/contact-us">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}