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
import { Menu, Briefcase, User, LogOut, ChevronDown } from "lucide-react";
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

  // Navigation links
  const navigationLinks = [
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

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <Briefcase className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold">RH Job Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigationLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group">
                  <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center ${
                    link.dropdownItems?.some(item => location === item.href) ? "text-primary" : "text-gray-700"
                  }`}>
                    {link.name}
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" />
                  </div>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {link.dropdownItems?.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <div className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${location === item.href ? "text-primary dark:text-primary bg-primary/5" : ""}`}>
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.name} href={link.href}>
                  <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === link.href ? "text-primary" : "text-gray-700"}`}>
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
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
                      <DropdownMenuItem>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>My Applications</span>
                      </DropdownMenuItem>
                    )}
                    {currentUser.user.userType === "employer" && (
                      <DropdownMenuItem>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Posted Jobs</span>
                      </DropdownMenuItem>
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
                <Link href="/auth?tab=login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth?type=jobseeker">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through our job portal
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 py-4">
                  {navigationLinks.map((link) => 
                    link.isDropdown ? (
                      <div key={link.name} className="flex flex-col">
                        <div className="px-4 py-2 font-medium text-gray-800">
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
                          <Link href="/auth?tab=login">
                            <Button variant="outline" className="w-full mb-2">
                              Sign In
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth?type=jobseeker">
                            <Button className="w-full">
                              Sign Up
                            </Button>
                          </Link>
                        </SheetClose>
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