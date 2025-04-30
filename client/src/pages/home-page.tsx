import { Helmet } from "react-helmet";
import Welcome from "@/components/home/welcome";
import HiringTrends from "@/components/home/hiring-trends";
import AnimatedTestimonials from "@/components/home/animated-testimonials";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, BuildingIcon, GraduationCapIcon } from "@/assets/icons";
import { MessageSquareShare, ArrowRight } from "lucide-react";
import { ScrollLink } from "@/components/ui/scroll-link";
import RealtimeJobs from "@/components/job/real-time-jobs";
import RealtimeApplications from "@/components/job/real-time-applications";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import hireTalentImage from "../assets/hire-talent-image.webp";

export default function HomePage() {
  const { currentUser } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Expert Recruitments LLC | Find Your Next Career Opportunity</title>
        <meta name="description" content="Connect with the best job opportunities and top talent through our professional job portal. Specializing in executive search across UAE & GCC markets." />
      </Helmet>
      
      <Welcome />
      
      {/* Real-time updates section */}
      {currentUser && (
        <div className="container mx-auto px-4 py-4">
          {currentUser.user.userType === "jobseeker" && <RealtimeJobs />}
          {currentUser.user.userType === "employer" && <RealtimeApplications />}
        </div>
      )}
      
      <HiringTrends />
      
      <section className="py-20 relative">
        {/* 3D Geometric Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 -z-10"></div>
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Animated decorative shapes */}
          <div className="absolute w-full h-full">
            <motion.div 
              className="absolute left-[5%] top-20 w-40 h-40 bg-blue-50 rotate-12 rounded-lg mix-blend-multiply opacity-60"
              animate={{ 
                rotate: [12, -5, 12],
                y: [0, 15, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="absolute right-[10%] top-20 w-32 h-32 bg-purple-50 rotate-45 rounded-lg mix-blend-multiply opacity-60"
              animate={{ 
                rotate: [45, 30, 45],
                y: [0, -20, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="absolute left-[30%] bottom-20 w-48 h-48 bg-green-50 -rotate-12 rounded-lg mix-blend-multiply opacity-60"
              animate={{ 
                rotate: [-12, -20, -12],
                x: [0, 15, 0]
              }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="absolute right-[15%] bottom-1/4 w-60 h-60 bg-amber-50 rotate-12 rounded-lg mix-blend-multiply opacity-40"
              animate={{ 
                rotate: [12, 20, 12],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block mb-4">
              <motion.div 
                className="px-5 py-2 rounded-full bg-white border border-primary/20 shadow-lg shadow-primary/5"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 font-semibold text-sm">
                  Job Portal Features
                </span>
              </motion.div>
            </div>
            <h2 className="text-4xl md:text-4xl font-bold mb-4 tracking-tight">
              Your Path to <span className="text-primary">Career Success</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
              Powerful tools for job seekers and employers to connect and collaborate
            </p>
          </motion.div>
          
          {/* Interactive Feature Blocks - Distinctly different from categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
           
            
            {/* Hire Talent Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition duration-500">
                {/* Image Area */}
                <div className="md:w-2/5 aspect-video md:aspect-square rounded-xl overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src={hireTalentImage}
                      alt="Professional business handshake" 
                      className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/60"></div>
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-purple-600">
                      10k+ Professional Candidates
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 mr-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <BuildingIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold">Hire Talent</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Connect with qualified professionals who have the skills and experience to drive your business forward.
                    </p>
                    
                    {/* Features List */}
                    <ul className="mb-6 space-y-2">
                      {["Candidate screening", "Direct messaging", "Resume database", "Skill assessment"].map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                          <div className="w-5 h-5 mr-2 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <ScrollLink href="/vacancy-form" className="w-full">
                    <Button variant="default" className="group w-full justify-between bg-purple-600 hover:bg-purple-700 text-white">
                      <span className="mr-2">Hire Talent</span>
                      <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </ScrollLink>
                </div>
              </div>
            </motion.div>
            
            {/* Find Jobs Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition duration-500">
                {/* Image Area */}
                <div className="md:w-2/5 aspect-video md:aspect-square rounded-xl overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1500&auto=format&fit=crop"
                      alt="Person searching for jobs on laptop" 
                      className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/60"></div>
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-primary">
                      1,500+ Active Jobs
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 mr-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                        <BriefcaseIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold">Find Jobs</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Discover opportunities matching your skills, experience, and career goals across various industries and locations.
                    </p>

                    {/* Features List */}
                    <ul className="mb-6 space-y-2">
                      {["Advanced search filters", "Job alerts", "Application tracking", "Salary insights"].map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                          <div className="w-5 h-5 mr-2 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/job-board">
                    <Button variant="default" className="group w-full justify-between overflow-hidden">
                      <span className="mr-2">Browse Jobs</span>
                      <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Post a Job Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition duration-500">
                {/* Image Area */}
                <div className="md:w-2/5 aspect-video md:aspect-square rounded-xl overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1500&auto=format&fit=crop"
                      alt="Person writing job descriptions" 
                      className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/60"></div>
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-indigo-600">
                      Fast & Easy Job Posting
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 mr-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Post a Job</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Create compelling job listings that attract top talent and help you find the perfect candidate for your needs.
                    </p>
                    
                    {/* Features List */}
                    <ul className="mb-6 space-y-2">
                      {["Targeted visibility", "Applicant management", "Custom screening questions", "Performance analytics"].map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                          <div className="w-5 h-5 mr-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href="/post-job">
                    <Button variant="default" className="group w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white">
                      <span className="mr-2">Post a Job</span>
                      <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Career Resources Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-green-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition duration-500">
                {/* Image Area */}
                <div className="md:w-2/5 aspect-video md:aspect-square rounded-xl overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1500&auto=format&fit=crop"
                      alt="Career growth materials" 
                      className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-600/0 to-teal-600/60"></div>
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-teal-600">
                      Expert Career Guidance
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 mr-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                        <GraduationCapIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold">Career Resources</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Access valuable tools, expert advice, and industry insights to help you advance your career.
                    </p>
                    
                    {/* Features List */}
                    <ul className="mb-6 space-y-2">
                      {["Resume templates", "Interview prep", "Career advice articles", "Salary negotiation guides"].map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                          <div className="w-5 h-5 mr-2 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href="/job-seeker-register">
                    <Button variant="default" className="group w-full justify-between bg-teal-600 hover:bg-teal-700 text-white">
                      <span className="mr-2">View Resources</span>
                      <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      
      <AnimatedTestimonials />
      
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking for your dream job or seeking top talent, we're here to help
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth?type=employer">
              <Button variant="secondary" size="lg">Sign Up as Employer</Button>
            </Link>
            <Link href="/auth?type=jobseeker">
              <Button variant="secondary" size="lg">Sign Up as Job Seeker</Button>
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
