import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Log the request for debugging purposes
  console.log(`API Request: ${method} ${url}`, data ? { data } : '');
  
  // Make sure credentials are always included
  const headers: Record<string, string> = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  };
  
  try {
    const res = await fetch(url, options);
    
    // Log the response status
    console.log(`API Response: ${method} ${url} - Status: ${res.status}`);
    
    // Check for unauthorized status
    if (res.status === 401) {
      console.error('Unauthorized request. User may not be logged in properly.');
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
    
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
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
