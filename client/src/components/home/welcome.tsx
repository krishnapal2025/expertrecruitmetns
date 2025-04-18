import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import hireImg from "@assets/3603649b-9dbb-4079-b5eb-c95af0e719b7.png";

// Sample slideshow images - in a real app, these would be stored properly
const slideImages = [
  {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&h=900&fit=crop",
    alt: "Professional team in a business meeting"
  },
  {
    url: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=600&h=900&fit=crop",
    alt: "Business professionals collaborating on project"
  },
  {
    url: hireImg,
    alt: "Team discussing recruitment strategy"
  },
  {
    url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=600&h=900&fit=crop",
    alt: "Job interview in progress"
  }
];

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto slideshow functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Navigation functions
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOS0uNiAyLjEtLjYgMy4yIDAgMS4yIDEuNSAyLjQuNiAzLjItLjkuOS0yIDEuMy0zLjIgMS4zLTEuMiAwLTIuMy0uNS0zLjItMS4zLS45LS45LjYtMi4xLjYtMy4yIDAtMS4yLTEuNS0yLjQtLjYtMy4yLjktLjggMi0xLjMgMy4yLTEuM3oiIHN0cm9rZT0icmdiYSgxNDcsIDUxLCAyMzQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      {/* Animated background shapes */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply opacity-60 -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-indigo-500/5 mix-blend-multiply opacity-50 -z-10"
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="bg-gradient-to-r from-primary/10 to-indigo-500/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm inline-block mb-3">
              Connecting Talent with Opportunity
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              Welcome to RH Job Portal
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We connect talented professionals with great companies. Whether you're looking for your next career move or seeking outstanding talent, we're here to help you succeed in today's competitive job market.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          {/* Left side - Image with floating elements */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 md:order-1 md:pr-8"
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-indigo-500/20 blur-2xl opacity-70 -z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/20 blur-2xl opacity-70 -z-10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-[9/16] relative overflow-hidden">
                {/* Connect to left corner design */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-primary/80 z-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-indigo-600"></div>
                  <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-white rounded-full"></div>
                </div>
                
                {/* Image slideshow */}
                <div className="relative w-full h-full">
                  <AnimatePresence initial={false}>
                    <motion.img 
                      key={currentSlide}
                      src={slideImages[currentSlide].url}
                      alt={slideImages[currentSlide].alt}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
                    />
                  </AnimatePresence>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-[5px]"></div>
                </div>
                
                {/* Navigation buttons */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                  {slideImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? "bg-white w-6" 
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Job seekers content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8 order-1 md:order-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Job Seekers
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Take the next step in your career journey with us. We offer access to thousands of opportunities across various industries and locations.
              </p>
              
              <ul className="space-y-3 mb-6">
                {[
                  "Create a profile that showcases your skills",
                  "Browse jobs that match your qualifications",
                  "Get discovered by employers seeking talent",
                  "Access resources to enhance your search"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Employer content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Employers
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Find the talent your organization needs to thrive. We provide access to a diverse pool of qualified candidates.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Post jobs and reach qualified candidates",
                  "Search for candidates with the right skills",
                  "Manage applications with tracking tools",
                  "Build your employer brand with a profile"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">95%</span>
              </div>
              <h3 className="font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-sm text-gray-600">Clients rating their experience as excellent</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-violet-600">10k+</span>
              </div>
              <h3 className="font-semibold mb-2">Placements</h3>
              <p className="text-sm text-gray-600">Successful job placements in the last year</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-emerald-600">67%</span>
              </div>
              <h3 className="font-semibold mb-2">Faster Hiring</h3>
              <p className="text-sm text-gray-600">Reduced time-to-hire compared to industry average</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-amber-600">92%</span>
              </div>
              <h3 className="font-semibold mb-2">Retention Rate</h3>
              <p className="text-sm text-gray-600">Candidates who stay with their new roles for 1+ years</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Industry-Leading Success</h3>
                    <p className="text-gray-600">
                      With a track record of connecting talent with opportunity, we've helped thousands of professionals advance their careers and hundreds of companies build strong teams.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-violet-500"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Quality Matches</h3>
                    <p className="text-gray-600">
                      We focus on making meaningful connections between candidates and employers, ensuring the right fit for both parties to foster long-term success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-emerald-500"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Expert Support</h3>
                    <p className="text-gray-600">
                      Our team of recruitment professionals is dedicated to providing personalized guidance and support throughout your job search or hiring process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
