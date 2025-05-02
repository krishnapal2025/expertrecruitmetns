import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, List, ListOrdered, FileEdit } from "lucide-react";
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

// Blog post creation schema
const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  subtitle: z.string().max(150, "Subtitle must be less than 150 characters").optional(),
  slug: z.string().max(100, "Slug must be less than 100 characters").optional(),
  content: z.string().min(100, "Content must be at least 100 characters"),
  bannerImage: z.string().url("Please enter a valid image URL").optional(),
  published: z.boolean().default(false),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional(),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

const CreateBlogPage = () => {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contentSections, setContentSections] = useState<{ type: 'paragraph' | 'header' | 'image'; content: string }[]>([
    { type: 'paragraph', content: '' }
  ]);
  
  // State for title formatting
  const [titleFormatting, setTitleFormatting] = useState({
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '2xl',
    alignment: 'left'
  });
  
  // State for subtitle formatting
  const [subtitleFormatting, setSubtitleFormatting] = useState({
    fontStyle: 'normal',
    fontWeight: 'medium',
    fontSize: 'lg',
    alignment: 'left'
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
    
    if (bannerImage) {
      previewContent += `<div class="w-full h-56 overflow-hidden rounded-t-lg">
        <img src="${bannerImage}" alt="Banner" class="w-full h-full object-cover" />
      </div>`;
    }
    
    if (title) {
      previewContent += `<h1 class="text-3xl font-bold mt-6 mb-2">${title}</h1>`;
    }
    
    if (subtitle) {
      previewContent += `<p class="text-xl text-gray-600 mb-6">${subtitle}</p>`;
    }
    
    previewContent += '<div class="prose max-w-none">';
    contentSections.forEach(section => {
      if (section.type === 'header' && section.content) {
        previewContent += `<h2 class="text-xl font-semibold my-4">${section.content}</h2>`;
      } else if (section.type === 'paragraph' && section.content) {
        previewContent += `<div class="my-4">${section.content}</div>`;
      } else if (section.type === 'image' && section.content) {
        previewContent += `<div class="my-6"><img src="${section.content}" alt="Blog image" class="w-full rounded-md" /></div>`;
      }
    });
    previewContent += '</div>';
    
    setPreviewHtml(previewContent);
  }, [form, contentSections]);

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      // Compile content from sections
      const compiledContent = contentSections
        .map(section => {
          if (section.type === 'header') {
            return `## ${section.content}\n\n`;
          } else if (section.type === 'paragraph') {
            return `${section.content}\n`;
          } else if (section.type === 'image') {
            return `![image](${section.content})\n\n`;
          }
          return '';
        })
        .join('');

      // Update data with compiled content
      const postData = {
        ...data,
        content: compiledContent,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      const response = await apiRequest("POST", "/api/blog-posts", postData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the blog posts query cache so the updated list shows immediately
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      navigate("/admin-dashboard");
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
    createBlogMutation.mutate(data);
  };

  const addSection = (type: 'paragraph' | 'header' | 'image') => {
    setContentSections([...contentSections, { type, content: '' }]);
  };

  const updateSection = (index: number, content: string) => {
    const newSections = [...contentSections];
    newSections[index].content = content;
    setContentSections(newSections);
    
    // Update the form content field with compiled content
    const compiledContent = newSections
      .map(section => {
        if (section.type === 'header') {
          return `## ${section.content}\n\n`;
        } else if (section.type === 'paragraph') {
          return `${section.content}\n`;
        } else if (section.type === 'image') {
          return `![image](${section.content})\n\n`;
        }
        return '';
      })
      .join('');
    
    form.setValue('content', compiledContent);
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
        <div className="w-full lg:w-3/5">
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
                                <h4 className="text-sm font-medium mb-1">Font Size</h4>
                                <Select 
                                  defaultValue={titleFormatting.fontSize}
                                  onValueChange={(value) => setTitleFormatting({...titleFormatting, fontSize: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="lg">Large</SelectItem>
                                    <SelectItem value="xl">Extra Large</SelectItem>
                                    <SelectItem value="2xl">2XL</SelectItem>
                                    <SelectItem value="3xl">3XL</SelectItem>
                                    <SelectItem value="4xl">4XL</SelectItem>
                                  </SelectContent>
                                </Select>
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
                            </div>
                          </div>
                          <FormControl>
                            <Input 
                              placeholder="Enter blog title" 
                              {...field} 
                              className={`text-${titleFormatting.fontSize} font-${titleFormatting.fontWeight} font-${titleFormatting.fontStyle} text-${titleFormatting.alignment}`}
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
                                <h4 className="text-sm font-medium mb-1">Font Size</h4>
                                <Select 
                                  defaultValue={subtitleFormatting.fontSize}
                                  onValueChange={(value) => setSubtitleFormatting({...subtitleFormatting, fontSize: value})}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="base">Normal</SelectItem>
                                    <SelectItem value="lg">Large</SelectItem>
                                    <SelectItem value="xl">Extra Large</SelectItem>
                                    <SelectItem value="2xl">2XL</SelectItem>
                                  </SelectContent>
                                </Select>
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
                            </div>
                          </div>
                          <FormControl>
                            <Input 
                              placeholder="Enter optional subtitle" 
                              {...field} 
                              className={`text-${subtitleFormatting.fontSize} font-${subtitleFormatting.fontWeight} font-${subtitleFormatting.fontStyle} text-${subtitleFormatting.alignment} text-gray-600`} 
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
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues('bannerImage') && (
                    <div className="mt-2 rounded-md overflow-hidden border border-border">
                      <img
                        src={form.getValues('bannerImage')}
                        alt="Banner preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                        }}
                      />
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
                                <h4 className="text-sm font-medium w-full mb-1">Font Size</h4>
                                <Select
                                  onValueChange={(value) => console.log('Font size changed:', value)}
                                  defaultValue="normal"
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="xl">Extra Large</SelectItem>
                                  </SelectContent>
                                </Select>
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
                              className="min-h-[150px]"
                            />
                          </div>
                        )}
                        
                        {section.type === 'header' && (
                          <div>
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <h4 className="text-sm font-medium w-full mb-1">Heading Style</h4>
                                <Select
                                  onValueChange={(value) => console.log('Header style changed:', value)}
                                  defaultValue="h2"
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Heading Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="h1">Heading 1 (Largest)</SelectItem>
                                    <SelectItem value="h2">Heading 2</SelectItem>
                                    <SelectItem value="h3">Heading 3</SelectItem>
                                    <SelectItem value="h4">Heading 4</SelectItem>
                                    <SelectItem value="h5">Heading 5 (Smallest)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <h4 className="text-sm font-medium w-full mb-1">Alignment</h4>
                                <ToggleGroup type="single" className="justify-start">
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
                            <Input
                              value={section.content}
                              onChange={(e) => updateSection(index, e.target.value)}
                              placeholder="Enter image URL"
                            />
                            {section.content && (
                              <div className="mt-2 rounded-md overflow-hidden border border-border">
                                <img
                                  src={section.content}
                                  alt="Image preview"
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                                  }}
                                />
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
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
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
        <div className="w-full lg:w-2/5">
          <Card className="w-full h-full shadow-md sticky top-6">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl font-bold text-primary flex items-center">
                <span className="mr-2">Preview</span>
              </CardTitle>
              <CardDescription>
                See how your blog post will look
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto bg-white" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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