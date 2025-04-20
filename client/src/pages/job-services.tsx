import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Award, Briefcase, FileText, Clock, BookOpen, UserCheck } from "lucide-react";
import { Link } from "wouter";

export default function JobServices() {
  return (
    <>
      <Helmet>
        <title>Job Services | EXPERT Recruitments LLC</title>
        <meta name="description" content="Premium job services for professionals to enhance your career journey" />
      </Helmet>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block bg-white px-4 py-1 rounded-full border border-primary/30 text-primary font-medium text-sm mb-4">
              EXCLUSIVELY FOR JOB SEEKERS
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Premium Career Services</h1>
            <p className="text-gray-600 text-lg mb-6">
              Enhance your job search experience with our specialized services designed to give you a competitive edge in the market.
            </p>
            <Link href="/job-seeker-register">
              <Button variant="default" className="mx-auto">
                Register as Job Seeker
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resume Review Service */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Resume Review & Optimization</CardTitle>
                <CardDescription>Professional assessment of your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Get your resume reviewed by industry experts who understand what employers look for. We'll provide feedback and optimization suggestions to make your resume stand out.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$99</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>

            {/* Interview Coaching */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Interview Coaching</CardTitle>
                <CardDescription>One-on-one interview preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Our coaching sessions prepare you for challenging interviews with personalized feedback, industry-specific question practice, and confidence-building techniques.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$149</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>

            {/* Career Counseling */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Career Counseling</CardTitle>
                <CardDescription>Strategic career guidance sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Unsure about your next career move? Our counselors provide personalized guidance to help you define goals, evaluate options, and create an actionable career plan.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$129</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Optimization */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">LinkedIn Profile Optimization</CardTitle>
                <CardDescription>Enhance your professional online presence</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Improve your visibility to recruiters with our LinkedIn optimization service. We'll enhance your profile to attract the right opportunities in the UAE & GCC job market.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$89</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Application Package */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Job Application Package</CardTitle>
                <CardDescription>Comprehensive application support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Our most comprehensive service includes resume optimization, cover letter writing, LinkedIn profile enhancement, and application strategy tailored to your target roles.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$249</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter Service */}
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Cover Letter Writing</CardTitle>
                <CardDescription>Custom cover letters that impress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Stand out with professionally written cover letters tailored to specific job applications. Our writers craft compelling letters that highlight your unique value proposition.
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">$79</div>
                  <Button variant="outline">Request Service</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mt-16 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Premium Job Seeker Package</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Take advantage of our exclusive premium package for serious job seekers in the UAE & GCC markets.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-primary">✓</div>
                    <span>Priority access to new job listings</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-primary">✓</div>
                    <span>Direct introduction to hiring managers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-primary">✓</div>
                    <span>Monthly 1:1 career coaching sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-primary">✓</div>
                    <span>Resume & LinkedIn refreshes every 3 months</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-primary">✓</div>
                    <span>Exclusive industry networking events</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-between">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$499</span>
                    <span className="text-gray-500 ml-2">/quarter</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Invest in your career with our comprehensive premium service package.
                  </p>
                  <Button className="w-full">Request Premium Package</Button>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Limited slots available each month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}