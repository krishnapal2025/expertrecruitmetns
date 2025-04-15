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
import { Menu, X, Search, Briefcase, User, LogOut } from "lucide-react";

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
    { name: "Services", href: "/services" },
    { name: "Job Board", href: "/job-board" },
    { name: "Sectors", href: "/sectors" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Briefcase className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold">RH Job Portal</span>
              </a>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigationLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <a className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-gray-700"}`}>
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
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
            ) : (
              <>
                <Link href="/auth">
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
                  {navigationLinks.map((link) => (
                    <SheetClose asChild key={link.name}>
                      <Link href={link.href}>
                        <a className={`px-4 py-2 rounded-md ${location === link.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}>
                          {link.name}
                        </a>
                      </Link>
                    </SheetClose>
                  ))}
                  
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
                            <a className="px-4 py-2 rounded-md hover:bg-gray-100 flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </a>
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
                          <Link href="/auth">
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
