import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, Send, Loader2, Globe, ArrowRight, ChevronDown } from "lucide-react";
import { IndiaFlag, UAEFlag, USAFlag } from "@/components/flags";
import { motion } from "framer-motion";
import OptimizedHeroBackground from "@/components/hero/optimized-hero-background";
import contactHeroBg from "../assets/images/contact-hero-bg.jpg";
import contactHeroBgSmall from "../assets/optimized/images/contact-hero-bg-sm.webp";
import contactHeroBgMedium from "../assets/optimized/images/contact-hero-bg-md.webp";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInquiryForm, setIsInquiryForm] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Parse URL parameters to check if this is an inquiry form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'inquiry') {
      setIsInquiryForm(true);
      // Auto-set subject for employer inquiry forms
      form.setValue('subject', 'Employer Inquiry');
    }
    
    // Pre-fill form with user data if logged in
    if (user) {
      // Set email from the user's email
      form.setValue('email', user.email);
      
      // Fill name if it's available based on user type
      if (user.userType === 'jobseeker' && user.profile && 'firstName' in user.profile) {
        form.setValue('name', `${user.profile.firstName} ${user.profile.lastName}`);
        
        // If phone number is available, set it
        if ('phoneNumber' in user.profile) {
          form.setValue('phone', user.profile.phoneNumber);
        }
      } else if (user.userType === 'employer' && user.profile && 'companyName' in user.profile) {
        form.setValue('name', user.profile.companyName);
        
        // If phone number is available, set it
        if ('phoneNumber' in user.profile) {
          form.setValue('phone', user.profile.phoneNumber);
        }
      }
    }
  }, [location, form, user]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Determine the inquiry type based on user type or form context
      let inquiryType = "contact"; // Default type for anonymous users
      
      if (user) {
        // If user is logged in, set inquiry type based on user type
        inquiryType = user.userType === "employer" ? "business" : "general";
      } else if (isInquiryForm) {
        // If not logged in but using inquiry form, assume business inquiry
        inquiryType = "business";
      }
      
      // Prepare the inquiry data
      const inquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: user?.userType === "employer" && user.profile && 'companyName' in user.profile 
          ? user.profile.companyName 
          : null,
        message: data.message,
        inquiryType: inquiryType, // Set to "business" for employers, "general" for job seekers
        marketing: false // Default setting
      };
      
      console.log("Submitting inquiry:", inquiryData);
      
      // Send to staffing-inquiries endpoint
      const response = await apiRequest("POST", "/api/staffing-inquiries", inquiryData);
      
      if (!response.ok) {
        throw new Error("Failed to send your message");
      }
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connect With Us | Expert Recruitments LLC</title>
        <meta name="description" content="Get in touch with Expert Recruitments across our global offices in India, Dubai, and USA. We're here to help with all your recruitment needs." />
      </Helmet>

      {/* Hero Section with Black Tint - matching Services page style */}
      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Optimized Background Image */}
        <OptimizedHeroBackground 
          imageSrc={contactHeroBg}
          smallImageSrc={contactHeroBgSmall}
          mediumImageSrc={contactHeroBgMedium}
          alt="Contact us banner"
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
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Global Presence</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight drop-shadow-md">
              Connect With Us
            </h1>
            
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-4 max-w-3xl drop-shadow-md">
              Offices in UAE, India, and the United States
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow">
              Our global team is ready to provide personalized recruitment solutions to meet your specific needs.
            </p>
            
            {/* Scroll Down Button */}
            <a 
              href="#contact-content" 
              className="flex flex-col items-center mt-4 text-white/80 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium mb-2">Our Offices</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div id="contact-content" className="container mx-auto px-4 py-16">
        {/* Office Locations Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            Our Global Offices
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            Worldwide Presence, Local Expertise
          </motion.h2>
          <motion.div 
            className="w-16 h-1 bg-primary mx-auto mb-6"
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: {
                  duration: 0.6
                }
              }
            }}
          ></motion.div>
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            With offices across three continents, we deliver excellent recruitment services worldwide.
          </motion.p>
        </motion.div>

        {/* Office Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-10 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
         
          
          {/* Dubai Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            variants={fadeIn}
          >
            <div className="w-full h-48">
              <UAEFlag className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">UAE</h3>
              
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">+9714 331 5588</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a href="mailto:talent@expertrecruitments.com" className="text-primary hover:underline text-lg">
                    talent@expertrecruitments.com
                  </a>
                </div>
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-primary mb-4">Our Location:</h4>
                  
                  <div className="mb-5">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Dubai</p>
                    <p className="text-gray-600 dark:text-gray-400">Office No. 306, Al Shali Building, Dubai, United Arab Emirates</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* India Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            variants={fadeIn}
          >
            <div className="w-full h-48">
              <IndiaFlag className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">INDIA</h3>

              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">+91 84509 79450</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a href="mailto:info@expertrecruitments.com" className="text-primary hover:underline text-lg">
                    info@expertrecruitments.com
                  </a>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-primary mb-4">Our Locations:</h4>

                  <div className="mb-5">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Navi Mumbai</p>
                    <p className="text-gray-600 dark:text-gray-400">302, Foundation Tower, CBD Belapur, Maharashtra</p>
                  </div>

                  <div className="mb-5">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Lucknow</p>
                    <p className="text-gray-600 dark:text-gray-400">05, Kisan Bazar, Bibhuti Nagar, Uttar Pradesh</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Hyderabad</p>
                    <p className="text-gray-600 dark:text-gray-400">Level 1, Phase 2, N-Heights, Plot No 38, Siddiq Nagar, HITEC City</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* USA Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            variants={fadeIn}
          >
            <div className="w-full h-48">
              <USAFlag className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">USA</h3>
              
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a href="mailto:nj@expertrecruitments.com" className="text-primary hover:underline text-lg">
                    nj@expertrecruitments.com
                  </a>
                </div>
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-primary mb-4">Our Location:</h4>
                  
                  <div className="mb-5">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">New Jersey</p>
                    <p className="text-gray-600 dark:text-gray-400">6 Moyse Place, Suite 302 Edison, New Jersey 08820</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Map Section */}
        <motion.div 
          className="mb-24"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="h-2 bg-primary"></div>
            <div className="h-[500px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1785270136026!2d55.17570511503143!3d25.18975998389566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69df66cafc8d%3A0x84a09f0b5b3c4e3f!2sAl%20Shali%20Building%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1619026384553!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Dubai Office Location"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Get in Touch Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            {isInquiryForm ? 'Send Us a Message' : 'Get In Touch'}
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            {isInquiryForm ? 'Tell Us About Your Hiring Needs' : 'Let\'s Start a Conversation'}
          </motion.h2>
          <motion.div 
            className="w-16 h-1 bg-primary mx-auto mb-6"
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: {
                  duration: 0.6
                }
              }
            }}
          ></motion.div>
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6
                }
              }
            }}
          >
            {isInquiryForm 
              ? 'Send us a message about your hiring needs and our expert recruitment team will contact you promptly to discuss solutions tailored for you.'
              : 'Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.'}
          </motion.p>
        </motion.div>

        {/* Contact Form and FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="h-2 bg-primary"></div>
            <div className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Us a Message
                </h3>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="rounded-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@example.com" className="rounded-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" className="rounded-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Job Inquiry" className="rounded-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={isInquiryForm 
                              ? "Please describe your company's hiring needs, positions you're looking to fill, and any specific requirements..." 
                              : "Please tell us how we can help you..."}
                            className="min-h-[150px] rounded-md"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 font-medium group transition-all rounded-md py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="h-2 bg-primary"></div>
            <div className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-8">
                <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="text-lg font-bold mb-3 text-primary">What services do you offer?</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We provide comprehensive recruitment solutions for both employers and job seekers, including executive talent acquisition, career development guidance, and specialized industry placement across the UAE, GCC, and international markets.
                  </p>
                </div>
                
                <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="text-lg font-bold mb-3 text-primary">How can I post a job on your platform?</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To post a job, register as an employer through our platform. Once your account is set up, you can create and manage job listings through your personalized dashboard with full control over the recruitment process.
                  </p>
                </div>
                
                <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="text-lg font-bold mb-3 text-primary">Are your services free for job seekers?</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Yes, job seekers can use our platform to search for jobs, create professional profiles, and apply to positions completely free of charge. We believe in making career opportunities accessible to all qualified professionals.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-3 text-primary">Do you offer international job placement?</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Yes, we work with employers worldwide and can help connect you with opportunities both locally and internationally.Out global network spans across the continents with specialized focus on the UAE, India and the USA.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connect With Us Section - Social Media (Minimalistic, Themed Version) */}
        <motion.div
          className="mb-24 mt-16 text-center bg-gray-50 py-10 rounded-lg border border-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute w-24 h-24 rounded-full bg-primary/5 top-0 right-10 -translate-y-1/2"></div>
            <div className="absolute w-16 h-16 rounded-full bg-primary/5 bottom-0 left-10 translate-y-1/3"></div>
          
            <motion.div 
              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4
                  }
                }
              }}
            >
              Follow Us
            </motion.div>
            
            <motion.h3 
              className="text-xl font-medium text-gray-700 mb-6 relative z-10"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4
                  }
                }
              }}
            >
              Connect with us on social media
            </motion.h3>
            
            {/* Social Media Icons - Modern & Elegant Design */}
            <div className="flex justify-center gap-5 mt-6 relative z-10">
              <motion.a 
                href="https://www.facebook.com/expertrecruitmentsdubai" 
                target="_blank" 
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.1 } 
                  }
                }}
                whileHover={{ 
                  scale: 1.15, 
                  backgroundColor: "#1877F2",
                  boxShadow: "0 10px 15px -3px rgba(24, 119, 242, 0.35)" 
                }}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-700 hover:text-white shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.101 23.691v-9.747H6.627v-3.754h2.474v-2.833c0-2.534 1.513-3.911 3.776-3.911 1.074 0 1.997.079 2.266.114v2.669h-1.56c-1.221 0-1.457.589-1.457 1.451v1.908h2.913l-.379 3.754h-2.534v9.749" />
                </svg>
              </motion.a>
        
              <motion.a 
                href="https://www.linkedin.com/company/expertrecruitmentsllc/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.2 } 
                  }
                }}
                whileHover={{ 
                  scale: 1.15, 
                  backgroundColor: "#0A66C2",
                  boxShadow: "0 10px 15px -3px rgba(10, 102, 194, 0.35)" 
                }}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-700 hover:text-white shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://twitter.com/ExpertRecruitLLC" 
                target="_blank" 
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.3 } 
                  }
                }}
                whileHover={{ 
                  scale: 1.15, 
                  backgroundColor: "#1DA1F2",
                  boxShadow: "0 10px 15px -3px rgba(29, 161, 242, 0.35)" 
                }}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-700 hover:text-white shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://www.instagram.com/expertrecruitmentsdubai/" 
                target="_blank" 
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.4 } 
                  }
                }}
                whileHover={{ 
                  scale: 1.15,
                  boxShadow: "0 10px 15px -3px rgba(193, 53, 132, 0.35)" 
                }}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-700 hover:text-white shadow-md transition-all duration-300 instagram-gradient"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </motion.a>
            </div>
            
            {/* Add Instagram gradient styles */}
            <style jsx>{`
              .instagram-gradient:hover {
                background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
              }
            `}</style>
          </div>
        </motion.div>
      </div>
    </>
  );
}