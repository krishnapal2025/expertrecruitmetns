import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Banner slide data
const slides = [
  {
    title: "Elevate Your Career Journey",
    subtitle: "Find Your Perfect Match",
    description: "Connect with innovative companies and opportunities that align with your skills and ambitions",
    bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    accent: "from-blue-600 to-indigo-600",
    ctaText: "Browse Jobs",
    ctaLink: "/job-board",
    iconPath: "M20 7.5v9l-5-2.25L10 12l-5 2.25v-9h15zm0-1.5H5c-.553 0-1 .448-1 1v10c0 .553.447 1 1 1h15c.553 0 1-.447 1-1V7c0-.552-.447-1-1-1zm-5 4H8v-1h7v1zm0 2H8v-1h7v1zm0 2H8v-1h7v1z",
  },
  {
    title: "Build Exceptional Teams",
    subtitle: "Connect with Top Talent",
    description: "Discover skilled professionals across all industries ready to bring expertise to your organization",
    bgImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    accent: "from-purple-600 to-pink-600",
    ctaText: "Post a Job",
    ctaLink: "/auth?type=employer",
    iconPath: "M12.75 11.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zM7 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7.757 12.757a3.001 3.001 0 0 0-5.514 0 .5.5 0 0 0 .5.743h4.514a.5.5 0 0 0 .5-.743zm9.486 0a3.001 3.001 0 0 0-5.514 0 .5.5 0 0 0 .5.743h4.514a.5.5 0 0 0 .5-.743z",
  },
  {
    title: "Shape Your Future Success",
    subtitle: "Expert Resources & Guidance",
    description: "Access specialized industry insights, career advice, and professional development tools",
    bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    accent: "from-teal-600 to-emerald-600",
    ctaText: "Career Resources",
    ctaLink: "/blogs",
    iconPath: "M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7zM9.91 8.5L8.5 9.91 10.59 12 8.5 14.09l1.41 1.41L12 13.41l2.09 2.09 1.41-1.41L13.41 12l2.09-2.09-1.41-1.41L12 10.59 9.91 8.5z",
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
    <div className="relative h-[650px] overflow-hidden bg-black">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl z-0"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 filter blur-3xl z-0"></div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-20"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].bgImage})`,
            }}
          >
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].accent} opacity-10`}></div>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative h-full z-20">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-white"
                >
                  <div className="mb-3 inline-block">
                    <span className={`bg-gradient-to-r ${slides[currentSlide].accent} px-4 py-1.5 rounded-full text-sm font-semibold text-white`}>
                      {slides[currentSlide].subtitle}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-xl">
                    {slides[currentSlide].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link href={
                      slides[currentSlide].ctaText === "Post a Job" && 
                      currentUser?.user.userType === "employer" ? 
                      "/post-job" : slides[currentSlide].ctaLink
                    }>
                      <Button 
                        size="lg" 
                        className={`text-lg font-semibold group bg-gradient-to-r ${slides[currentSlide].accent} hover:shadow-lg hover:shadow-primary/20 transition-all`}
                      >
                        {slides[currentSlide].ctaText}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    {currentSlide === 0 && !currentUser && (
                      <Link href="/auth?type=jobseeker">
                        <Button size="lg" variant="outline" className="text-lg font-semibold border-white text-white hover:bg-white/10">
                          Register Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
                
                {/* Decorative element/icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="hidden md:flex justify-center"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].accent} rounded-full opacity-20 blur-2xl transform -translate-x-10 -translate-y-10 scale-90`}></div>
                    <div className="w-64 h-64 rounded-3xl backdrop-blur-sm bg-white/10 flex items-center justify-center border border-white/20 shadow-xl">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-24 h-24 text-white/80"
                      >
                        <path d={slides[currentSlide].iconPath} />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-0 right-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl">
            <div className="flex space-x-3">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group flex flex-col items-center focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className={`transition-colors font-medium text-sm mb-2 ${
                    index === currentSlide ? "text-white" : "text-white/40 group-hover:text-white/70"
                  }`}>
                    0{index + 1}
                  </span>
                  <div className="w-16 h-1 rounded-full overflow-hidden bg-white/20">
                    <div 
                      className={`h-full transition-all bg-white ${
                        index === currentSlide ? "w-full" : "w-0 group-hover:w-1/4"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={prevSlide}
                className="text-white/60 hover:text-white focus:outline-none transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="text-white/60 hover:text-white focus:outline-none transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
