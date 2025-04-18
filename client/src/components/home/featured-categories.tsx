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
  
  // Categories data with icon components and images
  const categories = [
    {
      id: 1,
      name: "Technology",
      icon: <AreaChart className="h-7 w-7" />,
      color: "bg-blue-500",
      count: 1250,
      link: "/job-board?category=technology",
      description: "Software, IT, Data Science, Cybersecurity",
      image: "https://images.unsplash.com/photo-1581092335397-9fa73e0794d5?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Finance",
      icon: <Landmark className="h-7 w-7" />,
      color: "bg-emerald-500",
      count: 842,
      link: "/job-board?category=finance",
      description: "Banking, Accounting, Investment, Insurance",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Healthcare",
      icon: <Stethoscope className="h-7 w-7" />,
      color: "bg-red-500",
      count: 968,
      link: "/job-board?category=healthcare",
      description: "Medical, Nursing, Pharmacy, Mental Health",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Education",
      icon: <BookOpen className="h-7 w-7" />,
      color: "bg-amber-500",
      count: 573,
      link: "/job-board?category=education",
      description: "Teaching, Administration, Research, Training",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Marketing",
      icon: <AreaChart className="h-7 w-7" />,
      color: "bg-purple-500",
      count: 624,
      link: "/job-board?category=marketing",
      description: "Digital Marketing, PR, Social Media, Brand Management",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Engineering",
      icon: <Briefcase className="h-7 w-7" />,
      color: "bg-teal-500",
      count: 489,
      link: "/job-board?category=engineering",
      description: "Civil, Mechanical, Electrical, Chemical",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Retail",
      icon: <ShoppingBag className="h-7 w-7" />,
      color: "bg-indigo-500",
      count: 378,
      link: "/job-board?category=retail",
      description: "Sales, Customer Service, Merchandising, E-commerce",
      image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=600&h=400&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Legal",
      icon: <Scale className="h-7 w-7" />,
      color: "bg-gray-600",
      count: 246,
      link: "/job-board?category=legal",
      description: "Attorneys, Paralegals, Legal Consulting, Compliance",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&h=400&auto=format&fit=crop"
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
          className="mb-16 text-center relative"
        >
          {/* Artistic elements */}
          <div className="absolute left-1/4 -top-10 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute right-1/4 -top-5 w-16 h-16 bg-gradient-to-br from-primary/5 to-purple-500/10 rounded-full filter blur-lg"></div>
          
          <div className="inline-block mb-3 relative">
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Discover Opportunities
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl relative">
            Explore <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-indigo-600 text-transparent">Job Categories</span>
            <div className="absolute -right-2 top-0 w-4 h-4 bg-gradient-to-br from-primary to-indigo-600 rounded-full opacity-70 animate-ping"></div>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg relative z-10">
            Browse through our extensive range of job categories to find your perfect role
            across different industries and specializations.
          </p>
          
          {/* Subtle underline */}
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full mx-auto mt-6 mb-4"></div>
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
                  {/* Image background with overlay */}
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={`${category.name} jobs`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
                    <div className={`absolute inset-0 ${category.color} opacity-40 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    
                    {/* Count badge */}
                    <Badge className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white hover:bg-white/90 shadow-sm">
                      {category.count}+ jobs
                    </Badge>
                    
                    {/* Category name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-md">{category.name}</h3>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg ${category.color} bg-opacity-20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        {category.icon}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
                    </div>
                    
                    <div className="flex items-center text-primary font-medium text-sm mt-auto">
                      <span className="mr-1">Browse jobs</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${hoveredId === category.id ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full ${category.color} opacity-10 -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-500`}></div>
                  <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-full ${category.color} opacity-10 -ml-6 -mb-6 group-hover:scale-125 transition-transform duration-500`}></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* All categories section */}
        <div className="mb-12">
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {otherCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -5, x: 5, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300"
              >
                <Link href={category.link} className="block">
                  <div className="flex p-0">
                    {/* Image section */}
                    <div className="relative w-1/3 overflow-hidden h-full">
                      <div className="absolute inset-0">
                        <img 
                          src={category.image} 
                          alt={`${category.name} jobs`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                        <div className={`absolute inset-0 ${category.color} opacity-40 group-hover:opacity-50 transition-opacity duration-300`}></div>
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex items-start mb-2">
                        <div className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">{category.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{category.count}+ jobs</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">{category.description}</p>
                      
                      <div className="flex items-center text-primary font-medium text-sm mt-auto">
                        <span className="mr-1">View openings</span>
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${hoveredId === category.id ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className={`absolute bottom-0 right-0 w-16 h-16 rounded-tl-full ${category.color} opacity-10 -mr-4 -mb-4 group-hover:scale-125 transition-transform duration-500`}></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Visual divider */}
        <div className="relative py-8 mb-8">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-indigo-600"></div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-10 relative"
        >
          {/* Decorative elements */}
          <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-primary/10 to-indigo-500/5 rounded-full filter blur-xl"></div>
          
          <Link href="/job-board">
            <Button 
              variant="default" 
              className="rounded-full px-8 py-6 group transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg hover:shadow-primary/20 border-0"
            >
              <div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-40 animate-pulse transition-opacity duration-300"></div>
              <span className="relative text-white font-medium mr-2 z-10">Browse All Job Categories</span>
              <ArrowRight className="h-5 w-5 relative text-white z-10 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <span className="w-1 h-1 rounded-full bg-primary mr-2"></span>
              Discover over <span className="text-primary font-medium mx-1">4,500+</span> jobs across all sectors
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}