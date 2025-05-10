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

  // Direct admin delete mutation with enhanced error logging
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        console.log(`Attempting to delete user ID: ${userId} with enhanced logging`);
        
        // Step 1: Get a fresh user token by checking user status
        console.log("Step 1: Verifying authentication...");
        const userCheckResponse = await fetch('/api/user', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!userCheckResponse.ok) {
          console.error(`Authentication check failed with status: ${userCheckResponse.status}`);
          throw new Error("Authentication verification failed. Please refresh the page and try again.");
        }
        
        // Log session info
        const userData = await userCheckResponse.json();
        console.log("Authentication verified. User data:", {
          id: userData.id,
          userType: userData.userType,
          email: userData.email?.substring(0, 3) + '...' // Log only partial email for privacy
        });
        
        // Get cookies from the authentication check
        const cookies = document.cookie;
        console.log(`Step 2: Session cookies: ${cookies ? "Present" : "Missing"}`);
        
        // Step 3: Make the direct DELETE request with maximum authentication info
        console.log(`Step 3: Sending DELETE request to /api/users/${userId}`);
        
        // Make the direct DELETE request with cookies and all possible headers for authentication
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Session': 'true',
            'X-Admin-Id': userData.id?.toString() || '',
            'X-Admin-Type': userData.userType || '',
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // Log response details
        console.log(`Step 4: Received response with status: ${response.status}`);
        
        // Handle response
        if (!response.ok) {
          console.error(`DELETE request failed with status: ${response.status}`);
          let errorMessage = "Unknown error occurred";
          
          try {
            const errorData = await response.json();
            console.error("Error response details:", errorData);
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
          }
          
          throw new Error(errorMessage);
        }
        
        // Parse and return response data
        const data = await response.json();
        console.log("Step 5: Delete operation successful:", data);
        return data;
      } catch (error: any) {
        console.error("Error in admin delete operation:", error);
        // Include detailed error info
        const errorDetails = {
          message: error.message,
          stack: error.stack,
          name: error.name
        };
        console.error("Detailed error information:", errorDetails);
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
      // Display more detailed error message in toast
      toast({
        title: "Failed to delete admin",
        description: error.message || "An unexpected error occurred during the delete operation",
        variant: "destructive",
        duration: 7000, // Show longer for the detailed message
      });
      
      // Show more detailed error information in console for debugging
      console.error("Delete mutation error:", error);
      
      // Create a custom alert with more detailed information for visibility
      // This will ensure the error is prominently displayed to the user
      alert(`Error deleting admin account: ${error.message}\n\nPlease check the browser console for more details and contact technical support if this issue persists.`);
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