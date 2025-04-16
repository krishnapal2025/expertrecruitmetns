import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

// Animation variants
const testimonialVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.8,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.8,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  }),
};

// Helper function to generate initials from a name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function AnimatedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Handle automatic slider
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials, isPaused]);

  // Handle navigation
  const handlePrev = () => {
    if (testimonials.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    if (testimonials.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

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
    <section className="relative overflow-hidden bg-gray-50 py-16 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Users Say</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Hear from job seekers and employers who have successfully connected through our platform.
          </p>
        </motion.div>

        <div 
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Slider */}
          <div className="mx-auto overflow-hidden rounded-xl bg-white p-1 shadow-lg dark:bg-gray-900">
            <div className="relative h-[400px] w-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={testimonialVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex h-full w-full flex-col md:flex-row"
                >
                  {/* Image Container */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-full md:w-2/5">
                    <img
                      src={"https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&h=600"}
                      alt={testimonials[currentIndex].name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Quote className="mb-4 h-12 w-12 text-primary/20" />
                      <div className="mb-6 flex">
                        {renderStars(testimonials[currentIndex].rating || 5)}
                      </div>
                      <p className="mb-6 text-lg italic leading-relaxed text-gray-700 dark:text-gray-300">
                        "{testimonials[currentIndex].content}"
                      </p>
                      <div className="flex items-center">
                        <Avatar className="mr-4 h-12 w-12">
                          <AvatarImage src={"https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&h=600"} />
                          <AvatarFallback>{getInitials(testimonials[currentIndex].name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold">{testimonials[currentIndex].name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonials[currentIndex].role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-primary hover:text-white dark:bg-gray-800 dark:hover:bg-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {/* Dots Indicators */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index
                      ? "bg-primary"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-primary hover:text-white dark:bg-gray-800 dark:hover:bg-primary"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute -top-24 left-0 right-0 z-0 opacity-5">
        <Quote className="mx-auto h-48 w-48 rotate-12 transform text-primary" />
      </div>
    </section>
  );
}