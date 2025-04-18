import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, AreaChart, BookOpen, Building, Briefcase, Landmark, Stethoscope, ShoppingBag, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function FeaturedCategories() {
  // Animation variants for staggered reveal
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Categories data with icon components
  const categories = [
    {
      id: 1,
      name: "Technology",
      icon: <AreaChart className="h-7 w-7" />,
      color: "bg-blue-500",
      count: 1250,
      link: "/job-board?category=technology",
      description: "Software, IT, Data Science, Cybersecurity"
    },
    {
      id: 2,
      name: "Finance",
      icon: <Landmark className="h-7 w-7" />,
      color: "bg-emerald-500",
      count: 842,
      link: "/job-board?category=finance",
      description: "Banking, Accounting, Investment, Insurance"
    },
    {
      id: 3,
      name: "Healthcare",
      icon: <Stethoscope className="h-7 w-7" />,
      color: "bg-red-500",
      count: 968,
      link: "/job-board?category=healthcare",
      description: "Medical, Nursing, Pharmacy, Mental Health"
    },
    {
      id: 4,
      name: "Education",
      icon: <BookOpen className="h-7 w-7" />,
      color: "bg-amber-500",
      count: 573,
      link: "/job-board?category=education",
      description: "Teaching, Administration, Research, Training"
    },
    {
      id: 5,
      name: "Marketing",
      icon: <AreaChart className="h-7 w-7" />,
      color: "bg-purple-500",
      count: 624,
      link: "/job-board?category=marketing",
      description: "Digital Marketing, PR, Social Media, Brand Management"
    },
    {
      id: 6,
      name: "Engineering",
      icon: <Briefcase className="h-7 w-7" />,
      color: "bg-teal-500",
      count: 489,
      link: "/job-board?category=engineering",
      description: "Civil, Mechanical, Electrical, Chemical"
    },
    {
      id: 7,
      name: "Retail",
      icon: <ShoppingBag className="h-7 w-7" />,
      color: "bg-indigo-500",
      count: 378,
      link: "/job-board?category=retail",
      description: "Sales, Customer Service, Merchandising, E-commerce"
    },
    {
      id: 8,
      name: "Legal",
      icon: <Scale className="h-7 w-7" />,
      color: "bg-gray-600",
      count: 246,
      link: "/job-board?category=legal",
      description: "Attorneys, Paralegals, Legal Consulting, Compliance"
    }
  ];
  
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Featured categories (top 4)
  const featuredCategories = categories.slice(0, 4);
  // Other categories
  const otherCategories = categories.slice(4);

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Decorative elements */}
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

        {/* Featured categories section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 inline-flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <Briefcase className="h-4 w-4" />
            </span>
            Featured Categories
          </h3>
          
          <motion.div 
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300"
              >
                <Link href={category.link} className="block h-full">
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-xl ${category.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    
                    <Badge className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white/90 shadow-sm">
                      {category.count}+ jobs
                    </Badge>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{category.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{category.description}</p>
                    
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span className="mr-1">Browse jobs</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${hoveredId === category.id ? 'translate-x-1' : ''}`} />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full ${category.color} opacity-10 -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-500`}></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* All categories section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 inline-flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <Building className="h-4 w-4" />
            </span>
            More Career Sectors
          </h3>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {otherCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300"
              >
                <Link href={category.link} className="block p-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg ${category.color} bg-opacity-20 flex items-center justify-center mr-4`}>
                      {category.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">{category.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{category.count}+ jobs</span>
                      </div>
                    </div>
                    
                    <div className="ml-2">
                      <ArrowRight className={`h-4 w-4 text-primary transition-transform duration-300 ${hoveredId === category.id ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/job-board">
            <Button variant="default" className="rounded-full px-6 group transition-all duration-300">
              <span className="mr-2">Browse All Job Categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}