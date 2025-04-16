import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutUsPage from "@/pages/about-us";
import ServicesPage from "@/pages/services";
import JobBoardPage from "@/pages/job-board";
import SectorsPage from "@/pages/sectors";
import ContactUsPage from "@/pages/contact-us";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import BlogsPage from "@/pages/blogs";
import CareersPage from "@/pages/careers";
import AuthPage from "@/pages/auth-page";
import JobDetailsPage from "@/pages/job-details";
import HireTalentPage from "@/pages/hire-talent";
import SEOInsightsPage from "@/pages/seo-insights";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { ArrowUp } from "lucide-react";

// Track page views
function PageViewTracker() {
  const [location] = useLocation();
  
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/job-board" component={JobBoardPage} />
      <Route path="/job/:id">
        {params => <JobDetailsPage id={params.id} />}
      </Route>
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/contact-us" component={ContactUsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/blogs" component={BlogsPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/hire-talent" component={HireTalentPage} />
      <Route path="/seo-insights" component={SEOInsightsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics on app load
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Back to top button state
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <PageViewTracker />
            <Router />
          </main>
          <Footer />
          
          {/* Back to top button */}
          {showBackToTop && (
            <button 
              onClick={scrollToTop}
              aria-label="Back to top"
              className="fixed bottom-6 left-6 p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all duration-300 animate-fade-in z-50"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
