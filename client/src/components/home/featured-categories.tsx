import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Featured job categories data with updated high-quality images
const categories = [
  {
    id: 1,
    name: "Technology",
    icon: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-blue-500",
    count: 1286,
    link: "/job-board?category=technology"
  },
  {
    id: 2,
    name: "Healthcare",
    icon: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-green-500",
    count: 879,
    link: "/job-board?category=healthcare"
  },
  {
    id: 3,
    name: "Finance",
    icon: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-purple-500",
    count: 754,
    link: "/job-board?category=finance"
  },
  {
    id: 4,
    name: "Marketing",
    icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-red-500",
    count: 621,
    link: "/job-board?category=marketing"
  },
  {
    id: 5,
    name: "Education",
    icon: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-amber-500",
    count: 512,
    link: "/job-board?category=education"
  },
  {
    id: 6,
    name: "Engineering",
    icon: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-teal-500",
    count: 489,
    link: "/job-board?category=engineering"
  },
  {
    id: 7,
    name: "Retail",
    icon: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-indigo-500",
    count: 378,
    link: "/job-board?category=retail"
  },
  {
    id: 8,
    name: "Legal",
    icon: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&h=400&auto=format&fit=crop",
    color: "bg-gray-600",
    count: 264,
    link: "/job-board?category=legal"
  }
];

// Animation variants
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
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function FeaturedCategories() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // For slider functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxVisibleItems = 4; // Max items visible in desktop view
  const maxIndex = Math.ceil(categories.length / maxVisibleItems) - 1;
  
  // Move slider to specific index
  const goToIndex = (index: number) => {
    if (index < 0) {
      setCurrentIndex(0);
    } else if (index > maxIndex) {
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex(index);
    }
  };
  
  // Auto scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < maxIndex) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);
  
  // Apply transform when index changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = 100 / maxVisibleItems;
      const slidePercent = currentIndex * slideWidth * maxVisibleItems;
      sliderRef.current.style.transform = `translateX(-${slidePercent}%)`;
    }
  }, [currentIndex]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Enhanced decorative elements */}
      <div className="absolute -left-32 top-1/3 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl"></div>
      <div className="absolute -right-32 top-2/3 w-80 h-80 rounded-full bg-blue-400/5 filter blur-3xl"></div>
      <div className="absolute left-1/2 top-1/4 w-40 h-40 rounded-full bg-purple-400/5 filter blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 w-24 h-24 rounded-full bg-amber-400/5 filter blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-block mb-3">
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              Discover Opportunities
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Explore <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-indigo-600 text-transparent">Job Categories</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
            Browse through our extensive range of job categories to find your perfect role
            across different industries and specializations.
          </p>
        </motion.div>

        {/* Category showcase with slider */}
        <div className="relative overflow-hidden mb-10">
          <motion.div 
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-in-out"
              style={{ width: `${(categories.length / maxVisibleItems) * 100}%` }}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  onMouseEnter={() => setHoveredId(category.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl border border-gray-100 dark:border-gray-700 p-2"
                  style={{ width: `${100 / categories.length * maxVisibleItems}%` }}
                >
                  <Link href={category.link}>
                    <div className="relative h-56 w-full overflow-hidden rounded-lg">
                      <img
                        src={category.icon}
                        alt={`${category.name} jobs`}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                      <div className={`absolute inset-0 ${category.color} opacity-40`}></div>
                      
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                        {category.count}+ jobs
                      </div>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                        <div className={`w-16 h-16 rounded-full ${category.color} bg-opacity-30 flex items-center justify-center mb-3 backdrop-blur-sm`}>
                          <span className="text-3xl font-bold">{category.name.charAt(0)}</span>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-center drop-shadow-md">{category.name}</h3>
                        
                        <motion.div 
                          className="mt-4 flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: hoveredId === category.id ? 1 : 0,
                            scale: hoveredId === category.id ? 1 : 0.8
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="mr-1 text-sm font-medium">Explore</span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Navigation buttons */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full h-10 w-10 p-0 opacity-80 hover:opacity-100"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => goToIndex(currentIndex + 1)}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full h-10 w-10 p-0 opacity-80 hover:opacity-100"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center"
        >
          <Link href="/job-board">
            <Button variant="outline" className="rounded-full px-6 group transition-all duration-300">
              <span className="mr-2">View all categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}