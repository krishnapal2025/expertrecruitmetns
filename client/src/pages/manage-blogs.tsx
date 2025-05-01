import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Edit,
  FileText,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import type { BlogPost } from "@shared/schema";

export default function ManageBlogsPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Fetch all blog posts
  const {
    data: blogPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json() as Promise<BlogPost[]>;
    },
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setPostToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  // Filter blog posts based on search query
  const filteredPosts = blogPosts
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.subtitle && post.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete.id);
    }
  };

  const formatDate = (date: Date | null | string | undefined) => {
    if (!date) return "Not published";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Blog Posts</h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Something went wrong loading the blog posts. Please try again."}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Blogs | Admin Dashboard</title>
      </Helmet>

      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
            <p className="text-muted-foreground">
              Create, edit, and delete blog posts for your website
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/admin-dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/create-blog")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog content from this central dashboard
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {blogPosts && blogPosts.length > 0 ? (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div>
                            {truncateText(post.title, 40)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {truncateText(post.subtitle, 50)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {post.category ? (
                            <Badge variant="outline">{post.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              No category
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/edit-blog/${post.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => handleDeleteClick(post)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-10 border rounded-md bg-muted/20">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No blog posts found</p>
                <p className="text-sm text-muted-foreground/70 mt-1 mb-6">
                  Create your first blog post to get started
                </p>
                <Button onClick={() => navigate("/create-blog")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </div>
            )}
          </CardContent>
          {blogPosts && blogPosts.length > 0 && (
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredPosts.length} of {blogPosts.length} total blog posts
                </div>
                <Button onClick={() => navigate("/create-blog")} size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              <strong className="block mt-1">"{postToDelete?.title}"</strong>
              and remove it from your website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}