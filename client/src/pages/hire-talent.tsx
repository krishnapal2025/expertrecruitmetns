import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Users, 
  Briefcase, 
  Clock, 
  Award, 
  CheckCircle, 
  ClipboardList, 
  BadgeCheck, 
  FileText, 
  UserCheck,
  CalendarClock,
  Building,
  GraduationCap
} from "lucide-react";

export default function HireTalentPage() {
  return (
    <>
      <Helmet>
        <title>Hire Talent | RH Job Portal</title>
        <meta 
          name="description" 
          content="Access our database of qualified candidates for your short-term and permanent staffing needs. Learn how our talent acquisition specialists can help you find the perfect match." 
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the Right Talent for Your Business
            </h1>
            <p className="text-xl mb-8">
              Our talent acquisition specialists connect businesses with pre-screened, qualified professionals across multiple industries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-600">Candidates in our database</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">95%</div>
              <div className="text-gray-600">Client satisfaction rate</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">48 hrs</div>
              <div className="text-gray-600">Average time to fill</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-600">Partner companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Talent Solutions Tabs */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Talent Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible staffing solutions designed to meet your business needs
            </p>
          </div>

          <Tabs defaultValue="preview" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-8">
              <TabsTrigger value="preview" className="text-base py-3">Preview Candidates</TabsTrigger>
              <TabsTrigger value="contract" className="text-base py-3">Contract Talent</TabsTrigger>
              <TabsTrigger value="permanent" className="text-base py-3">Permanent Talent</TabsTrigger>
              <TabsTrigger value="process" className="text-base py-3">Our Process</TabsTrigger>
            </TabsList>

            {/* Preview Candidates Tab */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Users className="mr-2 h-6 w-6 text-primary" />
                    Preview Top Candidates
                  </CardTitle>
                  <CardDescription>
                    Browse through our pre-screened, qualified candidates ready for immediate placement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <UserCheck className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Candidate Database</h3>
                          <p className="text-gray-600">Access our extensive database of verified professionals</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>View detailed candidate profiles with skills, experience, and availability</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Filter by industry, skills, location, and experience level</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Request candidate shortlists tailored to your requirements</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Browse Candidates</Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <ClipboardList className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Talent Assessment</h3>
                          <p className="text-gray-600">We thoroughly vet all candidates in our database</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Skills testing and technical assessments</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Background and reference checks</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Behavioral and cultural fit evaluations</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Learn About Our Vetting Process</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contract Talent Tab */}
            <TabsContent value="contract">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <CalendarClock className="mr-2 h-6 w-6 text-primary" />
                    Contract Talent Solutions
                  </CardTitle>
                  <CardDescription>
                    Flexible staffing solutions for short-term projects, seasonal demands, or temporary positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Clock className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Temporary Staffing</h3>
                          <p className="text-gray-600">On-demand talent for short-term needs</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Quick placement for time-sensitive projects</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Specialized skills for project-based work</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Seasonal staffing support</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Request Temporary Staff</Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <FileText className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Contract-to-Hire</h3>
                          <p className="text-gray-600">Test fit before making a permanent commitment</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Evaluate on-the-job performance before permanent hiring</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Reduce hiring risks and ensure team compatibility</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Seamless transition from contract to full-time employment</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Explore Contract-to-Hire</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permanent Talent Tab */}
            <TabsContent value="permanent">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Building className="mr-2 h-6 w-6 text-primary" />
                    Permanent Talent Acquisition
                  </CardTitle>
                  <CardDescription>
                    Find the perfect long-term addition to your team with our comprehensive recruitment services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <BadgeCheck className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Executive Search</h3>
                          <p className="text-gray-600">Find top-tier leadership talent</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Specialized recruitment for C-suite and director positions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Thorough vetting of leadership capabilities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Confidential talent acquisition</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Find Executive Talent</Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Briefcase className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">Professional Recruitment</h3>
                          <p className="text-gray-600">Secure top performers for your key positions</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Comprehensive search for specialized roles</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Assessment of technical skills and cultural fit</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>Long-term retention strategies</span>
                        </li>
                      </ul>
                      <Button className="mt-6">Hire Professional Talent</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Our Process Tab */}
            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                    How We Work With You
                  </CardTitle>
                  <CardDescription>
                    Our comprehensive approach to finding the perfect talent match for your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="relative pl-8 md:pl-0">
                      <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-1 flex md:justify-end">
                          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-4 z-10">1</div>
                          <div className="absolute md:relative top-10 bottom-0 left-4 md:left-auto md:top-5 md:bottom-auto md:right-0 w-0.5 h-[calc(100%-40px)] bg-gray-200 z-0"></div>
                        </div>
                        <div className="md:col-span-4">
                          <h3 className="text-xl font-semibold mb-2">Understand Your Needs</h3>
                          <p className="text-gray-600 mb-4">We start by gaining a deep understanding of your business, company culture, and specific talent requirements.</p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="italic text-gray-600">"The team took the time to truly understand our company culture and the specific skills we needed. This made all the difference in finding the right candidates." - HR Director</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                      <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-1 flex md:justify-end">
                          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-4 z-10">2</div>
                          <div className="absolute md:relative top-10 bottom-0 left-4 md:left-auto md:top-5 md:bottom-auto md:right-0 w-0.5 h-[calc(100%-40px)] bg-gray-200 z-0"></div>
                        </div>
                        <div className="md:col-span-4">
                          <h3 className="text-xl font-semibold mb-2">Strategic Talent Search</h3>
                          <p className="text-gray-600 mb-4">We leverage our extensive candidate database, industry networks, and advanced recruitment techniques to identify qualified candidates.</p>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>Database of pre-screened professionals</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>Industry-specific talent networks</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>Targeted recruitment campaigns</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                      <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-1 flex md:justify-end">
                          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-4 z-10">3</div>
                          <div className="absolute md:relative top-10 bottom-0 left-4 md:left-auto md:top-5 md:bottom-auto md:right-0 w-0.5 h-[calc(100%-40px)] bg-gray-200 z-0"></div>
                        </div>
                        <div className="md:col-span-4">
                          <h3 className="text-xl font-semibold mb-2">Rigorous Screening Process</h3>
                          <p className="text-gray-600 mb-4">Each candidate undergoes a comprehensive evaluation to ensure they meet your technical requirements and will thrive in your company culture.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium">Skills Assessment</h4>
                              <p className="text-sm text-gray-600">Technical evaluations tailored to the role</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium">Background Verification</h4>
                              <p className="text-sm text-gray-600">Complete reference and credential checks</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium">Cultural Fit Analysis</h4>
                              <p className="text-sm text-gray-600">Ensuring alignment with your company values</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                      <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-1 flex md:justify-end">
                          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-4 z-10">4</div>
                          <div className="absolute md:relative top-10 bottom-0 left-4 md:left-auto md:top-5 md:bottom-auto md:right-0 w-0.5 h-[calc(100%-40px)] bg-gray-200 z-0"></div>
                        </div>
                        <div className="md:col-span-4">
                          <h3 className="text-xl font-semibold mb-2">Candidate Presentation</h3>
                          <p className="text-gray-600 mb-4">We present a shortlist of qualified candidates with detailed profiles and our assessment notes, saving you time in the selection process.</p>
                          <Button>View Sample Candidate Profile</Button>
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                      <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-1 flex md:justify-end">
                          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-4 z-10">5</div>
                        </div>
                        <div className="md:col-span-4">
                          <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                          <p className="text-gray-600 mb-4">From interview coordination to offer negotiation and onboarding, we provide comprehensive support throughout the hiring process.</p>
                          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                            <h4 className="font-medium mb-2">Our Guarantee</h4>
                            <p className="text-gray-600">We stand behind our placements with industry-leading guarantee periods. If a candidate doesn't work out, we'll find a replacement at no additional cost.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized recruiters have deep expertise in a variety of industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Technology</h3>
              <p className="text-gray-600 mb-4">From software engineers to IT leaders, we connect you with tech talent that drives innovation.</p>
              <Link href="/hire-talent/technology">
                <Button variant="outline" className="w-full">View Tech Talent</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Briefcase className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Finance</h3>
              <p className="text-gray-600 mb-4">Access financial professionals with the expertise to strengthen your organization's fiscal operations.</p>
              <Link href="/hire-talent/finance">
                <Button variant="outline" className="w-full">View Finance Talent</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Healthcare</h3>
              <p className="text-gray-600 mb-4">Find qualified healthcare professionals to deliver exceptional patient care and administrative support.</p>
              <Link href="/hire-talent/healthcare">
                <Button variant="outline" className="w-full">View Healthcare Talent</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Building className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Legal</h3>
              <p className="text-gray-600 mb-4">Connect with experienced legal professionals for your firm or in-house legal department.</p>
              <Link href="/hire-talent/legal">
                <Button variant="outline" className="w-full">View Legal Talent</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GraduationCap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="text-gray-600 mb-4">Find qualified educational professionals from instructors to administrators.</p>
              <Link href="/hire-talent/education">
                <Button variant="outline" className="w-full">View Education Talent</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Industries</h3>
              <p className="text-gray-600 mb-4">Explore our complete range of talent solutions across all professional sectors.</p>
              <Link href="/hire-talent/industries">
                <Button variant="outline" className="w-full">Explore All Industries</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next star employee?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let our talent specialists help you build the team you need to succeed
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Request Talent
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}