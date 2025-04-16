import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

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

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Handle automatic slider
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials, isPaused]);

  if (!testimonials.length) {
    return null;
  }

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

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Lunar pattern background */}
      <div className="absolute inset-0 pointer-events-none bg-lunar-grid"></div>
      <div className="absolute inset-0 pointer-events-none bg-stars-pattern opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 -mt-24 -mr-24 bg-gradient-lunar rounded-full blur-3xl opacity-15"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 -mb-24 -ml-24 bg-gradient-cosmic rounded-full blur-3xl opacity-20"></div>
      
      {/* Star elements */}
      <div className="star-lg animate-twinkle absolute top-[15%] right-[25%]"></div>
      <div className="star-md animate-twinkle absolute top-[40%] right-[10%]"></div>
      <div className="star-lg animate-twinkle absolute top-[65%] right-[30%]"></div>
      <div className="star-sm animate-twinkle absolute top-[20%] left-[15%]"></div>
      <div className="star-md animate-twinkle absolute top-[50%] left-[8%]"></div>
      <div className="star-lg animate-twinkle absolute top-[75%] left-[20%]"></div>
      
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
          <h2 className="mb-4 text-3xl font-bold md:text-5xl text-gradient-cosmic dark:text-gradient-cosmic">
            <span className="relative inline-block">
              What Our Users Say
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-secondary dark:bg-gradient-secondary"
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
              className="relative overflow-hidden glass-effect-fullmoon rounded-2xl shadow-lg min-h-[300px] border border-primary/10 hover-lift"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-gradient-secondary rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-gradient-accent rounded-full blur-3xl opacity-20"></div>
              <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-grid-pattern opacity-5"></div>
              
              <div className="z-10 relative p-8 md:p-10">
                <Quote className="h-10 w-10 text-primary/30 dark:text-primary/40 absolute top-6 left-6 opacity-80" />
                
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
                      <Avatar className="mr-4 h-14 w-14 border-2 border-white shadow-md ring-2 ring-primary/20">
                        <AvatarFallback className={`${avatarColors[activeIndex % avatarColors.length]} text-white animate-float`}>
                          {getInitials(testimonials[activeIndex].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
                        <div className="flex items-center">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mr-2">
                            Verified
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonials[activeIndex].role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
                <motion.div 
                  className="h-full bg-gradient-secondary"
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
                className="w-10 h-10 rounded-full glass-effect-crescent flex items-center justify-center text-white dark:text-white hover:bg-primary/5 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeIndex === index 
                        ? "bg-gradient-secondary w-12" 
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-8"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full glass-effect-crescent flex items-center justify-center text-white dark:text-white hover:bg-primary/5 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Stats and CTA Column */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-cosmic rounded-2xl p-8 shadow-md border border-primary/10 dark:border-primary/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-white">Join Our Success Stories</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="glass-effect-fullmoon rounded-lg p-4 shadow-md hover-lift">
                    <div className="text-3xl font-bold text-primary">94%</div>
                    <div className="text-sm text-slate-600">Microsoft Placement Rate</div>
                  </div>
                  
                  <div className="glass-effect-crescent rounded-lg p-4 shadow-md hover-lift">
                    <div className="text-3xl font-bold text-white">+32%</div>
                    <div className="text-sm text-white/80">Google Salary Increase</div>
                  </div>
                  
                  <div className="glass-effect-eclipse rounded-lg p-4 shadow-md hover-lift">
                    <div className="text-3xl font-bold text-white">14K+</div>
                    <div className="text-sm text-white/80">Amazon Hired Clients</div>
                  </div>
                  
                  <div className="glass-effect-newmoon rounded-lg p-4 shadow-md hover-lift">
                    <div className="text-3xl font-bold text-white">4.8/5</div>
                    <div className="text-sm text-white/80">Apple Client Rating</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-white text-primary hover:bg-white/90 group mt-2"
                  size="lg"
                >
                  Start Your Success Story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}