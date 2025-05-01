import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BriefcaseIcon, ChevronDown, Clock, DollarSign, FileCheck, FileText, Search, ShieldCheck, Users, Building2, UserPlus, Award } from "lucide-react";
import { motion } from "framer-motion";
import hireTalentHeroImage from "../assets/hire-talent-hero.jpg";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | Expert Recruitments</title>
        <meta name="description" content="Partner with Dubai's leading executive search specialists to find exceptional leadership talent that will drive your business forward." />
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
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 relative z-20">
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
            
            {/* Scroll Down Indicator */}
            <motion.div
              className="flex flex-col items-center text-white/80 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="text-sm mb-2">Scroll Down</span>
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

      {/* Executive Search & Headhunting Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Executive Search & Headhunting</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Connecting exceptional leaders with forward-thinking organizations in the UAE and beyond</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Strategic Executive Search</h2>
              <p className="text-lg text-gray-700 mb-6">
                Expert Recruitments specializes in identifying and attracting high-caliber executive talent who can drive your organization's growth and success. Our headhunters leverage deep industry networks and proven methodologies to connect you with leaders who make an immediate impact.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex">
                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">C-Suite Recruitment Excellence</h3>
                    <p className="text-gray-600">We excel in identifying and attracting top-tier executives who possess the perfect balance of leadership vision, industry expertise, and cultural alignment for your organization.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Discreet Approach</h3>
                    <p className="text-gray-600">Our headhunters employ confidential search strategies to approach passive candidates with sensitivity, protecting both your organization's privacy and that of potential executives.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Global Talent Networks</h3>
                    <p className="text-gray-600">With established connections across the UAE and international markets, we identify exceptional leadership talent regardless of geographic location.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Vetting</h3>
                    <p className="text-gray-600">We conduct thorough assessments of leadership capabilities, personality profiles, and career achievements to ensure candidates are truly exceptional.</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link href="/submit-vacancy">Request Executive Search</Link>
              </Button>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Headhunting Advantage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-base">Industry Specialization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Our headhunters possess deep sector-specific knowledge enabling precise candidate matches for your industry.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-base">Cultural Alignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">We ensure leaders not only have the skills for the role but will thrive within your organizational culture.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-base">Passive Candidate Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Our methodology targets exceptional talent who aren't actively seeking new opportunities but are open to the right offer.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-base">Market Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Gain valuable insights on talent availability, compensation benchmarks, and emerging leadership trends.</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white p-4 rounded-lg mt-6 border border-gray-100">
                <h4 className="font-semibold mb-2">Industries We Serve</h4>
                <div className="flex flex-wrap gap-2">
                  {["Financial Services", "Technology", "Healthcare", "Real Estate", "Energy", "Retail", "Manufacturing", "Hospitality"].map((industry) => (
                    <span key={industry} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{industry}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Our Executive Search Process</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our systematic, data-driven approach to executive search ensures we identify leaders who will drive your organization's success. Through rigorous methodology and personal attention, we deliver exceptional results.
              </p>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-primary/10 to-primary/5 mb-8">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold">Strategic Consultation</h4>
                        <p className="text-gray-600">We begin with a deep dive into your organization's vision, challenges, and the specific leadership qualities you require.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold">Position Profiling</h4>
                        <p className="text-gray-600">We develop a comprehensive position specification detailing leadership requirements, qualifications, and success metrics.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold">Targeted Search Strategy</h4>
                        <p className="text-gray-600">Our headhunters deploy sophisticated research methods to identify potential candidates, including those not actively seeking new opportunities.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold">Candidate Assessment</h4>
                        <p className="text-gray-600">Rigorous interviews, leadership evaluations, and comprehensive reference checks validate candidate capabilities.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                      <div>
                        <h4 className="font-semibold">Candidate Presentation</h4>
                        <p className="text-gray-600">We present a shortlist of exceptional candidates with detailed assessments highlighting their leadership strengths and potential contributions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">6</div>
                      <div>
                        <h4 className="font-semibold">Interview Facilitation</h4>
                        <p className="text-gray-600">We coordinate and manage the interview process, providing structured evaluation frameworks for consistent candidate assessment.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">7</div>
                      <div>
                        <h4 className="font-semibold">Offer Negotiation & Onboarding</h4>
                        <p className="text-gray-600">We provide expert guidance throughout negotiations and facilitate a smooth transition for your new executive.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link href="/submit-vacancy">Start Your Executive Search</Link>
              </Button>
            </div>
            
            <div>
              <div className="sticky top-4">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-6">
                  <h3 className="text-xl font-bold mb-4">Why Choose Expert Recruitments?</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="flex items-center font-semibold text-primary">
                        <Users className="h-5 w-5 mr-2" />
                        Elite Talent Networks
                      </h4>
                      <p className="text-gray-600 pl-7">Access to exclusive pools of high-caliber leadership talent not available through traditional channels.</p>
                    </div>
                    
                    <div>
                      <h4 className="flex items-center font-semibold text-primary">
                        <Building2 className="h-5 w-5 mr-2" />
                        UAE Market Expertise
                      </h4>
                      <p className="text-gray-600 pl-7">Deep understanding of the regional business landscape and leadership requirements specific to the UAE.</p>
                    </div>
                    
                    <div>
                      <h4 className="flex items-center font-semibold text-primary">
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Quality Guarantees
                      </h4>
                      <p className="text-gray-600 pl-7">Our commitment to excellence is backed by performance guarantees and replacement assurances.</p>
                    </div>
                    
                    <div>
                      <h4 className="flex items-center font-semibold text-primary">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Success-Based Model
                      </h4>
                      <p className="text-gray-600 pl-7">Our fee structure aligns with your successful hiring outcomes, demonstrating our confidence and commitment.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-bold mb-2">Ready to elevate your leadership team?</h3>
                  <p className="text-gray-700 mb-4">Schedule a confidential consultation with our executive search specialists today.</p>
                  <Button className="w-full" asChild>
                    <Link href="/contact-us">Book a Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Hear from organizations who have partnered with Expert Recruitments for their executive hiring needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              <Card key={index} className="bg-white border border-gray-100">
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
      <div className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
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