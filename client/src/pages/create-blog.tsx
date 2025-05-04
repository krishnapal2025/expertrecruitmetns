import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, List, ListOrdered, FileEdit, Upload, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Blog post creation schema for the form
// Note: This schema matches the database schema in shared/schema.ts but with some form-specific modifications
const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  subtitle: z.string().max(150, "Subtitle must be less than 150 characters").optional(),
  slug: z.string().max(100, "Slug must be less than 100 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  // Allow either a valid URL or an empty string for bannerImage
  bannerImage: z.string()
    .refine(val => val === '' || val.startsWith('http'), {
      message: "Please enter a valid image URL or upload an image",
    })
    .optional(),
  published: z.boolean().default(true),
  category: z.string().min(1, "Please select a category"),
  // Tags are entered as a comma-separated string in the form
  tags: z.string().optional(),
  readTime: z.string().optional(),
  excerpt: z.string().optional(),
  metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional(),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

const CreateBlogPage = () => {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for file upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  type ContentSection = {
    type: 'paragraph' | 'header' | 'image';
    content: string;
    format?: {
      color?: string;
      alignment?: string;
      size?: string;
      weight?: string;
      style?: string;
      fontSize?: string; // Added fontSize property for the numerical input
    };
  };

  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { 
      type: 'paragraph', 
      content: '',
      format: {
        alignment: 'left'
      }
    }
  ]);
  
  // State for title formatting
  const [titleFormatting, setTitleFormatting] = useState({
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '2xl',
    customFontSize: '24px',
    alignment: 'left',
    color: 'primary'
  });
  
  // State for subtitle formatting
  const [subtitleFormatting, setSubtitleFormatting] = useState({
    fontStyle: 'normal',
    fontWeight: 'medium',
    fontSize: 'lg',
    customFontSize: '18px',
    alignment: 'left',
    color: 'gray-600'
  });
  
  // State for preview content
  const [previewHtml, setPreviewHtml] = useState<string>("");
  
  // Check if user is admin
  if (user?.userType !== "admin") {
    navigate("/admin-login");
    return null;
  }

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      content: "",
      bannerImage: "",
      published: false,
      category: "",
      tags: "",
      metaDescription: "",
    },
  });

  // Update preview when content changes
  useEffect(() => {
    const title = form.getValues('title');
    const subtitle = form.getValues('subtitle');
    const bannerImage = form.getValues('bannerImage');
    
    let previewContent = '';
    
    // Title always appears first in the preview/published blog
    if (title) {
      previewContent += `<h1 class="font-${titleFormatting.fontWeight} font-${titleFormatting.fontStyle} text-${titleFormatting.alignment} text-${titleFormatting.color} mb-4" style="font-size: ${titleFormatting.customFontSize};">${title}</h1>`;
    }
    
    // Banner image appears after the title
    if (bannerImage) {
      previewContent += `
      <div class="w-full overflow-hidden rounded-lg mb-4">
        <div class="relative w-full" style="padding-top: 56.25%"> <!-- 16:9 aspect ratio -->
          <img 
            src="${bannerImage}" 
            alt="Banner" 
            class="absolute top-0 left-0 w-full h-full object-cover"
            onerror="this.src='https://placehold.co/600x338?text=Invalid+Image+URL'" 
          />
        </div>
      </div>`;
    }
    
    if (subtitle) {
      previewContent += `<p class="font-${subtitleFormatting.fontWeight} font-${subtitleFormatting.fontStyle} text-${subtitleFormatting.alignment} text-${subtitleFormatting.color} mb-6" style="font-size: ${subtitleFormatting.customFontSize};">${subtitle}</p>`;
    }
    
    previewContent += '<div class="prose max-w-none">';
    contentSections.forEach(section => {
      if (section.type === 'header' && section.content) {
        // Get the selected header color and other formatting options
        const headerColor = section.format?.color || "slate-900"; // Default color if not set
        const alignment = section.format?.alignment || "left"; // Default alignment if not set
        const fontSize = section.format?.fontSize || "24px"; // Default font size if not set
        
        previewContent += `<h2 class="font-semibold my-4 text-${headerColor} text-${alignment}" style="font-size: ${fontSize};">${section.content}</h2>`;
      } else if (section.type === 'paragraph' && section.content) {
        // Get the formatting options for paragraphs
        const fontSize = section.format?.fontSize || "16px"; // Default font size if not set
        const alignment = section.format?.alignment || "left"; // Default alignment if not set
        
        previewContent += `<div class="my-4 text-${alignment}" style="font-size: ${fontSize};">${section.content}</div>`;
      } else if (section.type === 'image' && section.content) {
        previewContent += `
          <div class="my-6">
            <div class="rounded-md overflow-hidden">
              <div class="relative w-full" style="padding-top: 56.25%"> <!-- 16:9 aspect ratio -->
                <img 
                  src="${section.content}" 
                  alt="Blog image" 
                  class="absolute top-0 left-0 w-full h-full object-cover" 
                  onerror="this.src='https://placehold.co/600x338?text=Invalid+Image+URL'" 
                />
              </div>
            </div>
          </div>
        `;
      }
    });
    previewContent += '</div>';
    
    setPreviewHtml(previewContent);
  }, [form, contentSections, titleFormatting, subtitleFormatting]);

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      // Convert tags from string to array for the API
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      // Create API-compatible data structure
      const postData = {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        bannerImage: data.bannerImage,
        category: data.category,
        excerpt: data.excerpt,
        readTime: data.readTime,
        metaDescription: data.metaDescription,
        slug: data.slug,
        published: data.published,
        tags: tagsArray, // Pass as array to the API
      };

      console.log("Submitting blog post:", postData);
      
      const response = await apiRequest("POST", "/api/blog-posts", postData);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to create blog post");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate the blog posts query cache so the updated list shows immediately
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      
      // Navigate to the blog post
      if (data.slug) {
        navigate(`/article/${data.slug}`);
      } else {
        navigate("/blogs");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    console.log("Form submitted with data:", data);
    
    // Make sure content is being populated
    if (!data.content || data.content.trim().length < 100) {
      toast({
        title: "Content too short",
        description: "Please add more content to your blog post (minimum 100 characters)",
        variant: "destructive",
      });
      return;
    }
    
    // Generate slug if one doesn't exist
    const slug = data.slug || data.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    // Pass the form data directly - the mutation function will handle the tags conversion
    // Don't convert tags to array here; it will be done in the mutation function
    const submissionData = {
      ...data,
      slug,
      readTime: data.readTime || "5 min read",
      excerpt: data.excerpt || data.content.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
    };
    
    console.log("Submitting data:", submissionData);
    createBlogMutation.mutate(submissionData);
  };

  const addSection = (type: 'paragraph' | 'header' | 'image') => {
    // Initialize with default format options
    setContentSections([...contentSections, { 
      type, 
      content: '',
      format: {
        color: type === 'header' ? 'slate-900' : undefined,
        alignment: 'left'
      }
    }]);
  };

  const updateSection = (index: number, content: string) => {
    console.log(`Updating section ${index} with content length: ${content.length}`);
    
    const newSections = [...contentSections];
    newSections[index].content = content;
    setContentSections(newSections);
    
    // Just store the HTML content directly
    const allContent = newSections
      .map(section => section.content)
      .join('');
    
    console.log(`Total content length: ${allContent.length}`);
    
    // This triggers validation and updates the form
    form.setValue('content', allContent, { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const updateSectionFormat = (index: number, formatKey: string, formatValue: string) => {
    const newSections = [...contentSections];
    if (!newSections[index].format) {
      newSections[index].format = {};
    }
    newSections[index].format = {
      ...newSections[index].format,
      [formatKey]: formatValue
    };
    setContentSections(newSections);
  };

  const removeSection = (index: number) => {
    if (contentSections.length > 1) {
      const newSections = [...contentSections];
      newSections.splice(index, 1);
      setContentSections(newSections);
    }
  };

  const blogCategories = [
    "Career Development",
    "Industry Insights",
    "Recruitment Tips",
    "Job Market Trends",
    "Interview Advice",
    "Leadership",
    "HR Practices",
    "Work-Life Balance",
    "Technology",
    "Career Change",
    "Professional Growth"
  ];

  return (
    <div className="container max-w-7xl py-12">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Column */}
        <div className="w-full lg:w-[55%]">
          <Card className="w-full shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-3xl font-bold text-primary">Create New Blog Post</CardTitle>
              <CardDescription>
                Add a new article to the Expert Recruitments blog
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-4 mb-2">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Style</h4>
                                <Select 
                                  defaultValue={titleFormatting.fontStyle}
                                  onValueChange={(value) => setTitleFormatting({...titleFormatting, fontStyle: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Style" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Weight</h4>
                                <Select 
                                  defaultValue={titleFormatting.fontWeight}
                                  onValueChange={(value) => setTitleFormatting({...titleFormatting, fontWeight: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Weight" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semibold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra Bold</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Size (px)</h4>
                                <div className="flex items-center">
                                  <Input 
                                    type="number" 
                                    min="12" 
                                    max="72" 
                                    defaultValue="24" 
                                    className="w-24"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const fontSize = parseInt(value) ? `${value}px` : '24px';
                                      setTitleFormatting({...titleFormatting, customFontSize: fontSize});
                                    }}
                                  />
                                  <span className="ml-2">px</span>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Text Alignment</h4>
                                <ToggleGroup 
                                  type="single" 
                                  defaultValue={titleFormatting.alignment} 
                                  onValueChange={(value) => {
                                    if (value) setTitleFormatting({...titleFormatting, alignment: value});
                                  }}
                                  className="justify-start"
                                >
                                  <ToggleGroupItem value="left" aria-label="Align left" title="Align Left">
                                    <AlignLeft className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="center" aria-label="Align center" title="Align Center">
                                    <AlignCenter className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="right" aria-label="Align right" title="Align Right">
                                    <AlignRight className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Text Color</h4>
                                <Select 
                                  defaultValue={titleFormatting.color}
                                  onValueChange={(value) => setTitleFormatting({...titleFormatting, color: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-primary mr-2" />
                                        <span>Primary</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="slate-900">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-slate-900 mr-2" />
                                        <span>Black</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="gray-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gray-600 mr-2" />
                                        <span>Gray</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="blue-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 mr-2" />
                                        <span>Blue</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="green-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-green-600 mr-2" />
                                        <span>Green</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="red-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-red-600 mr-2" />
                                        <span>Red</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="purple-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-purple-600 mr-2" />
                                        <span>Purple</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="amber-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-amber-600 mr-2" />
                                        <span>Amber</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <FormControl>
                            <Input 
                              placeholder="Enter blog title" 
                              {...field} 
                              className={`text-${titleFormatting.fontSize} font-${titleFormatting.fontWeight} font-${titleFormatting.fontStyle} text-${titleFormatting.alignment} text-${titleFormatting.color}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle</FormLabel>
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-4 mb-2">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Style</h4>
                                <Select 
                                  defaultValue={subtitleFormatting.fontStyle}
                                  onValueChange={(value) => setSubtitleFormatting({...subtitleFormatting, fontStyle: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Style" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Weight</h4>
                                <Select 
                                  defaultValue={subtitleFormatting.fontWeight}
                                  onValueChange={(value) => setSubtitleFormatting({...subtitleFormatting, fontWeight: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Weight" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semibold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Font Size (px)</h4>
                                <div className="flex items-center">
                                  <Input 
                                    type="number" 
                                    min="12" 
                                    max="50" 
                                    defaultValue="18" 
                                    className="w-24"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const fontSize = parseInt(value) ? `${value}px` : '18px';
                                      setSubtitleFormatting({...subtitleFormatting, customFontSize: fontSize});
                                    }}
                                  />
                                  <span className="ml-2">px</span>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Text Alignment</h4>
                                <ToggleGroup 
                                  type="single" 
                                  defaultValue={subtitleFormatting.alignment} 
                                  onValueChange={(value) => {
                                    if (value) setSubtitleFormatting({...subtitleFormatting, alignment: value});
                                  }}
                                  className="justify-start"
                                >
                                  <ToggleGroupItem value="left" aria-label="Align left" title="Align Left">
                                    <AlignLeft className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="center" aria-label="Align center" title="Align Center">
                                    <AlignCenter className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="right" aria-label="Align right" title="Align Right">
                                    <AlignRight className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Text Color</h4>
                                <Select 
                                  defaultValue={subtitleFormatting.color}
                                  onValueChange={(value) => setSubtitleFormatting({...subtitleFormatting, color: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="slate-900">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-slate-900 mr-2" />
                                        <span>Black</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="gray-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gray-600 mr-2" />
                                        <span>Gray</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="slate-700">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-slate-700 mr-2" />
                                        <span>Dark Gray</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="primary">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-primary mr-2" />
                                        <span>Primary</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="blue-500">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                                        <span>Blue</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="green-500">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                                        <span>Green</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="amber-500">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-amber-500 mr-2" />
                                        <span>Amber</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="purple-500">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
                                        <span>Purple</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <FormControl>
                            <Input 
                              placeholder="Enter optional subtitle" 
                              {...field} 
                              className={`text-${subtitleFormatting.fontSize} font-${subtitleFormatting.fontWeight} font-${subtitleFormatting.fontStyle} text-${subtitleFormatting.alignment} text-${subtitleFormatting.color}`} 
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
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="blog-post-url (leave empty to generate automatically)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {blogCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bannerImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Enter URL</label>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Or Upload Image</label>
                                <div 
                                  className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => {
                                    const fileInput = document.getElementById('blog-banner-upload') as HTMLInputElement;
                                    if (fileInput) fileInput.click();
                                  }}
                                >
                                  <input 
                                    type="file" 
                                    id="blog-banner-upload" 
                                    className="hidden" 
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={async (e) => {
                                      if (!e.target.files?.[0]) return;
                                      
                                      const file = e.target.files[0];
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast({
                                          title: "File too large",
                                          description: "Image must be less than 5MB",
                                          variant: "destructive",
                                        });
                                        return;
                                      }
                                      
                                      // Create form data for upload
                                      const formData = new FormData();
                                      formData.append('image', file);
                                      
                                      setIsUploading(true);
                                      setUploadProgress(10); // Start progress
                                      
                                      try {
                                        // Call the upload API
                                        const response = await fetch('/api/upload/blog-image', {
                                          method: 'POST',
                                          body: formData,
                                          credentials: 'include',
                                        });
                                        
                                        setUploadProgress(75); // Update progress
                                        
                                        if (!response.ok) {
                                          const errorData = await response.json();
                                          throw new Error(errorData.message || 'Upload failed');
                                        }
                                        
                                        const data = await response.json();
                                        setUploadProgress(100); // Complete progress
                                        
                                        // Update the form field with the uploaded image URL
                                        field.onChange(data.file.path);
                                        
                                        toast({
                                          title: "Upload successful",
                                          description: "Image uploaded successfully",
                                        });
                                      } catch (error) {
                                        console.error('Error uploading image:', error);
                                        toast({
                                          title: "Upload failed",
                                          description: error instanceof Error ? error.message : 'Image upload failed',
                                          variant: "destructive",
                                        });
                                      } finally {
                                        setTimeout(() => {
                                          setIsUploading(false);
                                          setUploadProgress(0);
                                        }, 500);
                                      }
                                    }}
                                  />
                                  
                                  {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                      <div className="text-sm text-gray-600">Uploading... {uploadProgress}%</div>
                                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary rounded-full" 
                                          style={{ width: `${uploadProgress}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-8 w-8 text-gray-400" />
                                      <div className="text-sm text-gray-500">Click to upload image</div>
                                      <div className="text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 5MB</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Banner images will be displayed in 16:9 aspect ratio
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues('bannerImage') && (
                    <div className="mt-3">
                      <div className="rounded-md overflow-hidden border border-border">
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
                          <img
                            src={form.getValues('bannerImage')}
                            alt="Banner preview"
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/600x338?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Banner image preview (16:9 aspect ratio)
                      </p>
                    </div>
                  )}

                  <Separator className="my-6" />
                  
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="text-xl font-medium mb-6 flex items-center text-primary">
                      <FileEdit className="h-5 w-5 mr-2" />
                      Content Sections
                    </h3>
                    
                    {contentSections.map((section, index) => (
                      <div 
                        key={index} 
                        className="mb-8 p-5 border border-slate-200 rounded-md bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-3 pb-2 border-b">
                          <div>
                            <Badge variant="outline" className="text-sm font-medium">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                            </Badge>
                          </div>
                          <Button 
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(index)}
                            disabled={contentSections.length <= 1}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">Remove</span>
                          </Button>
                        </div>
                        
                        {section.type === 'paragraph' && (
                          <div>
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <h4 className="text-sm font-medium w-full mb-1">Text Formatting</h4>
                                <ToggleGroup type="multiple" className="justify-start">
                                  <ToggleGroupItem value="bold" aria-label="Toggle bold" title="Bold">
                                    <Bold className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="italic" aria-label="Toggle italic" title="Italic">
                                    <Italic className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="align-left" aria-label="Align left" title="Align Left">
                                    <AlignLeft className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="align-center" aria-label="Align center" title="Align Center">
                                    <AlignCenter className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="align-right" aria-label="Align right" title="Align Right">
                                    <AlignRight className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <h4 className="text-sm font-medium w-full mb-1">Lists</h4>
                                <ToggleGroup type="single" className="justify-start">
                                  <ToggleGroupItem value="bullet" aria-label="Bullet list" title="Bullet List">
                                    <List className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="numbered" aria-label="Numbered list" title="Numbered List">
                                    <ListOrdered className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                <h4 className="text-sm font-medium w-full mb-1">Font Size (px)</h4>
                                <div className="flex items-center">
                                  <Input 
                                    type="number" 
                                    min="12" 
                                    max="36" 
                                    defaultValue="16" 
                                    className="w-24"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const fontSize = parseInt(value) ? `${value}px` : '16px';
                                      updateSectionFormat(index, 'fontSize', fontSize);
                                    }}
                                  />
                                  <span className="ml-2">px</span>
                                </div>
                              </div>
                            </div>
                            
                            <ReactQuill
                              theme="snow"
                              value={section.content}
                              onChange={(content) => updateSection(index, content)}
                              placeholder="Enter paragraph text"
                              modules={{
                                toolbar: [
                                  ['bold', 'italic', 'underline', 'strike'],
                                  [{ 'align': [] }],
                                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                  [{ 'size': ['small', false, 'large', 'huge'] }],
                                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                  ['clean']
                                ]
                              }}
                              className="min-h-[300px]"
                            />
                          </div>
                        )}
                        
                        {section.type === 'header' && (
                          <div>
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <h4 className="text-sm font-medium w-full mb-1">Heading Size (px)</h4>
                                <div className="flex items-center">
                                  <Input 
                                    type="number" 
                                    min="16" 
                                    max="48" 
                                    defaultValue="24" 
                                    className="w-24"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const fontSize = parseInt(value) ? `${value}px` : '24px';
                                      updateSectionFormat(index, 'fontSize', fontSize);
                                    }}
                                  />
                                  <span className="ml-2">px</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <h4 className="text-sm font-medium w-full mb-1">Alignment</h4>
                                <ToggleGroup 
                                  type="single" 
                                  className="justify-start"
                                  value={section.format?.alignment || 'left'}
                                  onValueChange={(value) => {
                                    if (value) updateSectionFormat(index, 'alignment', value);
                                  }}
                                >
                                  <ToggleGroupItem value="left" aria-label="Align left" title="Align Left">
                                    <AlignLeft className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="center" aria-label="Align center" title="Align Center">
                                    <AlignCenter className="h-4 w-4" />
                                  </ToggleGroupItem>
                                  <ToggleGroupItem value="right" aria-label="Align right" title="Align Right">
                                    <AlignRight className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                <h4 className="text-sm font-medium w-full mb-1">Heading Color</h4>
                                <Select 
                                  value={section.format?.color || 'slate-900'}
                                  onValueChange={(value) => updateSectionFormat(index, 'color', value)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-primary mr-2" />
                                        <span>Primary</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="slate-900">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-slate-900 mr-2" />
                                        <span>Black</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="gray-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gray-600 mr-2" />
                                        <span>Gray</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="blue-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 mr-2" />
                                        <span>Blue</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="green-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-green-600 mr-2" />
                                        <span>Green</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="red-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-red-600 mr-2" />
                                        <span>Red</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="purple-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-purple-600 mr-2" />
                                        <span>Purple</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="amber-600">
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-amber-600 mr-2" />
                                        <span>Amber</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <Input
                              value={section.content}
                              onChange={(e) => updateSection(index, e.target.value)}
                              placeholder="Enter header text"
                              className="text-lg font-semibold"
                            />
                          </div>
                        )}
                        
                        {section.type === 'image' && (
                          <div className="space-y-2">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <Input
                                  value={section.content}
                                  onChange={(e) => updateSection(index, e.target.value)}
                                  placeholder="Enter image URL"
                                  className="mb-1"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Images will be displayed in 16:9 aspect ratio
                                </p>
                              </div>
                              <Button 
                                type="button"
                                variant="outline"
                                className="h-10 mt-0 px-3"
                                onClick={() => {
                                  // This is just a UI placeholder. For actual implementation, we'd need to handle file uploads
                                  toast({
                                    title: "Upload Image",
                                    description: "Currently only supporting image URLs. File uploads will be implemented in a future version.",
                                  });
                                }}
                              >
                                Upload
                              </Button>
                            </div>
                            
                            {section.content && (
                              <div className="mt-3">
                                <div className="rounded-md overflow-hidden border border-border">
                                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
                                    <img
                                      src={section.content}
                                      alt="Image preview"
                                      className="absolute top-0 left-0 w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x338?text=Invalid+Image+URL';
                                      }}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Preview of 16:9 image display
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addSection('header')}
                        className="flex items-center"
                      >
                        <span className="mr-1">Add Heading</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addSection('paragraph')}
                        className="flex items-center"
                      >
                        <span className="mr-1">Add Paragraph</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addSection('image')}
                        className="flex items-center"
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        <span>Add Image</span>
                      </Button>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          {/* Visible for debugging */}
                          <div className="space-y-2">
                            <Textarea 
                              {...field} 
                              className="font-mono text-xs h-20"
                              placeholder="Content will be populated from the editor sections above"
                            />
                            <p className="text-xs text-muted-foreground">
                              This field is automatically populated from the editor sections above. 
                              You don't need to edit it directly.
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="tag1, tag2, tag3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description (SEO)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description for search engines"
                              {...field}
                              className="resize-none h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Publish Immediately
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Toggle off to save as draft
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-between px-0">
                    <Button variant="outline" type="button" onClick={() => navigate("/admin-dashboard")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBlogMutation.isPending}>
                      {createBlogMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Create Blog Post"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Column */}
        <div className="w-full lg:w-[45%]">
          <Card className="w-full h-full shadow-md sticky top-6">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl font-bold text-primary flex items-center">
                <span className="mr-2">Preview</span>
              </CardTitle>
              <CardDescription>
                See how your blog post will look
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto bg-white" style={{ maxHeight: 'calc(100vh - 170px)' }}>
              <div className="rounded-md border p-4 bg-white">
                {!previewHtml ? (
                  <div className="py-12 text-center text-gray-500">
                    <p>Your blog post preview will appear here as you type</p>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;