import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation, useParams } from "wouter";
import { Loader2, Save, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { BlogPost } from "@shared/schema";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  tags: z.string().optional().transform(value => value ? value.split(',').map(tag => tag.trim()) : []),
  bannerImage: z.string().url("Banner image must be a valid URL").optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt must be at most 300 characters"),
  readTime: z.string().min(3, "Read time must be at least 3 characters"),
  published: z.boolean().default(false),
});

export default function EditBlogPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams();
  const blogId = params.id ? parseInt(params.id) : 0;
  
  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/blog-posts/${blogId}`],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${blogId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json() as Promise<BlogPost>;
    },
    enabled: !!blogId,
  });

  // Initialize form with blog post data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      content: "",
      category: "",
      tags: "",
      bannerImage: "",
      excerpt: "",
      readTime: "",
      published: false,
    },
  });

  // Update form when post data is loaded
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        subtitle: post.subtitle || "",
        slug: post.slug || "",
        content: post.content || "",
        category: post.category || "",
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : "",
        bannerImage: post.bannerImage || "",
        excerpt: post.excerpt || "",
        readTime: post.readTime || "",
        published: post.published || false,
      });
    }
  }, [post, form]);

  // Update blog post mutation
  const updateBlogMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch(`/api/blog-posts/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog post');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: [`/api/blog-posts/${blogId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateBlogMutation.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading blog post...</span>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Blog Post</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load the blog post you're trying to edit. It may have been deleted or you don't have permission to access it.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setLocation("/manage-blogs")}>
              Return to Blog Management
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Blog Post | Admin Dashboard</title>
      </Helmet>
      
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
              <p className="text-muted-foreground">Update your blog post content</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation("/manage-blogs")}>
                Cancel
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
              <CardDescription>
                Edit the content and settings for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter blog post title" {...field} />
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
                              <Input placeholder="Enter subtitle" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="enter-url-slug" {...field} />
                            </FormControl>
                            <FormDescription>
                              The URL-friendly version of the title
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Executive Recruitment">Executive Recruitment</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Workplace Trends">Workplace Trends</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Sustainability">Sustainability</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Employment Trends">Employment Trends</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input placeholder="career, recruitment, jobs" {...field} />
                            </FormControl>
                            <FormDescription>
                              Comma separated list of tags
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="readTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Read Time</FormLabel>
                            <FormControl>
                              <Input placeholder="5 min read" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bannerImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to an image that will be displayed at the top of your post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of your blog post" 
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary that appears in blog listings (max 300 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here" 
                            className="min-h-[300px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish</FormLabel>
                          <FormDescription>
                            When checked, this post will be visible on your site
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={updateBlogMutation.isPending}
                    >
                      {updateBlogMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}