import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Image, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      // Compile content from sections
      const compiledContent = contentSections
        .map(section => {
          if (section.type === 'header') {
            return `## ${section.content}\n\n`;
          } else if (section.type === 'paragraph') {
            // Preserve all line breaks and whitespace in paragraphs
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
          // Preserve all line breaks and whitespace in paragraphs
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
    <div className="container max-w-5xl py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
          <CardDescription>
            Add a new article to the Expert Recruitments blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
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
                      <FormControl>
                        <Input placeholder="Enter optional subtitle" {...field} />
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
              
              <div>
                <h3 className="text-lg font-medium mb-4">Content Sections</h3>
                
                {contentSections.map((section, index) => (
                  <div key={index} className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">
                        {section.type} Section
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(index)}
                        disabled={contentSections.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {section.type === 'paragraph' && (
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, e.target.value)}
                        placeholder="Enter paragraph text"
                        className="min-h-[100px] whitespace-pre-wrap"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    )}
                    
                    {section.type === 'header' && (
                      <Input
                        value={section.content}
                        onChange={(e) => updateSection(index, e.target.value)}
                        placeholder="Enter header text"
                      />
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
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSection('header')}
                  >
                    Add Heading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSection('paragraph')}
                  >
                    Add Paragraph
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSection('image')}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Add Image
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
  );
};

export default CreateBlogPage;