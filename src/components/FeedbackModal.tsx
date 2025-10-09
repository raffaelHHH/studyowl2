import { CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  letter?: string;
  onContinue: () => void;
}

export const FeedbackModal = ({ isOpen, isCorrect, letter, onContinue }: FeedbackModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onContinue}>
      <DialogContent className="max-w-md text-center">
        {isCorrect ? (
          <div className="space-y-6">
            <div className="relative">
              <CheckCircle2 className="w-24 h-24 text-success mx-auto animate-scale-in" />
              <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-success">Well done!</h2>
            {letter && (
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">You unlocked the letter:</p>
                <div className="text-6xl font-bold text-primary bg-primary/10 rounded-3xl py-6">
                  {letter}
                </div>
              </div>
            )}
            <Button 
              onClick={onContinue}
              size="lg"
              className="w-full bg-success hover:bg-success/90"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <XCircle className="w-24 h-24 text-destructive mx-auto animate-scale-in" />
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-destructive">Try again!</h2>
            <p className="text-xl text-muted-foreground">
              Don't give up! You can do this! 💪
            </p>
            <Button 
              onClick={onContinue}
              size="lg"
              className="w-full"
              variant="outline"
            >
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
