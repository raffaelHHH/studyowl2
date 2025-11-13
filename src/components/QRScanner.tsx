import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  questionNumber?: number;
}

export const QRScanner = ({ onScan, onClose, questionNumber }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        setIsScanning(true);
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Try to find back camera
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        const deviceId = backCamera ? backCamera.deviceId : videoDevices[videoDevices.length - 1]?.deviceId;

        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: deviceId ? { exact: deviceId } : undefined }
          });
          streamRef.current = stream;
          videoRef.current.srcObject = stream;

          await reader.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                const text = result.getText();
                onScan(text);
              }
            }
          );
        }
      } catch (err) {
        setError("Failed to access camera. Please allow camera permissions.");
        console.error(err);
      }
    };

    startScanning();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 p-6 bg-card border-2 border-accent/30">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-foreground hover:text-accent"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-accent" />
            <div>
              <h2 className="text-xl font-bold text-accent">
                {questionNumber ? `Checkpoint ${questionNumber}` : "Scan QR Code"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Position the QR code within the frame
              </p>
            </div>
          </div>

          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            
            {/* Scanning frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-accent rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Scan the QR code to {questionNumber ? "proceed to the next question" : "start the game"}
          </p>
        </div>
      </Card>
    </div>
  );
};
