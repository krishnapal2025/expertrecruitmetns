import { useState } from "react";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2, Building, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import businessImage from "../assets/business-people-shaking-hands-meeting-room.jpg";
import { apiRequest, queryClient } from "@/lib/queryClient";

const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  inquiryType: z.enum(["executive", "midlevel", "entrylevel", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  marketing: z.boolean().default(false),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function EmployerInquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: "executive",
      message: "",
      marketing: false,
    },
  });

  async function onSubmit(data: InquiryFormValues) {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/staffing-inquiries", data);
      
      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }
      
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your inquiry. Our team will contact you shortly.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Employer Inquiry Form | Expert Recruitments LLC</title>
        <meta name="description" content="Submit your staffing and recruitment inquiries. Our expert team will help you find the talent you need." />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {/* Hero Section */}
        <div 
          className="w-full bg-gradient-to-r from-primary/90 to-primary pt-10 pb-10 md:pb-16 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--primary-rgb), 0.92), rgba(var(--primary-rgb), 0.85))`,
          }}
        >
          <div className="absolute inset-0 z-0 opacity-20" style={{ 
            backgroundImage: `url(${businessImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Employer Inquiry Form
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Let us know your staffing needs and our expert recruitment team will get back to you with tailored solutions.
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Section */}
            <motion.div 
              className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="h-2 bg-primary"></div>
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Your Inquiry</h2>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field} 
                              />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Your email address" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your phone number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your company name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recruitment Type</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="executive">Executive Search</option>
                              <option value="midlevel">Mid-Level Positions</option>
                              <option value="entrylevel">Entry-Level Roles</option>
                              <option value="other">Other Recruitment Needs</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your staffing needs, number of open positions, timeline, and any specific requirements" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="marketing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Subscribe to Updates
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              I would like to receive updates about recruitment trends and services.
                            </p>
                          </div>
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div 
              className="lg:col-span-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
                <div className="h-2 bg-primary"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">What Sets Us Apart</h3>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    What sets us apart from other recruitment agencies in Dubai is our unwavering dedication to delivering growth. When talent acquisition works properly, it takes your organization to the next level of its development.
                  </p>
                  
                  <ul className="space-y-4">
                    <motion.li 
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">Embracing Technology</span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">We embrace the latest technologies – including AI and Machine Learning – to ensure we're one step ahead of other recruiters when it comes to securing best-in-class talent.</p>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">Prioritizing Experience</span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">We focus on matching specific industry experience with the right positions. The talent acquisition work we do empowers businesses to deliver their commercial objectives.</p>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">Leveraging Big Data</span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">By processing and utilizing huge volumes of industry-specific data, our executive search experts in Dubai gain the insights needed to develop effective recruiting strategies.</p>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">Industry-Specific Services</span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Our executive search professionals and head hunters in Dubai tailor our proven search strategies according to the specific needs of each industry we serve.</p>
                      </div>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <ArrowRight className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">Exceeding Client Expectations</span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Your success is our success. That's why we'll go the extra mile to ensure your team has the skills and qualities it needs to succeed.</p>
                      </div>
                    </motion.li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="h-2 bg-primary"></div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Comprehensive Recruitment Process</h3>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-5">
                    At Expert Recruitments, we work tirelessly to ensure a comprehensive and meticulous approach to executive search in Dubai and across the UAE. Our experienced recruiting agents use a proven talent acquisition process that guarantees best-in-class employees who exceed the expectations of our clients.
                  </p>
                  
                  <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                    <motion.li className="ml-6" variants={fadeIn}>
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 text-xs text-white">1</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Detailed Requirement Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Understanding your organization's culture, values, and specific staffing needs</p>
                    </motion.li>
                    
                    <motion.li className="ml-6" variants={fadeIn}>
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 text-xs text-white">2</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Strategic Talent Sourcing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Leveraging our extensive network and cutting-edge technologies to identify top talent</p>
                    </motion.li>
                    
                    <motion.li className="ml-6" variants={fadeIn}>
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 text-xs text-white">3</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Rigorous Screening & Assessment</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive evaluation of skills, experience, and cultural fit through our meticulous process</p>
                    </motion.li>
                    
                    <motion.li className="ml-6" variants={fadeIn}>
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 text-xs text-white">4</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Precise Candidate Matching</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Presenting only the most qualified candidates who will drive your organization's growth</p>
                    </motion.li>
                    
                    <motion.li className="ml-6" variants={fadeIn}>
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 text-xs text-white">5</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Comprehensive Onboarding Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ensuring a smooth transition and long-term success for both employer and employee</p>
                    </motion.li>
                  </ol>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "By utilizing tried-and-tested executive search and head-hunting processes in the UAE, we give our clients the talent they need quickly and efficiently. Whether we're serving businesses in Dubai, the wider GCC region, India, or Europe, our attention to detail and meticulous approach guarantees results."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}