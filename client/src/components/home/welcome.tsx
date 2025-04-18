import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import hireImg from "@assets/3603649b-9dbb-4079-b5eb-c95af0e719b7.png";

export default function Welcome() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Welcome to RH Job Portal</h2>
            <p className="text-lg text-gray-600">
              We connect talented professionals with great companies. Whether you're looking for your next career move or seeking outstanding talent, we're here to help you succeed in today's competitive job market.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 order-2 md:order-1"
          >
            <h3 className="text-xl font-bold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              For Job Seekers
            </h3>
            <p className="text-gray-600">
              Take the next step in your career journey with us. We offer access to thousands of opportunities across various industries and locations, along with resources to help you stand out to employers.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create a profile that showcases your skills and experience</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Browse and apply to jobs that match your qualifications</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get discovered by employers seeking your skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access resources to enhance your job search</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative order-1 md:order-2 mb-8 md:mb-0"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full z-0"></div>
            <div className="relative z-10 rounded-lg shadow-xl overflow-hidden">
              <img 
                src={hireImg} 
                alt="Professional team in a business meeting" 
                className="w-full h-auto object-cover rounded-lg" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xl font-semibold">Find your dream team</div>
                <div className="text-sm opacity-90">Connect with top professionals today</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6 col-span-2 md:col-span-1 order-3"
          >
            <h3 className="text-xl font-bold flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              For Employers
            </h3>
            <p className="text-gray-600">
              Find the talent your organization needs to thrive. We provide access to a diverse pool of qualified candidates and offer tools to streamline your recruitment process.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Post jobs and reach thousands of qualified candidates</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Search our database for candidates with the right skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Manage applications efficiently with our tracking tools</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Build your employer brand with a company profile</span>
              </li>
            </ul>
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
