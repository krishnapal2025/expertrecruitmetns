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

  // Super admin delete mutation - uses specialized endpoint for super admins
  const deleteSuperAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      console.log("Deleting super admin with ID:", userId);
      
      try {
        // Use specialized endpoint for super admin deletion
        const res = await apiRequest(
          "DELETE", 
          `/api/admin/super-admins/${userId}`
        );
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Delete super admin error:", errorData);
          
          // Even if there's a 404, we'll still consider it a success
          if (res.status === 404) {
            return { success: true, message: "Super admin account already deleted or not found" };
          }
          
          throw new Error(errorData.message || "Failed to delete super admin account");
        }
        
        // Parse response JSON
        try {
          return await res.json();
        } catch (e) {
          // If no valid JSON, still return success
          return { success: true, message: "Super admin deleted successfully" };
        }
      } catch (error) {
        console.error("Delete super admin error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Super admin deleted",
        description: "The super admin account has been deleted successfully",
      });
      
      // Refresh admin list after successful deletion
      queryClient.invalidateQueries({ queryKey: ["/api/admin/all"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete super admin",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      console.error("Delete super admin operation failed:", error);
      
      // Close dialog even on error
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    },
  });

  // Regular admin delete mutation - using the same pattern as vacancy deletion
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      console.log("Deleting admin user with ID:", userId);
      
      try {
        // Use apiRequest from queryClient to handle auth properly
        const res = await apiRequest(
          "DELETE", 
          `/api/users/${userId}`
        );
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Delete admin error:", errorData);
          
          // Even if there's a 404, we'll still consider it a success
          // because the user might have been already deleted
          if (res.status === 404) {
            return { success: true, message: "Admin account already deleted or not found" };
          }
          
          // Special handling for super admin protection
          if (errorData.code === "SUPER_ADMIN_PROTECTION") {
            throw new Error(errorData.message || "Only super admins can delete other super admin accounts");
          }
          
          throw new Error(errorData.message || "Failed to delete admin account");
        }
        
        // Parse response JSON
        try {
          return await res.json();
        } catch (e) {
          // If no valid JSON, still return success
          return { success: true, message: "Admin deleted successfully" };
        }
      } catch (error) {
        console.error("Delete admin error:", error);
        // Re-throw to trigger onError handler
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
      
      // Close dialog even on error
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    },
  });

  // Handle admin deletion using AlertDialog
  const [adminToDelete, setAdminToDelete] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDeleteConfirm = () => {
    if (adminToDelete && adminToDelete.user && adminToDelete.user.id) {
      const userId = adminToDelete.user.id;
      const userType = adminToDelete.user.userType;
      
      console.log(`Attempting to delete admin user with ID: ${userId}, type: ${userType}`);
      
      // Use different deletion methods based on user type
      if (userType === 'super_admin' && user?.userType === 'super_admin') {
        // For super_admin accounts, use the specialized endpoint
        console.log(`Using specialized super admin deletion endpoint for ID: ${userId}`);
        deleteSuperAdminMutation.mutate(userId);
      } else {
        // For regular admin accounts, use the standard users endpoint
        console.log(`Using standard user deletion endpoint for ID: ${userId}`);
        deleteUserMutation.mutate(userId);
      }
      
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
            <AlertDialogTitle>
              {adminToDelete?.user?.userType === 'super_admin' ? 'Delete Super Admin Account' : 'Delete Admin Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminToDelete && (
                <>
                  Are you sure you want to delete the {adminToDelete?.user?.userType === 'super_admin' ? 'super admin' : 'admin'} account for{" "}
                  <strong>
                    {adminToDelete.firstName} {adminToDelete.lastName}
                  </strong>
                  ? This action cannot be undone.
                  
                  {adminToDelete?.user?.userType === 'super_admin' && (
                    <div className="mt-2 text-destructive font-medium">
                      Warning: Deleting a super admin account will remove all associated data and permissions.
                    </div>
                  )}
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