import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type ReviewDialogProps = {
  children: React.ReactNode;
  googleReviewUrl: string;
};

const ReviewDialog = ({ children, googleReviewUrl }: ReviewDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleReviewClick = () => {
    // Open the Google review page in a new tab/window
    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Rate Your Experience</DialogTitle>
          <DialogDescription className="text-center pt-2">
            We value your feedback. Please share your experience with Expert Recruitments.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className="h-10 w-10 cursor-pointer hover:fill-yellow-400 hover:text-yellow-400 transition-colors"
                onClick={() => handleReviewClick()}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center mb-4">
            Your honest feedback helps us improve our services and helps others
            make informed decisions.
          </p>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Not Now
          </Button>
          <Button onClick={handleReviewClick} className="bg-primary hover:bg-primary/90">
            Leave a Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;