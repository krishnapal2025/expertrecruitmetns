import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
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
import { Menu, User, LogOut, ChevronDown, Briefcase } from "lucide-react";
import expertLogo from "../../assets/er-logo-icon.png";
import NotificationsPopover from "@/components/common/notifications";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { currentUser, logoutMutation } = useAuth();
  
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
      { name: "Find Jobs", href: "/job-board" },
      { name: "Hire Talent", href: "/hire-talent" },
      { 
        name: "Solutions", 
        href: "#",
        isDropdown: true,
        dropdownItems: [
          { name: "Services", href: "/services" },
          { name: "Sectors", href: "/sectors" },
          { name: "Blogs", href: "/blogs" },
          { name: "Insights", href: "/seo-insights" },
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
              <div className="flex items-center cursor-pointer">
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
                        <Link key={item.name} href={item.href}>
                          <div className={`block px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-[#5372f1]/10 hover:text-[#5372f1] transition-colors duration-200 ${location === item.href ? "text-[#5372f1] bg-[#5372f1]/10 font-medium border-l-2 border-[#5372f1]" : ""}`}>
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.name} href={link.href}>
                  <div className={`text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-4 py-2 rounded-md cursor-pointer ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}>
                    {link.name}
                  </div>
                </Link>
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
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    {currentUser.user.userType === "jobseeker" && (
                      <Link href="/applied-jobs">
                        <DropdownMenuItem>
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Applied Jobs</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {currentUser.user.userType === "employer" && (
                      <>
                        <Link href="/my-jobs">
                          <DropdownMenuItem>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Post Manager</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/applications-manager">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Applications Manager</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/post-job">
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
                        </Link>
                      </>
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
                <Link href="/auth">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="text-lg text-white bg-[#4060e0] hover:bg-[#3050d0] px-6 font-bold shadow-md focus:ring-0 focus:ring-offset-0 focus:outline-none"
                  >
                    Sign In
                  </Button>
                </Link>
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
                    <Link href="/employer-register" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <Briefcase className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Employer</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/job-seeker-register" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <User className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Job Seeker</span>
                      </DropdownMenuItem>
                    </Link>
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
                  <SheetDescription>
                    EXPERT Recruitments LLC
                  </SheetDescription>
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
                            <SheetClose asChild key={item.name}>
                              <Link href={item.href}>
                                <div className={`px-4 py-2 rounded-md cursor-pointer ${location === item.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}>
                                  {item.name}
                                </div>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <SheetClose asChild key={link.name}>
                        <Link href={link.href}>
                          <div className={`px-4 py-2 rounded-md cursor-pointer ${location === link.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}>
                            {link.name}
                          </div>
                        </Link>
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
                          <Link href="/profile">
                            <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </div>
                          </Link>
                        </SheetClose>
                        
                        {currentUser.user.userType === "jobseeker" && (
                          <SheetClose asChild>
                            <Link href="/applied-jobs">
                              <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Applied Jobs
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                        
                        {currentUser.user.userType === "employer" && (
                          <>
                            <SheetClose asChild>
                              <Link href="/post-job">
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
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/my-jobs">
                                <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Post Manager
                                </div>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/applications-manager">
                                <div className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer">
                                  <User className="mr-2 h-4 w-4" />
                                  Applications Manager
                                </div>
                              </Link>
                            </SheetClose>
                          </>
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
                          <Link href="/auth">
                            <Button 
                              variant="default" 
                              className="w-full mb-2 text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] font-bold text-white focus:ring-0 focus:ring-offset-0 focus:outline-none"
                            >
                              Sign In
                            </Button>
                          </Link>
                        </SheetClose>
                        <div className="mb-2">
                          <div className="font-medium text-sm mb-2">Sign Up as:</div>
                          <div className="space-y-2">
                            <SheetClose asChild>
                              <Link href="/employer-register">
                                <Button 
                                  variant="default" 
                                  className="w-full flex items-center text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                >
                                  <Briefcase className="mr-2 h-5 w-5" />
                                  Employer
                                </Button>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/job-seeker-register">
                                <Button 
                                  variant="default" 
                                  className="w-full flex items-center text-lg py-6 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                >
                                  <User className="mr-2 h-5 w-5" />
                                  Job Seeker
                                </Button>
                              </Link>
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