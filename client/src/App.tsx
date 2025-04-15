import { Switch, Route } from "wouter";
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
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
