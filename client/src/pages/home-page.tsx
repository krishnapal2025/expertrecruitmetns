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
      
      <section className="py-24 overflow-hidden relative">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 -z-10"></div>
        <div className="absolute h-full w-full -z-10">
          <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-blue-50 mix-blend-multiply opacity-50 blur-3xl"></div>
          <div className="absolute bottom-40 left-[5%] w-96 h-96 rounded-full bg-purple-50 mix-blend-multiply opacity-40 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-green-50 mix-blend-multiply opacity-30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold shadow-sm inline-block mb-4">
              Take The Next Step
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Career Paths</span>
            </h2>
            <p className="mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
              Whether you're looking for your next career move or seeking top talent, 
              we have all the tools you need to succeed in today's competitive job market.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-6">
            {/* Find Jobs Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1500&auto=format&fit=crop"
                    alt="Person searching for jobs on laptop"
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 to-blue-900/90"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col h-full justify-between text-white min-h-[500px]">
                  <div>
                    {/* Icon with decorative ring */}
                    <div className="mb-6 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl relative">
                      <BriefcaseIcon className="w-12 h-12 text-white" />
                      <motion.div 
                        className="absolute inset-0 border border-white/20 rounded-2xl"
                        initial={{ opacity: 0.3, scale: 0.9 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Find Jobs</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Browse thousands of opportunities across various industries, locations, and specializations tailored to your skills and expertise.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    {/* Animated decorative bars */}
                    <div className="space-y-1.5 mb-6">
                      <motion.div 
                        className="h-1 bg-white/80 rounded-full" 
                        initial={{ width: "30%" }}
                        whileInView={{ width: "65%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/50 rounded-full" 
                        initial={{ width: "60%" }}
                        whileInView={{ width: "45%" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/30 rounded-full" 
                        initial={{ width: "20%" }}
                        whileInView={{ width: "80%" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    
                    <Link href="/job-board">
                      <Button variant="secondary" size="lg" className="w-full font-medium text-blue-900 bg-white hover:bg-white/90 group-hover:shadow-lg transition-all duration-300">
                        <span>Browse Jobs</span>
                        <motion.div 
                          initial={{ x: 0 }} 
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Hire Talent Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1500&auto=format&fit=crop"
                    alt="Group of business professionals"
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/70 to-purple-900/90"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col h-full justify-between text-white min-h-[500px]">
                  <div>
                    {/* Icon with decorative ring */}
                    <div className="mb-6 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl relative">
                      <BuildingIcon className="w-12 h-12 text-white" />
                      <motion.div 
                        className="absolute inset-0 border border-white/20 rounded-2xl"
                        initial={{ opacity: 0.3, scale: 0.9 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Hire Talent</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Connect with qualified professionals who have the skills and experience to drive your business forward and achieve your goals.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    {/* Animated decorative bars */}
                    <div className="space-y-1.5 mb-6">
                      <motion.div 
                        className="h-1 bg-white/80 rounded-full" 
                        initial={{ width: "40%" }}
                        whileInView={{ width: "75%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/50 rounded-full" 
                        initial={{ width: "70%" }}
                        whileInView={{ width: "50%" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/30 rounded-full" 
                        initial={{ width: "25%" }}
                        whileInView={{ width: "60%" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    
                    <Link href="/hire-talent">
                      <Button variant="secondary" size="lg" className="w-full font-medium text-purple-900 bg-white hover:bg-white/90 group-hover:shadow-lg transition-all duration-300">
                        <span>Hire Talent</span>
                        <motion.div 
                          initial={{ x: 0 }} 
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Post a Job Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1500&auto=format&fit=crop"
                    alt="Person writing a job description"
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/70 to-indigo-900/90"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col h-full justify-between text-white min-h-[500px]">
                  <div>
                    {/* Icon with decorative ring */}
                    <div className="mb-6 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <line x1="10" y1="9" x2="8" y2="9"></line>
                      </svg>
                      <motion.div 
                        className="absolute inset-0 border border-white/20 rounded-2xl"
                        initial={{ opacity: 0.3, scale: 0.9 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Post a Job</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Create a compelling job listing that attracts top talent and helps you find the perfect candidate for your organization's needs.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    {/* Animated decorative bars */}
                    <div className="space-y-1.5 mb-6">
                      <motion.div 
                        className="h-1 bg-white/80 rounded-full" 
                        initial={{ width: "20%" }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/50 rounded-full" 
                        initial={{ width: "50%" }}
                        whileInView={{ width: "65%" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/30 rounded-full" 
                        initial={{ width: "35%" }}
                        whileInView={{ width: "45%" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    
                    <Link href="/post-job">
                      <Button variant="secondary" size="lg" className="w-full font-medium text-indigo-900 bg-white hover:bg-white/90 group-hover:shadow-lg transition-all duration-300">
                        <span>Post a Job</span>
                        <motion.div 
                          initial={{ x: 0 }} 
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Career Resources Card */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1500&auto=format&fit=crop"
                    alt="Career growth and learning resources"
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-600/70 to-teal-900/90"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col h-full justify-between text-white min-h-[500px]">
                  <div>
                    {/* Icon with decorative ring */}
                    <div className="mb-6 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl relative">
                      <GraduationCapIcon className="w-12 h-12 text-white" />
                      <motion.div 
                        className="absolute inset-0 border border-white/20 rounded-2xl"
                        initial={{ opacity: 0.3, scale: 0.9 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Career Resources</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Access valuable tools, expert advice, and industry insights to help you advance your career and achieve your professional goals.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    {/* Animated decorative bars */}
                    <div className="space-y-1.5 mb-6">
                      <motion.div 
                        className="h-1 bg-white/80 rounded-full" 
                        initial={{ width: "55%" }}
                        whileInView={{ width: "40%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/50 rounded-full" 
                        initial={{ width: "30%" }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      ></motion.div>
                      <motion.div 
                        className="h-1 bg-white/30 rounded-full" 
                        initial={{ width: "70%" }}
                        whileInView={{ width: "55%" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    
                    <Link href="/blogs">
                      <Button variant="secondary" size="lg" className="w-full font-medium text-teal-900 bg-white hover:bg-white/90 group-hover:shadow-lg transition-all duration-300">
                        <span>View Resources</span>
                        <motion.div 
                          initial={{ x: 0 }} 
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contact us on WhatsApp"
      >
        <MessageSquareShare size={24} />
      </a>
    </>
  );
}
