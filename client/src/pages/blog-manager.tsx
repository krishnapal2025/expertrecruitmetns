import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Edit,
  EyeIcon,
  File,
  FileText,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { BlogPost } from "@shared/schema";

export default function BlogManagerPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogPostToDelete, setBlogPostToDelete] = useState<BlogPost | null>(null);
  const [sortField, setSortField] = useState<keyof BlogPost>("publishDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Check if user is admin
  useEffect(() => {
    if (user?.userType !== "admin") {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  // Fetch all blog posts
  const {
    data: blogPosts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog-posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json() as Promise<BlogPost[]>;
    },
    enabled: user?.userType === "admin",
  });

  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDeleteDialogOpen(false);
      setBlogPostToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle blog post published status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      await apiRequest("PATCH", `/api/blog-posts/${id}`, { published });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Blog post status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateNewPost = () => {
    navigate("/create-blog");
  };

  const handleEditPost = (id: number) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleViewPost = (slug: string) => {
    window.open(`/article/${slug}`, "_blank");
  };

  const handleDeletePost = (post: BlogPost) => {
    setBlogPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blogPostToDelete) {
      deleteBlogMutation.mutate(blogPostToDelete.id);
    }
  };

  const handleTogglePublished = (post: BlogPost) => {
    togglePublishMutation.mutate({
      id: post.id,
      published: !post.published,
    });
  };

  // Filter and sort blog posts
  const filteredAndSortedPosts = blogPosts
    ? blogPosts
        .filter((post) => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            post.title.toLowerCase().includes(searchTermLower) ||
            (post.subtitle && post.subtitle.toLowerCase().includes(searchTermLower)) ||
            (post.category && post.category.toLowerCase().includes(searchTermLower)) ||
            post.slug.toLowerCase().includes(searchTermLower)
          );
        })
        .sort((a, b) => {
          const fieldA = a[sortField] as any;
          const fieldB = b[sortField] as any;

          // Handle date fields specially
          if (sortField === "publishDate") {
            const dateA = new Date(fieldA || "").getTime();
            const dateB = new Date(fieldB || "").getTime();
            return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
          }

          // Handle string fields
          if (typeof fieldA === "string" && typeof fieldB === "string") {
            return sortDirection === "asc"
              ? fieldA.localeCompare(fieldB)
              : fieldB.localeCompare(fieldA);
          }

          // Handle number fields and other cases
          return sortDirection === "asc"
            ? (fieldA || 0) - (fieldB || 0)
            : (fieldB || 0) - (fieldA || 0);
        })
    : [];

  // Format date for display
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (user?.userType !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Manager</h1>
        <Button onClick={handleCreateNewPost} className="flex items-center" size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Blog Post
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog posts, edit content, publish or unpublish, and delete posts.
          </CardDescription>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search blog posts by title, subtitle, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">Failed to load blog posts</p>
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </div>
          ) : filteredAndSortedPosts.length === 0 ? (
            searchTerm ? (
              <div className="text-center py-10">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-500 mb-4">No blog posts matching "{searchTerm}"</p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="text-center py-10">
                <File className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-500 mb-4">No blog posts have been created yet</p>
                <Button onClick={handleCreateNewPost}>Create Your First Blog Post</Button>
              </div>
            )
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead className="w-[15%]">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        if (sortField === "category") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("category");
                          setSortDirection("asc");
                        }
                      }}
                    >
                      Category
                      {sortField === "category" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[15%]">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        if (sortField === "publishDate") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("publishDate");
                          setSortDirection("desc");
                        }
                      }}
                    >
                      Published Date
                      {sortField === "publishDate" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{post.title}</div>
                        {post.subtitle && (
                          <div className="text-sm text-gray-500 mt-1">{post.subtitle}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline" className="bg-primary/10">
                          {post.category}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No category</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(post.publishDate ? post.publishDate.toString() : null)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={post.published || false}
                          onCheckedChange={() => handleTogglePublished(post)}
                          disabled={togglePublishMutation.isPending}
                          id={`publish-switch-${post.id}`}
                        />
                        <Label htmlFor={`publish-switch-${post.id}`} className="cursor-pointer">
                          {post.published ? "Published" : "Draft"}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewPost(post.slug)}
                            className="cursor-pointer"
                          >
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditPost(post.id)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <CardFooter className="flex justify-between py-4">
          <div className="text-sm text-gray-500">
            {!isLoading &&
              !error &&
              `Showing ${filteredAndSortedPosts.length} of ${blogPosts?.length || 0} blog posts`}
          </div>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] })}
            className="flex items-center"
          >
            Refresh
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {blogPostToDelete && (
            <div className="py-4">
              <h3 className="text-lg font-semibold">{blogPostToDelete.title}</h3>
              {blogPostToDelete.subtitle && (
                <p className="text-gray-500">{blogPostToDelete.subtitle}</p>
              )}
              {blogPostToDelete.category && (
                <Badge variant="outline" className="mt-2">
                  {blogPostToDelete.category}
                </Badge>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteBlogMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteBlogMutation.isPending}
            >
              {deleteBlogMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}