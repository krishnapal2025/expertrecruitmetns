import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Briefcase, 
  Building, 
  FileText, 
  BookOpen,
  Search,
  Users
} from "lucide-react";
import { useInView } from "react-intersection-observer";

// Interactive card component with animations
function InteractiveCard({ title, description, icon: Icon, color, to }: { 
  title: string, 
  description: string, 
  icon: any, 
  color: string,
  to: string
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const gradientMap: Record<string, string> = {
    indigo: "from-indigo-600 to-indigo-400",
    green: "from-green-600 to-green-400",
    red: "from-red-600 to-red-400",
    yellow: "from-amber-600 to-amber-400",
    purple: "from-purple-600 to-purple-400",
  };

  const gradient = gradientMap[color] || "from-gray-600 to-gray-400";
  
  return (
    <Link href={to}>
      <motion.div
        className="relative h-full cursor-pointer perspective-1000"
        style={{
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={`card-body relative h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700`}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Gradient header */}
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradient}`}></div>
          
          <div className="p-6 flex flex-col h-full">
            {/* Icon and Title */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg transform transition-transform duration-300 hover:rotate-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              
              <motion.div
                className="absolute top-5 right-5 text-gray-400"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold mt-4 mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
            
            {/* Decorative elements */}
            <div className="mt-auto pt-4">
              <div className="space-y-1.5 mb-4">
                <div className={`h-1 w-16 bg-gradient-to-r ${gradient} opacity-50 rounded-full`}></div>
                <div className={`h-1 w-12 bg-gradient-to-r ${gradient} opacity-30 rounded-full`}></div>
                <div className={`h-1 w-8 bg-gradient-to-r ${gradient} opacity-20 rounded-full`}></div>
              </div>
              
              <div className="flex items-center text-sm font-medium">
                <span>Explore</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function Animated3DCards() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  const cardData = [
    {
      title: "Find Job",
      description: "Browse thousands of job openings across various industries and locations.",
      icon: Search,
      color: "indigo",
      to: "/job-board"
    },
    {
      title: "Hire Talent",
      description: "Connect with qualified professionals to build your perfect team.",
      icon: Users,
      color: "green",
      to: "/hire-talent"
    },
    {
      title: "Post a Job",
      description: "List your job openings and reach thousands of potential candidates.",
      icon: FileText,
      color: "red",
      to: "/post-job" 
    },
    {
      title: "Career Resources",
      description: "Access guides, tips and resources to advance your career journey.",
      icon: BookOpen,
      color: "yellow",
      to: "/blogs"
    },
    {
      title: "Explore Opportunities",
      description: "Discover exciting career paths and growth opportunities in various fields.",
      icon: Briefcase,
      color: "purple",
      to: "/sectors"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 overflow-hidden">
          <div className="absolute -left-32 top-1/3 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl"></div>
          <div className="absolute -right-32 top-2/3 w-80 h-80 rounded-full bg-blue-400/5 filter blur-3xl"></div>
          <div className="absolute left-1/2 top-1/4 w-40 h-40 rounded-full bg-purple-400/5 filter blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 w-24 h-24 rounded-full bg-amber-400/5 filter blur-2xl"></div>
          
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Featured Visual */}
          <motion.div 
            className="w-full lg:w-6/12 flex-shrink-0 h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl p-8 flex flex-col justify-center items-center">
              {/* Animated Elements */}
              <div className="relative w-full h-full">
                {/* Animated particles */}
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: Math.random() * 6 + 2,
                        height: Math.random() * 6 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.1,
                      }}
                      animate={{
                        y: [0, Math.random() * -30 - 10],
                        x: [0, Math.random() * 20 - 10],
                        opacity: [0.7, 0],
                      }}
                      transition={{
                        duration: Math.random() * 5 + 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Animated floating cards */}
                <div className="relative h-full w-full flex items-center justify-center">
                  {cardData.map((card, index) => {
                    const angle = (index / cardData.length) * Math.PI * 2;
                    const radius = 120;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <motion.div
                        key={index}
                        className="absolute"
                        style={{
                          left: "50%",
                          top: "50%",
                          marginLeft: -45,
                          marginTop: -45,
                        }}
                        animate={{
                          x: x,
                          y: y,
                          rotateZ: [0, 5, 0, -5, 0],
                          scale: [1, 1.05, 1, 0.95, 1],
                        }}
                        transition={{
                          x: { duration: 20, repeat: Infinity, repeatType: "reverse" },
                          y: { duration: 20, repeat: Infinity, repeatType: "reverse" },
                          rotateZ: { duration: 10, repeat: Infinity, repeatType: "reverse" },
                          scale: { duration: 8, repeat: Infinity, repeatType: "reverse" },
                          delay: index * 0.5,
                        }}
                      >
                        <div 
                          className={`w-[90px] h-[90px] rounded-2xl flex items-center justify-center bg-gradient-to-br from-${card.color === 'yellow' ? 'amber' : card.color}-600 to-${card.color === 'yellow' ? 'amber' : card.color}-400 shadow-lg`}
                        >
                          <card.icon className="h-10 w-10 text-white" />
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {/* Center Icon */}
                  <motion.div
                    className="relative z-10 bg-white rounded-full p-8 shadow-xl"
                    animate={{
                      scale: [1, 1.05, 1, 0.95, 1],
                      rotateZ: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Building className="h-16 w-16 text-primary" />
                  </motion.div>
                  
                  {/* Moving circles in background */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    style={{ width: "260px", height: "260px", left: "50%", top: "50%", marginLeft: -130, marginTop: -130 }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/10"
                    style={{ width: "320px", height: "320px", left: "50%", top: "50%", marginLeft: -160, marginTop: -160 }}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Interactive Cards */}
          <div className="w-full lg:w-6/12">
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Discover Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Career Move</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl">
                  Explore our interactive career tools designed to help you find opportunities, 
                  connect with employers, and advance your professional journey.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {cardData.map((card, index) => (
                  <motion.div key={index} variants={itemVariants} className="h-[220px]">
                    <InteractiveCard {...card} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}