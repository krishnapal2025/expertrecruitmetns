import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import { ScrollLink } from "@/components/ui/scroll-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User, LogOut, ChevronDown, Briefcase, ShieldCheck } from "lucide-react";
import expertLogo from "../../assets/er-logo-icon.png";
import NotificationsPopover from "@/components/common/notifications";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { currentUser, logoutMutation } = useAuth();
  const scrollToTop = useScrollToTop();
  
  // Detect scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return "U";
    
    if (currentUser.user.userType === "jobseeker" && 'firstName' in currentUser.profile) {
      return `${currentUser.profile.firstName.charAt(0)}${currentUser.profile.lastName.charAt(0)}`;
    } else if (currentUser.user.userType === "employer" && 'companyName' in currentUser.profile) {
      return currentUser.profile.companyName.charAt(0);
    }
    
    return currentUser.user.email.charAt(0).toUpperCase();
  };

  // Define navigation links based on user type
  const getNavigationLinks = () => {
    // Default navigation for all users
    const defaultLinks = [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about-us" },
      { name: "Hire Talent", href: "/hire-talent" },
      { name: "Find Jobs", href: "/job-board" },
      
      { 
        name: "Solutions", 
        href: "#",
        isDropdown: true,
        dropdownItems: [
          { name: "Services", href: "/services" },
          { name: "Sectors", href: "/sectors" },
          { name: "Blogs", href: "/blogs" },
          { name: "Insights", href: "/seo-insights" },
          ...(currentUser && currentUser.user.userType === "admin" ? [{ name: "Admin", href: "/admin" }] : [{ name: "Admin", href: "/admin-login" }]),
          { name: "Contact Us", href: "/contact-us" },
        ]
      },
    ];
    
    // If no user, return default links
    if (!currentUser) {
      return defaultLinks;
    }
    
    // Job seeker specific links - show Home, About Us, Find Jobs, Applied Jobs, Job Services, Blogs, and Contact Us
    if (currentUser.user.userType === "jobseeker") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Find Jobs", href: "/job-board" },
        { name: "Applied Jobs", href: "/applied-jobs" },
        { name: "Job Services", href: "/job-services" },
        { name: "Blogs", href: "/blogs" },
        { name: "Contact Us", href: "/contact-us" },
      ];
    }
    
    // Employer specific links - show Home, About Us, Hire Talent, Blogs, Contact Us, but NOT Find Jobs
    if (currentUser.user.userType === "employer") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Hire Talent", href: "/hire-talent" },
        { name: "Post Manager", href: "/my-jobs" },
        { name: "Applications Manager", href: "/applications-manager" },
        { name: "Blogs", href: "/blogs" },
        { name: "Contact Us", href: "/contact-us" },
      ];
    }
    
    // Admin specific links
    if (currentUser.user.userType === "admin") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { 
          name: "Solutions", 
          href: "#",
          isDropdown: true,
          dropdownItems: [
            { name: "Services", href: "/services" },
            { name: "Sectors", href: "/sectors" },
            { name: "Blogs", href: "/blogs" },
            { name: "Insights", href: "/seo-insights" },
            { name: "Admin", href: "/admin" },
            { name: "Contact Us", href: "/contact-us" },
          ]
        },
      ];
    }
    
    // Default fallback
    return defaultLinks;
  };
  
  // Get the appropriate navigation links
  const navigationLinks = getNavigationLinks();

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${scrolled ? "bg-[#5372f1] shadow-md" : "bg-[#5372f1] bg-opacity-95"}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-[100px] md:h-[120px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
                <div className="flex items-center justify-center h-[50px] md:h-[70px] w-[50px] md:w-[70px] rounded-full bg-white p-2 border-2 border-white shadow-md">
                  <img 
                    src={expertLogo} 
                    alt="Expert Recruitments LLC" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-white font-bold text-xl md:text-2xl uppercase" style={{ letterSpacing: '0.15em', width: '91%', display: 'inline-block' }}>Expert</span>
                  <span className="text-white text-xs md:text-sm -mt-1">Recruitments LLC</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navigationLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group">
                  <div className={`text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-4 py-2 rounded-md cursor-pointer flex items-center ${
                    link.dropdownItems?.some(item => location === item.href) ? "text-white font-bold" : "text-gray-100"
                  }`}>
                    {link.name}
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" />
                  </div>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-[#5372f1]/20 dark:border-gray-700">
                      {link.dropdownItems?.map((item) => (
                        <ScrollLink key={item.name} href={item.href} className={`block px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-[#5372f1]/10 hover:text-[#5372f1] transition-colors duration-200 ${location === item.href ? "text-[#5372f1] bg-[#5372f1]/10 font-medium border-l-2 border-[#5372f1]" : ""}`}>
                          {item.name}
                        </ScrollLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <ScrollLink key={link.name} href={link.href} className={`text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-4 py-2 rounded-md cursor-pointer ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}>
                  {link.name}
                </ScrollLink>
              )
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <NotificationsPopover />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#4060e0]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollLink href="/profile" className="w-full">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </ScrollLink>
                    {currentUser.user.userType === "jobseeker" && (
                      <ScrollLink href="/applied-jobs" className="w-full">
                        <DropdownMenuItem>
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Applied Jobs</span>
                        </DropdownMenuItem>
                      </ScrollLink>
                    )}
                    {currentUser.user.userType === "employer" && (
                      <>
                        <ScrollLink href="/my-jobs" className="w-full">
                          <DropdownMenuItem>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Post Manager</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                        <ScrollLink href="/applications-manager" className="w-full">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Applications Manager</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                        <ScrollLink href="/post-job" className="w-full">
                          <DropdownMenuItem>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span>Post New Job</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                      </>
                    )}
                    {currentUser.user.userType === "admin" && (
                      <ScrollLink href="/admin" className="w-full">
                        <DropdownMenuItem>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      </ScrollLink>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ScrollLink href="/auth" className="w-full">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="text-lg text-white bg-[#4060e0] hover:bg-[#3050d0] px-6 font-bold shadow-md focus:ring-0 focus:ring-offset-0 focus:outline-none"
                  >
                    Sign In
                  </Button>
                </ScrollLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="text-lg flex items-center justify-center bg-[#4060e0] hover:bg-[#3050d0] text-white px-6 font-bold shadow-md focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    >
                      Sign Up
                      <ChevronDown className="ml-1 h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 border-2 border-[#5372f1] bg-white shadow-lg rounded-md">
                    <DropdownMenuLabel className="text-lg font-bold text-center text-[#5372f1]">Register as:</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <ScrollLink href="/employer-register" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <Briefcase className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Employer</span>
                      </DropdownMenuItem>
                    </ScrollLink>
                    <ScrollLink href="/job-seeker-register" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <User className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Job Seeker</span>
                      </DropdownMenuItem>
                    </ScrollLink>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-[#4060e0]">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="mb-4">
                  <div className="flex flex-col items-center mb-3 space-y-2">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white p-2 border-2 border-[#5372f1] shadow-md">
                      <img 
                        src={expertLogo} 
                        alt="Expert Recruitments LLC" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[#5372f1] font-bold text-xl md:text-2xl uppercase" style={{ letterSpacing: '0.15em', width: '91%', display: 'inline-block' }}>Expert</span>
                      <span className="text-[#5372f1] text-xs -mt-1">Recruitments LLC</span>
                    </div>
                  </div>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 py-4">
                  {navigationLinks.map((link) => 
                    link.isDropdown ? (
                      <div key={link.name} className="flex flex-col">
                        <div className="px-4 py-3 font-medium text-gray-800 text-base">
                          {link.name}
                        </div>
                        <div className="ml-4 flex flex-col space-y-2 mt-2">
                          {link.dropdownItems?.map((item) => (
                            <div key={item.name} 
                              className={`px-4 py-2 rounded-md cursor-pointer ${location === item.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                                setTimeout(() => window.location.href = item.href, 100);
                              }}
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <SheetClose asChild key={link.name}>
                        <ScrollLink href={link.href} className={`px-4 py-2 rounded-md cursor-pointer block ${location === link.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}>
                          {link.name}
                        </ScrollLink>
                      </SheetClose>
                    )
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 mb-2">
                          <div className="font-medium">
                            {currentUser.user.userType === "jobseeker" && 'firstName' in currentUser.profile
                              ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
                              : currentUser.user.userType === "employer" && 'companyName' in currentUser.profile
                              ? currentUser.profile.companyName
                              : currentUser.user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {currentUser.user.email}
                          </div>
                        </div>
                        <SheetClose asChild>
                          <ScrollLink href="/profile" className="block">
                            <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </div>
                          </ScrollLink>
                        </SheetClose>
                        
                        {currentUser.user.userType === "jobseeker" && (
                          <SheetClose asChild>
                            <ScrollLink href="/applied-jobs" className="block">
                              <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Applied Jobs
                              </div>
                            </ScrollLink>
                          </SheetClose>
                        )}
                        
                        {currentUser.user.userType === "employer" && (
                          <>
                            <SheetClose asChild>
                              <ScrollLink href="/post-job" className="block">
                                <div className="px-4 py-2 rounded-md hover:bg-primary/10 text-primary bg-primary/5 font-medium flex items-center cursor-pointer">
                                  <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  Post New Job
                                </div>
                              </ScrollLink>
                            </SheetClose>
                            <SheetClose asChild>
                              <ScrollLink href="/my-jobs" className="block">
                                <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Post Manager
                                </div>
                              </ScrollLink>
                            </SheetClose>
                            <SheetClose asChild>
                              <ScrollLink href="/applications-manager" className="block">
                                <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                  <User className="mr-2 h-4 w-4" />
                                  Applications Manager
                                </div>
                              </ScrollLink>
                            </SheetClose>
                          </>
                        )}
                        
                        {currentUser.user.userType === "admin" && (
                          <SheetClose asChild>
                            <ScrollLink href="/admin" className="block">
                              <div className="px-4 py-2 rounded-md hover:bg-primary/10 text-primary bg-primary/5 font-medium flex items-center cursor-pointer">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Admin Dashboard
                              </div>
                            </ScrollLink>
                          </SheetClose>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <ScrollLink href="/auth" className="block">
                            <Button 
                              variant="default" 
                              className="w-full mb-2 text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] font-bold text-white focus:ring-0 focus:ring-offset-0 focus:outline-none"
                            >
                              Sign In
                            </Button>
                          </ScrollLink>
                        </SheetClose>
                        <div className="mb-2">
                          <div className="font-medium text-sm mb-2">Sign Up as:</div>
                          <div className="space-y-2">
                            <SheetClose asChild>
                              <ScrollLink href="/employer-register" className="block">
                                <Button 
                                  variant="default" 
                                  className="w-full flex items-center text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                >
                                  <Briefcase className="mr-2 h-5 w-5" />
                                  Employer
                                </Button>
                              </ScrollLink>
                            </SheetClose>
                            <SheetClose asChild>
                              <ScrollLink href="/job-seeker-register" className="block">
                                <Button 
                                  variant="default" 
                                  className="w-full flex items-center text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                >
                                  <User className="mr-2 h-5 w-5" />
                                  Job Seeker
                                </Button>
                              </ScrollLink>
                            </SheetClose>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}