import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Remove DataTable import as we're using a regular table instead
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, UserPlus, Building2, Briefcase, Users, Activity, BarChart3, Layers, Settings, FileText, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation, Link } from 'wouter';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for demonstration
  const userStats = [
    { name: 'Job Seekers', value: 145 },
    { name: 'Employers', value: 67 },
  ];

  const jobStats = [
    { name: 'Active', value: 84 },
    { name: 'Filled', value: 35 },
    { name: 'Expired', value: 21 },
  ];

  const applicationStats = [
    { name: 'Jan', applications: 12 },
    { name: 'Feb', applications: 19 },
    { name: 'Mar', applications: 25 },
    { name: 'Apr', applications: 32 },
    { name: 'May', applications: 28 },
    { name: 'Jun', applications: 43 },
  ];

  const pieColors = ['#5372f1', '#36A2EB', '#ff6384', '#4BC0C0', '#9966FF', '#FF9F40'];

  // If not admin, show access denied
  if (currentUser?.user.userType !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-20rem)]">
        <Helmet>
          <title>Admin Dashboard | Expert Recruitments</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <Shield className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Dashboard | Expert Recruitments</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your recruitment platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "dashboard" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Dashboard</span>
                </button>
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "users" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  <Users className="h-5 w-5 text-primary" />
                  <span>Users</span>
                </button>
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "jobs" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("jobs")}
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span>Jobs</span>
                </button>
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "companies" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("companies")}
                >
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Companies</span>
                </button>
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "content" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("content")}
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Content</span>
                </button>
                <button 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${activeTab === "settings" ? "bg-gray-100 border-l-4 border-primary" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Settings</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">212</span>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">84</span>
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">356</span>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Applications Trend</CardTitle>
                    <CardDescription>Monthly applications over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={applicationStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="applications" fill="#5372f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-rows-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Distribution</CardTitle>
                      <CardDescription>Job seekers vs employers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={userStats}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {userStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Job Status</CardTitle>
                      <CardDescription>Distribution of job listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={jobStats}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {jobStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-primary/10 p-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-gray-500">John Doe registered as a job seeker</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">New company registration</p>
                        <p className="text-sm text-gray-500">Acme Corp registered as an employer</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">New job posting</p>
                        <p className="text-sm text-gray-500">Software Engineer position posted by TechCorp</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all users on the platform</CardDescription>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="jobseeker">Job Seekers</SelectItem>
                        <SelectItem value="employer">Employers</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="active">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Input placeholder="Search users..." className="w-[250px]" />
                  </div>
                </div>

                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">JD</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">John Doe</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">john.doe@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Job Seeker
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </td>
                      </tr>
                      {/* More user rows would go here */}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">212</span> results
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Job Management</CardTitle>
                  <CardDescription>Manage all job listings on the platform</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="filled">Filled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        <SelectItem value="company1">TechCorp</SelectItem>
                        <SelectItem value="company2">Acme Inc</SelectItem>
                        <SelectItem value="company3">Global Solutions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Input placeholder="Search jobs..." className="w-[250px]" />
                  </div>
                </div>

                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Senior Software Engineer</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">TechCorp</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Dubai, UAE</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          12
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </td>
                      </tr>
                      {/* More job rows would go here */}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">84</span> results
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Manage your platform configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="email">Email Templates</TabsTrigger>
                    <TabsTrigger value="api">API Integration</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Site Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input id="site-name" value="Expert Recruitments" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="site-desc">Site Description</Label>
                            <Textarea 
                              id="site-desc" 
                              value="A cutting-edge job recruitment platform specializing in talent acquisition across UAE, India, and America markets."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-email">Contact Email</Label>
                            <Input id="contact-email" value="contact@expertrecruitments.com" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Job Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="job-expiry">Default Job Expiry (days)</Label>
                            <Input id="job-expiry" type="number" value="30" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobs-per-page">Jobs Per Page</Label>
                            <Input id="jobs-per-page" type="number" value="10" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="featured-duration">Featured Job Duration (days)</Label>
                            <Input id="featured-duration" type="number" value="14" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="job-approval">Job Approval Required</Label>
                            <Select defaultValue="yes">
                              <SelectTrigger id="job-approval">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Button>Save Changes</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="email">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Email Templates</h3>
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Welcome Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <Label htmlFor="welcome-subject">Subject</Label>
                                <Input id="welcome-subject" value="Welcome to Expert Recruitments!" />
                              </div>
                              <div className="space-y-2 mt-4">
                                <Label htmlFor="welcome-body">Email Body</Label>
                                <Textarea 
                                  id="welcome-body" 
                                  className="min-h-[200px]" 
                                  value="Dear {{name}},

Thank you for joining Expert Recruitments! We're excited to have you on board.

Your account has been successfully created and you can now access all the features of our platform.

Best regards,
The Expert Recruitments Team"
                                />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Job Application Confirmation</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <Label htmlFor="application-subject">Subject</Label>
                                <Input id="application-subject" value="Your application for {{job_title}} has been received" />
                              </div>
                              <div className="space-y-2 mt-4">
                                <Label htmlFor="application-body">Email Body</Label>
                                <Textarea 
                                  id="application-body" 
                                  className="min-h-[200px]" 
                                  value="Dear {{name}},

Your application for the position of {{job_title}} at {{company}} has been successfully submitted.

We will review your application and get back to you as soon as possible.

Best regards,
The Expert Recruitments Team"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <Button>Save Templates</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="api">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">API Keys</h3>
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">Your API Keys</CardTitle>
                              <Button>Generate New Key</Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="rounded-md bg-gray-50 p-4 mb-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Production Key</p>
                                  <p className="text-sm text-gray-500">Created on Apr 10, 2025</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Reveal</Button>
                                  <Button variant="destructive" size="sm">Revoke</Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="rounded-md bg-gray-50 p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Development Key</p>
                                  <p className="text-sm text-gray-500">Created on Apr 15, 2025</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Reveal</Button>
                                  <Button variant="destructive" size="sm">Revoke</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Webhooks</h3>
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">Webhook Endpoints</CardTitle>
                              <Button>Add Endpoint</Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-gray-500 mb-4">
                              Configure webhook endpoints to receive real-time notifications for events on your platform.
                            </div>
                            <div className="rounded-md bg-gray-50 p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">https://example.com/webhooks/jobs</p>
                                  <p className="text-sm text-gray-500">Events: job.created, job.updated, job.expired</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="destructive" size="sm">Delete</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Authentication</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="min-password">Minimum Password Length</Label>
                            <Input id="min-password" type="number" value="8" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                            <Input id="password-expiry" type="number" value="90" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mfa-required">Require 2FA for Admins</Label>
                            <Select defaultValue="yes">
                              <SelectTrigger id="mfa-required">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lockout-attempts">Login Attempts Before Lockout</Label>
                            <Input id="lockout-attempts" type="number" value="5" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Activity Logging</h3>
                        <div className="space-y-2">
                          <Label htmlFor="log-retention">Log Retention Period (days)</Label>
                          <Input id="log-retention" type="number" value="30" />
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label>Log Actions</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="log-login" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked />
                              <Label htmlFor="log-login" className="text-sm font-normal">Login Attempts</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="log-job" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked />
                              <Label htmlFor="log-job" className="text-sm font-normal">Job Management</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="log-user" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked />
                              <Label htmlFor="log-user" className="text-sm font-normal">User Management</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="log-settings" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked />
                              <Label htmlFor="log-settings" className="text-sm font-normal">Settings Changes</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button>Save Security Settings</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;