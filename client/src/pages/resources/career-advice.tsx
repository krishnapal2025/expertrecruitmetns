import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, BookOpen, Calendar, CircleCheck, ClipboardCheck, FileText, GraduationCap, Lightbulb, Link, LinkIcon, Presentation, Share2, Star, Target, TrendingUp } from "lucide-react";

export default function CareerAdvicePage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Career Advice</h1>
          <p className="text-gray-500 text-lg">
            Discover expert tips and strategies to advance your professional journey, 
            enhance your skills, and achieve your career goals.
          </p>
        </div>

        <Tabs defaultValue="growth" className="w-full mb-10">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="growth">Career Growth</TabsTrigger>
            <TabsTrigger value="skills">Building Skills</TabsTrigger>
            <TabsTrigger value="workplace">Workplace Success</TabsTrigger>
            <TabsTrigger value="job-search">Job Search</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Professional Development</CardTitle>
                  </div>
                  <CardDescription>Strategies to continuously develop your expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-base mb-2">Continuous Learning</h3>
                        <p className="text-sm text-gray-600">
                          Dedicate time each week to learning new skills relevant to your industry. Consider online courses, 
                          professional certifications, workshops, or industry conferences. Allocate at least 5 hours weekly to skill development.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Seek Mentorship</h3>
                        <p className="text-sm text-gray-600">
                          Find an experienced professional in your field who can provide guidance, feedback, and insights. 
                          A good mentor can help you navigate challenges, identify growth opportunities, and expand your professional network.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Cross-Functional Experience</h3>
                        <p className="text-sm text-gray-600">
                          Volunteer for projects that expose you to different areas of your organization. 
                          Understanding how various departments operate will make you more valuable to employers and better equipped for leadership roles.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <ClipboardCheck className="h-3 w-3 mr-1" />
                    <span>Key to advancement: Proactive skill acquisition</span>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Setting Career Goals</CardTitle>
                  </div>
                  <CardDescription>Defining and achieving your professional objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-base mb-2">SMART Goal Framework</h3>
                        <p className="text-sm text-gray-600">
                          Create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound. 
                          For example, instead of "get better at leadership," set a goal like "complete a leadership certification and lead two major projects within six months."
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Short and Long-Term Planning</h3>
                        <p className="text-sm text-gray-600">
                          Balance immediate objectives (6-12 months) with long-term aspirations (3-5 years). 
                          Review and adjust your goals quarterly to stay agile in response to changing opportunities and circumstances.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Track Progress Systematically</h3>
                        <p className="text-sm text-gray-600">
                          Maintain a career journal to document achievements, challenges, and lessons learned. 
                          Schedule monthly self-assessments to evaluate progress toward your goals and identify areas for adjustment.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Review goals quarterly to maintain momentum</span>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Presentation className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Personal Branding</CardTitle>
                  </div>
                  <CardDescription>Building your professional reputation and presence</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-base mb-2">Define Your Value Proposition</h3>
                        <p className="text-sm text-gray-600">
                          Identify what makes you unique in your field—your specific expertise, approach, or combination of skills. 
                          Craft a concise personal statement that communicates your professional identity and the value you bring.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Curate Your Online Presence</h3>
                        <p className="text-sm text-gray-600">
                          Maintain an updated LinkedIn profile that showcases your experience, skills, and accomplishments. 
                          Consider creating content related to your expertise through blogging, videos, or professional social media posts.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Network Strategically</h3>
                        <p className="text-sm text-gray-600">
                          Attend industry events and engage in professional communities relevant to your field. 
                          Be intentional about building relationships with colleagues, mentors, and industry leaders who align with your career goals.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Share2 className="h-3 w-3 mr-1" />
                    <span>Consistency across all professional platforms is essential</span>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Career Progression</CardTitle>
                  </div>
                  <CardDescription>Strategies for advancement and promotion</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-base mb-2">Take Initiative</h3>
                        <p className="text-sm text-gray-600">
                          Volunteer for challenging projects, especially those with high visibility and impact. 
                          Identify problems before they're apparent to others and propose solutions that demonstrate your leadership potential.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Document Achievements</h3>
                        <p className="text-sm text-gray-600">
                          Maintain a detailed record of your accomplishments, particularly those that demonstrate measurable impact. 
                          Quantify results whenever possible (e.g., "increased efficiency by 30%" or "generated $50K in revenue").
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">Strategic Relationships</h3>
                        <p className="text-sm text-gray-600">
                          Build strong working relationships with decision-makers in your organization. 
                          Find a sponsor—someone in a position of influence who will advocate for your advancement and connect you with opportunities.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <CircleCheck className="h-3 w-3 mr-1" />
                    <span>Make your accomplishments visible to decision-makers</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="pt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Essential Skills for Career Growth</h2>
              <p className="text-gray-600 mb-6">
                Beyond technical expertise, these core competencies will help you thrive in any professional environment 
                and adapt to changing workplace demands.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span>Critical Thinking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to analyze information objectively and make reasoned judgments. 
                    Practice by questioning assumptions, evaluating evidence, and considering alternative perspectives 
                    before making decisions.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Problem-solving exercises</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    <span>Communication</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to convey information clearly and effectively. Focus on both verbal communication 
                    (presentations, meetings) and written skills (emails, reports). Tailor your message to your audience 
                    and practice active listening.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Public speaking & writing</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Adaptability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to adjust to new conditions and embrace change. In rapidly evolving industries, 
                    this skill is particularly valuable. Develop adaptability by stepping outside your comfort zone 
                    and taking on diverse challenges.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Embracing new technologies</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <span>Collaboration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to work effectively with others toward a common goal. Enhance collaboration skills by 
                    practicing empathy, respecting diverse perspectives, and focusing on shared objectives rather than 
                    personal agendas.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Cross-functional projects</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Digital Literacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to navigate and utilize digital tools effectively. Beyond basic computer skills, 
                    focus on understanding data analysis, digital collaboration tools, and industry-specific software. 
                    Stay current with evolving technologies.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Online courses & tutorials</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-primary" />
                    <span>Emotional Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    The ability to recognize, understand, and manage emotions—both your own and others'. 
                    Develop this skill through self-reflection, seeking feedback, and practicing mindfulness in your 
                    interactions with colleagues.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <p className="text-xs text-gray-500">Development method:</p>
                  <p className="text-xs font-medium text-primary">Self-awareness practices</p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workplace" className="pt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Workplace Success Strategies</h2>
              <p className="text-gray-600 mb-6">
                Practical approaches to navigate workplace dynamics, build professional relationships, 
                and maximize your impact and visibility.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Navigating Workplace Politics</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Observe Before Acting</h4>
                    <p className="text-sm text-gray-600">
                      Take time to understand the informal power structures, alliances, and communication norms in your workplace. 
                      Identify key influencers and decision-makers beyond the official organizational chart.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Build Authentic Relationships</h4>
                    <p className="text-sm text-gray-600">
                      Focus on developing genuine connections based on mutual respect and trust, rather than transactional relationships. 
                      Find common interests and opportunities to collaborate with colleagues across departments.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Manage Conflicts Professionally</h4>
                    <p className="text-sm text-gray-600">
                      Address disagreements directly but diplomatically. Focus on issues rather than personalities, and approach 
                      conflicts as opportunities to find better solutions rather than win-lose scenarios.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Managing Workload and Productivity</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Prioritization Techniques</h4>
                    <p className="text-sm text-gray-600">
                      Use methods like the Eisenhower Matrix (urgent/important grid) to identify which tasks deserve immediate attention. 
                      Learn to distinguish between tasks that are truly important versus merely urgent.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Strategic Time Blocking</h4>
                    <p className="text-sm text-gray-600">
                      Schedule dedicated blocks of time for different types of work—deep focus work, meetings, emails, and breaks. 
                      Protect your most productive hours for your most challenging tasks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Delegation and Collaboration</h4>
                    <p className="text-sm text-gray-600">
                      Identify tasks that can be delegated or shared. Be clear about expectations, timelines, and desired outcomes 
                      when assigning work to others. Focus your energy on tasks that utilize your unique skills.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Demonstrating Leadership</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Lead Without Authority</h4>
                    <p className="text-sm text-gray-600">
                      Even without a formal leadership title, you can demonstrate leadership by taking initiative, supporting team goals, 
                      and helping colleagues succeed. Focus on solving problems rather than simply identifying them.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Develop a Growth Mindset</h4>
                    <p className="text-sm text-gray-600">
                      View challenges as opportunities to learn and improve. Embrace feedback—both positive and constructive—and use it 
                      to refine your approach. Share your knowledge and support others' development.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Strategic Communication</h4>
                    <p className="text-sm text-gray-600">
                      Articulate ideas clearly and persuasively. Learn to tailor your communication style to different audiences 
                      and situations. Listen actively to understand others' perspectives before responding.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="job-search" className="pt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Effective Job Search Strategies</h2>
              <p className="text-gray-600 mb-6">
                Techniques and approaches to help you find and secure the right opportunities in today's competitive job market.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resume Optimization</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Tailor to Each Application</h4>
                    <p className="text-sm text-gray-600">
                      Customize your resume for each position by highlighting the most relevant skills and experiences. 
                      Use keywords from the job description to help your resume pass through applicant tracking systems (ATS).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Focus on Achievements</h4>
                    <p className="text-sm text-gray-600">
                      Instead of simply listing job duties, emphasize specific accomplishments with measurable results. 
                      Use the formula: "Accomplished [X] as measured by [Y] by doing [Z]."
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Clean, Professional Formatting</h4>
                    <p className="text-sm text-gray-600">
                      Use a clean, professional design with consistent formatting. Ensure your resume is easy to scan in 
                      6-7 seconds—the average time recruiters initially spend on each resume.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Networking Strategies</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Leverage LinkedIn</h4>
                    <p className="text-sm text-gray-600">
                      Optimize your LinkedIn profile with a professional photo, compelling summary, and detailed work history. 
                      Actively engage with industry content and connect with professionals in your target companies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Informational Interviews</h4>
                    <p className="text-sm text-gray-600">
                      Request brief conversations with professionals in roles or companies that interest you. 
                      Focus on learning about their experience rather than asking for a job directly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Industry Events</h4>
                    <p className="text-sm text-gray-600">
                      Attend conferences, webinars, and meetups related to your field. Prepare an engaging elevator pitch 
                      and follow up with new connections promptly after the event.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Interview Excellence</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Research Thoroughly</h4>
                    <p className="text-sm text-gray-600">
                      Research the company's products/services, culture, recent news, and challenges. 
                      Understand how your role would contribute to their goals and be prepared to discuss this connection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Prepare STAR Stories</h4>
                    <p className="text-sm text-gray-600">
                      Develop concise stories using the STAR method (Situation, Task, Action, Result) that demonstrate 
                      your skills and accomplishments. Prepare examples for common behavioral interview questions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Practice Thoughtful Questions</h4>
                    <p className="text-sm text-gray-600">
                      Prepare insightful questions about the role, team, company challenges, and growth opportunities. 
                      Questions that demonstrate your understanding of the business will set you apart.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Search Organization</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Track Applications</h4>
                    <p className="text-sm text-gray-600">
                      Maintain a detailed spreadsheet or use a job search app to track applications, follow-ups, 
                      interview stages, and key contacts for each opportunity.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Establish a Routine</h4>
                    <p className="text-sm text-gray-600">
                      Treat your job search like a job itself, with dedicated hours and specific goals (e.g., applications submitted, 
                      networking connections made). Schedule regular breaks to maintain energy and motivation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Balanced Approach</h4>
                    <p className="text-sm text-gray-600">
                      Divide your time between multiple job search methods: online applications (30%), networking (40%), 
                      skill development (20%), and reflection/strategy adjustment (10%).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
          <h3 className="text-xl font-semibold mb-3 text-primary">Career Development Resources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Online Learning Platforms</h4>
                <p className="text-sm text-gray-600">
                  LinkedIn Learning, Coursera, and Udemy offer courses on professional skills, 
                  industry-specific knowledge, and career development.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <GraduationCap className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Professional Associations</h4>
                <p className="text-sm text-gray-600">
                  Join industry-specific associations for networking, continuing education, 
                  and access to specialized job boards.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Career Assessment Tools</h4>
                <p className="text-sm text-gray-600">
                  StrengthsFinder, Myers-Briggs, and Career Explorer can help you identify your strengths, 
                  interests, and potential career paths.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Career Coaching</h4>
                <p className="text-sm text-gray-600">
                  Consider working with a professional career coach for personalized guidance, 
                  feedback, and accountability in your career development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}