import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

// Banner slide data
const slides = [
  {
    title: "Find Your Dream Job",
    description: "Connect with thousands of employers and opportunities across all industries",
    bgImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    ctaText: "Browse Jobs",
    ctaLink: "/job-board",
  },
  {
    title: "Hire Top Talent",
    description: "Access a wide pool of qualified candidates to grow your team",
    bgImage: "https://images.unsplash.com/photo-1573496130407-57329f01f769",
    ctaText: "Post a Job",
    ctaLink: "/auth?type=employer",
  },
  {
    title: "Expert Career Guidance",
    description: "Get advice and resources to help you advance your professional journey",
    bgImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    ctaText: "Career Resources",
    ctaLink: "/blogs",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up automatic slider
  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    };

    startAutoSlide();

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentSlide(index);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${slide.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link href={
                  // If we're showing the "Post a Job" CTA and user is already logged in as employer,
                  // send them directly to job creation page instead of auth
                  slide.ctaText === "Post a Job" && 
                  currentUser?.user.userType === "employer" ? 
                  "/post-job" : slide.ctaLink
                }>
                  <Button size="lg" className="text-lg group">
                    {slide.ctaText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                {index === 0 && !currentUser && (
                  <Link href="/auth?type=jobseeker">
                    <Button size="lg" className="text-lg group">
                      Register Now
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
