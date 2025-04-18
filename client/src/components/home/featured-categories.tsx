import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  ArrowRight, 
  Briefcase, 
  Heart, 
  Globe, 
  PieChart, 
  Lightbulb, 
  BookOpen, 
  Wrench, 
  ShoppingBag, 
  Scale,
  ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Enhanced job categories data with attractive imagery
const categories = [
  {
    id: 1,
    name: "Technology",
    icon: Globe,
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    color: "from-blue-600 to-blue-400",
    shadowColor: "shadow-blue-500/20",
    ringColor: "ring-blue-500/20",
    count: 1286,
    description: "Software, IT, Cloud, DevOps",
    link: "/job-board?category=technology"
  },
  {
    id: 2,
    name: "Healthcare",
    icon: Heart,
    bgImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1920&auto=format&fit=crop",
    color: "from-green-600 to-green-400",
    shadowColor: "shadow-green-500/20",
    ringColor: "ring-green-500/20",
    count: 879,
    description: "Medical, Nursing, Wellness",
    link: "/job-board?category=healthcare"
  },
  {
    id: 3,
    name: "Finance",
    icon: PieChart,
    bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1920&auto=format&fit=crop",
    color: "from-purple-600 to-purple-400",
    shadowColor: "shadow-purple-500/20",
    ringColor: "ring-purple-500/20",
    count: 754,
    description: "Banking, Investment, Insurance",
    link: "/job-board?category=finance"
  },
  {
    id: 4,
    name: "Marketing",
    icon: Lightbulb,
    bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop",
    color: "from-rose-600 to-rose-400",
    shadowColor: "shadow-rose-500/20",
    ringColor: "ring-rose-500/20",
    count: 621,
    description: "Digital, Branding, Growth",
    link: "/job-board?category=marketing"
  },
  {
    id: 5,
    name: "Education",
    icon: BookOpen,
    bgImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1920&auto=format&fit=crop",
    color: "from-amber-600 to-amber-400",
    shadowColor: "shadow-amber-500/20",
    ringColor: "ring-amber-500/20",
    count: 512,
    description: "Teaching, Training, E-learning",
    link: "/job-board?category=education"
  },
  {
    id: 6,
    name: "Engineering",
    icon: Wrench,
    bgImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1920&auto=format&fit=crop",
    color: "from-teal-600 to-teal-400",
    shadowColor: "shadow-teal-500/20",
    ringColor: "ring-teal-500/20",
    count: 489,
    description: "Civil, Mechanical, Electrical",
    link: "/job-board?category=engineering"
  },
  {
    id: 7,
    name: "Retail",
    icon: ShoppingBag,
    bgImage: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=1920&auto=format&fit=crop",
    color: "from-indigo-600 to-indigo-400",
    shadowColor: "shadow-indigo-500/20",
    ringColor: "ring-indigo-500/20",
    count: 378,
    description: "Sales, E-commerce, Merchandising",
    link: "/job-board?category=retail"
  },
  {
    id: 8,
    name: "Legal",
    icon: Scale,
    bgImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop",
    color: "from-slate-700 to-slate-500",
    shadowColor: "shadow-slate-500/20",
    ringColor: "ring-slate-500/20",
    count: 264,
    description: "Law, Compliance, Regulatory",
    link: "/job-board?category=legal"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95
  },
  visible: {
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function FeaturedCategories() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Artistic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Geometric patterns */}
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-900/10 mix-blend-multiply dark:mix-blend-soft-light opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-purple-50 dark:bg-purple-900/10 mix-blend-multiply dark:mix-blend-soft-light opacity-60"></div>
        <div className="absolute top-1/4 left-1/3 w-40 h-40 rounded-full bg-amber-50 dark:bg-amber-900/10 mix-blend-multiply dark:mix-blend-soft-light opacity-60"></div>
        
        {/* Decorative patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>
        
        {/* Dynamic gradient stripes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full transform rotate-45 opacity-30"></div>
        <div className="absolute top-1/4 right-0 w-96 h-32 bg-gradient-to-l from-blue-500/10 to-transparent transform -rotate-12 opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-t from-purple-500/10 to-transparent rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-semibold shadow-sm">
              Discover Opportunities
            </span>
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="block mb-1">Explore</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              Job Categories
            </span>
          </h2>
          <p className="mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
            Browse through our extensive range of job categories to find your perfect role
            across different industries and specializations.
          </p>
        </motion.div>
        
        {/* Banner Image with Call-to-Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-indigo-600/90 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1920&auto=format&fit=crop" 
            alt="Professionals collaborating" 
            className="w-full h-80 object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
            <div className="max-w-3xl">
              <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
                Find Your Dream Career Path
              </h3>
              <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who have found their ideal job through our platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/job-board">
                  <Button 
                    size="lg" 
                    className="bg-white hover:bg-white/90 text-primary hover:text-primary/90 border-0"
                  >
                    Browse All Jobs
                  </Button>
                </Link>
                <Link href="/post-job">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-500/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-l from-indigo-500/30 to-transparent"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border-4 border-white/20"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full border-4 border-white/20"></div>
        </motion.div>

        {/* Artistic featured categories */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              onHoverStart={() => setActiveId(category.id)}
              onHoverEnd={() => setActiveId(null)}
              onClick={() => setSelectedId(selectedId === category.id ? null : category.id)}
              className="group relative rounded-xl overflow-hidden"
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 200 } 
              }}
            >
              <Link href={category.link} className="block relative h-full">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 z-20`}></div>
                  <img 
                    src={category.bgImage} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="relative h-64 sm:h-80 p-6 z-30 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    {/* Icon and Title */}
                    <div className="flex flex-col space-y-2">
                      <div className={`p-3 bg-white bg-opacity-15 backdrop-blur-md rounded-xl ${category.shadowColor} shadow-lg transform transition-transform duration-300 group-hover:rotate-3`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white text-2xl font-bold tracking-tight mt-4">{category.name}</h3>
                      <p className="text-white/80 text-sm font-medium line-clamp-2">{category.description}</p>
                    </div>
                    
                    {/* Job count */}
                    <div className="bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5 text-white font-bold">
                      {category.count}
                      <span className="text-xs ml-1 opacity-70">jobs</span>
                    </div>
                  </div>
                  
                  {/* Bottom Content */}
                  <div className="pt-4">
                    {/* Animated Indicator Bars */}
                    <div className="space-y-1.5 mb-4">
                      <motion.div 
                        initial={{ width: "25%" }}
                        animate={{ width: activeId === category.id ? "65%" : "25%" }}
                        transition={{ duration: 0.5 }}
                        className="h-1 bg-white/80 rounded-full"
                      ></motion.div>
                      <motion.div 
                        initial={{ width: "45%" }}
                        animate={{ width: activeId === category.id ? "85%" : "45%" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-1 bg-white/60 rounded-full"
                      ></motion.div>
                      <motion.div 
                        initial={{ width: "30%" }}
                        animate={{ width: activeId === category.id ? "50%" : "30%" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-1 bg-white/40 rounded-full"
                      ></motion.div>
                    </div>
                    
                    {/* Explore button */}
                    <motion.div 
                      className="flex items-center mt-2"
                      initial={{ opacity: 0.9, x: 0 }}
                      animate={{ 
                        opacity: 1,
                        x: activeId === category.id ? 5 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white font-medium mr-2">Explore Careers</span>
                      <motion.div
                        animate={{ x: activeId === category.id ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronsRight className="h-5 w-5 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative Ring Effect */}
                <motion.div 
                  className={`absolute inset-0 rounded-xl ${category.ringColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ 
                    opacity: activeId === category.id ? 0.8 : 0,
                    scale: activeId === category.id ? 1 : 0.85
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.1) inset"
                  }}
                ></motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-center"
        >
          <Link href="/job-board">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 group transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-md"
            >
              <span className="mr-2 text-base">View all job categories</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}