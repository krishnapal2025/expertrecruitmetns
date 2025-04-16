import { Helmet } from "react-helmet";
import Banner from "@/components/home/banner";
import Welcome from "@/components/home/welcome";
import QuickLinks from "@/components/home/quick-links";
import HiringTrends from "@/components/home/hiring-trends";
import FeaturedCategories from "@/components/home/featured-categories";
import AnimatedTestimonials from "@/components/home/animated-testimonials";
import SearchBar from "@/components/home/search-bar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, BuildingIcon, GraduationCapIcon } from "@/assets/icons";
import { MessageSquareShare, ArrowRight } from "lucide-react";
import RealtimeJobs from "@/components/job/real-time-jobs";
import RealtimeApplications from "@/components/job/real-time-applications";
import { motion } from "framer-motion";
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
      
      <SearchBar />
      
      <Welcome />
      
      {/* Real-time updates section */}
      {currentUser && (
        <div className="container mx-auto px-4 py-4">
          {currentUser.user.userType === "jobseeker" && <RealtimeJobs />}
          {currentUser.user.userType === "employer" && <RealtimeApplications />}
        </div>
      )}
      
      <HiringTrends />
      
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              Explore <span className="text-primary">Opportunities</span>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-orange-200 dark:bg-orange-800"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
              Whether you're looking for your next career move or seeking top talent, we have all the tools you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full overflow-hidden">
                <div className="relative h-40 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-pattern-grid"></div>
                  <BriefcaseIcon className="w-20 h-20 text-primary relative z-10" />
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Find Jobs</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Browse thousands of opportunities across various industries and locations
                  </p>
                  <Link href="/job-board">
                    <Button size="lg" className="w-full font-semibold">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full overflow-hidden">
                <div className="relative h-40 bg-gradient-to-r from-purple-100 to-purple-50 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-pattern-grid"></div>
                  <BuildingIcon className="w-20 h-20 text-purple-500 relative z-10" />
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">For Employers</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Post jobs and find the perfect candidates for your organization
                  </p>
                  <Link href="/auth?type=employer">
                    <Button size="lg" className="w-full font-semibold">
                      Post a Job
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full overflow-hidden">
                <div className="relative h-40 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-pattern-grid"></div>
                  <GraduationCapIcon className="w-20 h-20 text-green-500 relative z-10" />
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Career Resources</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Access valuable tools and advice to advance your career
                  </p>
                  <Link href="/blogs">
                    <Button size="lg" className="w-full font-semibold">
                      View Resources
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FeaturedCategories />
      
      <QuickLinks />
      
      <AnimatedTestimonials />
      
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
