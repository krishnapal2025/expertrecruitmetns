import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { format, parseISO, isValid } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

export function AdminsList({ user }: { user: User | null }) {
  const { toast } = useToast();
  
  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ["/api/admin/all"],
    queryFn: async () => {
      const res = await fetch("/api/admin/all");
      if (!res.ok) throw new Error("Failed to fetch admin accounts");
      return await res.json();
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin")
  });

  // Improved direct admin delete mutation with better error logging
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        console.log(`Client: Attempting to delete user ID: ${userId}`);
        
        // Use the current user from props for auth headers
        if (!user || !user.id) {
          console.error("Client: No authenticated user found");
          throw new Error("No authenticated user found. Please log in again.");
        }
        
        console.log(`Client: Sending DELETE request for user ${userId} with auth from user ${user.id} (${user.userType})`);
        
        // Make the direct DELETE request with debug headers
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Session': 'true',
            'X-Admin-Id': user.id.toString(),
            'X-Admin-Type': user.userType,
            'X-Request-Debug': 'true' // Add a debug flag
          }
        });
        
        console.log(`Client: Received response with status: ${response.status}`);
        
        // Handle error response with improved debug info
        if (!response.ok) {
          let errorMessage = "Failed to delete admin account";
          let errorDetail = "";
          
          try {
            const errorData = await response.json();
            console.log("Client: Error response data:", errorData);
            errorMessage = errorData.message || errorMessage;
            errorDetail = errorData.detail || "";
          } catch (parseError) {
            // If we can't parse JSON, use text content if available
            try {
              const textContent = await response.text();
              console.log("Client: Error response text:", textContent);
              if (textContent) errorMessage = textContent;
            } catch (textError) {
              console.error("Client: Failed to read error response body:", textError);
            }
          }
          
          const fullErrorMessage = errorDetail 
            ? `${errorMessage} - ${errorDetail} (Status: ${response.status})`
            : `${errorMessage} (Status: ${response.status})`;
            
          console.error("Client: Delete operation failed with message:", fullErrorMessage);
          throw new Error(fullErrorMessage);
        }
        
        // Success - return data or simple confirmation
        try {
          const data = await response.json();
          console.log("Client: Successfully deleted user, response:", data);
          return data;
        } catch (e) {
          // If no JSON response, just return success
          console.log("Client: Successfully deleted user, no JSON response");
          return { success: true };
        }
      } catch (error: any) {
        console.error("Client: Error deleting admin:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Admin deleted",
        description: "The admin account has been deleted successfully",
      });
      
      // Refresh admin list after successful deletion
      queryClient.invalidateQueries({ queryKey: ["/api/admin/all"] });
    },
    onError: (error: Error) => {
      // Display error message in toast - simplified for better UX
      toast({
        title: "Failed to delete admin",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Log error details for debugging
      console.error("Delete operation failed:", error);
    },
  });

  // Handle admin deletion using AlertDialog
  const [adminToDelete, setAdminToDelete] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDeleteConfirm = () => {
    if (adminToDelete && adminToDelete.user && adminToDelete.user.id) {
      console.log(`Attempting to delete admin user with ID: ${adminToDelete.user.id}`);
      deleteUserMutation.mutate(adminToDelete.user.id);
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };
  
  const handleDeleteAdmin = (admin: any) => {
    if (!admin.user || !admin.user.id) {
      toast({
        title: "Error",
        description: "Cannot identify user account for this admin",
        variant: "destructive",
      });
      return;
    }
    
    setAdminToDelete(admin);
    setShowDeleteDialog(true);
  };
  
  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return "N/A";
      return format(dateObj, 'MMM d, yyyy');
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <>
      <div className="space-y-4">
        {adminsLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : admins && admins.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin: any) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.user?.email || "N/A"}</TableCell>
                  <TableCell>{admin.role || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={admin.user?.userType === "super_admin" ? "destructive" : "default"}>
                      {admin.user?.userType === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(admin.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAdmin(admin)}
                      disabled={user?.id === admin.user?.id}
                      title={user?.id === admin.user?.id ? "Cannot delete your own account" : "Delete admin"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No admin accounts found.</p>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
            <AlertDialogDescription>
              {adminToDelete && (
                <>
                  Are you sure you want to delete the admin account for{" "}
                  <strong>
                    {adminToDelete.firstName} {adminToDelete.lastName}
                  </strong>
                  ? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}