import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Briefcase, 
  Clock, 
  Heart, 
  TrendingUp, 
  Code, 
  Star, 
  Zap, 
  BookOpen, 
  Globe
} from 'lucide-react';

// Define industry data with 3D images
const industries = [
  {
    id: 1,
    title: "Technology",
    primaryColor: "#4f46e5",
    secondaryColor: "#818cf8",
    description: "Join innovative tech companies building tomorrow's solutions",
    image: "https://images.unsplash.com/photo-1581092921461-fd0e43f5e568?q=80&w=1000&auto=format&fit=crop",
    icon: Code,
    stats: {
      jobs: 1846,
      growth: "+27%",
      avgSalary: "$95,000"
    },
    skills: ["Programming", "Cloud", "AI/ML", "DevOps"],
    link: "/job-board?category=technology"
  },
  {
    id: 2,
    title: "Healthcare",
    primaryColor: "#0ea5e9",
    secondaryColor: "#7dd3fc",
    description: "Make a difference in people's lives through healthcare careers",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1000&auto=format&fit=crop",
    icon: Heart,
    stats: {
      jobs: 1375,
      growth: "+18%",
      avgSalary: "$88,000"
    },
    skills: ["Patient Care", "Medical", "Research", "Diagnostics"],
    link: "/job-board?category=healthcare"
  },
  {
    id: 3,
    title: "Finance",
    primaryColor: "#10b981",
    secondaryColor: "#6ee7b7",
    description: "Navigate the world of finance with exciting career opportunities",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop",
    icon: TrendingUp,
    stats: {
      jobs: 1142,
      growth: "+14%",
      avgSalary: "$92,000"
    },
    skills: ["Analysis", "Investment", "Banking", "Risk Management"],
    link: "/job-board?category=finance"
  }
];

// 3D Scene Element
const Scene3D: React.FC<{className?: string}> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* 3D floating elements */}
      {[...Array(10)].map((_, i) => {
        const size = Math.floor(Math.random() * 40) + 10;
        const xPos = Math.floor(Math.random() * 100);
        const yPos = Math.floor(Math.random() * 100);
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;
        const startScale = 0.5 + Math.random() * 0.5;
        
        return (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-white/5 backdrop-blur-md border border-white/10"
            style={{ 
              width: size, 
              height: size, 
              left: `${xPos}%`, 
              top: `${yPos}%`,
              zIndex: Math.floor(Math.random() * 3) - 1
            }}
            initial={{ 
              scale: startScale, 
              opacity: 0.1, 
              rotate: 0,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [startScale, startScale * 1.2, startScale],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 180, 360],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: duration,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
      
      {/* 3D gradient spheres */}
      <motion.div 
        className="absolute -left-[10%] top-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute -right-[10%] top-[50%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-blue-500/10 to-emerald-500/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      <motion.div 
        className="absolute left-[40%] bottom-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-amber-500/15 to-rose-500/10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 20, 0],
          y: [0, 20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

// 3D Card with parallax effect
const Card3D: React.FC<{
  industry: typeof industries[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ industry, isActive, onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });
  };
  
  const resetMousePosition = () => {
    setMousePosition({ x: 0, y: 0 });
  };
  
  // Calculate rotation and transform based on mouse position
  const rotateX = mousePosition.y * 10; // Limit rotation
  const rotateY = mousePosition.x * -10; // Reverse X for natural feeling
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer mb-6 ${isActive ? 'z-20' : 'z-10'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMousePosition}
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1,
        transition: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.05 }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
    >
      <div className={`h-full relative overflow-hidden rounded-xl border-2 ${isActive ? 'border-white/20 shadow-2xl' : 'border-transparent shadow-xl'} transition-all duration-300`}>
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, ${industry.primaryColor} 0%, ${industry.secondaryColor} 100%)`,
          }}
        >
          {/* Animated gradient movement */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            }}
          />
        </div>
        
        {/* Content with 3D depth */}
        <div className="relative p-6 h-full flex flex-col z-10">
          {/* 3D Icon with floating animation */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4 w-14 h-14 flex items-center justify-center shadow-lg"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)" // Push out of card for 3D effect
            }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
          >
            <industry.icon className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Title with 3D effect */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            style={{ transform: "translateZ(30px)" }}
          >
            {industry.title}
          </motion.h3>
          
          <motion.p 
            className="text-white/90 mb-4"
            style={{ transform: "translateZ(20px)" }}
          >
            {industry.description}
          </motion.p>
          
          {/* Stats with 3D hover effect */}
          <div 
            className="grid grid-cols-3 gap-2 mb-6"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="bg-black/10 backdrop-blur-md rounded-lg p-3 text-center">
              <div className="text-white font-bold">{industry.stats.jobs}</div>
              <div className="text-white/80 text-xs">Jobs</div>
            </div>
            <div className="bg-black/10 backdrop-blur-md rounded-lg p-3 text-center">
              <div className="text-white font-bold">{industry.stats.growth}</div>
              <div className="text-white/80 text-xs">Growth</div>
            </div>
            <div className="bg-black/10 backdrop-blur-md rounded-lg p-3 text-center">
              <div className="text-white font-bold">{industry.stats.avgSalary}</div>
              <div className="text-white/80 text-xs">Avg Salary</div>
            </div>
          </div>
          
          {/* Skills section */}
          <div 
            className="flex flex-wrap gap-2 mb-6"
            style={{ transform: "translateZ(25px)" }}
          >
            {industry.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/15 text-white"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* Explore button with 3D effect */}
          <motion.div 
            className="mt-auto"
            style={{ transform: "translateZ(50px)" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <Link href={industry.link}>
              <Button className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-full py-6 font-semibold flex items-center justify-center group">
                <span>Explore {industry.title} Jobs</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent"></div>
        
        {/* Image overlay with depth effect */}
        {isActive && (
          <motion.div 
            className="absolute right-0 bottom-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            style={{ 
              backgroundImage: `url(${industry.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: "translateZ(10px)" 
            }}
          />
        )}
      </div>
      
      {/* 3D shadow effect */}
      <motion.div 
        className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl blur-md -z-10"
        animate={{
          opacity: isActive ? 1 : 0.5
        }}
      />
    </motion.div>
  );
};

// 3D Stat Counter
const StatCounter: React.FC<{
  start: number;
  end: number;
  duration: number;
  label: string;
  icon: React.ComponentType<any>;
  delay?: number;
  color: string;
}> = ({ 
  start, 
  end, 
  duration, 
  label, 
  icon: Icon, 
  delay = 0,
  color
}) => {
  const [count, setCount] = useState(start);
  const [countStarted, setCountStarted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3
  });
  
  useEffect(() => {
    if (inView && !countStarted) {
      setCountStarted(true);
      
      // Delay start if specified
      const timer = setTimeout(() => {
        let startTime: number;
        let animationFrame: number;
        
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
          setCount(Math.floor(progress * (end - start) + start));
          
          if (progress < 1) {
            animationFrame = requestAnimationFrame(step);
          }
        };
        
        animationFrame = requestAnimationFrame(step);
        
        // Cleanup
        return () => cancelAnimationFrame(animationFrame);
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inView, countStarted, start, end, duration, delay]);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.7, delay: delay }}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
    >
      {/* Glass gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 dark:from-gray-800/50 dark:to-gray-800/20 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>
      
      <div className="relative">
        <div className="mb-4">
          <div 
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold mr-1">{countStarted ? count.toLocaleString() : start.toLocaleString()}</span>
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">+</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mt-1">{label}</p>
      </div>
      
      {/* 3D bottom shadow */}
      <div className="absolute -bottom-2 inset-x-4 h-2 bg-black/5 blur-md rounded-full"></div>
    </motion.div>
  );
};

export default function ExploreOpportunities3D() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0].id);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Automatic rotation of active industry
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndustry(current => {
        const currentIndex = industries.findIndex(industry => industry.id === current);
        const nextIndex = (currentIndex + 1) % industries.length;
        return industries[nextIndex].id;
      });
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* 3D animated background scene */}
      <Scene3D />
      
      {/* Glass background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-white/80 dark:from-gray-900/80 dark:via-gray-900/95 dark:to-gray-900/80 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with 3D effect */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 rounded-full px-3 py-1 bg-gradient-to-r from-primary/10 to-indigo-500/10 backdrop-blur-sm text-primary border border-primary/20"
          >
            <span className="text-sm font-semibold">Discover Your Future</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <motion.span 
              className="block mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Explore Amazing
            </motion.span>
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 inline-block relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Career Opportunities
              {/* 3D text shadow */}
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-primary/20 to-indigo-600/20 blur-md"></span>
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Discover exciting positions across top industries and take the next step in your professional journey.
          </motion.p>
        </motion.div>
        
        {/* 3D Industry Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {industries.map((industry) => (
            <Card3D 
              key={industry.id}
              industry={industry}
              isActive={activeIndustry === industry.id}
              onClick={() => setActiveIndustry(industry.id)}
            />
          ))}
        </div>
        
        {/* 3D Stats with counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCounter 
              start={0}
              end={25000}
              duration={2.5}
              delay={0.2}
              label="Job Opportunities"
              icon={Briefcase}
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <StatCounter 
              start={0}
              end={8500}
              duration={2.5}
              delay={0.4}
              label="Companies Hiring"
              icon={Building}
              color="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatCounter 
              start={0}
              end={15000}
              duration={2.5}
              delay={0.6}
              label="Career Placements"
              icon={Star}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
            />
            <StatCounter 
              start={0}
              end={97}
              duration={2.5}
              delay={0.8}
              label="Satisfaction Rate"
              icon={Zap}
              color="bg-gradient-to-br from-rose-500 to-red-600"
            />
          </div>
        </motion.div>
        
        {/* 3D CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-primary/90 to-indigo-600/90 rounded-2xl p-10 md:p-16 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* Animated particles */}
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 8 + 2;
              const initialX = Math.random() * 100;
              const initialY = Math.random() * 100;
              const duration = Math.random() * 20 + 10;
              const delay = Math.random() * 10;
              
              return (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${initialX}%`,
                    top: `${initialY}%`,
                    opacity: Math.random() * 0.5
                  }}
                  animate={{
                    y: [0, -100, 0],
                    x: [0, Math.random() * 50 - 25, 0],
                    opacity: [0, Math.random() * 0.5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: duration,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            
            <div className="relative z-10 max-w-2xl">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                Ready to Take the Next Step in Your Career?
              </motion.h3>
              
              <motion.p 
                className="text-white/90 text-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Join thousands of professionals who have found their dream jobs through our platform. Create your profile today and get matched with opportunities that align with your skills and career goals.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <Link href="/job-board">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-primary rounded-full py-6 px-8 font-semibold text-lg">
                    Browse All Jobs
                  </Button>
                </Link>
                
                <Link href="/profile-page">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full py-6 px-8 font-semibold text-lg">
                    Create Profile
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* 3D decorative icon */}
            <motion.div 
              className="absolute right-10 bottom-10 hidden lg:block"
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ 
                opacity: 0.2, 
                scale: 1,
                rotate: 0,
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{
                opacity: { delay: 1.8, duration: 1 },
                scale: { delay: 1.8, duration: 1 },
                rotate: { delay: 1.8, duration: 1 },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                x: { repeat: Infinity, duration: 8, ease: "easeInOut" }
              }}
            >
              <Globe className="w-48 h-48 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Additional components needed for the 3D effect
const Building = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="2" />
    <line x1="15" y1="22" x2="15" y2="2" />
    <line x1="4" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="20" y2="12" />
  </svg>
);