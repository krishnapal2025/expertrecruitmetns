import { Helmet } from "react-helmet";
import Banner from "@/components/home/banner";
import Welcome from "@/components/home/welcome";
import HiringTrends from "@/components/home/hiring-trends";
import FeaturedCategories from "@/components/home/featured-categories";
import AnimatedTestimonials from "@/components/home/animated-testimonials";
import SearchBar from "@/components/home/search-bar";
import Animated3DCards from "@/components/home/animated-3d-cards";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, BuildingIcon, GraduationCapIcon } from "@/assets/icons";
import { MessageSquareShare, ArrowRight } from "lucide-react";
import RealtimeJobs from "@/components/job/real-time-jobs";
import RealtimeApplications from "@/components/job/real-time-applications";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { currentUser } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>RH Job Portal | Find Your Next Career Opportunity</title>
        <meta name="description" content="Connect with the best job opportunities and top talent through our professional job portal. For job seekers and employers." />
      </Helmet>

      <Banner />
      
      <SearchBar />
      
      <Welcome />
      
      {/* Real-time updates section */}
      {currentUser && (
        <div className="container mx-auto px-4 py-4">
          {currentUser.user.userType === "jobseeker" && <RealtimeJobs />}
          {currentUser.user.userType === "employer" && <RealtimeApplications />}
        </div>
      )}
      
      <HiringTrends />
      {/* Replace static cards with animated 3D interactive cards */}
      <Animated3DCards />
      
      <FeaturedCategories />
      
      <AnimatedTestimonials />
      
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking for your dream job or seeking top talent, we're here to help
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth?type=jobseeker">
              <Button variant="secondary" size="lg">Sign Up as Job Seeker</Button>
            </Link>
            <Link href="/auth?type=employer">
              <Button variant="secondary" size="lg">Sign Up as Employer</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contact us on WhatsApp"
      >
        <MessageSquareShare size={24} />
      </a>
    </>
  );
}
