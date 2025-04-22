import React, { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Notification, markNotificationsAsRead, startRealtimePolling, stopRealtimePolling } from "@/lib/realtime";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function NotificationItem({ notification, onMarkRead }: { notification: Notification, onMarkRead: (id: number) => void }) {
  // Format the createdAt date as a relative time (e.g., "5 minutes ago")
  const createdAtDate = new Date(notification.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

  return (
    <div className={`p-4 border-b ${!notification.read ? 'bg-muted/50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium text-sm">{notification.message}</p>
        {!notification.read && (
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 px-2"
            onClick={() => onMarkRead(notification.id)}
          >
            Mark Read
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{timeAgo}</p>
    </div>
  );
}

export default function NotificationsPopover() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Get count of unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle marking a notification as read
  const handleMarkRead = async (notificationId: number) => {
    const success = await markNotificationsAsRead([notificationId]);
    
    if (success) {
      // Update the local state to mark the notification as read
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } else {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllRead = async () => {
    const unreadIds = notifications
      .filter(n => !n.read)
      .map(n => n.id);
    
    if (unreadIds.length === 0) return;
    
    const success = await markNotificationsAsRead(unreadIds);
    
    if (success) {
      // Update all notifications to be marked as read
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  // Setup real-time polling for notifications when user is logged in
  useEffect(() => {
    if (currentUser) {
      startRealtimePolling({
        // Poll every 15 seconds
        intervalMs: 15000,
        // Handle new notifications
        onNewNotifications: (newNotifications) => {
          setNotifications(prev => {
            // Create a map of existing notifications by ID
            const existingMap = new Map(prev.map(n => [n.id, n]));
            
            // Merge new notifications with existing ones
            newNotifications.forEach(n => {
              // Convert createdAt string to Date if needed
              const notification = {
                ...n,
                createdAt: n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt)
              };
              existingMap.set(notification.id, notification);
            });
            
            // Convert map back to array and sort by creation date (newest first)
            return Array.from(existingMap.values())
              .sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
          });
          
          // Show a toast for the newest notification if the popover is closed
          if (!open && newNotifications.length > 0) {
            const newest = newNotifications[0];
            toast({
              title: "New Notification",
              description: newest.message,
            });
          }
        }
      });
      
      // Clean up polling when component unmounts
      return () => {
        stopRealtimePolling();
      };
    }
  }, [currentUser, open, toast]);

  // Don't render anything if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:text-white hover:bg-gray-800">
          {unreadCount > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkRead={handleMarkRead} 
              />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}