import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { format, parseISO, isValid } from "date-fns";

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

  // Admin delete mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        console.log(`Deleting user with ID: ${userId}`);
        // Log the session cookie for debugging
        const cookies = document.cookie;
        console.log(`Session cookies available: ${cookies ? 'Yes' : 'No'}`);
        
        const res = await apiRequest("DELETE", `/api/users/${userId}`);
        console.log(`Delete response status: ${res.status}`);
        
        if (!res.ok) {
          let errorMessage = "Failed to delete admin account";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
        return await res.json();
      } catch (error: any) {
        console.error("Error in deleteUserMutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Admin deleted",
        description: "The admin account has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/all"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete admin",
        description: error.message,
        variant: "destructive",
      });
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
  );
}