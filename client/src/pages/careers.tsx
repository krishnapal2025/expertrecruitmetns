import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, CheckCircle, Users, Building, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Sample career opportunities data
const careerOpportunities = [
  {
    id: 1,
    title: "Senior Recruitment Consultant",
    department: "Recruitment",
    location: "New York, NY",
    type: "Full-time",
    description: "Join our team as a Senior Recruitment Consultant to help connect top talent with exceptional opportunities while building client relationships and growing our business."
  },
  {
    id: 2,
    title: "Technical Recruiter",
    department: "IT Recruitment",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a Technical Recruiter with experience in the IT sector to identify and place qualified candidates in technology roles."
  },
  {
    id: 3,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Help us expand our brand presence and reach more clients and candidates through innovative marketing strategies and campaigns."
  },
  {
    id: 4,
    title: "Client Relationship Manager",
    department: "Account Management",
    location: "Dallas, TX",
    type: "Full-time",
    description: "Build and maintain strong client relationships, understand their hiring needs, and ensure we deliver exceptional service and qualified candidates."
  },
  {
    id: 5,
    title: "HR Operations Coordinator",
    department: "Human Resources",
    location: "Remote",
    type: "Full-time",
    description: "Support our internal HR operations, including employee onboarding, benefits administration, and various HR initiatives."
  }
];

// Benefits data
const benefits = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Competitive Compensation",
    description: "Attractive salary packages and performance-based bonuses"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Health Benefits",
    description: "Comprehensive health, dental, and vision insurance"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Professional Development",
    description: "Training programs and career advancement opportunities"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Work-Life Balance",
    description: "Flexible schedules and remote work options"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Retirement Plan",
    description: "401(k) with company matching contributions"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Team Building",
    description: "Regular team events and social activities"
  }
];

export default function CareersPage() {
  return (
    <>
      <Helmet>
        <title>Careers at RH Job Portal | Join Our Team</title>
        <meta name="description" content="Explore career opportunities at RH Job Portal. Join our team of talented professionals and help connect great people with great opportunities." />
      </Helmet>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-2xl">
            Be part of a dynamic team that's transforming how people find jobs and how companies find talent.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Why Join Us Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Join Us?</h2>
              <p className="text-lg text-gray-700 mb-6">
                At RH Job Portal, we're not just connecting candidates with jobs – we're transforming lives and businesses. When you join our team, you become part of something truly meaningful.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We foster a collaborative, innovative culture where your ideas are valued and you have the freedom to make an impact. Our commitment to excellence, integrity, and human connection guides everything we do.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  <span className="font-medium">Collaborative Culture</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-6 w-6 mr-2 text-primary" />
                  <span className="font-medium">Industry Leader</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary" />
                  <span className="font-medium">Work-Life Balance</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786" 
                alt="Happy team members in the office"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Benefits</h2>
          <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto">
            We believe in taking care of our team. Here are some of the benefits you'll enjoy when you join RH Job Portal.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Open Positions</h2>
          <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto">
            Explore our current openings and find a role where you can grow and make an impact.
          </p>
          
          <div className="space-y-6">
            {careerOpportunities.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <Badge className="mb-2">{job.department}</Badge>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Culture Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Culture</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Collaborative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in the power of teamwork and work together to achieve exceptional results for our clients and candidates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Innovative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We embrace new ideas and technologies to improve our services and stay ahead in a rapidly evolving industry.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Inclusive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We celebrate diversity and create an environment where everyone feels valued, respected, and empowered.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
              alt="Team collaboration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Application Process</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="font-bold mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">
                Submit your application through our careers page
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="font-bold mb-2">Initial Screening</h3>
              <p className="text-gray-600 text-sm">
                Brief phone interview with our HR team
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="font-bold mb-2">Interviews</h3>
              <p className="text-gray-600 text-sm">
                Meet with the team and discuss your experience
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h3 className="font-bold mb-2">Offer</h3>
              <p className="text-gray-600 text-sm">
                Receive and accept your offer to join our team
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Team Says</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1573496130141-209d200cebd8" 
                        alt="Team member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <blockquote className="text-gray-700 italic mb-4">
                      "Working at RH Job Portal has been the highlight of my career. The collaborative environment and opportunities for growth are unmatched. I truly feel valued and supported in my role."
                    </blockquote>
                    <div className="font-bold">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Senior Recruitment Consultant, 3 years</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" 
                        alt="Team member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <blockquote className="text-gray-700 italic mb-4">
                      "I joined RH Job Portal as an entry-level recruiter and have grown so much professionally. The mentorship and training I've received have been instrumental in my development."
                    </blockquote>
                    <div className="font-bold">Michael Taylor</div>
                    <div className="text-sm text-gray-500">Technical Recruiter, 2 years</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Discover your potential with RH Job Portal. We're looking for talented individuals who are passionate about making a difference.
          </p>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary">
              View All Openings
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
