import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

// Featured job categories data
const categories = [
  {
    id: 1,
    name: "Technology",
    icon: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=300",
    color: "bg-blue-500",
    count: 1286,
    link: "/job-board?category=technology"
  },
  {
    id: 2,
    name: "Healthcare",
    icon: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&h=300",
    color: "bg-green-500",
    count: 879,
    link: "/job-board?category=healthcare"
  },
  {
    id: 3,
    name: "Finance",
    icon: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300",
    color: "bg-purple-500",
    count: 754,
    link: "/job-board?category=finance"
  },
  {
    id: 4,
    name: "Marketing",
    icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=300",
    color: "bg-red-500",
    count: 621,
    link: "/job-board?category=marketing"
  },
  {
    id: 5,
    name: "Education",
    icon: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400&h=300",
    color: "bg-amber-500",
    count: 512,
    link: "/job-board?category=education"
  },
  {
    id: 6,
    name: "Engineering",
    icon: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&h=300",
    color: "bg-teal-500",
    count: 489,
    link: "/job-board?category=engineering"
  },
  {
    id: 7,
    name: "Retail",
    icon: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=400&h=300",
    color: "bg-indigo-500",
    count: 378,
    link: "/job-board?category=retail"
  },
  {
    id: 8,
    name: "Legal",
    icon: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&h=300",
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

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute -left-32 top-1/3 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl"></div>
      <div className="absolute -right-32 top-2/3 w-80 h-80 rounded-full bg-blue-400/5 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-block mb-3">
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              Discover Opportunities
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Explore <span className="text-primary">Job Categories</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
            Browse through our extensive range of job categories to find your perfect role
            across different industries and specializations.
          </p>
        </motion.div>

        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              <Link href={category.link}>
                <div className="relative aspect-w-4 aspect-h-3">
                  <img
                    src={category.icon}
                    alt={`${category.name} jobs`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-60 ${category.color}`}></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                    <h3 className="mb-2 text-xl font-bold text-center">{category.name}</h3>
                    <p className="text-sm">{category.count} open positions</p>
                    
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
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/job-board">
            <span className="inline-flex items-center text-primary hover:underline">
              View all categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}