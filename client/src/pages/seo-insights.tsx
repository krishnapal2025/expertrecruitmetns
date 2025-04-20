import { Helmet } from "react-helmet";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Search, TrendingUp, BarChart2, PieChart as PieChartIcon, 
  Globe, ArrowUpRight, ArrowRight, ArrowDown, ArrowUp,
  Zap, Database, Award, Share2
} from "lucide-react";

export default function SEOInsightsPage() {
  const [activeTab, setActiveTab] = useState("keyword-research");
  const [searchTerm, setSearchTerm] = useState("");

  // Fade in animation for sections
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  // Stagger children animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Sample data for charts and metrics
  const keywordTrendsData = [
    { month: 'Jan', remote_work: 1000, hybrid_work: 800, office_based: 600 },
    { month: 'Feb', remote_work: 1200, hybrid_work: 900, office_based: 550 },
    { month: 'Mar', remote_work: 1100, hybrid_work: 950, office_based: 500 },
    { month: 'Apr', remote_work: 1500, hybrid_work: 1000, office_based: 480 },
    { month: 'May', remote_work: 1700, hybrid_work: 1050, office_based: 450 },
    { month: 'Jun', remote_work: 1600, hybrid_work: 1100, office_based: 400 },
  ];
  
  // Company names for chart labels - Google (remote), Microsoft (hybrid), Amazon (office)
  const workTypeCompanies = {
    remote_work: "Google & GitLab Remote",
    hybrid_work: "Microsoft & Apple Hybrid",
    office_based: "Goldman Sachs & JP Morgan Office"
  };

  const industryGrowthData = [
    { name: 'Technology (Google/NVIDIA)', value: 35 },
    { name: 'Healthcare (Mayo/CVS)', value: 25 },
    { name: 'Finance (Goldman/JP Morgan)', value: 20 },
    { name: 'Marketing (Adobe/Salesforce)', value: 15 },
    { name: 'Others (Various)', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const competitiveAnalysisData = [
    { job_title: 'Google Software Engineer', volume: 8500, difficulty: 65, opportunity: 85 },
    { job_title: 'Salesforce Marketing Manager', volume: 5600, difficulty: 45, opportunity: 78 },
    { job_title: 'Amazon Data Scientist', volume: 7800, difficulty: 70, opportunity: 90 },
    { job_title: 'Apple UX Designer', volume: 4500, difficulty: 40, opportunity: 75 },
    { job_title: 'Microsoft Product Manager', volume: 6700, difficulty: 60, opportunity: 82 },
  ];

  const resumeOptimizationData = [
    { skill: 'JavaScript (Google/Meta)', frequency: 85, trending: true },
    { skill: 'Python (Amazon/IBM)', frequency: 75, trending: true },
    { skill: 'React (Facebook/Airbnb)', frequency: 70, trending: true },
    { skill: 'SQL (Oracle/Microsoft)', frequency: 65, trending: false },
    { skill: 'AWS (Amazon/Netflix)', frequency: 60, trending: true },
    { skill: 'Machine Learning (NVIDIA/Tesla)', frequency: 55, trending: true },
    { skill: 'Node.js (PayPal/LinkedIn)', frequency: 50, trending: false },
    { skill: 'Docker (Uber/Spotify)', frequency: 45, trending: true },
  ];

  // Insights data for quick metrics
  const insightsData = [
    { title: "Top Keywords", value: "Google Remote, AWS Cloud, Microsoft AI", icon: Search, color: "bg-blue-500" },
    { title: "Average Searches", value: "15.3k monthly on LinkedIn & Indeed", icon: BarChart2, color: "bg-green-500" },
    { title: "Trending Industries", value: "NVIDIA AI, Mayo Healthcare", icon: TrendingUp, color: "bg-purple-500" },
    { title: "Keyword Difficulty", value: "Medium (45/100) for Amazon roles", icon: Award, color: "bg-amber-500" },
  ];

  return (
    <>
      <Helmet>
        <title>SEO Insights | Expert Recruitments</title>
        <meta name="description" content="Analyze job market trends, optimize your resume, and improve your visibility with our SEO insights tools." />
      </Helmet>

      {/* Hero section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gray-50"></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
          <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary/5 rounded-full"></div>
          <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-primary/5 rounded-full"></div>
        </div>
        
        <div className="absolute left-0 bottom-0 w-1/4 h-80 overflow-hidden">
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16">
            <motion.div 
              className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Data Analytics</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Job Market SEO Insights
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Analyze trends, optimize your visibility, and make data-driven decisions
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Gain valuable insights for your job search or hiring process with our advanced analytics tools
            </motion.p>
            
            <div className="w-full max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for keywords, skills, or job titles..."
                className="pl-12 py-6 text-gray-900 border-0 rounded-md shadow-lg bg-white/90 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
                size="sm"
              >
                Analyze
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        {/* Quick insights section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {insightsData.map((insight, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className={`${insight.color} rounded-full p-3 text-white mr-4`}>
                      <insight.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{insight.title}</h3>
                      <p className="text-gray-600">{insight.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab navigation */}
        <div className="mb-12">
          <Tabs defaultValue="keyword-research" onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-1 rounded-full">
                <TabsTrigger 
                  value="keyword-research"
                  className={`rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all`}
                >
                  Keyword Research
                </TabsTrigger>
                <TabsTrigger 
                  value="competitive-analysis"
                  className={`rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all`}
                >
                  Competitive Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="industry-trends"
                  className={`rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all`}
                >
                  Industry Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="resume-optimization"
                  className={`rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all`}
                >
                  Resume Optimization
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="keyword-research" className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <motion.div variants={fadeIn} className="lg:col-span-2">
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Keyword Search Volume Trends</CardTitle>
                      <CardDescription>Monthly search volume for popular work arrangement keywords</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={keywordTrendsData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorRemote" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorHybrid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorOffice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FFBB28" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="remote_work" stroke="#0088FE" fillOpacity={1} fill="url(#colorRemote)" />
                            <Area type="monotone" dataKey="hybrid_work" stroke="#00C49F" fillOpacity={1} fill="url(#colorHybrid)" />
                            <Area type="monotone" dataKey="office_based" stroke="#FFBB28" fillOpacity={1} fill="url(#colorOffice)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <span className="text-sm text-gray-500">
                        Data suggests a continuous rise in remote work searches
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="shadow-lg border-none h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Top Rising Keywords</CardTitle>
                      <CardDescription>Keywords with the highest growth in the past 3 months</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { keyword: "Google AI Engineer", growth: "+125%", volume: "8.5k" },
                          { keyword: "Amazon Remote Data Analyst", growth: "+85%", volume: "6.3k" },
                          { keyword: "Microsoft Cloud Architect", growth: "+72%", volume: "5.8k" },
                          { keyword: "Cisco Cybersecurity Specialist", growth: "+65%", volume: "7.2k" },
                          { keyword: "Meta Full Stack Developer", growth: "+58%", volume: "12.1k" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{item.keyword}</h4>
                                <p className="text-sm text-gray-500">Volume: {item.volume}/mo</p>
                              </div>
                            </div>
                            <div className="text-green-500 font-medium flex items-center">
                              <ArrowUp className="w-4 h-4 mr-1" />
                              {item.growth}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <Button variant="outline" className="w-full">
                        View All Keywords
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="competitive-analysis" className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <motion.div variants={fadeIn} className="lg:col-span-2">
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Competitive Job Title Analysis</CardTitle>
                      <CardDescription>Search volume, difficulty, and opportunity score for popular roles</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={competitiveAnalysisData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="job_title" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="volume" name="Search Volume" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="difficulty" name="Difficulty Score" fill="#82ca9d" />
                            <Bar yAxisId="right" dataKey="opportunity" name="Opportunity Score" fill="#ffc658" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <span className="text-sm text-gray-500">
                        Higher opportunity score indicates better job market potential
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="shadow-lg border-none h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Top Competitors</CardTitle>
                      <CardDescription>Companies with the most job postings in your field</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { company: "Google", growth: "+12%", postings: "152" },
                          { company: "Amazon", growth: "+8%", postings: "127" },
                          { company: "Microsoft", growth: "+15%", postings: "118" },
                          { company: "IBM", growth: "-3%", postings: "96" },
                          { company: "Salesforce", growth: "+10%", postings: "89" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${
                                index === 0 ? "bg-amber-100 text-amber-600" :
                                index === 1 ? "bg-gray-200 text-gray-600" :
                                index === 2 ? "bg-orange-100 text-orange-600" :
                                "bg-blue-100 text-blue-600"
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{item.company}</h4>
                                <p className="text-sm text-gray-500">Postings: {item.postings}</p>
                              </div>
                            </div>
                            <div className={`font-medium flex items-center ${
                              item.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {item.growth.startsWith('+') ? 
                                <ArrowUp className="w-4 h-4 mr-1" /> :
                                <ArrowDown className="w-4 h-4 mr-1" />
                              }
                              {item.growth}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <Button variant="outline" className="w-full">
                        View Detailed Report
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="industry-trends" className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <motion.div variants={fadeIn} className="lg:col-span-2">
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Industry Growth Analysis</CardTitle>
                      <CardDescription>Job market growth distribution across industries</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={industryGrowthData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {industryGrowthData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <span className="text-sm text-gray-500">
                        Technology and Healthcare lead the job market growth
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="shadow-lg border-none h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Emerging Job Roles</CardTitle>
                      <CardDescription>New job titles with increasing demand</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { role: "Google AI Ethics Officer", industry: "Technology", growth: "New" },
                          { role: "Spotify Remote Work Coordinator", industry: "HR", growth: "New" },
                          { role: "Mayo Clinic Digital Health Consultant", industry: "Healthcare", growth: "New" },
                          { role: "Tesla Sustainability Manager", industry: "Automotive", growth: "+215%" },
                          { role: "Amazon Customer Experience Lead", industry: "Retail", growth: "+180%" },
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{item.role}</h4>
                              <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                {item.growth}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">Industry: {item.industry}</p>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${index === 0 ? 90 : index === 1 ? 85 : index === 2 ? 80 : index === 3 ? 75 : 70}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <Button variant="outline" className="w-full">
                        Explore Career Opportunities
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="resume-optimization" className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <motion.div variants={fadeIn} className="lg:col-span-2">
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Skill Keyword Frequency Analysis</CardTitle>
                      <CardDescription>Most frequently mentioned skills in job postings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={resumeOptimizationData}
                            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="skill" type="category" scale="band" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="frequency" name="Frequency Score" fill="#0088FE" radius={[0, 4, 4, 0]}>
                              {resumeOptimizationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.trending ? '#0088FE' : '#8884d8'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <span className="text-sm text-gray-500">
                        Skills in blue are currently trending upward in demand
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Card className="shadow-lg border-none h-full">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-xl">Resume Optimization Tips</CardTitle>
                      <CardDescription>Improve your resume's visibility to recruiters</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { tip: "Use Google-specific keywords", description: "Include terms from Google job descriptions" },
                          { tip: "Quantify Amazon-style achievements", description: "Use numbers like Amazon's leadership principles" },
                          { tip: "Optimize for Microsoft ATS", description: "Format resume to pass Microsoft's screening systems" },
                          { tip: "Include Apple's trending skills", description: "Highlight skills mentioned in Apple job posts" },
                          { tip: "Tailor for each tech company", description: "Customize keywords for specific companies like Meta" },
                        ].map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">{item.tip}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-3">
                      <Button variant="outline" className="w-full">
                        Resume Analysis Tool
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature boxes */}
        <motion.div
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <motion.div variants={fadeIn}>
            <Card className="border-none shadow-lg overflow-hidden h-full">
              <div className="h-3 bg-blue-500"></div>
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Keyword Explorer</h3>
                <p className="text-gray-600 mb-4">
                  Discover high-value keywords to include in your resume and job applications to increase visibility.
                </p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Explore Keywords
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="border-none shadow-lg overflow-hidden h-full">
              <div className="h-3 bg-purple-500"></div>
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Market Intelligence</h3>
                <p className="text-gray-600 mb-4">
                  Access industry-specific reports and data to understand hiring trends and salary expectations.
                </p>
                <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                  View Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="border-none shadow-lg overflow-hidden h-full">
              <div className="h-3 bg-green-500"></div>
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Profile Visibility</h3>
                <p className="text-gray-600 mb-4">
                  Optimize your online professional profile to increase visibility to recruiters and hiring managers.
                </p>
                <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                  Boost Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 bg-blue-500/10 w-64 h-64 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 bg-purple-500/10 w-64 h-64 rounded-full"></div>
          
          <div className="relative z-10 text-center md:text-left md:flex items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">Ready to boost your job market visibility?</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Get personalized insights, keyword recommendations, and competitive analysis for your job search or hiring process.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Job Seeker Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Employer Insights
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}