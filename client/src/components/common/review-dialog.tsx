import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StarIcon, Check } from "lucide-react";

type ReviewDialogProps = {
  trigger: React.ReactNode;
  googleReviewUrl: string;
};

// Function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ReviewDialog({ trigger, googleReviewUrl }: ReviewDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoveredRating(value);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  // Generate a random 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification code (simulated)
  const sendVerificationCode = () => {
    if (!email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Generate a code
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setShowVerificationInput(true);

    // In a real implementation, you would send this code to the user's email
    // For demonstration, we'll show it in a toast
    toast({
      title: "Verification Code Sent",
      description: `For demonstration: Your code is ${code}`,
      variant: "default"
    });
  };

  // Verify the entered code
  const verifyCode = () => {
    if (verificationCode === generatedCode) {
      setEmailVerified(true);
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (!emailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!review.trim()) {
      toast({
        title: "Review is required",
        description: "Please share your thoughts.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating is required",
        description: "Please provide a star rating.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Normally you would send this data to your backend
    // Here we're simulating an API call and then redirecting to Google Reviews
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message
      toast({
        title: "Thank you for your review!",
        description: "Your feedback is valuable to us. You will now be redirected to Google to post your review.",
        variant: "default"
      });
      
      // Reset form and close dialog
      setName("");
      setEmail("");
      setEmailVerified(false);
      setShowVerificationInput(false);
      setVerificationCode("");
      setGeneratedCode("");
      setReview("");
      setRating(0);
      setOpen(false);
      
      // Open the Google review URL with pre-filled data (if possible)
      // Note: Google doesn't allow direct pre-filling of reviews, but we can open their page
      setTimeout(() => {
        window.open(googleReviewUrl, "_blank");
      }, 1500);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Experience</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve and helps others discover our services.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Email {emailVerified && <Check className="h-4 w-4 inline text-green-500" />}
              </label>
              {!emailVerified && email && isValidEmail(email) && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm p-0 h-auto text-primary" 
                  onClick={sendVerificationCode}
                >
                  Verify Email
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Reset verification if email changes
                  if (emailVerified) {
                    setEmailVerified(false);
                  }
                }}
                placeholder="Your email address"
                className={`w-full ${emailVerified ? 'border-green-500' : ''}`}
                disabled={emailVerified}
              />
            </div>
          </div>

          {showVerificationInput && !emailVerified && (
            <div className="mt-3">
              <label htmlFor="verificationCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                Verification Code
              </label>
              <div className="flex space-x-2">
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={verifyCode}
                >
                  Verify
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          )}

          <div>
            <label htmlFor="rating" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Your Rating
            </label>
            <div className="flex space-x-1" id="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  className="focus:outline-none transition-colors"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      (hoveredRating ? star <= hoveredRating : star <= rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Your Review
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with us"
              className="w-full min-h-[100px]"
            />
          </div>

          <DialogFooter className="sm:justify-end gap-2 flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={isSubmitting || !emailVerified}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}