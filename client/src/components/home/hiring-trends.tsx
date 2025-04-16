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
    description: "AI, machine learning, and data science professionals see 35% higher demand in 2025",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&h=450&fit=crop",
    icon: <Code className="h-5 w-5" />,
    link: "/sectors/tech"
  },
  {
    id: 2,
    title: "Remote Work Trends",
    description: "76% of companies now offer permanent remote positions across all departments",
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?q=80&w=800&h=450&fit=crop",
    icon: <Globe className="h-5 w-5" />,
    link: "/blogs/remote-work"
  },
  {
    id: 3,
    title: "Healthcare Expansion",
    description: "Healthcare sector projected to add 1.5 million new jobs over the next five years",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&h=450&fit=crop",
    icon: <Users className="h-5 w-5" />,
    link: "/sectors/healthcare"
  },
  {
    id: 4,
    title: "Sustainability Roles",
    description: "ESG and sustainability positions increased by 45% in Fortune 500 companies",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&h=450&fit=crop",
    icon: <TrendingUp className="h-5 w-5" />,
    link: "/sectors/sustainability"
  },
  {
    id: 5,
    title: "Education Evolution",
    description: "EdTech and online learning specialists among the fastest-growing education roles",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&h=450&fit=crop",
    icon: <GraduationCap className="h-5 w-5" />,
    link: "/sectors/education"
  },
  {
    id: 6,
    title: "Gig Economy Expansion",
    description: "Freelance marketplace expected to represent 50% of the workforce by 2027",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&h=450&fit=crop",
    icon: <Briefcase className="h-5 w-5" />,
    link: "/blogs/gig-economy"
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const statsRef = useRef<HTMLDivElement>(null);
  
  // Animation for statistics counting up
  useEffect(() => {
    if (inView && statsRef.current) {
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
  }, [inView]);

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/20 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-block mb-3">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
              Market Intelligence
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Hiring Trends & Insights
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-lg">
            Stay ahead with the latest job market data, emerging career paths, and industry forecasts to navigate your professional journey.
          </p>
        </motion.div>

        {/* Statistics section */}
        <motion.div 
          ref={statsRef}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-8 mb-16 md:grid-cols-4"
        >
          <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <TrendingUp className="mb-3 h-8 w-8 text-primary" />
            <span className="stat-counter text-3xl font-bold text-primary" data-target="73">0</span>
            <span className="text-lg font-semibold">%</span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Growth in remote jobs</p>
          </div>
          
          <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <Code className="mb-3 h-8 w-8 text-primary" />
            <span className="stat-counter text-3xl font-bold text-primary" data-target="122">0</span>
            <span className="text-lg font-semibold">K</span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Tech jobs added yearly</p>
          </div>
          
          <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <Users className="mb-3 h-8 w-8 text-primary" />
            <span className="stat-counter text-3xl font-bold text-primary" data-target="42">0</span>
            <span className="text-lg font-semibold">%</span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Increase in healthcare demand</p>
          </div>
          
          <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <Briefcase className="mb-3 h-8 w-8 text-primary" />
            <span className="stat-counter text-3xl font-bold text-primary" data-target="89">0</span>
            <span className="text-lg font-semibold">K</span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Monthly active job seekers</p>
          </div>
        </motion.div>

        {/* Trends cards */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trendingIndustries.map((trend, index) => (
            <InsightCard key={trend.id} trend={trend} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}