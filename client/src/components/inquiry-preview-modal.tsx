import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, SendIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface InquiryPreviewModalProps {
  inquiry: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  onReplySuccess: () => void;
}

export function InquiryPreviewModal({
  inquiry,
  isOpen,
  onClose,
  onStatusChange,
  onReplySuccess,
}: InquiryPreviewModalProps) {
  const [replyMode, setReplyMode] = useState(false);
  const [replySubject, setReplySubject] = useState(`Re: ${inquiry?.subject || 'Your inquiry to Expert Recruitments'}`);
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState(inquiry?.status || "new");
  const [isSending, setIsSending] = useState(false);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "N/A";
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await onStatusChange(inquiry.id, newStatus);
      toast({
        title: "Status updated",
        description: `Inquiry status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the inquiry status.",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a reply message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await apiRequest("POST", `/api/staffing-inquiries/${inquiry.id}/reply`, {
        subject: replySubject,
        message: replyMessage,
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });

      // Update status to "contacted" if currently "new"
      if (status === "new") {
        await handleStatusChange("contacted");
      }

      // Reset and close
      setReplyMode(false);
      setReplyMessage("");
      onReplySuccess();
    } catch (error) {
      toast({
        title: "Failed to send reply",
        description: error instanceof Error ? error.message : "An error occurred while sending your reply.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!inquiry ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : replyMode ? (
          <>
            <DialogHeader>
              <DialogTitle>Reply to {inquiry.name}</DialogTitle>
              <DialogDescription>
                Send an email response to the inquiry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="emailTo">To:</Label>
                <Input id="emailTo" value={inquiry.email} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Subject:</Label>
                <Input 
                  id="emailSubject" 
                  value={replySubject} 
                  onChange={(e) => setReplySubject(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailMessage">Message:</Label>
                <Textarea 
                  id="emailMessage" 
                  rows={10} 
                  placeholder="Type your reply here..." 
                  value={replyMessage} 
                  onChange={(e) => setReplyMessage(e.target.value)} 
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setReplyMode(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSendReply}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Send Reply
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl">{inquiry.inquiryType === "business" ? "Business Inquiry" : "General Inquiry"}</DialogTitle>
                <Badge variant={
                  inquiry.status === "completed" 
                    ? "default" 
                    : inquiry.status === "in_progress" 
                    ? "secondary" 
                    : inquiry.status === "contacted"
                    ? "outline"
                    : "destructive"
                }>
                  {inquiry.status || "new"}
                </Badge>
              </div>
              <DialogDescription>
                Received on {formatDate(inquiry.submittedAt || inquiry.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">From:</Label>
                  <p className="text-lg font-semibold">{inquiry.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email:</Label>
                  <p className="text-lg font-semibold">{inquiry.email}</p>
                </div>
              </div>
              
              {inquiry.phone && (
                <div>
                  <Label className="text-sm font-medium">Phone:</Label>
                  <p className="text-lg font-semibold">{inquiry.phone}</p>
                </div>
              )}
              
              {inquiry.company && (
                <div>
                  <Label className="text-sm font-medium">Company:</Label>
                  <p className="text-lg font-semibold">{inquiry.company}</p>
                </div>
              )}
              
              <div className="border-t pt-4 mt-2">
                <Label className="text-sm font-medium">Message:</Label>
                <div className="mt-2 bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {inquiry.message}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <Label className="text-sm font-medium">Status:</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={() => setReplyMode(true)}>
                <SendIcon className="mr-2 h-4 w-4" />
                Reply
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}