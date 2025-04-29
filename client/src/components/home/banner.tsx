import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollLink } from "@/components/ui/scroll-link";

// Add the keyframes for the zoom effect in CSS
const slowZoomKeyframes = `
@keyframes slowZoom {
  from { transform: scale(1.05); }
  to { transform: scale(1.15); }
}`;

// Banner slide data with SEO-optimized keywords for Dubai and UAE recruitment
const slides = [
  {
    title: "Executive Search\nDubai & UAE",
    tagline: "FIND OPPORTUNITIES",
    description: "Connect with premier Dubai employers seeking top talent through UAE's leading recruitment agency",
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1600&auto=format&fit=crop",
    color: "bg-primary",
    stats: [
      { value: "10k+", label: "Executive Placements" },
      { value: "500+", label: "UAE Companies" },
      { value: "24/7", label: "Dedicated Support" }
    ],
    ctaText: "Browse Jobs",
    ctaLink: "/job-board",
  },
  {
    title: "Talent\nAcquisition UAE",
    tagline: "PREMIUM HEADHUNTING",
    description: "Partner with Dubai's expert headhunters to transform your business with exceptional talent",
    image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1600&auto=format&fit=crop",
    color: "bg-violet-500",
    stats: [
      { value: "15+", label: "Years in UAE Market" },
      { value: "48hr", label: "Executive Match Time" },
      { value: "92%", label: "Placement Success Rate" }
    ],
    ctaText: "Post a Job",
    ctaLink: "/auth?type=employer",
  },
  {
    title: "Recruitment\nAgencies Dubai",
    tagline: "EXPERT HEADHUNTERS",
    description: "Experience the difference with Dubai's most trusted recruitment agency for executive talent",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    color: "bg-emerald-500",
    stats: [
      { value: "100+", label: "Dubai Industry Sectors" },
      { value: "3000+", label: "UAE Professionals Placed" },
      { value: "8k+", label: "Executive Success Stories" }
    ],
    ctaText: "Our Services",
    ctaLink: "/services",
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
    <div className="relative h-[760px] md:h-[760px] overflow-hidden">
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
            className="w-full md:w-7/12 bg-white dark:bg-gray-900 h-[380px] md:h-full relative overflow-hidden p-6 md:p-16 flex flex-col justify-center"
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
                className="mb-3 md:mb-6"
              >
                <span className={`inline-block ${currentSlide === 0 ? 'bg-primary/10 dark:bg-primary/20' : `${slides[currentSlide].color} bg-opacity-10`} text-xs font-semibold tracking-wider px-3 py-1 rounded-sm ${currentSlide === 0 ? 'text-primary dark:text-primary/90' : `text-${slides[currentSlide].color.split('-')[1]}-600 dark:text-${slides[currentSlide].color.split('-')[1]}-400`}`}>
                  {slides[currentSlide].tagline}
                </span>
              </motion.div>
              
              {/* Title with line break preserved */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold mb-3 md:mb-6 leading-tight text-gray-900 dark:text-white"
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
                className="text-sm sm:text-base md:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-4 md:mb-8 max-w-lg"
              >
                {slides[currentSlide].description}
              </motion.p>
              
              {/* Statistics - Hidden on smallest screens */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden sm:grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-10"
              >
                {slides[currentSlide].stats.map((stat, index) => (
                  <div key={index}>
                    <div className={`text-xl md:text-2xl xl:text-3xl font-bold mb-0 md:mb-1 ${currentSlide === 0 ? 'text-primary' : `text-${slides[currentSlide].color.split('-')[1]}-500`}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
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
                className="flex flex-wrap gap-3 md:gap-4"
              >
                <Link href={
                  slides[currentSlide].ctaText === "Post a Job" && 
                  currentUser?.user.userType === "employer" ? 
                  "/post-job" : slides[currentSlide].ctaLink
                }>
                  <Button 
                    size="default" 
                    className={`${currentSlide === 0 ? 'bg-primary hover:bg-primary/90' : slides[currentSlide].color} font-medium group transition-all text-white md:text-base text-sm`}
                  >
                    {slides[currentSlide].ctaText}
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                {currentSlide === 1 && (
                  <ScrollLink href="/vacancy-form" className="block">
                    <Button 
                      size="default" 
                      variant="outline"
                      className="font-medium bg-white hover:bg-gray-50 text-gray-800 border-gray-200 md:text-base text-sm"
                    >
                      Hire Talent
                    </Button>
                  </ScrollLink>
                )}
                
                {currentSlide === 0 && !currentUser && (
                  <Link href="/auth?type=jobseeker">
                    <Button 
                      size="default" 
                      variant="outline" 
                      className="font-medium border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:text-base text-sm"
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
            className="w-full md:w-5/12 h-[380px] md:h-full relative overflow-hidden"
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
            
            {/* Floating card with call-to-action - Hidden on smallest screens */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hidden sm:block absolute bottom-8 right-4 left-4 md:left-auto md:right-8 md:bottom-8 md:w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg p-3 md:p-4 shadow-lg"
            >
              <div className="flex items-start">
                <div className={`${slides[currentSlide].color} rounded-full p-2 mr-3 text-white`}>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Ready to start?</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Join thousands who have already found their perfect career match.</div>
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
