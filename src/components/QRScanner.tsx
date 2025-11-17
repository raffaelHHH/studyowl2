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
  const controlsRef = useRef<any>(null);     // <— The FIX
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    const start = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d) => d.kind === "videoinput");

        const back = cams.find((d) =>
          d.label.toLowerCase().includes("back")
        );

        const deviceId = back?.deviceId ?? cams[cams.length - 1]?.deviceId;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        });
        streamRef.current = stream;

        if (videoRef.current) videoRef.current.srcObject = stream;

        // IMPORTANT: Save returned controls for stopping later
        controlsRef.current = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current!,
          (result) => {
            if (result) {
              stopScanner();
              onScan(result.getText());
            }
          }
        );
      } catch (err) {
        console.error(err);
        setError("Camera unavailable. Please allow access.");
      }
    };

    start();

    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    try {
      // Stop ZXing continuous scanning
      controlsRef.current?.stop();
    } catch (e) {
      console.warn("ZXing stop() failed", e);
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <Card className="relative w-full max-w-md mx-auto p-6 bg-card border-2 border-accent/30 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Camera className="w-7 h-7 text-accent" />
          <div>
            <h2 className="text-lg font-bold text-accent">
              {questionNumber ? `Checkpoint ${questionNumber}` : "Scan QR Code"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Position the QR code within the frame
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      </div>

      {error && <p className="text-center text-destructive mt-3">{error}</p>}
    </Card>
  );
};
