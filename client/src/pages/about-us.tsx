import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  Award, 
  Target, 
  Globe, 
  Building, 
  CheckCircle2, 
  Rocket, 
  Search,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  MapPin
} from "lucide-react";
import OptimizedHeroBackground from "@/components/hero/optimized-hero-background";
import ourApproachImage from "../assets/our-approach-image.webp";
import aerialBusinessViewImage from "../assets/aerial-view-business-team.jpg";
import aerialBusinessViewSmallImage from "../assets/optimized/aerial-view-business-team-sm.webp";
import aerialBusinessViewMediumImage from "../assets/optimized/aerial-view-business-team-md.webp";

export default function AboutUsPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <>
      <Helmet>
        <title>About Us | Expert Recruitments</title>
        <meta name="description" content="Expert Recruitments - The Home of High-End Executive Search in Dubai. We provide comprehensive and meticulous approach to executive search in Dubai and across the UAE." />
      </Helmet>

      {/* Hero Section with Premium Executive Design */}
      <div className="relative min-h-[90vh] overflow-hidden" id="about-hero-section">
        {/* Optimized Background Image */}
        <OptimizedHeroBackground 
          imageSrc={aerialBusinessViewImage}
          smallImageSrc={aerialBusinessViewSmallImage}
          mediumImageSrc={aerialBusinessViewMediumImage}
          alt="Aerial view of business team"
          brightness={0.85}
          overlayOpacity={0.65}
          priority={true}
        />
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-10"></div>
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-32 md:py-40">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 relative z-20">
            <div className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Executive Search Specialists</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-white tracking-tight drop-shadow-md">
              Expert Recruitments
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed drop-shadow-md">
                The Home of High-End Executive Search in Dubai and across the UAE
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed max-w-3xl drop-shadow">
                From executive search in the UAE to focused head hunting services, we take a detailed and meticulous approach to finding the right people for the right positions.
              </p>
            </div>
            
            {/* Section Navigation Buttons */}
            <div className="flex flex-col items-center gap-4 mt-12 mb-10 z-30">
              {/* First Row */}
              <div className="flex flex-wrap justify-center gap-5 w-full">
                <a 
                  href="#our-approach" 
                  className="px-6 py-3 bg-white text-primary text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 7V5m0 14v-2m5-5h2M5 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Our Approach</span>
                </a>
                <a 
                  href="#what-sets-us-apart" 
                  className="px-5 py-2.5 bg-white text-primary text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 8V16M12 8L8 12M12 8L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>What Sets Us Apart</span>
                </a>
                <a 
                  href="#our-history" 
                  className="px-5 py-2.5 bg-white text-amber-600 text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600">
                    <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our History</span>
                </a>
                <a 
                  href="#our-mission" 
                  className="px-5 py-2.5 bg-white text-blue-600 text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                    <path d="M15 3L19 7M19 7L15 11M19 7H5M9 13L5 17M5 17L9 21M5 17H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our Mission</span>
                </a>
              </div>
              
              {/* Second Row */}
              <div className="flex flex-wrap justify-center gap-5 w-full mt-4">
                <a 
                  href="#our-values" 
                  className="px-6 py-3 bg-white text-emerald-600 text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
                    <path d="M9 10.5L11 12.5L15.5 8M7 18L3 14L7 10M17 18L21 14L17 10M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our Values</span>
                </a>
                <a 
                  href="#our-promise" 
                  className="px-6 py-3 bg-white text-[#5372f1] text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5372f1]">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our Promise</span>
                </a>
                <a 
                  href="#our-commitments" 
                  className="px-6 py-3 bg-white text-rose-600 text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-600">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 22a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our Commitments</span>
                </a>
                <a 
                  href="#our-reputation" 
                  className="px-6 py-3 bg-white text-orange-600 text-sm font-medium rounded-full shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center space-x-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Our Reputation</span>
                </a>
              </div>
            </div>
            
            {/* Scroll Down Button */}
            <a 
              href="#our-approach" 
              className="flex flex-col items-center mt-12 text-white/80 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium mb-2">Explore More</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
            
          </div>
            

          
          {/* Three value propositions */}
         

        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Our Approach Section */}
        <motion.div 
          id="our-approach"
          className="grid md:grid-cols-2 gap-16 items-center mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div variants={fadeIn}>
            <motion.div 
              className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Approach
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">A Comprehensive & Meticulous Approach</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Expert Recruitments, we work tirelessly to ensure our clients receive a comprehensive and meticulous approach to executive search in Dubai and across the UAE.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our experienced recruiting agents use a proven talent acquisition process that guarantees best-in-class employees who exceed the expectations of our clients.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By utilizing tried-and-tested executive search and head-hunting processes in the UAE, we give our clients the talent they need quickly and efficiently. Whether we're serving businesses in Dubai, the wider GCC region, India, or Europe, our attention to detail and meticulous approach guarantees results.
            </p>
            
            <motion.div 
              className="mt-8 flex items-center gap-4 text-primary"
              variants={scaleIn}
            >
              <motion.div 
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                animate={pulseAnimation}
              >
                <Search className="w-6 h-6" />
              </motion.div>
              <p className="font-medium">Finding the perfect talent for your organization</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-xl relative"
            variants={scaleIn}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10 rounded-2xl"></div>
            <motion.svg
              className="absolute top-0 left-0 w-full h-full z-0 opacity-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </motion.svg>
            <motion.div 
              className="relative z-10 p-1 bg-white rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={ourApproachImage} 
                alt="Team collaborating on recruitment strategy"
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* What Sets Us Apart Section */}
        <motion.div 
          id="what-sets-us-apart"
          className="grid md:grid-cols-2 gap-16 items-center mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div 
            className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl relative"
            variants={scaleIn}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent mix-blend-overlay z-10 rounded-2xl"></div>
            <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 200 200">
              <motion.path
                d="M 0,100 C 20,120 50,50 70,100 S 100,190 120,100 S 150,40 180,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
            <motion.div 
              className="relative z-10 p-1 bg-white rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" 
                alt="Executive recruitment professionals meeting with clients"
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
          </motion.div>
          
          <motion.div className="order-1 md:order-2" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              What Sets Us Apart
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Delivering Growth Through Talent</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              What sets us apart from other recruitment agencies in Dubai is our unwavering dedication to delivering growth. When talent acquisition works properly, it takes the organization to the next level of its development.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We're driven by a desire to deliver value with every appointment. Every candidate we find, vet, and on-board fills a skill gap or brings the qualities needed to drive long-term business growth.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your success is our success. That's why we'll go the extra mile to ensure your team has the skills and qualities it needs to succeed.
            </p>
            
            <motion.div 
              className="mt-8 flex items-center gap-4 text-primary"
              variants={scaleIn}
            >
              <motion.div 
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                animate={pulseAnimation}
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              <p className="font-medium">Taking your organization to the next level</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our History Section */}
        <motion.div 
          id="our-history"
          className="grid md:grid-cols-2 gap-16 items-center mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div variants={fadeIn}>
            <motion.div 
              className="inline-block bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our History
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">A Legacy of Excellence</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Expert Recruitments LLC is a global executive search firm, established in Dubai in 2015 (initially as Expert Labor Supply Services) and now also operating as Expert Recruitments LLC in the UAE, India (Expert Recruitments since 2018), and the USA (New Jersey). This international journey has equipped us with decades of collective expertise in executive search, talent acquisition, and headhunting across diverse regions.  Our extensive candidate pool and experienced team are well-positioned to efficiently meet your talent needs.
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2015</div>
                <p className="text-sm text-gray-600">Founded as Expert Labor Supply Services in Dubai, UAE.</p>
              </div>
              
              
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2018</div>
                <p className="text-sm text-gray-600">Expanded to India as Expert Recruitments</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2025</div>
                <p className="text-sm text-gray-600">UAE and USA offices registered in 2025 as Expert Recruitments LLC</p>
              </div>
              
            </div>
            
          </motion.div>
          
          <motion.div 
            className="relative"
            variants={scaleIn}
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-transparent rounded-2xl blur-lg opacity-70"></div>
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-1">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1500&auto=format&fit=crop"
                  alt="Expert Recruitments Office Building" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              
              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4">
                <div className="text-gray-800 font-semibold mb-1">Global Presence</div>
                <div className="text-sm text-gray-600">Dubai | UAE | India | USA</div>
              </div>
            </div>
            
            <motion.div 
              className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full h-24 w-24 flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-center">
                <div className="font-bold text-2xl">10+</div>
                <div className="text-xs">Years of Excellence</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our Mission Section */}
        <motion.div 
          id="our-mission"
          className="mb-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 rounded-2xl relative overflow-hidden pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          {/* Background decoration elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <motion.div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/5 mix-blend-multiply"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div 
              className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
              variants={scaleIn}
            >
              Our Mission
            </motion.div>
            
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-8"
              variants={fadeIn}
            >
              Redefining Executive Search
            </motion.h2>
            
            <motion.div 
              className="relative"
              variants={scaleIn}
            >
              <svg className="text-primary/5 w-32 h-32 mx-auto mb-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h10zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
              </svg>
              
              <motion.p 
                className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8 relative z-10"
                variants={fadeIn}
              >
                We redefine executive search in Dubai and beyond by meticulously connecting exceptional talent with organizations across multiple sectors.
              </motion.p>
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              variants={fadeIn}
            >
              Through our proven talent acquisition process, cutting-edge technology, established network of contacts, and industry-specific expertise, we are on a mission to drive business growth, exceed expectations, and empower success across Dubai and the UAE.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-wrap justify-center gap-4"
              variants={container}
            >
              {[
                { text: "Proven Process", color: "bg-primary/10 text-primary" },
                { text: "Cutting-Edge Technology", color: "bg-primary/10 text-primary" },
                { text: "Established Network", color: "bg-purple-500/10 text-purple-600" },
                { text: "Industry Expertise", color: "bg-amber-500/10 text-amber-600" },
                { text: "Business Growth", color: "bg-green-500/10 text-green-600" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`px-4 py-2 rounded-full ${item.color} font-medium text-sm`}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.text}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Our Values Section */}
        <motion.div 
          id="our-values"
          className="mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Values
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Guiding Principles</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We're quickly becoming one of the most respected recruitment agencies in the UAE because everything we do is based on our guiding principles.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {/* Value 1: Embracing Technology */}
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-1"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <svg 
                    className="w-8 h-8 text-primary" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 10V19H3V10H15ZM16 8H2C1.44772 8 1 8.44772 1 9V20C1 20.5523 1.44772 21 2 21H16C16.5523 21 17 20.5523 17 20V9C17 8.44772 16.5523 8 16 8ZM9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12ZM22 6C22 8.76142 19.7614 11 17 11C14.2386 11 12 8.76142 12 6C12 3.23858 14.2386 1 17 1C19.7614 1 22 3.23858 22 6ZM20 6C20 4.34315 18.6569 3 17 3C15.3431 3 14 4.34315 14 6C14 7.65685 15.3431 9 17 9C18.6569 9 20 7.65685 20 6Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">Embracing Technology</h3>
                <p className="text-sm text-gray-600">
                  We embrace the latest technologies – including AI and Machine Learning – to ensure we're one step ahead of other recruiters when it comes to securing best-in-class talent.
                </p>
              </div>
            </motion.div>
            
            {/* Value 2: Prioritizing Experience */}
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-1"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">Prioritizing Experience</h3>
                <p className="text-sm text-gray-600">
                  We focus on matching specific industry experience with the right positions. The talent acquisition work we do empower businesses to deliver their commercial objectives and pursue long-term growth.
                </p>
              </div>
            </motion.div>
            
            {/* Value 3: Leveraging Big Data */}
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-1"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <svg 
                    className="w-8 h-8 text-purple-600" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65381V16.3462L12 20.689L19.5 16.3462V7.65381L12 3.311ZM12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13ZM7.5 14.5C6.7 14.5 6 13.8 6 13C6 12.2 6.7 11.5 7.5 11.5C8.3 11.5 9 12.2 9 13C9 13.8 8.3 14.5 7.5 14.5ZM7.5 9.5C6.7 9.5 6 8.8 6 8C6 7.2 6.7 6.5 7.5 6.5C8.3 6.5 9 7.2 9 8C9 8.8 8.3 9.5 7.5 9.5ZM16.5 14.5C15.7 14.5 15 13.8 15 13C15 12.2 15.7 11.5 16.5 11.5C17.3 11.5 18 12.2 18 13C18 13.8 17.3 14.5 16.5 14.5ZM16.5 9.5C15.7 9.5 15 8.8 15 8C15 7.2 15.7 6.5 16.5 6.5C17.3 6.5 18 7.2 18 8C18 8.8 17.3 9.5 16.5 9.5Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">Leveraging Big Data</h3>
                <p className="text-sm text-gray-600">
                  By processing and utilizing huge volumes of industry-specific data, our executive search experts in Dubai gain the insights needed to develop effective recruiting strategies.
                </p>
              </div>
            </motion.div>
            
            {/* Value 4: Delivering Industry-Specific Services */}
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-1"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <Briefcase className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg mb-3">Industry-Specific Services</h3>
                <p className="text-sm text-gray-600">
                  Our executive search professionals and head hunters in Dubai tailor our proven search strategies according to the specific needs of each industry we serve.
                </p>
              </div>
            </motion.div>
            
            {/* Value 5: Exceeding Client Expectations */}
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-1"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-lg mb-3">Exceeding Expectations</h3>
                <p className="text-sm text-gray-600">
                  It's not enough to simply deliver a comprehensive and productive service at Expert Recruitments. We work tirelessly to go well beyond our minimum commitments. Exceeding expectations is always the goal.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Our Promise Section */}
        <motion.div 
          id="our-promise"
          className="mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-10 lg:p-16 relative overflow-hidden shadow-lg">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
                <motion.div 
                  className="lg:w-1/2"
                  variants={fadeIn}
                >
                  <motion.div 
                    className="inline-block bg-[#5372f1]/10 text-[#5372f1] px-4 py-2 rounded-full text-sm font-medium mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    Our Promise
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">A Personalized Approach to Executive Search</h2>
                  
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      When you choose Expert Recruitments for executive search in Dubai, you're guaranteed a personalized, fully tailored service based on the needs and objectives of your business.
                    </p>
                    <p className="leading-relaxed">
                      At Expert recruitment , We take the time to understand your organization before creating a custom solution designed to make the entire process fast, efficient, and productive.
                    </p>
                    <p className="leading-relaxed">
                      We understand the pressures and challenges associated with running a successful business in the UAE. That's why we've developed a comprehensive approach that lifts the burden of recruitment from your shoulders.
                    </p>
                    <p className="leading-relaxed font-medium text-lg">
                      Leave talent acquisition and head hunting in Dubai to us – while you focus on driving business growth.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="lg:w-1/2 relative"
                  variants={scaleIn}
                >
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#5372f1]/20 via-[#5372f1]/5 to-transparent rounded-3xl blur-lg opacity-70"></div>
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl relative">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#5372f1]/10 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-[#5372f1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Our Commitment to You</h3>
                    </div>
                    
                    <ul className="space-y-4">
                      {[
                        "Personalized service tailored to your business needs",
                        "Custom recruitment solutions for maximum efficiency",
                        "Comprehensive support to reduce your workload",
                        "Focus on quality over quantity in candidates",
                        "Transparent communication throughout the process",
                        "Long-term partnership approach for continued success",
                        "Specialized expertise across multiple industries"
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + (index * 0.1) }}
                        >
                          <svg className="w-5 h-5 text-[#5372f1] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Our Commitments Section */}
        <motion.div 
          id="our-commitments"
          className="mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-purple-500/10 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Commitments
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">How We Ensure Your Success</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our commitments to every client and candidate drive our exceptional results.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={container}
          >
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 h-full">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="w-20 h-20 bg-primary/10 text-primary rounded-full mx-auto mb-6 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.15)" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Exceptional Quality</h3>
                  <p className="text-gray-600">
                    We guarantee best-in-class employees who exceed the expectations of our clients through our proven talent acquisition process.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 h-full">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="w-20 h-20 bg-primary/10 text-primary rounded-full mx-auto mb-6 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
                    <Award className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Meticulous Approach</h3>
                  <p className="text-gray-600">
                    Our attention to detail and meticulous approach to executive search guarantees results for businesses in Dubai and beyond.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 h-full">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="w-20 h-20 bg-purple-500/10 text-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-ping"></div>
                    <Target className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Delivering Value</h3>
                  <p className="text-gray-600">
                    Every candidate we place brings the qualities needed to drive long-term business growth for your organization.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our Reputation Section */}
        <motion.div 
          id="our-reputation"
          className="mb-24 pt-16 -mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-indigo-500/10 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Reputation
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Premium Executive Search in Dubai</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
              While we're not the oldest recruitment agency in the UAE, we're definitely one of the most respected. We look beyond the immediate talent requirements of the businesses we serve to ensure every appointment makes a real difference.
            </p>

            {/* Numbers Talk Section */}
            <motion.div 
              className="max-w-4xl mx-auto mb-10"
              variants={scaleIn}
            >
              <div className="bg-white rounded-xl p-8 relative overflow-hidden shadow-sm border-b-2 border-primary">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-gray-100/20"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="inline-block mb-8 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -20 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="font-medium text-primary tracking-wider uppercase text-sm">Numbers Talk</span>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Years in Business */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 rounded-full mb-3 shadow-md relative">
                        <div className="absolute inset-1 rounded-full border border-gray-200 opacity-50"></div>
                        <span className="text-3xl font-bold text-gray-800">10+</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Years in Business</p>
                    </div>
                    
                    {/* Clients & Brands */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 rounded-full mb-3 shadow-md relative">
                        <div className="absolute inset-1 rounded-full border border-gray-200 opacity-50"></div>
                        <span className="text-3xl font-bold text-gray-800">100+</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Clients & Brands</p>
                    </div>
                    
                    {/* Placements */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 rounded-full mb-3 shadow-md relative">
                        <div className="absolute inset-1 rounded-full border border-gray-200 opacity-50"></div>
                        <span className="text-3xl font-bold text-gray-800">10K+</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Placements</p>
                    </div>
                    
                    {/* Countries-wide Presence */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 rounded-full mb-3 shadow-md relative">
                        <div className="absolute inset-1 rounded-full border border-gray-200 opacity-50"></div>
                        <span className="text-3xl font-bold text-gray-800">3</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Countries-wide Presence</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* First row - the 4 cards that should remain unchanged */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19.25C15 19.25 8 16 8 10V4.75L15 2L22 4.75V10C22 16 15 19.25 15 19.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10.5C2 14 5 16.5 5 16.5C5 16.5 8 14 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 8L13 10L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Unlock Access to a Larger Talent Pool</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Gain a broader candidate pool, boosting your odds of securing the ideal hire. Our extensive network spans various industries and regions, ensuring you connect with top-tier talent tailored to your needs in Dubai and beyond.
                </p>
              </div>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Accelerate Hiring Time</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Slash recruitment delays with Expert Recruitments' streamlined process. We refine every step, enabling you to fill positions swiftly without sacrificing quality.
                </p>
              </div>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-green-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18C11.0807 18 9.87449 17.6994 8.4487 16.6845C6.79843 15.5143 6 13.9227 6 12C6 10.0773 6.79843 8.48566 8.4487 7.31547C9.87449 6.30063 11.0807 6 12 6C13.3951 6 14.7424 6.53225 16.2782 7.64673C18.0393 8.94167 19 10.6364 19 12C19 13.3636 18.0393 15.0583 16.2782 16.3533C14.7424 17.4677 13.3951 18 12 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 10L15 12L17 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L9 12L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Maximize Cost Savings</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cut hiring expenses significantly by relying on our expertise, experience, and comprehensive marketing reach. Our services are proven to reduce overhead, optimize resources, and boost efficiency.
                </p>
              </div>
            </motion.div>
            
            {/* Benefit 4 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-purple-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10C18 11.657 14.4183 13 10 13C5.58172 13 2 11.657 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 14C18 15.657 14.4183 17 10 17C5.58172 17 2 15.657 2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9C14.4183 9 18 7.65685 18 6C18 4.34315 14.4183 3 10 3C5.58172 3 2 4.34315 2 6C2 7.65685 5.58172 9 10 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 6V18C2 19.657 5.58172 21 10 21C13.8125 21 16.9324 19.9603 17.8358 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12C22 13.657 20.6569 15 19 15C17.3431 15 16 13.657 16 12C16 10.343 17.3431 9 19 9C20.6569 9 22 10.343 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Receive Tailored Consultation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Benefit from customized guidance designed for your unique hiring goals. We provide personalized strategies and insights throughout the process, ensuring every decision aligns perfectly with your business vision.
                </p>
              </div>
            </motion.div>
            
          </div>
          
          {/* Second row - the 3 specific cards that should be in one row with equal size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Card 1: Tap Proactive Headhunting Strategies */}
            <motion.div
              className="group relative flex h-full"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full shadow-lg flex flex-col">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 9H20.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 15H20.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20.4952C14.4 20.4952 16.5 17.0962 16.5 11.9952C16.5 6.89415 14.4 3.49512 12 3.49512C9.6 3.49512 7.5 6.89415 7.5 11.9952C7.5 17.0962 9.6 20.4952 12 20.4952Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Tap Proactive Headhunting Strategies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                  Discover hidden talent through our expert headhunting. We proactively seek out high-caliber candidates who aren't on the market, delivering game-changers to your doorstep and elevating your team.
                </p>
              </div>
            </motion.div>
            
            {/* Card 2: Strengthen Competitive Positioning */}
            <motion.div
              className="group relative flex h-full"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full shadow-lg flex flex-col">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 14L17 9L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 9L13 14L12 22L8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 19L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 11L8 9L12 2L17 9L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Strengthen Competitive Positioning</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                  Stay ahead in your industry with top talent uncovered by us. Our ability to identify and attract elite professionals gives your business a sharp edge, positioning you as a leader in the job market.
                </p>
              </div>
            </motion.div>
            
            {/* Card 3: Enjoy a Seamless Recruitment Experience */}
            <motion.div 
              className="group relative flex h-full"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full shadow-lg flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Enjoy a Seamless Recruitment Experience</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                  Experience a hassle-free hiring journey with our expert support. From start to finish, we handle the details, ensuring a smooth, stress-free executive search process that delivers results and keeps your focus on growing your business.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Call to Action Section */}
        <motion.div 
          className="relative overflow-hidden mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* CTA that matches hero section */}
          <div className="relative py-14 px-8 bg-white">            
            {/* Content */}
            <div className="relative max-w-3xl mx-auto text-center">
              <motion.div 
                className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-medium text-primary tracking-wider uppercase text-sm">Executive Recruitment Excellence</span>
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 tracking-tight"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Ready to Enhance Your Workforce?
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed mb-8"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Our expert team is prepared to help you find exceptional candidates who will drive your business forward.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <a 
                  href="/contact-us" 
                  className="px-6 py-3 bg-primary text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all hover:bg-primary/90 flex items-center"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
                
                <a 
                  href="/services" 
                  className="px-6 py-3 bg-white border border-gray-100 text-gray-700 font-medium rounded-md shadow-sm hover:shadow-md transition-all hover:bg-gray-50 flex items-center"
                >
                  <span>Our Services</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}