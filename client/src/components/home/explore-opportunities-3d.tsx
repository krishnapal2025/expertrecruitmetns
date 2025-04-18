import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Search, MapPin, Award, CheckCircle } from 'lucide-react';

// 3D-style career opportunity cards with animated features
const careerOpportunities = [
  {
    id: 1,
    title: "Technology",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop",
    description: "Explore cutting-edge tech roles that shape the future.",
    icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&auto=format&fit=crop",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    hoverColor: "hover:from-blue-600 hover:to-indigo-700",
    link: "/job-board?category=technology",
    count: 1250,
    tags: ["Software", "DevOps", "Data Science"]
  },
  {
    id: 2,
    title: "Finance",
    image: "https://images.unsplash.com/photo-1638913660106-73b4bac0db09?q=80&w=800&auto=format&fit=crop",
    description: "Build a rewarding career in global finance and banking.",
    icon: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=200&auto=format&fit=crop",
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    hoverColor: "hover:from-emerald-600 hover:to-green-700",
    link: "/job-board?category=finance",
    count: 856,
    tags: ["Banking", "Investment", "Analysis"]
  },
  {
    id: 3,
    title: "Healthcare",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    description: "Make a difference in the lives of others through healthcare.",
    icon: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200&auto=format&fit=crop",
    color: "bg-gradient-to-br from-red-500 to-rose-600",
    hoverColor: "hover:from-red-600 hover:to-rose-700",
    link: "/job-board?category=healthcare",
    count: 732,
    tags: ["Medical", "Research", "Nursing"]
  }
];

// 3D rotation effect for cards
const Card3D = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    // Calculate rotation based on mouse position
    // Adjust divisors to control sensitivity of the rotation
    const rotX = ((y - rect.height / 2) / 10) * -1;
    const rotY = (x - rect.width / 2) / 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
    setScale(1.05);
  };

  const handleMouseLeave = () => {
    // Reset card position with smooth transition
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <div 
      className={`relative transform-gpu transition-all duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Main component
export default function ExploreOpportunities3D() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* 3D Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Abstract 3D shapes */}
        <div className="absolute top-20 left-10 w-60 h-60 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-yellow-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YTEyIDEyIDAgMCAxIDEyIDEyaC02eiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-[0.15] dark:opacity-[0.05]"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Section header with 3D text effect */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { duration: 0.8 }
              }
            }}
            className="relative z-10"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-sm relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 relative">
                Explore Opportunities
              </span>
              <motion.div 
                className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-primary/20 to-indigo-600/20 blur-sm"
                animate={{
                  x: [0, 2, 0],
                  y: [0, 1, 0],
                  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                Explore Opportunities
              </motion.div>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exciting career paths and find your perfect role in these thriving industries.
            </p>
          </motion.div>
          
          {/* Floating 3D icons */}
          <motion.div 
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="absolute top-0 right-1/4 -mt-10 hidden md:block"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transform rotate-12">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
          
          <motion.div 
            variants={{
              ...floatingAnimation,
              animate: {
                y: [0, -10, 0],
                transition: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }
            }}
            initial="initial"
            animate="animate"
            className="absolute top-10 left-1/4 hidden md:block"
          >
            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center transform -rotate-6">
              <Search className="w-5 h-5 text-indigo-500" />
            </div>
          </motion.div>
          
          <motion.div 
            variants={{
              ...floatingAnimation,
              animate: {
                y: [0, -8, 0],
                transition: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }
            }}
            initial="initial"
            animate="animate"
            className="absolute bottom-0 right-1/5 hidden md:block"
          >
            <div className="w-8 h-8 bg-rose-500/10 rounded-full flex items-center justify-center transform rotate-12">
              <MapPin className="w-4 h-4 text-rose-500" />
            </div>
          </motion.div>
        </div>
        
        {/* 3D Career Cards */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {careerOpportunities.map((opportunity) => (
            <motion.div
              key={opportunity.id}
              variants={itemVariants}
              className="relative h-full"
            >
              <Link href={opportunity.link}>
                <Card3D className="group rounded-xl overflow-hidden h-full shadow-xl hover:shadow-2xl cursor-pointer">
                  {/* Card Content with 3D Perspective */}
                  <div className="relative h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    {/* 3D Layered Header */}
                    <div className="h-48 relative overflow-hidden">
                      {/* Background Image */}
                      <img 
                        src={opportunity.image} 
                        alt={opportunity.title} 
                        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 ${opportunity.color} opacity-80 transition-opacity duration-300 group-hover:opacity-90`}></div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className="rounded-lg bg-white/20 backdrop-blur-md p-2">
                            <span className="text-white font-semibold text-sm">
                              {opportunity.count}+ Jobs
                            </span>
                          </div>
                          
                          <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-lg"
                          >
                            <img 
                              src={opportunity.icon} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        </div>
                        
                        <h3 className="text-white text-2xl font-bold mt-4 drop-shadow-md transform transition-transform duration-300 group-hover:translate-x-2">
                          {opportunity.title}
                        </h3>
                      </div>
                      
                      {/* 3D Edge */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/20 transform -skew-y-1 origin-left"></div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-6 relative">
                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {opportunity.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {opportunity.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* 3D Button */}
                      <div className="absolute bottom-6 right-6">
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`${opportunity.color} ${opportunity.hoverColor} px-4 py-2 rounded-full text-white font-medium shadow-lg transform transition-transform duration-300 flex items-center space-x-1`}
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* 3D Ribbon in corner */}
                    <div className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden">
                      <div className={`${opportunity.color} shadow-lg transform rotate-45 origin-bottom-left w-14 h-28 absolute top-0 right-0 translate-x-7 -translate-y-7`}>
                        <span className="absolute bottom-5 right-1 transform rotate-45 text-xs font-bold text-white">NEW</span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 3D Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden mb-16"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] mix-blend-overlay"></div>
          
          {/* 3D Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white relative">
                  Why Explore With Us
                  <div className="absolute -bottom-2 left-0 h-1 w-12 bg-primary rounded-full"></div>
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We connect talented professionals with outstanding opportunities across industries, providing the tools and resources needed to advance your career or find the perfect team member.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Access to thousands of exclusive job listings",
                    "Personalized job matching to your skills",
                    "Direct connections with top employers",
                    "Career development resources and support"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      className="flex items-start"
                    >
                      <div className="mt-1 mr-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8"
                >
                  <Button 
                    className="rounded-full px-6 py-6 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <span className="mr-2">Explore All Industries</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              <div className="md:w-1/2 relative">
                {/* 3D Stats Display */}
                <div className="relative h-full flex flex-col justify-center">
                  {/* 3D Stacked Cards Effect */}
                  <motion.div 
                    initial={{ y: 60, opacity: 0, rotateX: 80 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                    className="relative z-20"
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Leading Industries</h4>
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { name: "Technology", value: 35, color: "bg-blue-500" },
                          { name: "Healthcare", value: 25, color: "bg-green-500" },
                          { name: "Finance", value: 20, color: "bg-purple-500" },
                          { name: "Marketing", value: 15, color: "bg-rose-500" }
                        ].map((stat, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{stat.name}</span>
                              <span className="text-sm font-medium">{stat.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                transition={{ delay: 1 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                                className={`h-2.5 rounded-full ${stat.color}`}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Shadow card underneath for 3D effect */}
                  <div className="absolute top-4 left-4 right-4 bottom-0 bg-primary/5 dark:bg-primary/10 rounded-xl border border-gray-200 dark:border-gray-700 -z-10"></div>
                  <div className="absolute top-8 left-8 right-8 bottom-4 bg-primary/5 dark:bg-primary/5 rounded-xl border border-gray-200 dark:border-gray-700 -z-20"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Testimonial with 3D elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-indigo-500/5 rounded-2xl p-8 md:p-10 relative"
          >
            {/* Decorative Quotes */}
            <div className="absolute top-6 left-6 text-6xl text-primary/20 font-serif">"</div>
            <div className="absolute bottom-6 right-6 text-6xl text-primary/20 font-serif transform rotate-180">"</div>
            
            <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium italic mb-6">
              My career journey completely transformed after discovering this platform. The opportunities and connections I found here led me to my dream role at a leading tech company.
            </blockquote>
            
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                  alt="Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">Sarah Johnson</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Senior UX Designer at TechCorp</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}