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

      {/* Hero Section with Animated Gradient */}
      <div className="relative bg-gradient-to-r from-primary/90 to-primary py-24 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTYwIDEyYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col items-center text-center"
          >
            <motion.div 
              className="mb-6 inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-medium text-white/90">Executive Search Specialists</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              animate={{ opacity: [0.8, 1], y: [10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
            >
              Expert Recruitments
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8"
              variants={fadeIn}
            >
              The Home of High-End Executive Search in Dubai and across the UAE
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-center gap-2 mb-12"
              variants={scaleIn}
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                <MapPin className="h-4 w-4 mr-2 text-white/80" />
                <span className="text-white/90 font-medium">Dubai</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Globe className="h-4 w-4 mr-2 text-white/80" />
                <span className="text-white/90 font-medium">UAE & GCC</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Building className="h-4 w-4 mr-2 text-white/80" />
                <span className="text-white/90 font-medium">Executive Search</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-8 grid grid-cols-3 gap-6 md:gap-10 max-w-3xl mx-auto"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={scaleIn} className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Users size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">Comprehensive</h3>
                <p className="text-sm text-white/80">Talent Acquisition</p>
              </motion.div>
              
              <motion.div variants={scaleIn} className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Briefcase size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">Meticulous</h3>
                <p className="text-sm text-white/80">Search Process</p>
              </motion.div>
              
              <motion.div variants={scaleIn} className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Target size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">Results</h3>
                <p className="text-sm text-white/80">Guaranteed</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Our Approach Section */}
        <motion.div 
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
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent mix-blend-overlay z-10 rounded-2xl"></div>
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
              className="inline-block bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
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
              className="mt-8 flex items-center gap-4 text-blue-600"
              variants={scaleIn}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center"
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
              className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/5 mix-blend-multiply"
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
                { text: "Cutting-Edge Technology", color: "bg-blue-500/10 text-blue-600" },
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
              <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-5 h-full flex flex-col">
                <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md mb-4">
                  <Award className="w-8 h-8 text-blue-500" />
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
                    className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping"></div>
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

        {/* Call to Action Section */}
        <motion.div 
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTYwIDEyYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-10"></div>
          
          <div className="relative py-16 px-6 md:px-10 lg:px-16 text-white text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to Enhance Your Workforce?
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              If you're ready to enhance your workforce with the very best talent in your niche, we stand ready to serve.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <a 
                href="/contact-us" 
                className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Get in Touch 
                <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}