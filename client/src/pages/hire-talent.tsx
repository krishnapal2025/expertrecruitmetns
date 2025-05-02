import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, DollarSign, Shield, Users, Building2, UserPlus, Award, Target, Globe, CheckCircle2, Search, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import handshakeImage from "../assets/business-people-shaking-hands-meeting-room.jpg";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | Expert Recruitments</title>
        <meta name="description" content="Partner with Dubai's leading executive search specialists to find exceptional leadership talent that will drive your business forward." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative min-h-[90vh] overflow-hidden" id="hire-talent-hero-section">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black/75 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: `url(${handshakeImage})`,
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
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-32 md:py-40">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 relative z-20">
            <div className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Executive Search Specialists</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight drop-shadow-md">
              Connect With Exceptional Leadership Talent
            </h1>
            
            <p className="text-xl text-white/95 leading-relaxed mb-8 max-w-3xl drop-shadow">
              Partner with Dubai's premier headhunters to find the executive talent that will drive your organization's success
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-6 mb-16 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-primary font-bold text-2xl mb-1">500+</div>
                <div className="text-white/90 text-sm">Executive Placements</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-primary font-bold text-2xl mb-1">92%</div>
                <div className="text-white/90 text-sm">Retention Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-primary font-bold text-2xl mb-1">15+</div>
                <div className="text-white/90 text-sm">Industry Sectors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-primary font-bold text-2xl mb-1">10+</div>
                <div className="text-white/90 text-sm">Years of Excellence</div>
              </div>
            </div>
            
            {/* Scroll Down Button */}
            <a 
              href="#services-overview" 
              className="flex flex-col items-center mt-4 text-white/80 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium mb-2">Explore More</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Services Overview Section */}
      <div id="services-overview" className="py-16 bg-gradient-to-b from-white to-gray-50">
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
      
      {/* Final CTA Section */}
      <div className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Leadership Team?</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Partner with Expert Recruitments to secure the exceptional executive talent your organization needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md px-8" asChild>
              <Link href="/contact-us">Send Executive Inquiry </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}