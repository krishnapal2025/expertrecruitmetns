import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, User, Building, Briefcase, Globe, ChevronRight, MapPin } from "lucide-react";

export default function SiteMap() {
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

  const categories = [
    {
      title: "Main Navigation",
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
      title: "For Job Seekers",
      icon: <User className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Register as Job Seeker", url: "/job-seeker-register" },
        { name: "Find Jobs", url: "/job-board" },
        { name: "Create Resume", url: "/resources/create-resume" },
        { name: "Interview Preparation", url: "/resources/interview-prep" },
        { name: "Career Advice", url: "/resources/career-advice" },
        { name: "Salary Negotiation", url: "/resources/salary-negotiation" },
        { name: "Job Application", url: "/apply" },
        { name: "Login", url: "/auth" },
      ],
    },
    {
      title: "For Employers",
      icon: <Building className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Register as Employer", url: "/employer-register" },
        { name: "Post a Job", url: "/post-job" },
        { name: "Post Manager", url: "/post-manager" },
        { name: "Applications Manager", url: "/applications-manager" },
        { name: "Hire Talent", url: "/hire-talent" },
        { name: "Submit a Vacancy", url: "/vacancy-form" },
        { name: "Inquiry Form", url: "/inquiry-form" },
        { name: "Login", url: "/auth" },
      ],
    },
    {
      title: "Admin Section",
      icon: <Briefcase className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Admin Dashboard", url: "/admin-dashboard" },
        { name: "Admin Login", url: "/admin-login" },
        { name: "Admin Register", url: "/admin-register" },
        { name: "Create Blog", url: "/create-blog" },
        { name: "Post Manager", url: "/post-manager" },
        { name: "Legacy Admin", url: "/admin" },
      ],
    },
    {
      title: "Content & Information",
      icon: <Globe className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Blogs", url: "/blogs" },
        { name: "Team Articles", url: "/team-articles" },
        { name: "Careers", url: "/careers" },
        { name: "Privacy Policy", url: "/privacy-policy" },
        { name: "Terms & Conditions", url: "/terms-conditions" },
        { name: "Site Map", url: "/site-map" },
      ],
    },
    {
      title: "Account Management",
      icon: <User className="h-5 w-5 text-primary mr-2" />,
      links: [
        { name: "Profile", url: "/profile" },
        { name: "Forgot Password", url: "/auth/forgot-password" },
        { name: "Reset Password", url: "/auth/reset-password" },
        { name: "Admin Forgot Password", url: "/admin/forgot-password" },
        { name: "Admin Reset Password", url: "/admin/reset-password" },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Site Map | Expert Recruitments LLC</title>
        <meta
          name="description"
          content="Navigate our website easily with our comprehensive site map. Find all sections and pages of Expert Recruitments LLC."
        />
      </Helmet>

      <div className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Site Map
              </h1>
              <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Use our site map to easily navigate and find all the pages available on the Expert Recruitments LLC website.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    {category.icon && category.icon}
                    <h2 className="text-xl font-semibold text-gray-800">
                      {category.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.url}
                          className="text-gray-600 hover:text-primary flex items-center group"
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
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                Global Offices
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-primary mb-2 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Dubai, UAE
                  </h3>
                  <p className="text-sm text-gray-600">
                    Office No. 306, Al Shali Building, Dubai, United Arab Emirates
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-primary mb-2 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    India
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600">
                      Navi Mumbai: 302, Foundation Tower, CBD Belapur, Maharashtra
                    </li>
                    <li className="text-sm text-gray-600">
                      Lucknow: 05, Kisan Bazar, Bibhuti Nagar, Uttar Pradesh
                    </li>
                    <li className="text-sm text-gray-600">
                      Hyderabad: Level 1, Phase 2, N-Heights, Plot No 38, Siddiq Nagar, HITEC City
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-primary mb-2 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    New Jersey, USA
                  </h3>
                  <p className="text-sm text-gray-600">
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
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Back to Home <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}