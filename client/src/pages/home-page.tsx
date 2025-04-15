import { Helmet } from "react-helmet";
import Banner from "@/components/home/banner";
import Welcome from "@/components/home/welcome";
import QuickLinks from "@/components/home/quick-links";
import Testimonials from "@/components/home/testimonials";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, BuildingIcon, GraduationCapIcon } from "@/assets/icons";
import { MessageSquareShare } from "lucide-react";
import RealtimeJobs from "@/components/job/real-time-jobs";
import RealtimeApplications from "@/components/job/real-time-applications";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { currentUser } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>RH Job Portal | Find Your Next Career Opportunity</title>
        <meta name="description" content="Connect with the best job opportunities and top talent through our professional job portal. For job seekers and employers." />
      </Helmet>

      <Banner />
      
      <Welcome />
      
      {/* Real-time updates section */}
      {currentUser && (
        <div className="container mx-auto px-4 py-4">
          {currentUser.user.userType === "jobseeker" && <RealtimeJobs />}
          {currentUser.user.userType === "employer" && <RealtimeApplications />}
        </div>
      )}
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Opportunities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Find Jobs</h3>
                <p className="text-gray-600 mb-4">
                  Browse thousands of opportunities across various industries and locations
                </p>
                <Link href="/job-board">
                  <Button className="w-full">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BuildingIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">For Employers</h3>
                <p className="text-gray-600 mb-4">
                  Post jobs and find the perfect candidates for your organization
                </p>
                <Link href="/auth?type=employer">
                  <Button className="w-full">Post a Job</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <GraduationCapIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Career Resources</h3>
                <p className="text-gray-600 mb-4">
                  Access valuable tools and advice to advance your career
                </p>
                <Link href="/blogs">
                  <Button className="w-full">View Resources</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <QuickLinks />
      
      <Testimonials />
      
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking for your dream job or seeking top talent, we're here to help
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth?type=jobseeker">
              <Button variant="secondary" size="lg">Sign Up as Job Seeker</Button>
            </Link>
            <Link href="/auth?type=employer">
              <Button variant="secondary" size="lg">Sign Up as Employer</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* MessageSquareShare Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contact us on MessageSquareShare"
      >
        <MessageSquareShare size={24} />
      </a>
    </>
  );
}
