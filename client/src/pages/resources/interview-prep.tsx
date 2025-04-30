import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, CircleHelp, UserRound, Building2, BookText, LucideIcon, MessagesSquare, Lightbulb, Search, BriefcaseBusiness, BadgeDollarSign, Coins } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface TipCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const TipCard = ({ title, description, icon: Icon }: TipCardProps) => (
  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
    <CardHeader className="pb-2">
      <div className="flex items-center mb-2">
        <div className="mr-3 p-2 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const commonQuestions: FAQ[] = [
  {
    question: "Tell me about yourself",
    answer: "This is often the opening question. Keep your answer concise (1-2 minutes) and focused on your professional background. Start with your current role, mention key experiences, and highlight achievements relevant to the position. End with why you're excited about this opportunity."
  },
  {
    question: "Why do you want to work for our company?",
    answer: "Show that you've done your research about the company. Mention specific aspects of their culture, products, or reputation that align with your career goals. Be genuine about why you're interested and how you can contribute to their mission."
  },
  {
    question: "What are your greatest strengths?",
    answer: "Choose 2-3 strengths that are relevant to the position. Use the STAR method (Situation, Task, Action, Result) to provide specific examples of how you've demonstrated these strengths. Focus on qualities that make you valuable to the employer."
  },
  {
    question: "What is your greatest weakness?",
    answer: "Select a genuine weakness that isn't critical to the job, and most importantly, explain the steps you're taking to improve. This shows self-awareness and a commitment to professional growth. Avoid cliché answers like 'I'm a perfectionist' or 'I work too hard.'"
  },
  {
    question: "Where do you see yourself in five years?",
    answer: "Be honest but strategic. Show ambition and a desire to grow with the company, but keep your answer somewhat flexible. Emphasize your interest in developing skills and taking on greater responsibilities in a way that aligns with the company's trajectory."
  },
  {
    question: "Describe a challenging situation and how you handled it",
    answer: "Use the STAR method to describe a specific work challenge. Clearly explain the situation, your role, the actions you took, and the positive outcome. Focus on what you learned and how it helped you grow professionally."
  },
  {
    question: "Why should we hire you?",
    answer: "This is your opportunity to summarize your key qualifications, unique strengths, and the value you'll bring. Connect your skills directly to the job requirements and explain how your experience makes you the ideal candidate. Highlight what sets you apart from other candidates."
  },
  {
    question: "Do you have any questions for us?",
    answer: "Always have 3-5 thoughtful questions prepared. Ask about the team structure, company culture, expectations for the role, or growth opportunities. This demonstrates your interest in the position and helps you determine if the company is a good fit for you."
  },
];

const technicalInterviewTips: TipCardProps[] = [
  {
    title: "Understand the Fundamentals",
    description: "Focus on mastering the core concepts of your field rather than memorizing specific solutions. Strong foundational knowledge allows you to tackle unfamiliar problems more effectively.",
    icon: BookText
  },
  {
    title: "Practice Problem-Solving Aloud",
    description: "Get comfortable explaining your thought process out loud as you solve problems. This helps interviewers follow your reasoning and shows your communication skills.",
    icon: MessagesSquare
  },
  {
    title: "Research Company Technologies",
    description: "Research the specific technologies, frameworks, and tools used by the company. Tailor your preparation to focus on the tech stack relevant to the position.",
    icon: Search
  },
  {
    title: "Prepare for System Design Questions",
    description: "For senior roles, be ready to discuss system architecture, scalability concerns, and design tradeoffs. Practice drawing diagrams to explain complex systems.",
    icon: Lightbulb
  }
];

const behaviouralInterviewTips: TipCardProps[] = [
  {
    title: "Use the STAR Method",
    description: "Structure your responses using Situation, Task, Action, and Result. This framework helps you tell coherent stories that highlight your skills and achievements.",
    icon: CheckCircle2
  },
  {
    title: "Prepare Specific Examples",
    description: "Compile a list of concrete examples from your experience that demonstrate leadership, teamwork, problem-solving, and overcoming challenges.",
    icon: BriefcaseBusiness
  },
  {
    title: "Show Cultural Fit",
    description: "Research the company's values and culture, then prepare examples that demonstrate how your work style and values align with their environment.",
    icon: Building2
  },
  {
    title: "Address Failures Constructively",
    description: "When discussing challenges or failures, focus on what you learned and how you've grown. Show resilience and a commitment to improvement.",
    icon: UserRound
  }
];

const salaryNegotiationTips: TipCardProps[] = [
  {
    title: "Research Market Rates",
    description: "Before the interview, research salary ranges for similar positions in your location and industry using reliable sources like Glassdoor and PayScale.",
    icon: Search
  },
  {
    title: "Delay Salary Discussions",
    description: "If possible, postpone salary discussions until after you've received an offer. This puts you in a stronger negotiating position once they've decided they want you.",
    icon: Coins
  },
  {
    title: "Consider Total Compensation",
    description: "Look beyond the base salary to evaluate benefits, bonuses, equity, remote work options, and other perks that contribute to your overall compensation.",
    icon: BadgeDollarSign
  },
  {
    title: "Practice Your Response",
    description: "Prepare and practice how you'll respond to salary questions. Be confident but flexible, and focus on the value you'll bring to the organization.",
    icon: MessagesSquare
  }
];

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState("common-questions");

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6 mb-10">
          <h1 className="text-3xl font-bold">Interview Preparation Guide</h1>
          <p className="text-gray-500 text-lg">
            Prepare for your next job interview with these expert tips, common questions, and strategies to help you showcase your skills and experience effectively.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="common-questions">Common Questions</TabsTrigger>
            <TabsTrigger value="interview-tips">Interview Tips</TabsTrigger>
            <TabsTrigger value="interview-types">Interview Types</TabsTrigger>
          </TabsList>

          <TabsContent value="common-questions" className="pt-6">
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <CircleHelp className="h-5 w-5 text-primary" />
              <AlertTitle>Practice Makes Perfect</AlertTitle>
              <AlertDescription>
                Rehearse your answers to these common questions, but avoid sounding overly scripted.
                Focus on authentic responses that highlight your experience and skills.
              </AlertDescription>
            </Alert>

            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Interview Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {commonQuestions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="interview-tips" className="pt-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Behavioral Interview Tips</h2>
              <p className="text-gray-600 mb-6">
                Behavioral interviews assess how you've handled situations in the past as a predictor of future performance.
                Use these tips to effectively showcase your experiences and skills.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {behaviouralInterviewTips.map((tip, index) => (
                  <TipCard key={index} {...tip} />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Technical Interview Tips</h2>
              <p className="text-gray-600 mb-6">
                Technical interviews assess your problem-solving abilities and domain knowledge.
                These strategies will help you approach technical questions with confidence.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {technicalInterviewTips.map((tip, index) => (
                  <TipCard key={index} {...tip} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Salary Negotiation Tips</h2>
              <p className="text-gray-600 mb-6">
                Discussing compensation can be uncomfortable, but it's a crucial part of the interview process.
                These strategies will help you navigate salary negotiations professionally.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {salaryNegotiationTips.map((tip, index) => (
                  <TipCard key={index} {...tip} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interview-types" className="pt-6">
            <h2 className="text-2xl font-semibold mb-6">Common Interview Formats</h2>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Phone Screening</CardTitle>
                  <CardDescription>Usually the first step in the interview process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">What to Expect:</h4>
                      <p className="text-gray-600">
                        A 15-30 minute call with a recruiter to assess basic qualifications, salary expectations, and interest in the role.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Find a quiet place with good reception</li>
                        <li>Have your resume, the job description, and company notes in front of you</li>
                        <li>Speak clearly and with enthusiasm</li>
                        <li>Prepare a concise "tell me about yourself" response</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Video Interview</CardTitle>
                  <CardDescription>Increasingly common with remote and hybrid work arrangements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">What to Expect:</h4>
                      <p className="text-gray-600">
                        A 30-60 minute interview via Zoom, Microsoft Teams, or another video platform with a hiring manager or team.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Test your technology beforehand</li>
                        <li>Dress professionally from head to toe</li>
                        <li>Choose a clean, well-lit background</li>
                        <li>Look at the camera, not the screen, to maintain "eye contact"</li>
                        <li>Close other applications to avoid notifications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>In-Person Interview</CardTitle>
                  <CardDescription>Traditional face-to-face meeting at the company's office</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">What to Expect:</h4>
                      <p className="text-gray-600">
                        A comprehensive interview that may last 1-3 hours, potentially including multiple rounds with different team members.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Arrive 10-15 minutes early</li>
                        <li>Bring multiple copies of your resume</li>
                        <li>Prepare for a potential office tour</li>
                        <li>Be courteous to everyone you meet, including receptionists</li>
                        <li>Bring a notepad and pen to take notes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Panel Interview</CardTitle>
                  <CardDescription>Interview with multiple team members simultaneously</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">What to Expect:</h4>
                      <p className="text-gray-600">
                        A 45-90 minute session where you'll face questions from several interviewers, each with different perspectives and concerns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Try to establish each person's role in the company</li>
                        <li>Address each person when answering their specific question</li>
                        <li>Maintain equal eye contact with all panel members</li>
                        <li>Ask for business cards to send personalized thank-you notes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment or Task-Based Interview</CardTitle>
                  <CardDescription>Practical demonstration of your skills and abilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">What to Expect:</h4>
                      <p className="text-gray-600">
                        A hands-on task relevant to the role, such as a coding challenge, writing sample, presentation, or case study analysis.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Practice similar tasks beforehand if possible</li>
                        <li>Ask clarifying questions to ensure you understand the assignment</li>
                        <li>Explain your thought process as you work</li>
                        <li>Manage your time effectively</li>
                        <li>Focus on demonstrating your problem-solving approach, not just the final result</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
          <h3 className="text-xl font-semibold mb-3 text-primary">Final Preparation Checklist</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Research the company thoroughly (mission, values, recent news, products/services)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Practice your responses to common questions using concrete examples</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Prepare insightful questions to ask the interviewer</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Plan your outfit and prepare all necessary documents the night before</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Confirm the interview location and time, planning to arrive early</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Get a good night's sleep before the interview day</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}