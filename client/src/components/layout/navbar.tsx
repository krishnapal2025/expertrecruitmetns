import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import { ScrollLink } from "@/components/ui/scroll-link";
import { RoleScrollLink } from "@/components/ui/role-scroll-link";
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
import { Menu, User, LogOut, ChevronDown, Briefcase, ShieldCheck, Building2, FileText } from "lucide-react";
import expertLogo from "../../assets/er-logo-icon.png";
import NotificationsPopover from "@/components/common/notifications";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [location] = useLocation();
  const { currentUser, logoutMutation } = useAuth();
  const scrollToTop = useScrollToTop();
  
  // Toggle dropdown in mobile view
  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
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
    
    if (currentUser?.user?.userType === "jobseeker" && currentUser?.profile && 'firstName' in currentUser.profile) {
      return `${currentUser.profile.firstName.charAt(0)}${currentUser.profile.lastName.charAt(0)}`;
    } else if (currentUser?.user?.userType === "employer" && currentUser?.profile && 'companyName' in currentUser.profile) {
      return currentUser.profile.companyName.charAt(0);
    }
    
    return currentUser?.user?.email.charAt(0).toUpperCase() || "U";
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
          { name: "Contact Us", href: "/contact-us" },
        ]
      },
    ];
    
    // If no user or user data is not available yet, return default links
    if (!currentUser || !currentUser?.user) {
      return defaultLinks;
    }
    
    // Job seeker specific links - show Home, About Us, Find Jobs, Resources, and Contact Us
    if (currentUser?.user?.userType === "jobseeker") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Find Jobs", href: "/job-board" },
        { 
          name: "Resources", 
          href: "#",
          isDropdown: true,
          dropdownItems: [
            { name: "Create Resume", href: "/resources/create-resume" },
            { name: "Interview Prep", href: "/resources/interview-prep" },
            { name: "Career Advice", href: "/resources/career-advice" },
            { name: "Salary Negotiation", href: "/resources/salary-negotiation" },
          ]
        },
        { name: "Contact Us", href: "/contact-us" },
      ];
    }
    
    // Employer specific links - show Home, About Us, Hire Talent, Blogs, Contact Us, but NOT Find Jobs
    if (currentUser?.user?.userType === "employer") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Hire Talent", href: "/hire-talent" },
        { name: "Vacancy Form", href: "/vacancy-form" },
        { name: "Blogs", href: "/blogs" },
        { name: "Contact Us", href: "/contact-us" },
      ];
    }
    
    // Admin specific links
    if (currentUser?.user?.userType === "admin" || currentUser?.user?.userType === "super_admin") {
      return [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Post Manager", href: "/post-manager" },
        { name: "Blog Manager", href: "/blog-manager" },
        { 
          name: "Solutions", 
          href: "#",
          isDropdown: true,
          dropdownItems: [
            { name: "Services", href: "/services" },
            { name: "Sectors", href: "/sectors" },
            { name: "Blogs", href: "/blogs" },
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
    <header className={`sticky top-0 z-40 transition-colors duration-200 w-full ${scrolled ? "bg-[#5372f1] shadow-md" : "bg-[#5372f1] bg-opacity-95"}`}>
      <div className="container mx-auto px-2 sm:px-4 max-w-full xl:max-w-7xl">
        <div className="flex h-[80px] sm:h-[90px] md:h-[100px] lg:h-[110px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
                <div className="flex items-center justify-center h-[40px] sm:h-[45px] md:h-[55px] lg:h-[65px] w-[40px] sm:w-[45px] md:w-[55px] lg:w-[65px] rounded-full bg-white p-2 border-2 border-white shadow-md">
                  <img 
                    src={expertLogo} 
                    alt="Expert Recruitments LLC" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="ml-2 sm:ml-3 flex flex-col">
                  <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl uppercase" style={{ letterSpacing: '0.12em', display: 'inline-block' }}>Expert</span>
                  <span className="text-white text-[10px] sm:text-xs md:text-sm -mt-1">Recruitments LLC</span>
                  <a 
                    href="https://jobpost.me" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center ml-1 -mt-1"
                  >
                    <img 
                      src="https://res.cloudinary.com/deeiccvqd/image/upload/v1770804947/awsyzhmfmdsr02r39iul.png" 
                      alt="jobpost.me logo" 
                      className="h-6 sm:h-8 md:h-8 w-auto object-contain cursor-pointer"
                    />
                  </a>

                </div>
              </div>
            </Link>
            
          </div>
          


          {/* Desktop navigation */}
          <nav className="hidden md:flex md:space-x-1 lg:space-x-3 xl:space-x-5 items-center">
            {navigationLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group">
                  <div className={`text-sm lg:text-base xl:text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-2 lg:px-3 xl:px-4 py-2 rounded-md cursor-pointer flex items-center ${
                    link.dropdownItems?.some(item => location === item.href) ? "text-white font-bold" : "text-gray-100"
                  }`}>
                    {link.name}
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 ml-1 transition-transform group-hover:rotate-180" />
                  </div>
                  <div className="absolute left-0 mt-2 w-48 lg:w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-[#5372f1]/20 dark:border-gray-700">
                      {link.dropdownItems?.map((item) => (
                        <ScrollLink key={item.name} href={item.href} className={`block px-3 lg:px-5 py-2 lg:py-3 text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-[#5372f1]/10 hover:text-[#5372f1] transition-colors duration-200 ${location === item.href ? "text-[#5372f1] bg-[#5372f1]/10 font-medium border-l-2 border-[#5372f1]" : ""}`}>
                          {item.name}
                        </ScrollLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : link.name === "Hire Talent" ? (
                <RoleScrollLink 
                  key={link.name}
                  href={link.href}
                  requiredUserType="employer"
                  redirectPath="/employer-register"
                  className={`text-sm lg:text-base xl:text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-2 lg:px-3 xl:px-4 py-2 rounded-md cursor-pointer whitespace-nowrap ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}
                >
                  {link.name}
                </RoleScrollLink>
              ) : link.name === "Find Jobs" ? (
                <RoleScrollLink 
                  key={link.name}
                  href={link.href}
                  requiredUserType="jobseeker"
                  redirectPath="/job-seeker-register"
                  className={`text-sm lg:text-base xl:text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-2 lg:px-3 xl:px-4 py-2 rounded-md cursor-pointer whitespace-nowrap ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}
                >
                  {link.name}
                </RoleScrollLink>
              ) : link.name === "Vacancy Form" ? (
                <RoleScrollLink 
                  key={link.name}
                  href={link.href}
                  requiredUserType="employer"
                  redirectPath="/employer-register"
                  className={`text-sm lg:text-base xl:text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-2 lg:px-3 xl:px-4 py-2 rounded-md cursor-pointer whitespace-nowrap ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}
                >
                  {link.name}
                </RoleScrollLink>
              ) : (
                <ScrollLink key={link.name} href={link.href} className={`text-sm lg:text-base xl:text-lg font-medium transition-colors hover:text-white hover:bg-[#4060e0] px-2 lg:px-3 xl:px-4 py-2 rounded-md cursor-pointer whitespace-nowrap ${location === link.href ? "text-white font-bold bg-[#4060e0]" : "text-gray-100"}`}>
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
                    {currentUser?.user?.userType === "jobseeker" && (
                      <ScrollLink href="/resources/create-resume" className="w-full">
                        <DropdownMenuItem>
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Create Resume</span>
                        </DropdownMenuItem>
                      </ScrollLink>
                    )}
                    {/* Employer-specific menu items removed */}
                    {(currentUser?.user?.userType === "admin" || currentUser?.user?.userType === "super_admin") && (
                      <>
                        <ScrollLink href="/admin" className="w-full">
                          <DropdownMenuItem>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                        <ScrollLink href="/post-manager" className="w-full">
                          <DropdownMenuItem>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Post Manager</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                        <ScrollLink href="/blog-manager" className="w-full">
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Blog Manager</span>
                          </DropdownMenuItem>
                        </ScrollLink>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
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
                    <RoleScrollLink href="/employer-register" requiredUserType="employer" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <Briefcase className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Employer</span>
                      </DropdownMenuItem>
                    </RoleScrollLink>
                    <RoleScrollLink href="/job-seeker-register" requiredUserType="jobseeker" className="w-full">
                      <DropdownMenuItem className="flex items-center py-3 px-4 rounded-md hover:bg-[#5372f1] hover:text-white cursor-pointer">
                        <User className="mr-2 h-5 w-5" />
                        <span className="text-base font-medium">Job Seeker</span>
                      </DropdownMenuItem>
                    </RoleScrollLink>
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
              <SheetContent side="right" className="w-[85vw] max-w-[400px] overflow-y-auto">
                <SheetHeader className="mb-2">
                  <div className="flex flex-col items-center mb-2 space-y-1">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white p-2 border-2 border-[#5372f1] shadow-md">
                      <img 
                        src={expertLogo} 
                        alt="Expert Recruitments LLC" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[#5372f1] font-bold text-lg uppercase" style={{ letterSpacing: '0.12em', display: 'inline-block' }}>Expert</span>
                      <span className="text-gray-600 text-xs -mt-1">Recruitments LLC</span>
                    </div>
                  </div>
                  <SheetTitle className="text-center text-lg font-bold">{currentUser ? 'Menu' : 'Welcome'}</SheetTitle>
                  <SheetDescription className="text-center text-xs">
                    {currentUser ? 'Access all your options here' : 'Please sign in or register'}
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-2 py-2 px-1">
                  {navigationLinks.map((link) => 
                    link.isDropdown ? (
                      <div key={link.name} className="flex flex-col mb-1">
                        <div 
                          className="px-3 py-2 font-medium text-gray-800 text-sm hover:bg-gray-100 rounded-md flex items-center justify-between cursor-pointer"
                          onClick={() => toggleDropdown(link.name)}
                        >
                          {link.name}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdowns[link.name] ? 'rotate-180' : ''}`} />
                        </div>
                        {openDropdowns[link.name] && (
                          <div className="ml-3 flex flex-col space-y-1 mt-1">
                            {link.dropdownItems?.map((item) => (
                              <div key={item.name} 
                                className={`px-3 py-2 text-sm rounded-md cursor-pointer ${location === item.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
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
                        )}
                      </div>
                    ) : (
                      <div key={link.name}
                        className={`px-3 py-2 text-sm rounded-md cursor-pointer block ${location === link.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
                        onClick={(e) => {
                          // Special handling for role-specific links
                          if (link.name === "Hire Talent" || link.name === "Vacancy Form") {
                            e.preventDefault();
                            setIsMobileMenuOpen(false);
                            
                            // Use the role redirect logic for employer features
                            if (!currentUser) {
                              // Not logged in - go to employer registration
                              setTimeout(() => window.location.href = "/employer-register", 100);
                            } else if (currentUser?.user?.userType === "employer" || currentUser?.user?.userType === "admin" || currentUser?.user?.userType === "super_admin") {
                              // Employer or admin - go to the requested page
                              setTimeout(() => window.location.href = link.href, 100);
                            } else if (currentUser?.user?.userType === "jobseeker") {
                              // Job seeker - show message and go to employer registration
                              setTimeout(() => {
                                window.location.href = "/employer-register";
                              }, 100);
                            }
                          }
                          else if (link.name === "Find Jobs") {
                            e.preventDefault();
                            setIsMobileMenuOpen(false);
                            
                            // Use the role redirect logic for job seeker features
                            if (!currentUser) {
                              // Not logged in - go to job seeker registration
                              setTimeout(() => window.location.href = "/job-seeker-register", 100);
                            } else if (currentUser?.user?.userType === "jobseeker" || currentUser?.user?.userType === "admin" || currentUser?.user?.userType === "super_admin") {
                              // Job seeker or admin - go to the requested page
                              setTimeout(() => window.location.href = link.href, 100);
                            } else if (currentUser?.user?.userType === "employer") {
                              // Employer - show message and go to job seeker registration
                              setTimeout(() => {
                                window.location.href = "/job-seeker-register";
                              }, 100);
                            }
                          }
                          else {
                            // Standard navigation for other links
                            setIsMobileMenuOpen(false);
                            window.scrollTo(0, 0);
                            setTimeout(() => window.location.href = link.href, 100);
                          }
                        }}
                      >
                        {link.name}
                      </div>
                    )
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 mb-2">
                          <div className="font-medium">
                            {currentUser?.user?.userType === "jobseeker" && currentUser?.profile && 'firstName' in currentUser.profile
                              ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
                              : currentUser?.user?.userType === "employer" && currentUser?.profile && 'companyName' in currentUser.profile
                              ? currentUser.profile.companyName
                              : currentUser?.user ? currentUser.user.email : 'User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {currentUser?.user ? currentUser.user.email : ''}
                          </div>
                        </div>
                        
                        {/* Minimalistic logout button for all account types */}
                        <div className="px-4 py-2 mb-3">
                          <div className="border-t border-gray-100 my-1 pt-1"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full py-2 rounded-md flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </button>
                        </div>
                        
                        <div 
                          className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            window.scrollTo(0, 0);
                            setTimeout(() => window.location.href = "/profile", 100);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </div>
                        
                        {/* Job seeker mobile menu items removed as requested */}
                        
                        {/* Employer-specific menu items removed as requested */}
                        
                        {(currentUser?.user?.userType === "admin" || currentUser?.user?.userType === "super_admin") && (
                          <>
                            <div 
                              className="px-4 py-2 rounded-md hover:bg-primary/10 text-primary bg-primary/5 font-medium flex items-center cursor-pointer"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                                setTimeout(() => window.location.href = "/admin", 100);
                              }}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </div>
                            <div 
                              className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                                setTimeout(() => window.location.href = "/post-manager", 100);
                              }}
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              Post Manager
                            </div>

                            <div 
                              className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                                setTimeout(() => window.location.href = "/blog-manager", 100);
                              }}
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              Blog Manager
                            </div>
                            <div 
                              className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                                setTimeout(() => window.location.href = "/vacancy-form", 100);
                              }}
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              Vacancy Form
                            </div>
                          </>
                        )}
                        
                        {/* Original logout button removed - now higher in the mobile menu */}
                      </>
                    ) : (
                      <>
                        <div className="px-2 py-2 mb-2">
                          <Button 
                            variant="default" 
                            className="w-full mb-3 text-sm sm:text-base py-4 bg-[#4060e0] hover:bg-[#3050d0] font-bold text-white focus:ring-0 focus:ring-offset-0 focus:outline-none"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                              setTimeout(() => window.location.href = "/auth", 100);
                            }}
                          >
                            Sign In
                          </Button>
                        
                          <div className="mt-4 mb-2">
                            <div className="font-medium text-sm mb-2 text-center">Sign Up as:</div>
                            <div className="space-y-2">
                              <Button 
                                variant="default" 
                                className="w-full flex items-center justify-center text-sm sm:text-base py-4 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsMobileMenuOpen(false);
                                  // Use the role redirect logic
                                  if (!currentUser) {
                                    // Not logged in - go to employer registration
                                    setTimeout(() => window.location.href = "/employer-register", 100);
                                  } else if (currentUser?.user?.userType === "employer") {
                                    // Already an employer - stay on current page
                                    window.scrollTo(0, 0);
                                  } else if (currentUser?.user?.userType === "jobseeker") {
                                    // Job seeker - go to employer registration
                                    setTimeout(() => window.location.href = "/employer-register", 100);
                                  }
                                }}
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Employer
                              </Button>
                              <Button 
                                variant="default" 
                                className="w-full flex items-center justify-center text-sm sm:text-base py-4 bg-[#4060e0] hover:bg-[#3050d0] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsMobileMenuOpen(false);
                                  // Use the role redirect logic
                                  if (!currentUser) {
                                    // Not logged in - go to job seeker registration
                                    setTimeout(() => window.location.href = "/job-seeker-register", 100);
                                  } else if (currentUser?.user?.userType === "jobseeker") {
                                    // Already a job seeker - stay on current page
                                    window.scrollTo(0, 0);
                                  } else if (currentUser?.user?.userType === "employer") {
                                    // Employer - go to job seeker registration
                                    setTimeout(() => window.location.href = "/job-seeker-register", 100);
                                  }
                                }}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Job Seeker
                              </Button>
                            </div>
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