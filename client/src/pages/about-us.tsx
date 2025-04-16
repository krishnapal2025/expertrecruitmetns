import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Briefcase, Users, Award, Target, Globe, Zap, Heart } from "lucide-react";

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
      repeatType: "reverse"
    }
  };

  return (
    <>
      <Helmet>
        <title>About Us | RH Job Portal</title>
        <meta name="description" content="Learn about our mission and vision to connect the best talent with the top employers worldwide." />
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
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              animate={{ opacity: [0.8, 1], y: [10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              About Us
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              variants={fadeIn}
            >
              We connect talent with opportunity and help businesses thrive with the right people.
            </motion.p>
            
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-6 md:gap-10 max-w-3xl mx-auto"
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
                <h3 className="text-lg font-semibold">10K+</h3>
                <p className="text-sm text-white/80">Placements</p>
              </motion.div>
              
              <motion.div variants={scaleIn} className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Briefcase size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">5K+</h3>
                <p className="text-sm text-white/80">Employers</p>
              </motion.div>
              
              <motion.div variants={scaleIn} className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Globe size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">20+</h3>
                <p className="text-sm text-white/80">Countries</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Vision Section with Interactive SVG */}
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
              Our Vision
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Connecting Talent with Opportunity</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To be the leading platform where talent and opportunity meet, creating meaningful careers and successful businesses around the world.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe in the transformative power of the right job match - not just for individuals, but for organizations. When people are in positions that leverage their strengths and align with their values, both the individual and the organization thrive.
            </p>
            
            <motion.div 
              className="mt-8 flex items-center gap-4 text-primary"
              variants={scaleIn}
            >
              <motion.div 
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                animate={pulseAnimation}
              >
                <Target className="w-6 h-6" />
              </motion.div>
              <p className="font-medium">Focused on finding the perfect match</p>
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
                alt="Team of business professionals collaborating"
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mission Section with Animated Path */}
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
                alt="Professional recruiters connecting employers with candidates"
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
          </motion.div>
          
          <motion.div className="order-1 md:order-2" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Mission
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Creating Connections That Matter</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To empower careers and strengthen businesses by creating connections that matter.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every day, we work to understand the unique needs of both job seekers and employers, ensuring we foster meaningful connections that lead to mutual success. We're committed to providing personalized service, innovative technology, and deep industry expertise.
            </p>
            
            <motion.div 
              className="mt-8 flex items-center gap-4 text-blue-600"
              variants={scaleIn}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center"
                animate={pulseAnimation}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <p className="font-medium">Powered by industry expertise and technology</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Core Values with Interactive Cards */}
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
              What Drives Us
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These principles guide everything we do and every decision we make.
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
                    <Award className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Integrity</h3>
                  <p className="text-gray-600">
                    We operate with transparency and honesty in all our dealings with clients, candidates, and colleagues.
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
                    <Target className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Excellence</h3>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, continually raising the bar for ourselves and our services.
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
                    <Heart className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">Human Connection</h3>
                  <p className="text-gray-600">
                    We believe in the power of human connections and relationships in the recruitment process.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our Team with Hover Effect Cards */}
        <motion.div 
          className="rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-12 mb-24 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32"></div>
          
          <motion.div className="text-center mb-16 relative z-10" variants={fadeIn}>
            <motion.div 
              className="inline-block bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Meet The Experts
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our team of experienced professionals is dedicated to understanding your unique needs and finding the perfect match.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={container}
          >
            <motion.div 
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1573496130141-209d200cebd8" 
                    alt="Sarah Johnson"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <p className="text-sm">Over 15 years of recruitment experience across multiple industries.</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Sarah Johnson</h3>
                  <p className="text-primary">CEO & Founder</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e" 
                    alt="David Chen"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <p className="text-sm">Former Google engineer with expertise in AI-powered recruitment solutions.</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg">David Chen</h3>
                  <p className="text-blue-600">Chief Technology Officer</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1573496130407-57329f01f769" 
                    alt="Emma Rodriguez"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <p className="text-sm">Specializes in executive search and talent acquisition strategy.</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Emma Rodriguez</h3>
                  <p className="text-purple-600">Head of Recruitment</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2" 
                    alt="Michael Taylor"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <p className="text-sm">Expert in building long-term client relationships and business development.</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Michael Taylor</h3>
                  <p className="text-green-600">Client Relations Manager</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Join Our Journey Section with Animation */}
        <motion.div 
          className="text-center relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <div className="absolute inset-0 bg-primary/5 rounded-full w-[800px] h-[800px] mx-auto -top-1/2 opacity-30"></div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
            variants={fadeIn}
          >
            Join Our Journey
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto relative z-10"
            variants={fadeIn}
          >
            Whether you're looking for your next career move or seeking the perfect addition to your team, we're here to help you succeed.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 relative z-10"
            variants={container}
          >
            <motion.a 
              href="/auth?type=jobseeker" 
              className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:bg-primary/90 transition-all"
              variants={scaleIn}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Register as Job Seeker
            </motion.a>
            <motion.a 
              href="/auth?type=employer" 
              className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-medium hover:shadow-lg hover:bg-primary/5 transition-all"
              variants={scaleIn}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              Register as Employer
            </motion.a>
          </motion.div>
          
          <motion.div 
            className="mt-16 flex justify-center items-center gap-2 text-gray-500 relative z-10"
            variants={fadeIn}
          >
            <motion.svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.93 4.93 14.14 14.14"></path>
              <path d="m14.83 9.17-5.66 5.66"></path>
              <path d="m9.17 9.17 5.66 5.66"></path>
            </motion.svg>
            <span>100% satisfaction guaranteed</span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
