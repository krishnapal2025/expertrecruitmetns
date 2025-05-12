import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { format, parseISO, isValid, addDays } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, KeyRound, Copy, CheckCircle, RefreshCw } from "lucide-react";

export function AdminsList({ user }: { user: User | null }) {
  const { toast } = useToast();
  const [invitationDialog, setInvitationDialog] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  
  // Function to generate a random code
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      // Add a hyphen every 4 characters for readability
      if (i > 0 && i % 4 === 0) {
        code += "-";
      }
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };
  
  // Get all admin accounts
  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ["/api/admin/all"],
    queryFn: async () => {
      const res = await fetch("/api/admin/all");
      if (!res.ok) throw new Error("Failed to fetch admin accounts");
      return await res.json();
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin")
  });
  
  // Get invitation codes
  const { data: invitationCodes, isLoading: invitationCodesLoading, refetch: refetchInvitationCodes } = useQuery({
    queryKey: ["/api/admin/invitation-codes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/invitation-codes");
      if (!res.ok) throw new Error("Failed to fetch invitation codes");
      return await res.json();
    },
    enabled: !!user && user.userType === "super_admin"
  });

  // Create invitation code mutation
  const createInvitationCodeMutation = useMutation({
    mutationFn: async () => {
      // Generate a random code
      const code = generateRandomCode();
      setGeneratedCode(code);
      
      // Calculate expiration date (7 days from now)
      const expiresAt = addDays(new Date(), 7).toISOString();
      
      const res = await apiRequest(
        "POST",
        "/api/admin/invitation-codes",
        {
          code,
          email: invitationEmail,
          expiresAt
        }
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create invitation code");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation code created",
        description: `A new invitation code has been created for ${invitationEmail}`,
      });
      
      // Refresh invitation codes list
      refetchInvitationCodes();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create invitation code",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "Invitation code has been copied to your clipboard",
      });
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCodeCopied(false);
      }, 3000);
    }
  };
  
  // Admin delete mutation - using the same pattern as vacancy deletion
  const deleteUserMutation = useMutation({
    mutationFn: async ({ userId, userType }: { userId: number; userType: string }) => {
      console.log(`Deleting ${userType} user with ID:`, userId);
      
      try {
        let endpoint = `/api/users/${userId}`;
        
        // Use special endpoint for super admin deletion
        if (userType === 'super_admin') {
          console.log("Using dedicated super admin deletion endpoint");
          endpoint = `/api/admin/super-admins/${userId}`;
        }
        
        // Use apiRequest from queryClient to handle auth properly
        const res = await apiRequest(
          "DELETE", 
          endpoint
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
          return { success: true, message: `${userType === 'super_admin' ? 'Super admin' : 'Admin'} deleted successfully` };
        }
      } catch (error) {
        console.error("Delete admin error:", error);
        // Re-throw to trigger onError handler
        throw error;
      }
    },
    onSuccess: (result, variables) => {
      // Show a different toast message based on user type
      const isSuperAdmin = variables.userType === 'super_admin';
      
      toast({
        title: isSuperAdmin ? "Super Admin deleted" : "Admin deleted",
        description: isSuperAdmin 
          ? "The super admin account has been successfully deleted using direct SQL operations" 
          : "The admin account has been deleted successfully",
        variant: isSuperAdmin ? "default" : "default",
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
      console.log(`Attempting to delete admin user with ID: ${adminToDelete.user.id}`);
      
      // Determine if this is a super admin deletion
      const userType = adminToDelete.user.userType || 'admin';
      
      // Call mutation with both userId and userType
      deleteUserMutation.mutate({ 
        userId: adminToDelete.user.id,
        userType: userType
      });
      
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
    
    // For super admin accounts, show a more specific confirmation dialog
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
        {/* Add invitation code generator button for super admins */}
        {user?.userType === "super_admin" && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setInvitationEmail("");
                setGeneratedCode("");
                setCodeCopied(false);
                setInvitationDialog(true);
              }}
              className="flex items-center"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Generate Invitation Code
            </Button>
          </div>
        )}
        
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
              {adminToDelete?.user?.userType === 'super_admin' 
                ? 'Delete Super Admin Account' 
                : 'Delete Admin Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminToDelete && (
                <>
                  {adminToDelete?.user?.userType === 'super_admin' ? (
                    <>
                      <span className="text-destructive font-semibold">WARNING:</span> You are about to delete a super admin account for{" "}
                      <strong>
                        {adminToDelete.firstName} {adminToDelete.lastName}
                      </strong>
                      . This is a critical system account with the highest privileges.
                      <div className="mt-2 bg-muted p-2 rounded-md text-sm">
                        Super admin accounts are used for application management and system maintenance.
                        Deleting this account will permanently remove all associated access and permissions.
                      </div>
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete the admin account for{" "}
                      <strong>
                        {adminToDelete.firstName} {adminToDelete.lastName}
                      </strong>
                      ?
                    </>
                  )}
                  <div className="mt-2 text-destructive">This action cannot be undone.</div>
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
              {adminToDelete?.user?.userType === 'super_admin' 
                ? 'Delete Super Admin' 
                : 'Delete Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invitation Code Dialog */}
      <Dialog open={invitationDialog} onOpenChange={setInvitationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Admin Invitation Code</DialogTitle>
            <DialogDescription>
              Create an invitation code for a new admin. The code will be valid for 7 days.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter admin email address"
                value={invitationEmail}
                onChange={(e) => setInvitationEmail(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                The invitation will be restricted to this email address.
              </p>
            </div>
            
            {generatedCode && (
              <div className="space-y-2 pt-2">
                <Label>Invitation Code</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm">
                    {generatedCode}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    {codeCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with the new admin to complete registration.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={!invitationEmail || createInvitationCodeMutation.isPending}
              onClick={() => createInvitationCodeMutation.mutate()}
              className="flex items-center"
            >
              {createInvitationCodeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Generate Code
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}