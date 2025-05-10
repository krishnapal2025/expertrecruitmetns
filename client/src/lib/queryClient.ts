import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText = res.statusText;
    try {
      // Try to parse JSON error response if available
      const text = await res.text();
      // Check if it's JSON
      try {
        const json = JSON.parse(text);
        // Handle different API error formats
        errorText = json.message || json.error || text || res.statusText;
      } catch {
        // If not JSON, use the text response
        errorText = text || res.statusText;
      }
    } catch (e) {
      // Fallback to statusText if text() fails
      console.error("Error parsing error response:", e);
    }
    
    // Handle specific status codes with friendly messages
    if (res.status === 401) {
      throw new Error("Your session has expired. Please refresh the page and log in again.");
    } else if (res.status === 403) {
      throw new Error("You don't have permission to perform this action.");
    } else if (res.status === 404) {
      throw new Error("The requested resource was not found.");
    } else if (res.status === 500) {
      throw new Error("A server error occurred. Please try again later.");
    } else {
      throw new Error(`${res.status}: ${errorText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  customOptions?: RequestInit
): Promise<Response> {
  // Log the request for debugging purposes
  console.log(`API Request: ${method} ${url}`, data ? { data } : '');
  
  // Detect if we might be in a cross-domain scenario (like fly.io deployment)
  const isFlyIoDeployment = window.location.hostname.includes('.fly.dev') ||
                          window.location.hostname.endsWith('.fly.io') ||
                          window.location.hostname.endsWith('.replit.app');
  
  // Make sure credentials are always included
  const headers: Record<string, string> = {
    // Prevent caching for critical operations (especially important for authentication)
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // For fly.io, make sure we're including the right SameSite settings
  if (isFlyIoDeployment) {
    console.log("Detected fly.io/replit deployment, using special cookie handling");
  }
  
  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    ...customOptions // Allow custom options to override defaults
  };
  
  try {
    // For DELETE requests, ensure the request includes admin credentials from sessionStorage if available
    if (method === 'DELETE') {
      console.log(`Special handling for DELETE request to ${url}`);
      
      // Add special X-Admin-Auth header for admin session
      const adminSession = sessionStorage.getItem('adminLoginNewTab') === 'true';
      if (adminSession) {
        console.log('Using admin session credentials for DELETE request');
        // Ensure we're passing the admin session credentials
        headers['X-Admin-Session'] = 'true';
      }
      
      // Add SameSite=Lax for DELETE requests to ensure cookies are sent
      document.cookie = "SameSite=Lax; path=/";
    }
    
    // For POST, DELETE, PATCH, or PUT requests, verify authentication state first
    if ((method === 'POST' || method === 'PATCH' || method === 'PUT') && 
        !url.includes('/api/login') && !url.includes('/api/register')) {
      try {
        console.log(`Verifying authentication before ${method} request to ${url}...`);
        const authCheck = await fetch('/api/user', { 
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!authCheck.ok || authCheck.status === 401) {
          console.error('Authentication check failed before API request');
          throw new Error('Your session has expired. Please refresh the page and login again.');
        }
        
        console.log('Authentication confirmed before request');
      } catch (authError) {
        console.error('Auth verification error:', authError);
        throw authError;
      }
    }
    
    const res = await fetch(url, options);
    
    // Log the response status
    console.log(`API Response: ${method} ${url} - Status: ${res.status}`);
    
    // Check for unauthorized status
    if (res.status === 401) {
      console.error('Unauthorized request detected. Session may have expired.', {
        method,
        url,
        status: res.status
      });
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Error: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Log query attempt
    console.log(`Fetching data from: ${queryKey[0]}`);
    
    // Detect if we might be in a cross-domain scenario (like fly.io deployment)
    const isFlyIoDeployment = window.location.hostname.includes('.fly.dev') ||
                            window.location.hostname.endsWith('.fly.io') ||
                            window.location.hostname.endsWith('.replit.app');
    
    try {
      const fetchOptions: RequestInit = {
        credentials: "include",
        headers: {
          // Prevent caching for queries too
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      };
      
      // Special handling for fly.io/replit deployments
      if (isFlyIoDeployment) {
        console.log(`Cross-domain fetch for ${queryKey[0]} in fly.io/replit environment`);
      }
      
      const res = await fetch(queryKey[0] as string, fetchOptions);
      
      // Log response status
      console.log(`Query response from ${queryKey[0]}: Status ${res.status}`);
      
      if (res.status === 401) {
        console.log(`Authentication error (401) when fetching ${queryKey[0]}`);
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
      }
      
      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Log success with sanitized data (no sensitive info)
      console.log(`Successfully fetched data from ${queryKey[0]}`, 
        typeof data === 'object' ? 'Data received' : data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
