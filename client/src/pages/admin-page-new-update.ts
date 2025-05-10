// Updated users query to use admin/all endpoint
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["/api/admin/all"],
    queryFn: async () => {
      console.log("Fetching admin users with user type:", user?.userType);
      try {
        const res = await fetch("/api/admin/all");
        console.log("Admin API response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text().catch(() => "No error details");
          console.error("Error fetching admin users:", errorText);
          throw new Error(`Failed to fetch admin users: ${res.status}`);
        }
        const data = await res.json();
        console.log("Admin data received. Count:", data?.length || 0);
        return data;
      } catch (error) {
        console.error("Admin users fetch error:", error);
        throw error;
      }
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin")
  });