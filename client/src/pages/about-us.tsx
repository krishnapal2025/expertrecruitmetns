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
  MapPin
} from "lucide-react";

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
      <div className="relative py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gray-50"></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
          <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary/5 rounded-full"></div>
          <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-primary/5 rounded-full"></div>
        </div>
        
        <div className="absolute left-0 bottom-0 w-1/4 h-80 overflow-hidden">
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16">
            <motion.div 
              className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Executive Search Specialists</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Expert Recruitments
            </motion.h1>
            

            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              The Home of High-End Executive Search in Dubai and across the UAE
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              From executive search in the UAE to focused head hunting services, we take a detailed and meticulous approach to finding the right people for the right positions.
            </motion.p>
            
            {/* Navigation buttons for page sections */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <button 
                onClick={() => document.getElementById('our-approach')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                Our Approach <ArrowUpRight className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => document.getElementById('what-sets-us-apart')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                What Sets Us Apart <ArrowUpRight className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => document.getElementById('our-history')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                Our History <ArrowUpRight className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => document.getElementById('our-mission')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                Our Mission <ArrowUpRight className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => document.getElementById('our-values')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                Our Values <ArrowUpRight className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => document.getElementById('our-promise')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-xs font-medium bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm flex items-center gap-1"
              >
                Our Promise <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
          
          {/* Three value propositions */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center h-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">Comprehensive</h3>
              <p className="text-gray-600 text-center">Talent Acquisition</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
            
            <div className="relative bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center h-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">Meticulous</h3>
              <p className="text-gray-600 text-center">Search Process</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
            
            <div className="relative bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center h-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">Results</h3>
              <p className="text-gray-600 text-center">Guaranteed</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
          </motion.div>
          

        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Our Approach Section */}
        <motion.div 
          id="our-approach"
          className="grid md:grid-cols-2 gap-16 items-center mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">A Comprehensive & Meticulous Approach</h2>
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
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
                alt="Executive recruitment professionals in Dubai"
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* What Sets Us Apart Section */}
        <motion.div 
          id="what-sets-us-apart"
          className="grid md:grid-cols-2 gap-16 items-center mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Delivering Growth Through Talent</h2>
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
          className="grid md:grid-cols-2 gap-16 items-center mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">A Legacy of Excellence</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Collectively, we offer decades of experience in executive search in Dubai, talent acquisition, and head-hunting services. However, the story of Expert Recruitments began in 2015 – when our executive search company was founded as Expert Labor Supply Services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Since 2018, we've been transforming workforces in India under the name Expert Recruitments LLC. Today, that name is synonymous with premium talent acquisition services in Dubai and throughout the UAE. We opened our first US office in New Jersey in 2015 – making us a truly global executive search company.
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2015</div>
                <p className="text-sm text-gray-600">Founded as Expert Labor Supply Services</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2015</div>
                <p className="text-sm text-gray-600">First US office in New Jersey</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">2018</div>
                <p className="text-sm text-gray-600">Expanded to India as Expert Recruitments LLC</p>
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
                <div className="font-bold text-2xl">8+</div>
                <div className="text-xs">Years of Excellence</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our Mission Section */}
        <motion.div 
          id="our-mission"
          className="mb-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 rounded-2xl relative overflow-hidden"
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
              className="text-3xl md:text-4xl font-bold mb-8"
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
          className="mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Guiding Principles</h2>
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
          className="mb-24"
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
                    className="inline-block bg-rose-500/10 text-rose-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    Our Promise
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">A Personalized Approach to Executive Search</h2>
                  
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      When you choose Expert Recruitments for executive search in Dubai, you're guaranteed a personalized, fully tailored service based on the needs and objectives of your business.
                    </p>
                    <p className="leading-relaxed">
                      We're not like other recruitment agencies in Dubai. We take the time to understand your organization before creating a custom solution designed to make the entire process fast, efficient, and productive.
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
                  <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500/20 via-rose-500/5 to-transparent rounded-3xl blur-lg opacity-70"></div>
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl relative">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                          <svg className="w-5 h-5 text-rose-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
          className="mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How We Ensure Your Success</h2>
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
          className="mb-24"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Premium Executive Search in Dubai</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              While we're not the oldest recruitment agency in the UAE, we're definitely one of the most respected. We look beyond the immediate talent requirements of the businesses we serve to ensure every appointment makes a real difference.
            </p>
          </motion.div>
          
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
            
            {/* Benefit 5 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 9H20.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.6 15H20.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20.4952C14.4 20.4952 16.5 17.0962 16.5 11.9952C16.5 6.89415 14.4 3.49512 12 3.49512C9.6 3.49512 7.5 6.89415 7.5 11.9952C7.5 17.0962 9.6 20.4952 12 20.4952Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Tap Proactive Headhunting Strategies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Discover hidden talent through our expert headhunting. We proactively seek out high-caliber candidates who aren't on the market, delivering game-changers to your doorstep and elevating your team.
                </p>
              </div>
            </motion.div>
            
            {/* Benefit 6 */}
            <motion.div
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 14L17 9L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 9L13 14L12 22L8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 19L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 11L8 9L12 2L17 9L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Strengthen Competitive Positioning</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Stay ahead in your industry with top talent uncovered by us. Our ability to identify and attract elite professionals gives your business a sharp edge, positioning you as a leader in the job market.
                </p>
              </div>
            </motion.div>
            
            {/* Benefit 7 */}
            <motion.div
              className="group relative md:col-span-2 lg:col-span-2"
              variants={scaleIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-lg flex flex-col md:flex-row items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5 md:mb-0 md:mr-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white text-center md:text-left">Enjoy a Seamless Recruitment Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Experience a hassle-free hiring journey with our expert support. From start to finish, we handle the details, ensuring a smooth, stress-free executive search process that delivers results and keeps your focus on growing your business.
                  </p>
                </div>
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
          {/* Professional modern CTA */}
          <div className="relative py-20 px-8 rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
            {/* Background with subtle pattern */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gray-50"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Professional accent elements */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary to-transparent"></div>
              
              {/* Subtle decorative elements */}
              <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-gray-200 opacity-20"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border border-gray-200 opacity-10"></div>
              
              {/* Professional geometric patterns */}
              <div className="absolute right-16 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 opacity-30"></div>
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 opacity-20"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <motion.div
                className="inline-block px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-medium text-sm tracking-wider uppercase text-primary">Executive Recruitment Excellence</span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Ready to Enhance Your Workforce?
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                If you're ready to enhance your workforce with the very best talent in your niche, 
                we stand ready to serve. Our expert team is prepared to help you find exceptional candidates who will drive your business forward.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <a 
                  href="/contact-us" 
                  className="px-8 py-4 bg-primary text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center group"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                <a 
                  href="/services" 
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-medium text-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center group"
                >
                  <span>Our Services</span>
                  <svg className="ml-2 h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>
              
              <motion.div 
                className="flex justify-center gap-10 pt-8 border-t border-gray-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {[
                  { text: "Premium Talent", value: "100%" },
                  { text: "Client Satisfaction", value: "95%" },
                  { text: "Retention Rate", value: "92%" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.text}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}