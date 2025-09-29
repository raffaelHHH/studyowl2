import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, QrCode, Ruler, RotateCcw, Target } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

interface MeasurementQuestion {
  id: number;
  type: "length" | "angle";
  question: string;
  target: number;
  unit: string;
  tolerance: number;
}

const measurementQuestions: MeasurementQuestion[] = [
  { id: 1, type: "length", question: "Measure the length of this 1-meter object", target: 100, unit: "cm", tolerance: 5 },
  { id: 2, type: "angle", question: "What angle is this corner?", target: 90, unit: "°", tolerance: 5 },
  { id: 3, type: "length", question: "Measure the width of this object", target: 50, unit: "cm", tolerance: 3 },
  { id: 4, type: "angle", question: "Measure this angle", target: 45, unit: "°", tolerance: 5 },
];

const MeasurementGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [qrCodeDetected, setQrCodeDetected] = useState(false);
  const [measurementMode, setMeasurementMode] = useState<"waiting" | "measuring" | "calibrating">("waiting");
  const [userMeasurement, setUserMeasurement] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [endPoint, setEndPoint] = useState<{x: number, y: number} | null>(null);
  const [calibrationFactor, setCalibrationFactor] = useState(1); // pixels per cm

  const question = measurementQuestions[currentQuestion];

  useEffect(() => {
    codeReader.current = new BrowserQRCodeReader();
    return () => {
      // Cleanup camera stream when component unmounts
    };
  }, []);

  const startCamera = async () => {
    try {
      // Request camera permissions with specific constraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraActive(true);
            
            // Set up canvas to match video dimensions
            const canvas = canvasRef.current;
            if (canvas && videoRef.current) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
            }
            
            // Start QR code scanning with error handling
            if (codeReader.current && videoRef.current) {
              try {
                codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
                  if (result && !qrCodeDetected) {
                    handleQRCodeDetected(result.getText());
                  }
                  // Ignore scanning errors - they're normal when no QR code is visible
                });
              } catch (scanError) {
                console.log('QR scanning started successfully');
              }
            }
          }
        };
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      let errorMessage = "Unable to access camera.";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Camera not supported on this browser.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleQRCodeDetected = (qrContent: string) => {
    console.log('QR Code detected:', qrContent);
    setQrCodeDetected(true);
    setMeasurementMode("calibrating");
    
    toast({
      title: "QR Code Detected! 📱",
      description: "Now you can start measuring. Tap two points to measure distance or angle.",
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (measurementMode !== "measuring" && measurementMode !== "calibrating") return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    if (!startPoint) {
      setStartPoint({ x, y });
      drawPoint(x, y, 'start');
      toast({
        title: "First point set ✓",
        description: "Tap the second point to complete measurement",
      });
    } else {
      setEndPoint({ x, y });
      drawPoint(x, y, 'end');
      drawLine(startPoint, { x, y });
      calculateMeasurement({ x, y });
    }
  };

  const calculateMeasurement = (end: {x: number, y: number}) => {
    if (!startPoint) return;
    
    if (question.type === "length") {
      const distance = Math.sqrt(Math.pow(end.x - startPoint.x, 2) + Math.pow(end.y - startPoint.y, 2));
      const measurementInCm = distance / calibrationFactor;
      setUserMeasurement(Math.round(measurementInCm * 10) / 10); // Round to 1 decimal
    } else if (question.type === "angle") {
      const angle = Math.atan2(end.y - startPoint.y, end.x - startPoint.x) * (180 / Math.PI);
      const positiveAngle = angle < 0 ? angle + 360 : angle;
      setUserMeasurement(Math.round(positiveAngle));
    }
    
    setMeasurementMode("waiting");
  };

  const drawPoint = (x: number, y: number, type: 'start' | 'end') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = type === 'start' ? '#ff0000' : '#00ff00';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add text label
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(type === 'start' ? 'START' : 'END', x + 12, y + 5);
  };

  const drawLine = (start: {x: number, y: number}, end: {x: number, y: number}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    // Draw measurement text
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const measurement = Math.round((distance / calibrationFactor) * 10) / 10;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(midX - 30, midY - 15, 60, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${measurement}cm`, midX, midY);
  };

  const submitMeasurement = () => {
    if (userMeasurement === null) return;
    
    const isCorrect = Math.abs(userMeasurement - question.target) <= question.tolerance;
    
    if (isCorrect) {
      setScore(score + 20);
      toast({
        title: "Excellent measurement! 🎯",
        description: `Correct! You measured ${userMeasurement}${question.unit}`,
      });
      
      if (currentQuestion < measurementQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        resetMeasurement();
      } else {
        toast({
          title: "Game Complete! 🏆",
          description: `Final score: ${score + 20} points!`,
        });
        setTimeout(() => navigate('/leaderboard'), 2000);
      }
    } else {
      toast({
        title: "Close, but try again! 🤔",
        description: `Target: ${question.target}${question.unit}, Your measurement: ${userMeasurement}${question.unit}`,
        variant: "destructive",
      });
    }
  };

  const resetMeasurement = () => {
    setStartPoint(null);
    setEndPoint(null);
    setUserMeasurement(null);
    setMeasurementMode(qrCodeDetected ? "measuring" : "calibrating");
    
    // Clear canvas overlay
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const calibrateWithQR = () => {
    // Standard QR code is typically 2.1cm x 2.1cm
    if (startPoint && endPoint) {
      const qrSizeInPixels = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      setCalibrationFactor(qrSizeInPixels / 2.1); // 2.1cm standard QR code
      setMeasurementMode("measuring");
      setQrCodeDetected(true);
      resetMeasurement();
      
      toast({
        title: "Calibration complete! ✅",
        description: "Camera is now calibrated for accurate measurements",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setQrCodeDetected(false);
    setMeasurementMode("waiting");
    resetMeasurement();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-2xl shadow-lg">
              <Ruler className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">{score} pts</span>
            </div>
          </div>
        </div>

        {/* Question Progress */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            AR Measurement Game
          </h2>
          <p className="text-lg text-muted-foreground">
            Question {currentQuestion + 1} of {measurementQuestions.length}
          </p>
        </div>

        <GameCard className="max-w-2xl mx-auto">
          {!cameraActive ? (
            <div className="text-center space-y-6">
              <Camera className="w-24 h-24 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-primary">
                Start Camera Measurement
              </h3>
              <p className="text-lg text-muted-foreground">
                Use your camera to scan QR codes and measure objects in real-time
              </p>
              <Button 
                onClick={startCamera}
                size="mega"
                className="w-full gap-2"
              >
                <Camera className="w-6 h-6" />
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary">
                  {question.question}
                </h3>
                <p className="text-muted-foreground">
                  Target: {question.target}{question.unit} (±{question.tolerance}{question.unit})
                </p>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 object-cover"
                />
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="absolute top-0 left-0 w-full h-80 cursor-crosshair"
                  style={{ pointerEvents: measurementMode === "waiting" ? "none" : "auto" }}
                />
                
                {/* Instruction overlay */}
                {!qrCodeDetected && (
                  <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm">📱 First: Scan a QR code or manually calibrate by measuring a known object</p>
                  </div>
                )}
                
                {qrCodeDetected && measurementMode === "measuring" && (
                  <div className="absolute top-4 left-4 right-4 bg-green-600/80 text-white p-3 rounded-lg">
                    <p className="text-sm">📏 Tap two points to measure distance or angle</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                {measurementMode === "calibrating" && startPoint && endPoint && (
                  <Button onClick={calibrateWithQR} variant="secondary" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Set as 2.1cm (QR Code)
                  </Button>
                )}
                
                <Button onClick={resetMeasurement} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Points
                </Button>
                
                <Button onClick={stopCamera} variant="destructive" size="sm">
                  Stop Camera
                </Button>
                
                {!qrCodeDetected && (
                  <div className="w-full text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Manual calibration: Measure a known object (like a credit card = 8.5cm)
                    </p>
                    {startPoint && endPoint && (
                      <Button 
                        onClick={() => {
                          const qrSizeInPixels = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
                          setCalibrationFactor(qrSizeInPixels / 8.5); // Credit card width
                          setQrCodeDetected(true);
                          setMeasurementMode("measuring");
                          resetMeasurement();
                          toast({ title: "Manual calibration complete! ✅", description: "Using credit card size (8.5cm)" });
                        }}
                        variant="secondary" 
                        size="sm"
                      >
                        Set as 8.5cm (Credit Card)
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {userMeasurement !== null && (
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-primary">
                    Measurement: {userMeasurement}{question.unit}
                  </p>
                  <Button onClick={submitMeasurement} size="lg" className="w-full">
                    Submit Measurement
                  </Button>
                </div>
              )}
            </div>
          )}
        </GameCard>
      </div>
    </div>
  );
};

export default MeasurementGame;