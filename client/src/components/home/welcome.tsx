import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, TrendingUp } from "lucide-react";

export default function Welcome() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to RH Job Portal</h2>
          <p className="text-lg text-gray-600">
            We connect talented professionals with great companies. Whether you're looking for your next career move or seeking outstanding talent, we're here to help you succeed in today's competitive job market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              For Job Seekers
            </h3>
            <p className="text-gray-600">
              Take the next step in your career journey with us. We offer access to thousands of opportunities across various industries and locations, along with resources to help you stand out to employers.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create a profile that showcases your skills and experience</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Browse and apply to jobs that match your qualifications</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get discovered by employers seeking your skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access resources to enhance your job search</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              For Employers
            </h3>
            <p className="text-gray-600">
              Find the talent your organization needs to thrive. We provide access to a diverse pool of qualified candidates and offer tools to streamline your recruitment process.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Post jobs and reach thousands of qualified candidates</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Search our database for candidates with the right skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Manage applications efficiently with our tracking tools</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Build your employer brand with a company profile</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <TrendingUp className="h-10 w-10 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Industry-Leading Success</h3>
                  <p className="text-gray-600">
                    With a track record of connecting talent with opportunity, we've helped thousands of professionals advance their careers and hundreds of companies build strong teams.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Award className="h-10 w-10 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Quality Matches</h3>
                  <p className="text-gray-600">
                    We focus on making meaningful connections between candidates and employers, ensuring the right fit for both parties to foster long-term success.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Users className="h-10 w-10 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Expert Support</h3>
                  <p className="text-gray-600">
                    Our team of recruitment professionals is dedicated to providing personalized guidance and support throughout your job search or hiring process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
