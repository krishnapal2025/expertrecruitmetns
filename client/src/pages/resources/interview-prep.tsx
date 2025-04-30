import { Helmet } from "react-helmet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, CheckCircle, AlertCircle, Video, MessageCircle, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Common interview question data
const commonQuestions = [
  {
    category: "Personal",
    questions: [
      { question: "Tell me about yourself.", answer: "Start with a brief introduction about your professional background, mention key achievements, and connect your experience to the role you're applying for. Keep it concise, around 2 minutes." },
      { question: "What are your strengths?", answer: "Mention 3-4 key strengths relevant to the position, provide specific examples demonstrating these strengths, and explain how they would benefit the company." },
      { question: "What are your weaknesses?", answer: "Choose a real weakness that isn't critical to the role, explain how you're working to improve it, and demonstrate your self-awareness and commitment to growth." },
      { question: "Where do you see yourself in 5 years?", answer: "Show ambition aligned with the position and company. Discuss how you hope to grow with the organization and contribute to its success while developing your skills and career." },
      { question: "Why do you want to work for our company?", answer: "Research the company beforehand and mention specific aspects like company culture, values, projects, or reputation that attract you. Show genuine interest and explain how your goals align with theirs." },
    ]
  },
  {
    category: "Experience",
    questions: [
      { question: "Describe your most challenging project.", answer: "Use the STAR method (Situation, Task, Action, Result) to describe a specific challenge, what your role was, how you addressed it, and the positive outcome achieved." },
      { question: "Why are you leaving your current job?", answer: "Focus on positive reasons like seeking new challenges, growth opportunities, or better alignment with your career goals. Never speak negatively about your current employer." },
      { question: "What is your greatest professional achievement?", answer: "Choose an achievement relevant to the position, quantify the results if possible, explain your specific contribution, and connect it to how you could add value in this new role." },
      { question: "How do you handle stress and pressure?", answer: "Describe specific strategies you use to manage stress (like prioritization, time management), provide an example of working under pressure, and emphasize your ability to remain productive." },
      { question: "Tell me about a time you failed.", answer: "Select a genuine failure, accept responsibility, explain what you learned, and how you've applied that lesson successfully since then. Show growth mindset and resilience." },
    ]
  },
  {
    category: "Job-Specific",
    questions: [
      { question: "What do you know about this role?", answer: "Demonstrate your understanding of the job description, key responsibilities, and required skills. Show how your experience and abilities align with what they're seeking." },
      { question: "How would you improve our product/service?", answer: "Research their offerings beforehand, provide thoughtful suggestions based on your expertise, and balance constructive ideas with respect for their existing approach." },
      { question: "Describe your ideal work environment.", answer: "Align your answer with what you know about their culture while being honest. Discuss factors like collaboration style, management approach, and work-life balance that help you thrive." },
      { question: "What would you accomplish in your first 90 days?", answer: "Outline a realistic plan including learning the organization, building relationships, identifying quick wins, and beginning to implement longer-term initiatives relevant to the role." },
      { question: "What unique skills can you bring to this position?", answer: "Highlight 2-3 distinctive skills or experiences that set you apart, explain why they're valuable for this specific role, and provide brief examples demonstrating these abilities." },
    ]
  },
  {
    category: "Behavioral",
    questions: [
      { question: "Describe a situation where you had to work with a difficult person.", answer: "Use the STAR method to explain the situation, your approach to understanding their perspective, the specific actions you took to improve the relationship, and the positive outcome achieved." },
      { question: "Give an example of a time you showed leadership.", answer: "Describe a specific situation where you led (formally or informally), the actions you took to guide others, overcome challenges, and the successful results your leadership produced." },
      { question: "Tell me about a time you had to persuade someone.", answer: "Detail a situation requiring persuasion, your understanding of the other person's perspective, the specific approach and arguments you used, and how you successfully gained their support." },
      { question: "How have you handled a major mistake by a team member?", answer: "Explain how you addressed the issue directly but privately, focused on solutions rather than blame, offered support, and ensured both accountability and learning from the experience." },
      { question: "Describe a situation where you had to adapt to change.", answer: "Outline a significant change you faced, your initial reaction, the steps you took to adjust positively, and how you ultimately embraced the change and contributed to success." },
    ]
  },
  {
    category: "Closing",
    questions: [
      { question: "Do you have any questions for me?", answer: "Always prepare 3-5 thoughtful questions about the role, team, company culture, or strategic direction. This demonstrates your interest, research, and engagement with the opportunity." },
      { question: "What are your salary expectations?", answer: "Research industry standards beforehand. Provide a realistic range based on your experience and the market, express flexibility, and emphasize that fit and opportunity are also important to you." },
      { question: "How soon could you start?", answer: "Be honest about notice periods or other commitments. If currently employed, explain the professional courtesy of providing adequate notice while expressing enthusiasm for starting as soon as reasonably possible." },
      { question: "Why should we hire you?", answer: "Summarize your key qualifications, unique strengths, and proven results relevant to their needs. Connect your capabilities directly to their requirements and express your enthusiasm for contributing to their team." },
      { question: "Is there anything else you'd like us to know?", answer: "Use this opportunity to address any gaps, add important information you haven't had a chance to share, or reinforce your key strengths and interest in the position." },
    ]
  }
];

// Industry-specific questions
const industryQuestions = {
  "Finance": [
    "How do you stay current with financial regulations and compliance requirements?",
    "Describe your experience with financial modeling and analysis.",
    "How would you explain complex financial concepts to non-financial stakeholders?",
    "What financial software and tools are you proficient with?",
    "How do you ensure accuracy in financial reporting?"
  ],
  "Technology": [
    "Describe your approach to learning new programming languages or technologies.",
    "How do you handle technical debt in your projects?",
    "Explain a complex technical concept in simple terms.",
    "How do you balance quality, speed, and cost in software development?",
    "Describe your experience with agile methodologies."
  ],
  "Healthcare": [
    "How do you ensure patient confidentiality and HIPAA compliance?",
    "Describe your experience working in multidisciplinary healthcare teams.",
    "How do you stay updated with the latest healthcare policies and procedures?",
    "What approaches do you use to handle high-stress medical situations?",
    "How do you prioritize patient care when resources are limited?"
  ],
  "Marketing": [
    "Describe a successful marketing campaign you developed and its results.",
    "How do you measure the ROI of marketing initiatives?",
    "What is your approach to understanding target audiences?",
    "How do you adapt marketing strategies based on performance data?",
    "Describe your experience with digital marketing tools and platforms."
  ],
  "Retail": [
    "How do you approach improving customer satisfaction and loyalty?",
    "Describe your experience with inventory management and supply chain.",
    "How do you handle difficult customer situations?",
    "What strategies have you used to increase sales or profitability?",
    "How do you train and motivate retail staff?"
  ]
};

// Interview tips by category
const interviewTips = [
  {
    category: "Research",
    icon: <BookOpen className="h-6 w-6 text-[#5372f1]" />,
    tips: [
      "Research the company's history, mission, values, products, and services.",
      "Review the company's website, social media, and recent news or press releases.",
      "Learn about the industry trends and challenges facing the company.",
      "Research your interviewers on LinkedIn if possible.",
      "Understand the company culture and how you might fit in."
    ]
  },
  {
    category: "Preparation",
    icon: <CheckCircle className="h-6 w-6 text-[#5372f1]" />,
    tips: [
      "Practice your responses to common interview questions.",
      "Prepare specific examples using the STAR method (Situation, Task, Action, Result).",
      "Create a list of questions to ask the interviewer.",
      "Prepare your professional introduction (your elevator pitch).",
      "Review your resume and be prepared to discuss all aspects in detail."
    ]
  },
  {
    category: "Presentation",
    icon: <Video className="h-6 w-6 text-[#5372f1]" />,
    tips: [
      "Dress professionally and appropriately for the company and role.",
      "Arrive 10-15 minutes early or log in 5 minutes early for virtual interviews.",
      "Bring copies of your resume, portfolio, and reference list.",
      "For virtual interviews, test your technology and ensure a professional background.",
      "Maintain good posture, eye contact, and a professional demeanor."
    ]
  },
  {
    category: "Communication",
    icon: <MessageCircle className="h-6 w-6 text-[#5372f1]" />,
    tips: [
      "Listen carefully to questions before responding.",
      "Keep answers concise and relevant (1-2 minutes per response).",
      "Use professional language and avoid industry jargon unless appropriate.",
      "Speak clearly and at a moderate pace.",
      "Ask for clarification if you don't understand a question."
    ]
  },
  {
    category: "Follow-Up",
    icon: <Download className="h-6 w-6 text-[#5372f1]" />,
    tips: [
      "Send a personalized thank-you email within 24 hours.",
      "Reference specific conversation points from the interview.",
      "Reiterate your interest in the position and company.",
      "Address any questions you didn't answer well or add information you forgot to mention.",
      "Follow up after one week if you haven't heard back."
    ]
  }
];

export default function InterviewPrepPage() {
  return (
    <>
      <Helmet>
        <title>Interview Preparation | Expert Recruitments LLC</title>
        <meta name="description" content="Prepare for your next job interview with expert tips, common questions, and industry-specific guidance." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#5372f1]">Interview Preparation Guide</h1>
          <p className="text-lg text-gray-600 mb-8">Comprehensive resources to help you ace your next job interview and stand out from other candidates.</p>
          
          <Alert className="mb-8 border-[#5372f1]/20 bg-[#5372f1]/5">
            <Lightbulb className="h-4 w-4 text-[#5372f1]" />
            <AlertTitle className="text-[#5372f1]">Pro Tip</AlertTitle>
            <AlertDescription>
              Interviews are a two-way conversation. They're not just assessing you; it's also your opportunity to evaluate if the company and role are right for you.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="common-questions" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="common-questions">Common Questions</TabsTrigger>
              <TabsTrigger value="industry-specific">Industry Specific</TabsTrigger>
              <TabsTrigger value="interview-tips">Interview Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="common-questions">
              <h2 className="text-2xl font-semibold mb-6">Common Interview Questions & Sample Answers</h2>
              <p className="text-gray-600 mb-6">Expand each section to see commonly asked questions in different categories, along with guidance on how to answer them effectively.</p>
              
              <Accordion type="single" collapsible className="w-full">
                {commonQuestions.map((category, index) => (
                  <AccordionItem key={index} value={`category-${index}`}>
                    <AccordionTrigger className="text-lg font-medium">
                      {category.category} Questions
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        {category.questions.map((item, qIndex) => (
                          <div key={qIndex} className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-2 text-[#5372f1]">{item.question}</h3>
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Alert className="mt-8 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Remember</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Personalize these sample answers with your own experiences and adapt them to each specific job opportunity.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="industry-specific">
              <h2 className="text-2xl font-semibold mb-6">Industry-Specific Interview Questions</h2>
              <p className="text-gray-600 mb-6">Questions frequently asked in specific industries. Prepare for these to demonstrate your specialized knowledge and experience.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(industryQuestions).map(([industry, questions], index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-semibold">{industry}</CardTitle>
                      <CardDescription>Common questions for {industry.toLowerCase()} roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {questions.map((question, qIndex) => (
                          <li key={qIndex} className="flex items-start">
                            <span className="text-[#5372f1] mr-2 mt-1">•</span>
                            <span className="text-gray-700">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 bg-[#5372f1]/5 p-6 rounded-lg border border-[#5372f1]/20">
                <h3 className="text-xl font-semibold mb-3 text-[#5372f1]">Need Help With Industry-Specific Preparation?</h3>
                <p className="text-gray-700 mb-4">Our recruitment specialists can provide personalized coaching for interviews in your industry. Get expert advice tailored to your career goals.</p>
                <Button className="bg-[#5372f1] hover:bg-[#4060e0]">Schedule Consultation</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="interview-tips">
              <h2 className="text-2xl font-semibold mb-6">Essential Interview Tips</h2>
              <p className="text-gray-600 mb-6">Follow these key strategies to make a strong impression and increase your chances of success.</p>
              
              <div className="grid grid-cols-1 gap-8">
                {interviewTips.map((category, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-4">
                      {category.icon}
                      <h3 className="text-xl font-semibold ml-2">{category.category}</h3>
                    </div>
                    <Separator className="mb-4" />
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Top Interview Mistakes to Avoid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Being unprepared or lacking company research</span>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Speaking negatively about previous employers</span>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Appearing disinterested or not asking questions</span>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Providing vague or generic answers</span>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Being late or unprofessionally dressed</span>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Failing to follow up after the interview</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-[#5372f1]/5 p-6 rounded-lg border border-[#5372f1]/20 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#5372f1]">Interview Formats You Should Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Traditional One-on-One</h3>
                <p className="text-gray-600 text-sm">The most common format with a single interviewer, typically lasting 30-60 minutes.</p>
              </div>
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Panel Interview</h3>
                <p className="text-gray-600 text-sm">Multiple interviewers asking questions, often from different departments.</p>
              </div>
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Group Interview</h3>
                <p className="text-gray-600 text-sm">Multiple candidates interviewed simultaneously, often including group exercises.</p>
              </div>
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Phone Interview</h3>
                <p className="text-gray-600 text-sm">Initial screening call to assess basic qualifications before in-person meetings.</p>
              </div>
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Video Interview</h3>
                <p className="text-gray-600 text-sm">Remote interview via platforms like Zoom, Teams, or Skype, increasingly common today.</p>
              </div>
              <div className="bg-white p-4 rounded-md border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Technical Interview</h3>
                <p className="text-gray-600 text-sm">Skills-based assessment with practical problems to solve, common in technical roles.</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white border p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Popular Interview Techniques</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Badge className="mt-1 mr-3 bg-[#5372f1]">STAR</Badge>
                <div>
                  <h3 className="font-semibold text-lg">Situation, Task, Action, Result</h3>
                  <p className="text-gray-600">A structured method for answering behavioral questions by describing the situation, explaining your task, detailing your actions, and sharing the results.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge className="mt-1 mr-3 bg-[#5372f1]">CAR</Badge>
                <div>
                  <h3 className="font-semibold text-lg">Challenge, Action, Result</h3>
                  <p className="text-gray-600">Similar to STAR but focused on challenges you've faced, the specific actions you took to address them, and the outcomes achieved.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge className="mt-1 mr-3 bg-[#5372f1]">PAR</Badge>
                <div>
                  <h3 className="font-semibold text-lg">Problem, Action, Result</h3>
                  <p className="text-gray-600">A technique emphasizing problem-solving by describing the problem you encountered, the actions you implemented, and the results you achieved.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Final Tips for Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Remember that confidence comes from preparation. Practice your responses, research the company thoroughly, prepare thoughtful questions, and focus on presenting the best version of yourself during the interview.
            </AlertDescription>
          </Alert>
          
          <div className="bg-[#5372f1] text-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Need Personalized Interview Coaching?</h2>
            <p className="mb-4">Our recruitment experts can provide one-on-one coaching sessions to help you prepare for specific roles and industries.</p>
            <Button variant="outline" className="bg-white text-[#5372f1] hover:bg-gray-100">Contact Our Team</Button>
          </div>
        </div>
      </div>
    </>
  );
}