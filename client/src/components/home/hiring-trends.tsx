import { useRef, useEffect } from "react";
import { ArrowUpRight, TrendingUp, Users, Globe, Code, Briefcase, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

// Sample hiring trends data with consistent image dimensions (800x450, 16:9 aspect ratio)
const trendingIndustries = [
  {
    id: 1,
    title: "Tech Growth Outlook",
    description: "Google & Microsoft AI engineers and NVIDIA data scientists see 35% higher demand in 2025",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&h=450&fit=crop",
    icon: <Code className="h-5 w-5" />,
    link: "/article/7"
  },
  {
    id: 2,
    title: "Remote Work Trends",
    description: "Amazon, GitLab & Spotify now offer 76% of positions as permanent remote across departments",
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?q=80&w=800&h=450&fit=crop",
    icon: <Globe className="h-5 w-5" />,
    link: "/article/8"
  },
  {
    id: 3,
    title: "Healthcare Expansion",
    description: "Mayo Clinic, Kaiser Permanente & Cleveland Clinic projected to add 1.5M jobs in five years",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&h=450&fit=crop",
    icon: <Users className="h-5 w-5" />,
    link: "/article/9"
  },
  {
    id: 4,
    title: "Sustainability Roles",
    description: "Tesla, Patagonia & Unilever ESG positions increased by 45% and lead Fortune 500 growth",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&h=450&fit=crop",
    icon: <TrendingUp className="h-5 w-5" />,
    link: "/article/10"
  },
  {
    id: 5,
    title: "Education Evolution",
    description: "Coursera, Udemy & Khan Academy EdTech specialists among fastest-growing education roles",
    image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=800&h=450&fit=crop",
    icon: <GraduationCap className="h-5 w-5" />,
    link: "/article/11"
  },
  {
    id: 6,
    title: "Gig Economy Expansion",
    description: "Upwork, Fiverr & Toptal freelance marketplace expected to represent 50% of workforce by 2027",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&h=450&fit=crop",
    icon: <Briefcase className="h-5 w-5" />,
    link: "/article/12"
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const InsightCard = ({ trend, index }: { trend: typeof trendingIndustries[0], index: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      <div className="relative overflow-hidden h-48">
        {/* Fixed height image container */}
        <img 
          src={trend.image} 
          alt={trend.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center justify-center rounded-full bg-primary p-2.5 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110">
          {trend.icon}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
          {trend.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex-grow">
          {trend.description}
        </p>
        <Link href={trend.link} className="group/link inline-flex items-center text-sm font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors self-start mt-auto">
          Read more 
          <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function HiringTrends() {
  const [containerRef, containerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const statsRef = useRef<HTMLDivElement>(null);
  
  // Animation for statistics counting up
  useEffect(() => {
    if (containerInView && statsRef.current) {
      const counters = statsRef.current.querySelectorAll('.stat-counter');
      
      counters.forEach((counter: Element) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 16)); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.textContent = current.toLocaleString();
          }
        }, 16);
      });
    }
  }, [containerInView]);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOS0uNiAyLjEtLjYgMy4yIDAgMS4yIDEuNSAyLjQuNiAzLjItLjkuOS0yIDEuMy0zLjIgMS4zLTEuMiAwLTIuMy0uNS0zLjItMS4zLS45LS45LjYtMi4xLjYtMy4yIDAtMS4yLTEuNS0yLjQtLjYtMy4yLjktLjggMi0xLjMgMy4yLTEuM3oiIHN0cm9rZT0icmdiYSgxNDcsIDUxLCAyMzQsIDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-500/5 mix-blend-multiply"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 left-[15%] w-72 h-72 rounded-full bg-purple-500/5 mix-blend-multiply"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        {/* Title Section with Animated Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center relative"
        >
          <div className="relative inline-block mb-4">
            <motion.div 
              className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative z-10 bg-white dark:bg-gray-800 text-primary px-5 py-2 rounded-full text-sm font-semibold shadow-sm border border-primary/10">
              Market Intelligence
            </span>
          </div>
          
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight">
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Industry Insights
              </span>
              <motion.span 
                className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full" 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </span>
            <span className="text-gray-700 dark:text-gray-200"> & Blogs</span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8">
            Stay ahead with the curated industry trends, expert perspectives, and the latest professional insights 
            to navigate your professional journey.
          </p>
          
        </motion.div>

        {/* Industry insights cards with visual enhancements */}
        <div className="py-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Industry <span className="text-primary">Insights</span>
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trendingIndustries.map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 50 }}
                animate={containerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl transition-all duration-500 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                  {/* Enhanced image container with artistic overlay */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img 
                      src={trend.image} 
                      alt={trend.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
                    
                    {/* Dynamic corner accent */}
                    <motion.div 
                      className="absolute -top-10 -right-10 w-20 h-20 bg-primary/80 rotate-45 origin-bottom-left"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    
                    {/* Floating industry indicator */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full py-1 px-3 text-xs font-medium text-primary shadow-lg flex items-center space-x-1">
                      {trend.icon}
                      <span className="ml-1">Trending Industry</span>
                    </div>
                    
                    {/* Company logos visualization */}
                    <div className="absolute bottom-4 left-4 flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-white flex items-center justify-center text-xs text-primary font-bold shadow-lg"
                        >
                          {trend.title.charAt(i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg">
                        +
                      </div>
                    </div>
                  </div>
                  
                  {/* Content area with enhanced styling */}
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                        {trend.title}
                      </h3>
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        {trend.icon}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 pr-4">
                      {trend.description}
                    </p>
                    
                    {/* Visual data representation */}
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Industry Growth</span>
                        <span className="font-medium">{20 + (index * 5)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${20 + (index * 5)}%` }}
                          transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                        ></motion.div>
                      </div>
                    </div>
                    
                    <Link href={trend.link} className="group/link inline-flex items-center text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-colors duration-300">
                      <span>View Trends</span>
                      <motion.span 
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}