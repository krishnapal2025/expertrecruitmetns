import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

function AdminUserDebug() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);

  // Function to get user info
  const handleGetUser = async () => {
    if (!userId || isNaN(Number(userId))) {
      toast({
        title: "Invalid User ID",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setDebugInfo("Fetching user information...");
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      
      setUserInfo(data);
      setDebugInfo(`User lookup response: ${JSON.stringify(data, null, 2)}`);
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: `Failed to get user: ${data.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setDebugInfo(`Error fetching user: ${error.message}`);
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Function to delete user
  const handleDeleteUser = async () => {
    if (!userId || isNaN(Number(userId))) {
      toast({
        title: "Invalid User ID",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Not Authenticated",
        description: "You need to be logged in as an admin to delete users",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      setDebugInfo("Attempting to delete user...");

      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': 'true',
          'X-Admin-Id': user.id.toString(),
          'X-Admin-Type': user.userType,
          'X-Request-Debug': 'true'
        }
      });

      const data = await response.json();
      setDebugInfo(`
Delete response:
Status: ${response.status}
Status Text: ${response.statusText}
Data: ${JSON.stringify(data, null, 2)}
      `);

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        setUserInfo(null);
      } else {
        toast({
          title: "Error",
          description: `Failed to delete user: ${data.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setDebugInfo(`Error deleting user: ${error.message}`);
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin User Debug Tool</h1>
        <p className="mb-6 text-muted-foreground">
          This tool is designed to help debug issues with user management.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Info and Delete Tester</CardTitle>
            <CardDescription>
              Enter a user ID to get information or delete the user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Input
                type="number"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleGetUser} variant="outline">
                Get User Info
              </Button>
              <Button 
                onClick={handleDeleteUser} 
                variant="destructive" 
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </Button>
            </div>

            {userInfo && (
              <div className="mb-6 border p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">User Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">ID:</div>
                  <div>{userInfo.id}</div>
                  
                  <div className="font-medium">Email:</div>
                  <div>{userInfo.email}</div>
                  
                  <div className="font-medium">User Type:</div>
                  <div>{userInfo.userType}</div>
                  
                  <div className="font-medium">Created At:</div>
                  <div>{new Date(userInfo.createdAt).toLocaleString()}</div>
                </div>
              </div>
            )}

            {debugInfo && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Debug Information</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    {debugInfo}
                  </pre>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Current admin: {user?.email} (ID: {user?.id})
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function ProtectedAdminUserDebug() {
  return (
    <AdminProtectedRoute>
      <AdminUserDebug />
    </AdminProtectedRoute>
  );
}