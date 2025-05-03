import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export default function MinimalistTestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use this when no testimonials are available in the database
  const defaultTestimonials = [
    {
      id: 1,
      name: "Vincy John",
      role: "Client",
      content: "Experts Recruitment Services is an excellent agency for finding the right candidates for the job description, with a strong follow-up process to ensure seamless hiring",
      rating: 5,
      userId: null
    },
    {
      id: 2,
      name: "RAJENDRA LINGWAL",
      role: "Client",
      content: "True to their name, they are EXPERTs in their work and provide world class service to their clients. Dealing with them will only benefit us 👍",
      rating: 5,
      userId: null
    },
    {
      id: 3,
      name: "Akhila Sista",
      role: "Client",
      content: "Expert Recruitment is one of the best recruiting agency. They were incredibly supportive throughout my job search, helping me with everything from scheduling interviews to ultimately landing into the perfect job.",
      rating: 5,
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

  return (
    <div 
      className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 min-h-[280px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-primary/10 rounded-full blur-2xl"></div>
      
      <div className="z-10 relative p-8">
        <Quote className="h-10 w-10 text-primary/20 absolute top-6 left-6 opacity-80" />
        
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
            
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 mb-6 italic">
              "{testimonials[activeIndex].content}"
            </p>
            
            <div className="flex items-center">
              <Avatar className="mr-4 h-12 w-12 border-2 border-white shadow-md">
                <AvatarFallback className={`${avatarColors[activeIndex % avatarColors.length]} text-white`}>
                  {getInitials(testimonials[activeIndex].name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
                <p className="text-sm text-gray-600">
                  {testimonials[activeIndex].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity }}
          key={activeIndex}
        />
      </div>
      
      {/* Navigation */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}