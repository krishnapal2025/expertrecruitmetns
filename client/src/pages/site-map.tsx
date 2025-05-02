import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, User, Building, Briefcase, Globe, ChevronRight, MapPin, 
  FileText, BookOpen, GraduationCap, Settings, Newspaper, Mail, ShieldCheck, Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SiteMap() {
  const { user } = useAuth();
  const isAdmin = user?.userType === "admin";
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Define site map categories, filtering out Admin Portal for non-admin users
  const categories = [
    {
      title: "Main Navigation | Head Hunters Dubai",
      icon: <Globe className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about-us" },
        { name: "Services", url: "/services" },
        { name: "Sectors", url: "/sectors" },
        { name: "Find Jobs", url: "/job-board" },
        { name: "Contact Us", url: "/contact-us" },
      ],
    },
    {
      title: "Job Seeker Resources | Top Recruitment Agencies in UAE",
      icon: <User className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Job Seeker Registration", url: "/job-seeker-register" },
        { name: "Browse Available Jobs", url: "/job-board" },
        { name: "Create Resume", url: "/resources/create-resume" },
        { name: "Interview Preparation", url: "/resources/interview-prep" },
        { name: "Career Advice", url: "/resources/career-advice" },
        { name: "Salary Negotiation", url: "/resources/salary-negotiation" },
        { name: "Apply for Jobs", url: "/job-board" },
        { name: "Job Seeker Login", url: "/auth" },
      ],
    },
    {
      title: "Employer Resources | Executive Search UAE Services",
      icon: <Building className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Employer Registration", url: "/employer-register" },
        { name: "Hire Talent", url: "/hire-talent" },
        { name: "Submit a Vacancy", url: "/vacancy-form" },
        { name: "Employer Login", url: "/auth" },
      ],
    },
    // Only show Admin Portal section to admin users
    ...(isAdmin ? [{
      title: "Admin Portal | Talent Acquisition Management",
      icon: <ShieldCheck className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Admin Dashboard", url: "/admin-dashboard" },
        { name: "Admin Login", url: "/admin-login" },
        { name: "Admin Registration", url: "/admin-register" },
        { name: "Admin Password Reset", url: "/admin/forgot-password" },
        { name: "Create Blog Post", url: "/create-blog" },
        { name: "Job Post Manager", url: "/post-manager" },
        { name: "Post New Job", url: "/post-job" },
        { name: "Legacy Admin Panel", url: "/admin" },
      ],
    }] : []),
    {
      title: "Knowledge Center | Recruitment Agencies in Dubai",
      icon: <BookOpen className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Blog Articles", url: "/blogs" },
        { name: "Expert Team Articles", url: "/team-articles" },
        { name: "Career Opportunities", url: "/careers" },
        { name: "Industry Insights", url: "/blogs" },
      ],
    },
    {
      title: "User Account | Executive Search Services",
      icon: <Settings className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "User Profile", url: "/profile" },
        { name: "Forgot Password", url: "/auth/forgot-password" },
      ],
    },
    {
      title: "Legal Information | Headhunting Services",
      icon: <FileText className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Privacy Policy", url: "/privacy-policy" },
        { name: "Terms & Conditions", url: "/terms-conditions" },
        { name: "Site Map", url: "/site-map" },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Site Map | Executive Search UAE | Recruitment Agencies in Dubai | Expert Recruitments LLC</title>
        <meta
          name="description"
          content="Navigate our website easily with our comprehensive site map. Leading headhunters in Dubai and recruitment agencies in UAE offering talent acquisition and executive search services."
        />
        <meta
          name="keywords"
          content="Executive search UAE, Talent acquisition, Recruitment agencies in Dubai, Recruitment agencies in UAE, Head hunting, Head hunters Dubai"
        />
      </Helmet>

      <div className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Site Map | Executive Search UAE
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Navigate our website with ease using this comprehensive guide to all pages and resources available at Expert Recruitments LLC - premier head hunters in Dubai and leading recruitment agencies in UAE offering specialized talent acquisition services.
              </p>
              
              {/* SEO keywords hidden from users but visible to search engines */}
              <div className="hidden" aria-hidden="true">
                <span>Headhunters Dubai</span>
                <span>Executive Search UAE</span>
                <span>Recruitment Agencies in Dubai</span>
                <span>Recruitment Agencies in UAE</span>
                <span>Best Recruitment Agency Dubai</span>
                <span>Top Headhunters in Dubai</span>
                <span>Job Consultants in UAE</span>
                <span>Executive Recruitment Services</span>
                <span>C-Level Executive Search</span>
                <span>Talent Acquisition Specialists</span>
                <span>IT Recruitment Dubai</span>
                <span>Banking Jobs in UAE</span>
                <span>Finance Recruitment Dubai</span>
                <span>Healthcare Jobs in UAE</span>
                <span>Engineering Recruitment UAE</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary border-r border-b border-l border-gray-100 h-full hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="flex items-center mb-5">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {category.title}
                    </h2>
                  </div>
                  <div className="w-full h-0.5 bg-gray-100 mb-4"></div>
                  <ul className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.url}
                          className="text-gray-600 hover:text-primary flex items-center group py-1.5"
                        >
                          <ChevronRight className="h-4 w-4 text-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary border-r border-b border-l border-gray-100 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center mb-5">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Global Office Locations | Recruitment Agencies in Dubai & UAE
                </h2>
              </div>
              <div className="w-full h-0.5 bg-gray-100 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-5 rounded-md hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <h3 className="font-medium text-primary mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Dubai, UAE
                  </h3>
                  <p className="text-gray-600">
                    Office No. 306, Al Shali Building, Dubai, United Arab Emirates
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-md hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <h3 className="font-medium text-primary mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    India
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-gray-600">
                      <span className="font-medium">Navi Mumbai:</span> 302, Foundation Tower, CBD Belapur, Maharashtra
                    </li>
                    <li className="text-gray-600">
                      <span className="font-medium">Lucknow:</span> 05, Kisan Bazar, Bibhuti Nagar, Uttar Pradesh
                    </li>
                    <li className="text-gray-600">
                      <span className="font-medium">Hyderabad:</span> Level 1, Phase 2, N-Heights, Plot No 38, Siddiq Nagar, HITEC City
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-5 rounded-md hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <h3 className="font-medium text-primary mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    New Jersey, USA
                  </h3>
                  <p className="text-gray-600">
                    6 Moyse Place, Suite 302 Edison, New Jersey 08820
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                Back to Homepage <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <p className="text-gray-500 mt-4 text-sm">
                © {new Date().getFullYear()} Expert Recruitments LLC - Premier Head Hunters Dubai & Executive Search UAE. All rights reserved.
              </p>
              <p className="text-gray-400 mt-2 text-xs">
                Leading talent acquisition and recruitment agencies in Dubai and UAE offering specialized headhunting services.
              </p>
              
              {/* Additional hidden SEO keywords related to specific sectors and job functions */}
              <div className="hidden" aria-hidden="true">
                <span>Oil and Gas Recruitment Dubai</span>
                <span>Technology Jobs UAE</span>
                <span>Finance Director Jobs Dubai</span>
                <span>C-Suite Executive Search</span>
                <span>CEO Positions UAE</span>
                <span>CFO Search Dubai</span>
                <span>CTO Positions Middle East</span>
                <span>HR Director Jobs UAE</span>
                <span>Construction Management Recruitment</span>
                <span>Hospitality Leadership Jobs</span>
                <span>Healthcare Executive Recruitment</span>
                <span>Supply Chain Management Jobs</span>
                <span>Digital Marketing Roles UAE</span>
                <span>Senior Management Positions</span>
                <span>Board Member Recruitment Dubai</span>
                <span>COO Positions Middle East</span>
                <span>Sales Director Recruitment</span>
                <span>Gulf Region Job Opportunities</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}