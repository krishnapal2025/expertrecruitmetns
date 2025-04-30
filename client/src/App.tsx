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
import TermsConditionsPage from "@/pages/terms-conditions";
import SiteMapPage from "@/pages/site-map";
import BlogsPage from "@/pages/blogs";
import ArticlePage from "@/pages/article-page";
import CareersPage from "@/pages/careers";
import AuthPage from "@/pages/auth-page";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import JobSeekerRegisterPage from "@/pages/job-seeker-register";
import EmployerRegisterPage from "@/pages/employer-register";
import JobDetailsPage from "@/pages/job-details";
import JobApplicationPage from "@/pages/job-application";
import HireTalentPage from "@/pages/hire-talent";

import AdminPage from "@/pages/admin-page";
import AdminRegisterPage from "@/pages/admin-register";
import AdminLoginPage from "@/pages/admin-login";
import AdminForgotPasswordPage from "@/pages/admin-forgot-password";
import AdminResetPasswordPage from "@/pages/admin-reset-password";
import ProfilePage from "@/pages/profile-page";
import PostJobPage from "@/pages/post-job";
import PostManagerPage from "@/pages/post-manager";
import EditJobPage from "@/pages/edit-job";
import CreateResumePage from "@/pages/resources/create-resume";
import InterviewPrepPage from "@/pages/resources/interview-prep";
import CareerAdvicePage from "@/pages/resources/career-advice";
import SalaryNegotiationPage from "@/pages/resources/salary-negotiation";
import ApplicationsManagerPage from "@/pages/applications-manager";
import VacancyFormPage from "@/pages/vacancy-form";
import InquiryFormPage from "@/pages/inquiry-form";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { ArrowUp } from "lucide-react";
import { useScrollTop, useScrollToTop } from "@/hooks/use-scroll-top";

// Track page views and scroll to top on route changes
function PageViewTracker() {
  const [location] = useLocation();
  
  // Track page views for analytics
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  
  // Scroll to top on route changes
  useScrollTop();
  
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
      <Route path="/apply/:id">
        {params => <ProtectedRoute path={`/apply/${params.id}`} component={JobApplicationPage} />}
      </Route>
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/contact-us" component={ContactUsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-conditions" component={TermsConditionsPage} />
      <Route path="/site-map" component={SiteMapPage} />
      <Route path="/blogs" component={BlogsPage} />
      <Route path="/article/:id">
        {params => <ArticlePage />}
      </Route>
      <Route path="/careers" component={CareersPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/reset-password" component={ResetPasswordPage} />
      <Route path="/job-seeker-register" component={JobSeekerRegisterPage} />
      <Route path="/employer-register" component={EmployerRegisterPage} />
      <Route path="/hire-talent" component={HireTalentPage} />
      <Route path="/vacancy-form" component={VacancyFormPage} />
      <Route path="/inquiry-form" component={InquiryFormPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin-register" component={AdminRegisterPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/admin/forgot-password" component={AdminForgotPasswordPage} />
      <Route path="/admin/reset-password" component={AdminResetPasswordPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/post-job" component={PostJobPage} />
      <ProtectedRoute path="/my-jobs" component={PostManagerPage} />
      <Route path="/resources/create-resume" component={CreateResumePage} />
      <Route path="/resources/interview-prep" component={InterviewPrepPage} />
      <Route path="/resources/career-advice" component={CareerAdvicePage} />
      <Route path="/resources/salary-negotiation" component={SalaryNegotiationPage} />
      <ProtectedRoute path="/applications-manager" component={ApplicationsManagerPage} />
      <Route path="/edit-job/:id">
        {params => <ProtectedRoute path={`/edit-job/${params.id}`} component={() => <EditJobPage />} />}
      </Route>
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

  // Use our custom hook for scrolling to top
  const scrollToTop = useScrollToTop();

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
              className="fixed bottom-24 right-6 p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all duration-300 animate-fade-in z-50"
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
