import { useState } from "react";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Loader2, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
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

      {/* Hero Section with Executive Theme - matching About Us page */}
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
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Global Presence</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Connect With Us
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Offices in UAE, India, and the United States
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Our global team is ready to provide personalized recruitment solutions to meet your specific needs.
            </motion.p>
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
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">Dubai, UAE</h3>
              <p className="text-gray-600 text-center">Middle East Headquarters</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
            
            <div className="relative bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center h-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">Mumbai, India</h3>
              <p className="text-gray-600 text-center">Asian Operations</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
            
            <div className="relative bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center h-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2 text-center">New Jersey, USA</h3>
              <p className="text-gray-600 text-center">North American Division</p>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-b-lg"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
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
          {/* India Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
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
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-9 w-9 text-primary" />
                </div>
              </div>
              
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
          
          {/* Dubai Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            variants={fadeIn}
          >
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-9 w-9 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">DUBAI</h3>
              
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
          
          {/* USA Office */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            variants={fadeIn}
          >
            <div className="h-2 bg-primary"></div>
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-9 w-9 text-primary" />
                </div>
              </div>
              
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
            Get In Touch
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
            Let's Start a Conversation
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
            Have a question or inquiry? Fill out the form below and our team will get back to you as soon as possible.
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Send Us a Message</h3>
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
                            placeholder="Please tell us how we can help you..."
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
                    Yes, we work with employers worldwide and can help connect you with opportunities both locally and internationally. Our global network spans across three continents with specialized focus on the UAE and GCC regions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connect With Us Section - Social Media (Minimalistic Version) */}
        <motion.div
          className="mb-24 mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h3 
            className="text-xl font-medium text-gray-700 mb-8"
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
          
          {/* Social Media Icons - Minimalistic Row */}
          <div className="flex justify-center space-x-8 md:space-x-12">
            <motion.a 
              href="https://facebook.com/expertrecruitmentsllc" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, delay: 0.1 } 
                }
              }}
              whileHover={{ y: -5 }}
              className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z"/>
              </svg>
            </motion.a>
            
            <motion.a 
              href="https://twitter.com/expertrecruit" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, delay: 0.2 } 
                }
              }}
              whileHover={{ y: -5 }}
              className="text-gray-500 hover:text-black transition-colors duration-300"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </motion.a>
            
            <motion.a 
              href="https://instagram.com/expertrecruitments" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, delay: 0.3 } 
                }
              }}
              whileHover={{ y: -5 }}
              className="text-gray-500 hover:text-pink-500 transition-colors duration-300"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z"/>
              </svg>
            </motion.a>
            
            <motion.a 
              href="https://linkedin.com/company/expert-recruitments-llc" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, delay: 0.4 } 
                }
              }}
              whileHover={{ y: -5 }}
              className="text-gray-500 hover:text-blue-700 transition-colors duration-300"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </>
  );
}