import { apiRequest } from "./queryClient";

export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface RealtimeJobsResponse {
  jobs: any[];
  lastId: number;
}

export interface RealtimeApplicationsResponse {
  applications: any[];
  lastId: number;
}

export interface RealtimeNotificationsResponse {
  notifications: Notification[];
  lastId: number;
}

/**
 * AJAX-based polling for real-time updates
 */

// Store the last IDs we've seen
const realtimeState = {
  lastJobId: 0,
  lastApplicationId: 0,
  lastNotificationId: 0,
  isPolling: false,
  pollingIntervalId: null as number | null,
  callbacks: {
    onNewJobs: null as ((jobs: any[]) => void) | null,
    onNewApplications: null as ((applications: any[]) => void) | null,
    onNewNotifications: null as ((notifications: Notification[]) => void) | null,
  }
};

/**
 * Fetch new jobs since the last poll
 */
async function pollJobs(): Promise<void> {
  try {
    const response = await apiRequest("GET", `/api/realtime/jobs?since=${realtimeState.lastJobId}`);
    
    // Skip if not OK
    if (!response.ok) {
      return;
    }
    
    const data: RealtimeJobsResponse = await response.json();
    
    // Update our last seen job ID
    realtimeState.lastJobId = data.lastId;
    
    // If we have new jobs and a callback is registered, call it
    if (data.jobs && data.jobs.length > 0 && realtimeState.callbacks.onNewJobs) {
      realtimeState.callbacks.onNewJobs(data.jobs);
    }
  } catch (error) {
    // Log the error but don't display it to the user as this is a background operation
    console.error("Error polling for new jobs:", error);
  }
}

/**
 * Fetch new applications since the last poll (for employers only)
 */
async function pollApplications(): Promise<void> {
  try {
    const response = await apiRequest("GET", `/api/realtime/applications?since=${realtimeState.lastApplicationId}`);
    
    // Skip if we get 401 or 403 error (not logged in or not an employer)
    if (response.status === 401 || response.status === 403) {
      return;
    }
    
    // Handle other errors
    if (!response.ok) {
      throw new Error(`Failed to poll applications: ${response.statusText}`);
    }
    
    const data: RealtimeApplicationsResponse = await response.json();
    
    // Update our last seen application ID
    realtimeState.lastApplicationId = data.lastId;
    
    // If we have new applications and a callback is registered, call it
    if (data.applications && data.applications.length > 0 && realtimeState.callbacks.onNewApplications) {
      realtimeState.callbacks.onNewApplications(data.applications);
    }
  } catch (error) {
    // Log the error but don't display it to the user as this is a background operation
    console.error("Error polling for new applications:", error);
  }
}

/**
 * Fetch new notifications since the last poll
 */
async function pollNotifications(): Promise<void> {
  try {
    const response = await apiRequest("GET", `/api/realtime/notifications?since=${realtimeState.lastNotificationId}`);
    
    // Skip if not logged in
    if (response.status === 401) {
      return;
    }
    
    // Handle other errors
    if (!response.ok) {
      throw new Error(`Failed to poll notifications: ${response.statusText}`);
    }
    
    const data: RealtimeNotificationsResponse = await response.json();
    
    // Update our last seen notification ID
    realtimeState.lastNotificationId = data.lastId;
    
    // If we have new notifications and a callback is registered, call it
    if (data.notifications && data.notifications.length > 0 && realtimeState.callbacks.onNewNotifications) {
      realtimeState.callbacks.onNewNotifications(data.notifications);
    }
  } catch (error) {
    // Log the error but don't display it to the user as this is a background operation
    console.error("Error polling for new notifications:", error);
  }
}

/**
 * Poll all real-time endpoints
 */
async function pollAllUpdates(): Promise<void> {
  await Promise.all([
    pollJobs(),
    pollApplications(),
    pollNotifications()
  ]);
}

/**
 * Start polling for real-time updates
 * @param options Polling options including callbacks for new data
 */
export function startRealtimePolling(options: {
  intervalMs?: number;
  onNewJobs?: (jobs: any[]) => void;
  onNewApplications?: (applications: any[]) => void;
  onNewNotifications?: (notifications: Notification[]) => void;
}): void {
  // If already polling, stop first
  if (realtimeState.isPolling) {
    stopRealtimePolling();
  }
  
  // Set polling interval (default: 10 seconds)
  const intervalMs = options.intervalMs || 10000;
  
  // Register callbacks
  realtimeState.callbacks.onNewJobs = options.onNewJobs || null;
  realtimeState.callbacks.onNewApplications = options.onNewApplications || null;
  realtimeState.callbacks.onNewNotifications = options.onNewNotifications || null;
  
  // Immediate first poll
  pollAllUpdates();
  
  // Start polling interval
  realtimeState.pollingIntervalId = window.setInterval(pollAllUpdates, intervalMs);
  realtimeState.isPolling = true;
  
  console.log(`Started real-time polling every ${intervalMs / 1000} seconds`);
}

/**
 * Stop polling for real-time updates
 */
export function stopRealtimePolling(): void {
  if (realtimeState.pollingIntervalId) {
    window.clearInterval(realtimeState.pollingIntervalId);
    realtimeState.pollingIntervalId = null;
    realtimeState.isPolling = false;
    console.log("Stopped real-time polling");
  }
}

/**
 * Mark notifications as read
 * @param notificationIds Array of notification IDs to mark as read
 */
export async function markNotificationsAsRead(notificationIds: number[]): Promise<boolean> {
  try {
    const response = await apiRequest("POST", "/api/realtime/notifications/read", { ids: notificationIds });
    
    if (!response.ok) {
      throw new Error(`Failed to mark notifications as read: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return false;
  }
}