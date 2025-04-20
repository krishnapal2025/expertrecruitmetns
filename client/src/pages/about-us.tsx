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