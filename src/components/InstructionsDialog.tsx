import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, QrCode, Camera, MessageSquare, Award } from "lucide-react";

export const InstructionsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">How to Play</DialogTitle>
          <DialogDescription className="text-lg">
            Follow these steps to become a StudyOwl champion!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Find QR Codes
              </h3>
              <p className="text-muted-foreground">
                For AR Measurement mode, look for QR codes around your environment to unlock geometry puzzles.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-lg">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scan with Your Device
              </h3>
              <p className="text-muted-foreground">
                Use your camera to scan QR codes or measure objects in real-time for AR challenges.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-lg">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Answer Questions
              </h3>
              <p className="text-muted-foreground">
                Solve math problems correctly to collect letters and earn points. Don't worry if you get it wrong - try again!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center text-purple font-bold text-lg">
              4
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Collect Letters
              </h3>
              <p className="text-muted-foreground">
                Each correct answer earns you a letter. Collect all letters to spell the target word!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success font-bold text-lg">
              5
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Form the Word & Earn Points</h3>
              <p className="text-muted-foreground">
                Complete the word to earn bonus points! Check the leaderboard to see your ranking and redeem rewards with your points.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-xl">
          <p className="text-sm text-center">
            💡 <span className="font-semibold">Pro Tip:</span> The more you play, the more points you earn to unlock exclusive rewards!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
