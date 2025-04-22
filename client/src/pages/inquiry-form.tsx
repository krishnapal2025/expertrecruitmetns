import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Check, Send } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .optional(),
  company: z.string().optional(),
  inquiryType: z.string(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
  marketing: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function InquiryForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: "",
      message: "",
      marketing: false,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      // In a real app, you would send this data to your API
      console.log("Form submitted:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Inquiry Submitted",
        description: "We've received your inquiry and will contact you soon.",
        variant: "default",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Inquiry Form | EXPERT Recruitments</title>
      </Helmet>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
            <Send size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Send Us an Inquiry</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need more information about our services? Complete the form below and one of our representatives will contact you soon.
          </p>
        </div>

        {isSubmitted ? (
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
                <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                  Your inquiry has been successfully submitted. One of our team members will get in touch with you shortly.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-primary hover:bg-primary/90 rounded-full"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="pt-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="general">General Inquiry</TabsTrigger>
                  <TabsTrigger value="business">Business Inquiry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email address" type="email" {...field} />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="inquiryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inquiry Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select inquiry type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Question</SelectItem>
                                  <SelectItem value="services">Services Information</SelectItem>
                                  <SelectItem value="careers">Careers</SelectItem>
                                  <SelectItem value="feedback">Feedback</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
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
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your inquiry in detail"
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I would like to receive updates about services and news
                              </FormLabel>
                              <FormDescription>
                                We'll never share your email with anyone else.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="text-center pt-4">
                        <Button 
                          type="submit" 
                          className="px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-full"
                        >
                          Submit Inquiry
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="business">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email address" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
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
                            <FormLabel>Inquiry Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select inquiry type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="recruitment">Recruitment Services</SelectItem>
                                <SelectItem value="executive">Executive Search</SelectItem>
                                <SelectItem value="temporary">Temporary Staffing</SelectItem>
                                <SelectItem value="partnership">Business Partnership</SelectItem>
                                <SelectItem value="other">Other Business Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Inquiry Details *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your business needs and how we can help"
                                className="min-h-[150px]"
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
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Subscribe to our business newsletter
                              </FormLabel>
                              <FormDescription>
                                Receive updates on industry trends and recruitment insights.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="text-center pt-4">
                        <Button 
                          type="submit" 
                          className="px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-full"
                        >
                          Submit Business Inquiry
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}