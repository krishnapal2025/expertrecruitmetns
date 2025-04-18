import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import hireImg from "@assets/3603649b-9dbb-4079-b5eb-c95af0e719b7.png";

export default function Welcome() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOS0uNiAyLjEtLjYgMy4yIDAgMS4yIDEuNSAyLjQuNiAzLjItLjkuOS0yIDEuMy0zLjIgMS4zLTEuMiAwLTIuMy0uNS0zLjItMS4zLS45LS45LjYtMi4xLjYtMy4yIDAtMS4yLTEuNS0yLjQtLjYtMy4yLjktLjggMi0xLjMgMy4yLTEuM3oiIHN0cm9rZT0icmdiYSgxNDcsIDUxLCAyMzQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      {/* Animated background shapes */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply opacity-60 -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-indigo-500/5 mix-blend-multiply opacity-50 -z-10"
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="bg-gradient-to-r from-primary/10 to-indigo-500/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm inline-block mb-3">
              Connecting Talent with Opportunity
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              Welcome to RH Job Portal
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We connect talented professionals with great companies. Whether you're looking for your next career move or seeking outstanding talent, we're here to help you succeed in today's competitive job market.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          {/* Left side - Image with floating elements */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 md:order-1 md:pr-8"
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-indigo-500/20 blur-2xl opacity-70 -z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/20 blur-2xl opacity-70 -z-10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={hireImg} 
                alt="Professional team in a business meeting" 
                className="w-full h-auto object-cover rounded-xl transform scale-105 hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/5"></div>
              
              {/* Floating information cards on the image */}
              <motion.div 
                className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </span>
                  RH Job Portal Success
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">10k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Active Jobs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">80k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Candidates</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">95%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right side - Job seekers content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8 order-1 md:order-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Job Seekers
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Take the next step in your career journey with us. We offer access to thousands of opportunities across various industries and locations.
              </p>
              
              <ul className="space-y-3 mb-6">
                {[
                  "Create a profile that showcases your skills",
                  "Browse jobs that match your qualifications",
                  "Get discovered by employers seeking talent",
                  "Access resources to enhance your search"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Employer content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  For Employers
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Find the talent your organization needs to thrive. We provide access to a diverse pool of qualified candidates.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Post jobs and reach qualified candidates",
                  "Search for candidates with the right skills",
                  "Manage applications with tracking tools",
                  "Build your employer brand with a profile"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <svg className="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">95%</span>
              </div>
              <h3 className="font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-sm text-gray-600">Clients rating their experience as excellent</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-violet-600">10k+</span>
              </div>
              <h3 className="font-semibold mb-2">Placements</h3>
              <p className="text-sm text-gray-600">Successful job placements in the last year</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-emerald-600">67%</span>
              </div>
              <h3 className="font-semibold mb-2">Faster Hiring</h3>
              <p className="text-sm text-gray-600">Reduced time-to-hire compared to industry average</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-amber-600">92%</span>
              </div>
              <h3 className="font-semibold mb-2">Retention Rate</h3>
              <p className="text-sm text-gray-600">Candidates who stay with their new roles for 1+ years</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Industry-Leading Success</h3>
                    <p className="text-gray-600">
                      With a track record of connecting talent with opportunity, we've helped thousands of professionals advance their careers and hundreds of companies build strong teams.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-violet-500"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Quality Matches</h3>
                    <p className="text-gray-600">
                      We focus on making meaningful connections between candidates and employers, ensuring the right fit for both parties to foster long-term success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-emerald-500"></div>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Expert Support</h3>
                    <p className="text-gray-600">
                      Our team of recruitment professionals is dedicated to providing personalized guidance and support throughout your job search or hiring process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
