import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle2 } from "lucide-react";

interface FingerprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rewardName: string;
}

export const FingerprintModal = ({
  isOpen,
  onClose,
  onConfirm,
  rewardName,
}: FingerprintModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(false);
      setIsVerified(false);
    }
  }, [isOpen]);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate fingerprint scan animation
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      
      // Auto-confirm after verification animation
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 800);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-accent">
            Verify to Redeem
          </DialogTitle>
          <DialogDescription className="text-center">
            {rewardName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Fingerprint Animation */}
          <div className="relative">
            <Fingerprint 
              className={`w-32 h-32 transition-all duration-500 ${
                isScanning 
                  ? 'text-accent animate-pulse' 
                  : isVerified 
                  ? 'text-green-500' 
                  : 'text-muted-foreground'
              }`} 
            />
            
            {isVerified && (
              <CheckCircle2 className="w-16 h-16 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in zoom-in" />
            )}
            
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center space-y-2">
            {!isScanning && !isVerified && (
              <p className="text-muted-foreground">
                Place your finger on the sensor
              </p>
            )}
            {isScanning && (
              <p className="text-accent font-semibold animate-pulse">
                Scanning...
              </p>
            )}
            {isVerified && (
              <p className="text-green-500 font-semibold">
                Verified! Redeeming reward...
              </p>
            )}
          </div>

          {/* Scan Button */}
          {!isScanning && !isVerified && (
            <Button 
              onClick={handleScan}
              size="lg"
              className="w-full"
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Scan Fingerprint
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
