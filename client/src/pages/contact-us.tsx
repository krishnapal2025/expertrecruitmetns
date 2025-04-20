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

      {/* Simple Header */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Connect With Us
          </motion.h1>
          <motion.div 
            className="w-20 h-1 bg-primary mx-auto mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          ></motion.div>
          <motion.p 
            className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Our global team is ready to provide personalized recruitment solutions to meet your specific needs.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Office Locations Section */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <span className="inline-block bg-primary/10 text-xs font-semibold tracking-wider px-3 py-1 rounded-sm text-primary mb-4">
            GLOBAL OFFICES
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Global Presence</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            With offices across three continents, we deliver excellent recruitment services worldwide.
          </p>
        </motion.div>

        {/* Office Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-10 mb-24"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* India Office */}
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
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <span className="inline-block bg-primary/10 text-xs font-semibold tracking-wider px-3 py-1 rounded-sm text-primary mb-4">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question or inquiry? Fill out the form below and our team will get back to you as soon as possible.
          </p>
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
      </div>
    </>
  );
}