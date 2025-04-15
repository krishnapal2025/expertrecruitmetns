import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutUsPage() {
  return (
    <>
      <Helmet>
        <title>About Us | RH Job Portal</title>
        <meta name="description" content="Learn about our mission and vision to connect the best talent with the top employers worldwide." />
      </Helmet>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl">
            We connect talent with opportunity and help businesses thrive with the right people.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 mb-6">
              To be the leading platform where talent and opportunity meet, creating meaningful careers and successful businesses around the world.
            </p>
            <p className="text-lg text-gray-700">
              We believe in the transformative power of the right job match - not just for individuals, but for organizations. When people are in positions that leverage their strengths and align with their values, both the individual and the organization thrive.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
              alt="Team of business professionals"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16 md:flex-row-reverse">
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              To empower careers and strengthen businesses by creating connections that matter.
            </p>
            <p className="text-lg text-gray-700">
              Every day, we work to understand the unique needs of both job seekers and employers, ensuring we foster meaningful connections that lead to mutual success. We're committed to providing personalized service, innovative technology, and deep industry expertise.
            </p>
          </div>
          <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" 
              alt="Professional recruiters in meeting"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We operate with transparency and honesty in all our dealings with clients, candidates, and colleagues.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, continually raising the bar for ourselves and our services.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Human Connection</h3>
                <p className="text-gray-600">
                  We believe in the power of human connections and relationships in the recruitment process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
          <p className="text-lg text-gray-700 text-center mb-10 max-w-3xl mx-auto">
            Our team of experienced professionals is dedicated to understanding your unique needs and finding the perfect match, whether you're seeking talent or opportunity.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496130141-209d200cebd8" 
                  alt="Team member"
                  className="w-full h-auto"
                />
              </div>
              <h3 className="font-bold">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">CEO & Founder</p>
            </div>
            
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e" 
                  alt="Team member"
                  className="w-full h-auto"
                />
              </div>
              <h3 className="font-bold">David Chen</h3>
              <p className="text-gray-600 text-sm">Chief Technology Officer</p>
            </div>
            
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496130407-57329f01f769" 
                  alt="Team member"
                  className="w-full h-auto"
                />
              </div>
              <h3 className="font-bold">Emma Rodriguez</h3>
              <p className="text-gray-600 text-sm">Head of Recruitment</p>
            </div>
            
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2" 
                  alt="Team member"
                  className="w-full h-auto"
                />
              </div>
              <h3 className="font-bold">Michael Taylor</h3>
              <p className="text-gray-600 text-sm">Client Relations Manager</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Whether you're looking for your next career move or seeking the perfect addition to your team, we're here to help you succeed.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/auth?type=jobseeker" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Register as Job Seeker
            </a>
            <a href="/auth?type=employer" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
              Register as Employer
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
