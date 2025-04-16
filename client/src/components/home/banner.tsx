import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Add the keyframes for the zoom effect in CSS
const slowZoomKeyframes = `
@keyframes slowZoom {
  from { transform: scale(1.05); }
  to { transform: scale(1.15); }
}`;

// Banner slide data with a new minimalist aesthetic
const slides = [
  {
    title: "Your Career,\nRedefined",
    tagline: "FIND OPPORTUNITIES",
    description: "Connect with forward-thinking companies seeking your unique talents",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1600&auto=format&fit=crop",
    color: "bg-blue-500",
    stats: [
      { value: "15k+", label: "Jobs" },
      { value: "1.2k", label: "Companies" },
      { value: "24/7", label: "Support" }
    ],
    ctaText: "Browse Jobs",
    ctaLink: "/job-board",
  },
  {
    title: "Talent\nAcquisition",
    tagline: "HIRE PROFESSIONALS",
    description: "Connect with exceptional candidates ready to transform your business",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop",
    color: "bg-violet-500",
    stats: [
      { value: "90k+", label: "Candidates" },
      { value: "48hr", label: "Avg. Hire Time" },
      { value: "92%", label: "Success Rate" }
    ],
    ctaText: "Post a Job",
    ctaLink: "/auth?type=employer",
  },
  {
    title: "Strategic\nGrowth",
    tagline: "CAREER RESOURCES",
    description: "Unlock industry insights and professional development resources",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    color: "bg-emerald-500",
    stats: [
      { value: "200+", label: "Expert Guides" },
      { value: "45%", label: "Salary Growth" },
      { value: "8k+", label: "Success Stories" }
    ],
    ctaText: "Career Resources",
    ctaLink: "/blogs",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up automatic slider
  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    };

    startAutoSlide();

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentSlide(index);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[650px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 flex flex-col md:flex-row"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Left content panel */}
          <motion.div 
            className="w-full md:w-7/12 bg-white dark:bg-gray-900 h-1/2 md:h-full relative overflow-hidden p-8 md:p-16 flex flex-col justify-center"
            variants={{
              initial: { opacity: 0, x: -50 },
              animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
            }}
          >
            {/* Decorative element */}
            <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full ${slides[currentSlide].color} opacity-10 blur-3xl`}></div>
            <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-dot-pattern opacity-5"></div>
            
            <div className="relative z-10 max-w-xl">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-6"
              >
                <span className={`inline-block ${slides[currentSlide].color} bg-opacity-10 text-xs font-semibold tracking-wider px-3 py-1 rounded-sm text-${slides[currentSlide].color.split('-')[1]}-600 dark:text-${slides[currentSlide].color.split('-')[1]}-400`}>
                  {slides[currentSlide].tagline}
                </span>
              </motion.div>
              
              {/* Title with line break preserved */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white"
              >
                {slides[currentSlide].title.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </motion.h1>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              >
                {slides[currentSlide].description}
              </motion.p>
              
              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 mb-10"
              >
                {slides[currentSlide].stats.map((stat, index) => (
                  <div key={index}>
                    <div className={`text-3xl font-bold mb-1 text-${slides[currentSlide].color.split('-')[1]}-500`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
              
              {/* Call to action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href={
                  slides[currentSlide].ctaText === "Post a Job" && 
                  currentUser?.user.userType === "employer" ? 
                  "/post-job" : slides[currentSlide].ctaLink
                }>
                  <Button 
                    size="lg" 
                    className={`${slides[currentSlide].color} font-medium group hover:opacity-90 transition-all`}
                  >
                    {slides[currentSlide].ctaText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                {currentSlide === 0 && !currentUser && (
                  <Link href="/auth?type=jobseeker">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="font-medium border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Register Now
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right image panel */}
          <motion.div 
            className="w-full md:w-5/12 h-1/2 md:h-full relative overflow-hidden"
            variants={{
              initial: { opacity: 0, scale: 1.1 },
              animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
              exit: { opacity: 0, scale: 1.1, transition: { duration: 0.3 } }
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-in-out"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
                transform: 'scale(1.05)',
                animation: 'slowZoom 15s infinite alternate ease-in-out'
              }}
            ></div>
            <div className={`absolute inset-0 ${slides[currentSlide].color} opacity-30 mix-blend-multiply`}></div>
            
            {/* Floating card with call-to-action */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-8 right-8 left-8 md:left-auto md:right-8 md:bottom-8 md:w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-start">
                <div className={`${slides[currentSlide].color} rounded-full p-2 mr-3 text-white`}>
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Ready to start?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Join thousands who have already found their perfect career match.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Slide navigation */}
      <div className="absolute left-8 md:left-16 bottom-6 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? `${slides[currentSlide].color} scale-125` 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Slide counter */}
      <div className="absolute right-8 md:right-16 bottom-6 z-30">
        <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md rounded-full px-3 py-1 font-mono text-sm text-gray-600 dark:text-gray-400">
          {currentSlide + 1}/{slides.length}
        </div>
      </div>
    </div>
  );
}
