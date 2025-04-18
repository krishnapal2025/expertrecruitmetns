import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, ArrowRight, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Link } from "wouter";

// Helper function to generate initials from a name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Pre-defined colors for avatar backgrounds
const avatarColors = [
  "bg-primary",
  "bg-primary/90",
  "bg-primary/80",
  "bg-primary/70",
  "bg-primary/85",
  "bg-primary/75"
];

export default function AnimatedTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Use this when no testimonials are available in the database
  const defaultTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior UX Designer at TechCorp",
      content: "I found my dream job through RH Job Portal. Their matching algorithm is incredible - the job opportunities I was presented with were spot-on for my skills and career goals.",
      rating: 5,
      userId: null
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      content: "After struggling with my job search for months, I turned to RH Job Portal and landed three interviews in the first week. The platform is intuitive and the career resources are invaluable.",
      rating: 5,
      userId: null
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Finance Manager",
      content: "As someone transitioning to a new industry, I was worried about finding the right opportunity. RH Job Portal made it easy with their specialized industry insights and personalized job recommendations.",
      rating: 4,
      userId: null
    }
  ] as Testimonial[];

  const { data: apiTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Use API testimonials if available, otherwise use defaults
  const testimonials = apiTestimonials.length > 0 ? apiTestimonials : defaultTestimonials;

  // Handle automatic slider
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials, isPaused]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  
  // Animation variants for benefits list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      {/* Grid pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse" x="50%" y="100%" patternTransform="translate(0, -16)">
                <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-block mb-3">
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/80 px-4 py-1.5 rounded-full text-sm font-semibold">
              Success Stories
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            <span className="relative inline-block">
              What Our Users Say
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 dark:bg-primary/30"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
            Join thousands who have found success through our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Minimalist Testimonial Card */}
          <div className="md:col-span-7">
            <div 
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg min-h-[300px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-primary/10 rounded-full blur-2xl"></div>
              
              <div className="z-10 relative p-8 md:p-10">
                <Quote className="h-10 w-10 text-primary/20 dark:text-primary/30 absolute top-6 left-6 opacity-80" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="pt-10"
                  >
                    <div className="mb-4 flex">
                      {renderStars(testimonials[activeIndex].rating || 5)}
                    </div>
                    
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200 mb-6 italic">
                      "{testimonials[activeIndex].content}"
                    </p>
                    
                    <div className="flex items-center">
                      <Avatar className="mr-4 h-14 w-14 border-2 border-white shadow-md">
                        <AvatarFallback className={`${avatarColors[activeIndex % avatarColors.length]} text-white`}>
                          {getInitials(testimonials[activeIndex].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonials[activeIndex].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                  key={activeIndex}
                />
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-8 h-1.5 rounded-full transition-all ${
                      activeIndex === index 
                        ? "bg-primary w-12" 
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Stats and CTA Column */}
          <div className="md:col-span-5" ref={sectionRef}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-primary/10 text-primary w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </span>
                  Join Our Success Stories
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-primary/20 rounded-full mr-3 group-hover:h-12 transition-all duration-300"></div>
                      <div>
                        <div className="text-3xl font-bold text-primary dark:text-primary/90">94%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Placement Rate</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-violet-400/20 rounded-full mr-3 group-hover:h-12 transition-all duration-300"></div>
                      <div>
                        <div className="text-3xl font-bold text-violet-500 dark:text-violet-400">+32%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Salary Increase</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-emerald-400/20 rounded-full mr-3 group-hover:h-12 transition-all duration-300"></div>
                      <div>
                        <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">14K+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Happy Clients</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-amber-400/20 rounded-full mr-3 group-hover:h-12 transition-all duration-300"></div>
                      <div>
                        <div className="text-3xl font-bold text-amber-500 dark:text-amber-400">4.8/5</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Client Rating</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="mb-8"
                >
                  <h4 className="text-lg font-semibold mb-3">Why join our platform?</h4>
                  <ul className="space-y-2">
                    <motion.li variants={itemVariants} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Access to exclusive job opportunities</span>
                    </motion.li>
                    <motion.li variants={itemVariants} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Profile visibility to top employers</span>
                    </motion.li>
                    <motion.li variants={itemVariants} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Career guidance and resources</span>
                    </motion.li>
                  </ul>
                </motion.div>
                
                <Link href="/job-seeker-register">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Success Story
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}