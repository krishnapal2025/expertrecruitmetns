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
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

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

      <div className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Connect With Us!</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to our team and we'll be happy to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-8">
            <div className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Contact Information</span>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 bg-yellow-300 px-4 py-1 rounded-full">INDIA</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg">+91 84509 79450</p>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <a href="mailto:info@expertrecruitments.com" className="text-blue-600 hover:underline text-lg">
                    info@expertrecruitments.com
                  </a>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium mb-2 text-lg">Navi Mumbai:</p>
                    <p className="text-gray-600 mb-6">302, Foundation Tower, CBD Belapur, Maharashtra</p>
                    
                    <p className="text-gray-700 font-medium mb-2 text-lg">Lucknow:</p>
                    <p className="text-gray-600 mb-6">05, Kisan Bazar, Bibhuti Nagar, Lucknow, Uttar Pradesh</p>
                    
                    <p className="text-gray-700 font-medium mb-2 text-lg">Hyderabad:</p>
                    <p className="text-gray-600">Level 1, Phase 2, N-Heights, Plot No 38, Siddiq Nagar, HITEC City, Hyderabad, Telangana</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 bg-yellow-300 px-4 py-1 rounded-full">DUBAI</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg">+9714 331 5588</p>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <a href="mailto:talent@expertrecruitments.com" className="text-blue-600 hover:underline text-lg">
                    talent@expertrecruitments.com
                  </a>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Office No. 306, Al Shali Building, Dubai, United Arab Emirates</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 bg-yellow-300 px-4 py-1 rounded-full">USA</h3>
              </div>
              
              <div>
                <div className="flex items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">6 Moyse Place, Suite 302 Edison, New Jersey 08820</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <a href="mailto:nj@expertrecruitments.com" className="text-blue-600 hover:underline text-lg">
                    nj@expertrecruitments.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Send Us a Message</span>
            </div>
            
            <Card className="shadow-md border-0">
              <CardContent className="pt-8 p-8">
                <h2 className="text-2xl font-bold mb-8 text-blue-800">Get in Touch</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
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
                              <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
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
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Job Inquiry" {...field} />
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
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please tell us how we can help you..."
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-20">
          <div className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
            <span className="font-medium text-primary tracking-wider uppercase text-sm">Our Global Presence</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-8 text-blue-800">Find Us Around the World</h2>
          <div className="h-[450px] rounded-xl overflow-hidden border border-gray-200 shadow-md">
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
        
        {/* FAQ Section */}
        <div className="mt-20 mb-12">
          <div className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
            <span className="font-medium text-primary tracking-wider uppercase text-sm">FAQ</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-8 text-blue-800">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-3 text-blue-700">What services do you offer?</h3>
              <p className="text-gray-700">We provide comprehensive recruitment solutions for both employers and job seekers, including talent acquisition, career development, and specialized industry placement.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-3 text-blue-700">How can I post a job on your platform?</h3>
              <p className="text-gray-700">To post a job, you'll need to register as an employer. Once registered, you can create and manage job listings through your dashboard.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-3 text-blue-700">Are your services free for job seekers?</h3>
              <p className="text-gray-700">Yes, job seekers can use our platform to search for jobs, create profiles, and apply to positions free of charge.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-3 text-blue-700">Do you offer international job placement?</h3>
              <p className="text-gray-700">Yes, we work with employers worldwide and can help connect you with opportunities both locally and internationally.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
