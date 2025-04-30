import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BadgeDollarSign, 
  Calculator, 
  CheckCheck, 
  Clock, 
  Coins, 
  DollarSign, 
  FileText, 
  HandshakeIcon, 
  HelpCircle, 
  Lightbulb, 
  MessagesSquare, 
  Search, 
  ShieldAlert, 
  Sigma 
} from "lucide-react";

export default function SalaryNegotiationPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Salary Negotiation Tips</h1>
          <p className="text-gray-500 text-lg">
            Learn how to negotiate your compensation package confidently and effectively to ensure you're paid what you're worth.
          </p>
        </div>

        <Tabs defaultValue="preparation" className="w-full mb-10">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="preparation">Preparation</TabsTrigger>
            <TabsTrigger value="negotiation-tactics">Negotiation Tactics</TabsTrigger>
            <TabsTrigger value="common-mistakes">Common Mistakes</TabsTrigger>
          </TabsList>

          <TabsContent value="preparation" className="pt-6">
            <Alert className="mb-6">
              <Lightbulb className="h-5 w-5" />
              <AlertTitle>Research is your strongest advantage</AlertTitle>
              <AlertDescription>
                The more informed you are before starting negotiations, the more confident and persuasive you'll be.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <CardTitle>Market Research</CardTitle>
                  </div>
                  <CardDescription>Understanding your market value</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Industry Salary Guides</h3>
                    <p className="text-sm text-gray-600">
                      Use resources like Glassdoor, PayScale, and industry-specific salary surveys to understand the typical compensation range for your role, experience level, and location.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Network Insights</h3>
                    <p className="text-sm text-gray-600">
                      Carefully approach professionals in similar positions through LinkedIn or industry events to gather insights on compensation trends. Focus on salary ranges rather than specific figures.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Company Research</h3>
                    <p className="text-sm text-gray-600">
                      Research the company's financial health, recent funding, or market performance to gauge their ability to pay competitively. Companies in growth phases may have more flexibility.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sigma className="h-5 w-5 text-primary" />
                    <CardTitle>Define Your Numbers</CardTitle>
                  </div>
                  <CardDescription>Setting your compensation targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Your Target Number</h3>
                    <p className="text-sm text-gray-600">
                      Based on your research, identify your ideal compensation—this should be ambitious but justifiable based on your skills and market data.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Reservation Point</h3>
                    <p className="text-sm text-gray-600">
                      Determine your absolute minimum acceptable offer—the point below which you'd walk away. Consider your current compensation, expenses, and future career impact.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Anchoring Range</h3>
                    <p className="text-sm text-gray-600">
                      Prepare to propose a range with your target number at the lower end. For example, if your target is $85,000, suggest a range of $85,000-$95,000.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Document Your Value</CardTitle>
                  </div>
                  <CardDescription>Building your case for higher compensation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Achievement Portfolio</h3>
                    <p className="text-sm text-gray-600">
                      Compile specific examples of your achievements, focusing on measurable results and business impact. Include metrics like revenue generated, costs saved, or efficiency improved.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Unique Skills Matrix</h3>
                    <p className="text-sm text-gray-600">
                      Identify specialized skills, experiences, or qualifications you possess that are highly valuable or scarce in the market. These differentiators strengthen your negotiating position.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Future Value Proposition</h3>
                    <p className="text-sm text-gray-600">
                      Prepare to articulate how you'll contribute to the company's success going forward. Focus on specific initiatives or improvements you plan to implement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Consider the Full Package</CardTitle>
                  </div>
                  <CardDescription>Looking beyond base salary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Benefits Valuation</h3>
                    <p className="text-sm text-gray-600">
                      Assess the monetary value of benefits like health insurance, retirement contributions, and paid time off. These can significantly impact your total compensation.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Flexible Arrangements</h3>
                    <p className="text-sm text-gray-600">
                      Consider the value of flexible work arrangements, remote work options, or compressed workweeks. These quality-of-life benefits may be worth trading for some salary.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Growth Opportunities</h3>
                    <p className="text-sm text-gray-600">
                      Evaluate professional development budgets, mentorship programs, or clear paths to promotion. Long-term growth potential can sometimes outweigh immediate compensation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="negotiation-tactics" className="pt-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Effective Negotiation Strategies</h2>
              <p className="text-gray-600 mb-6">
                These practical approaches will help you navigate salary discussions with confidence and professionalism.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Timing is Everything</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Wait for the Right Moment</h3>
                    <p className="text-sm text-gray-600">
                      Ideally, let the employer bring up compensation first. If they ask about your expectations early in the process, politely deflect with: "I'd like to learn more about the role and responsibilities before discussing compensation."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Negotiate After the Offer</h3>
                    <p className="text-sm text-gray-600">
                      Your strongest position is after receiving a formal offer but before accepting it. At this point, the employer has decided they want you and invested in the hiring process.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Use the 24-Hour Rule</h3>
                    <p className="text-sm text-gray-600">
                      When you receive an offer, thank the employer enthusiastically but ask for time to consider it. This creates space to plan your negotiation strategy without pressure.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessagesSquare className="h-5 w-5 text-primary" />
                    <span>Communication Techniques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Use Collaborative Language</h3>
                    <p className="text-sm text-gray-600">
                      Frame the negotiation as a collaborative process rather than a confrontation. Use phrases like "I'm excited about this opportunity and want to find an arrangement that works for both of us."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">The Power of Silence</h3>
                    <p className="text-sm text-gray-600">
                      After stating your counter-offer, resist the urge to fill silence. Pause and wait for the employer to respond. This creates space for them to consider or potentially improve their offer.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Express Enthusiasm</h3>
                    <p className="text-sm text-gray-600">
                      Throughout the negotiation, consistently express your interest in the role and company. This reassures the employer that you're negotiating in good faith and are committed to joining their team.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandshakeIcon className="h-5 w-5 text-primary" />
                    <span>Negotiation Moves</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">The Counter-Offer</h3>
                    <p className="text-sm text-gray-600">
                      When countering, aim for 10-20% above their initial offer (if reasonable based on your research). Support your counter with specific evidence of your value and market data.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">The "Split the Difference" Technique</h3>
                    <p className="text-sm text-gray-600">
                      If the employer counters your proposal, consider suggesting a figure that splits the difference between your positions. This appears fair and reasonable to most negotiation partners.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">The Trade-Off Strategy</h3>
                    <p className="text-sm text-gray-600">
                      If the employer can't meet your salary expectations, suggest trade-offs: "I understand you can't go higher than $X on base salary. Would you consider additional vacation days or a signing bonus to bridge the gap?"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCheck className="h-5 w-5 text-primary" />
                    <span>Closing the Deal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Get It in Writing</h3>
                    <p className="text-sm text-gray-600">
                      Once you've reached an agreement, request a revised offer letter that includes all negotiated terms, including salary, benefits, bonuses, and any special arrangements.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Express Gratitude</h3>
                    <p className="text-sm text-gray-600">
                      Thank the employer for their willingness to discuss compensation and reach a mutually beneficial agreement. This maintains goodwill as you start your new position.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Know When to Stop</h3>
                    <p className="text-sm text-gray-600">
                      Once you've achieved a reasonable improvement over the initial offer, consider accepting rather than pushing further. Maintaining a positive relationship is valuable for your long-term success.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="common-mistakes" className="pt-6">
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <AlertTitle>Learning from others' experiences</AlertTitle>
              <AlertDescription>
                Understanding these common pitfalls can help you avoid costly mistakes during your salary negotiation.
              </AlertDescription>
            </Alert>

            <h2 className="text-2xl font-semibold mb-4">Salary Negotiation Mistakes to Avoid</h2>
            <Accordion type="single" collapsible className="w-full mb-8">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-primary" />
                    <span className="font-medium">Revealing Your Salary Expectations Too Early</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Sharing your expected salary before the employer makes an offer can anchor negotiations too low or potentially price you out of consideration. It limits your negotiating leverage.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      If asked about salary expectations early in the process, politely defer: "I'd like to learn more about the role and responsibilities first. I'm confident we can find a compensation package that reflects the value I'll bring to your organization."
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <span className="font-medium">Basing Negotiations on Your Current Salary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Your current salary might not reflect your true market value, especially if you've been with the same employer for a long time or if you're changing industries or locations.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Base your expectations on current market rates for your skills and experience, not your previous compensation. Research salary benchmarks for your target role and location using resources like Glassdoor, PayScale, or industry salary surveys.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Not Preparing Specific Justification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Simply asking for more money without supporting evidence makes you appear unprofessional and unprepared. Employers need compelling reasons to increase their offer.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Prepare a specific, evidence-based case for your desired compensation. Highlight your relevant achievements, specialized skills, and market data. For example: "Based on my experience leading three successful product launches that generated $X in revenue, and considering the market rate for professionals with my expertise, I believe $Y would be appropriate."
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="font-medium">Focusing Only on Base Salary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Total compensation includes much more than just base salary. By focusing only on this number, you might miss opportunities to improve your overall package through benefits, bonuses, equity, or other perks.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Consider the entire compensation package, including health benefits, retirement contributions, bonuses, equity, paid time off, flexible work arrangements, professional development budgets, and other perks. If an employer can't meet your base salary expectations, explore improvements in these other areas.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <span className="font-medium">Making Ultimatums</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Phrases like "I need at least $X or I'll have to decline" create a confrontational dynamic and may damage the relationship before you even start. They can also backfire if the employer decides they can't meet your demands.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Frame your requests collaboratively: "I'm very excited about joining your team. Based on my research and the value I'll bring, I was hoping for a salary closer to $X. Is there any flexibility in the budget to help us reach a middle ground?" This maintains a positive relationship while still asserting your value.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <MessagesSquare className="h-5 w-5 text-primary" />
                    <span className="font-medium">Accepting the First Offer Immediately</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Most employers expect some negotiation and may start with an offer below what they're actually willing to pay. Accepting immediately might leave money on the table and signal that you undervalue your worth.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Express enthusiasm for the offer and the role, but ask for time to consider: "Thank you for this offer. I'm very excited about the opportunity to join your team. Would it be alright if I take 24-48 hours to review the details?" This gives you time to prepare a thoughtful counter-offer if appropriate.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Neglecting to Get the Final Agreement in Writing</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Why it's a mistake:</h3>
                    <p className="text-gray-700 mb-3">
                      Verbal agreements are difficult to verify later and can lead to misunderstandings or disputes. Without written confirmation, you have no documentation of what was promised.
                    </p>
                    <h3 className="font-medium mb-2">Better approach:</h3>
                    <p className="text-gray-700">
                      Once you've reached an agreement, request a revised offer letter that includes all negotiated terms. Review it carefully to ensure it reflects everything you discussed, including salary, bonuses, benefits, start date, and any special arrangements. Only accept the position after receiving and approving this written offer.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold mb-4 text-primary">Salary Negotiation Scripts</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">When asked about salary expectations early in the process:</h4>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-gray-700 italic">
                      "I'd like to learn more about the responsibilities and expectations for this role before discussing compensation. That way, I can better understand the value I'd bring to your organization and ensure we're aligned on what the position entails."
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">When making a counter-offer:</h4>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-gray-700 italic">
                      "Thank you for the offer of $X. I'm very excited about the opportunity to join your team. Based on my research of similar roles in this market, and considering my experience with [specific relevant skill/achievement], I was hoping for something closer to $Y. Would you have any flexibility in the compensation for this position?"
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">When negotiating beyond base salary:</h4>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-gray-700 italic">
                      "I understand you may not have flexibility on the base salary. I'm wondering if we could discuss other aspects of the compensation package, such as a signing bonus, additional vacation days, or professional development opportunities that might help bridge the gap?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}