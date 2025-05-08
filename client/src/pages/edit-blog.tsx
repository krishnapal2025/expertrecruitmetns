import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, ArrowLeft, Eye, Loader2, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for the form fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [readTime, setReadTime] = useState("");
  const [published, setPublished] = useState(false);
  
  // Fetch the blog post data
  const { data: blogPost, isLoading: isLoadingBlogPost } = useQuery({
    queryKey: [`/api/blog-posts/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/blog-posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      return await res.json();
    },
    enabled: !!id && !!user && user.userType === "admin"
  });
  
  // Populate form with data when blogPost is loaded
  useEffect(() => {
    if (blogPost) {
      setTitle(blogPost.title || "");
      setSubtitle(blogPost.subtitle || "");
      setContent(blogPost.content || "");
      setCategory(blogPost.category || "");
      setBannerImage(blogPost.bannerImage || "");
      setReadTime(blogPost.readTime || "");
      setPublished(blogPost.published || false);
    }
  }, [blogPost]);
  
  // Update blog post mutation
  const updateBlogMutation = useMutation({
    mutationFn: async (blogData: any) => {
      const res = await apiRequest("PATCH", `/api/blog-posts/${id}`, blogData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update blog post");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/blog-posts/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/blog-posts/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete blog post");
      }
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate the blog posts query cache so the updated list shows immediately
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      
      toast({
        title: "Blog post deleted",
        description: "Your blog post has been deleted successfully.",
      });
      navigate("/admin-dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData = {
      title,
      subtitle,
      content,
      category,
      bannerImage,
      readTime,
      published
    };
    
    updateBlogMutation.mutate(blogData);
  };
  
  // Check authentication
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "default",
      });
      navigate("/admin-login");
      return;
    }
    
    if (user.userType !== "admin" && user.userType !== "super_admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);
  
  // Loading state
  if (isLoadingBlogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Edit Blog Post | Expert Recruitments Admin</title>
      </Helmet>
      
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin-dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-1">
            Make changes to your blog post content
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
              <CardDescription>
                Edit the content and details of your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle or Excerpt</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter a subtitle or brief excerpt"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bannerImage">Banner Image URL</Label>
                  <Input
                    id="bannerImage"
                    placeholder="Enter image URL"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                  />
                  {bannerImage && (
                    <div className="mt-2 border rounded-md overflow-hidden h-48">
                      <img
                        src={bannerImage}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Preview';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Career Insights">Career Insights</SelectItem>
                        <SelectItem value="Expert Recruitments">Executive Recruitment</SelectItem>
                        <SelectItem value="Industry Trends">Industry Trends</SelectItem>
                        <SelectItem value="Job Search Tips">Job Search Tips</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Select value={readTime} onValueChange={setReadTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Estimated read time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 min read">3 min read</SelectItem>
                        <SelectItem value="5 min read">5 min read</SelectItem>
                        <SelectItem value="7 min read">7 min read</SelectItem>
                        <SelectItem value="10 min read">10 min read</SelectItem>
                        <SelectItem value="15 min read">15 min read</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] whitespace-pre-wrap"
                    style={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6' // Standard line height for normal spacing
                    }}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
                      deleteBlogMutation.mutate();
                    }
                  }}
                  disabled={deleteBlogMutation.isPending}
                >
                  {deleteBlogMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Post
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/article/${id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                
                <Select 
                  value={published ? "published" : "draft"} 
                  onValueChange={(value) => setPublished(value === "published")}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit" disabled={updateBlogMutation.isPending}>
                  {updateBlogMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}