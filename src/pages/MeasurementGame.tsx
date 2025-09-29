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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Start QR code scanning
        if (codeReader.current) {
          codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
            if (result) {
              handleQRCodeDetected(result.getText());
            }
          });
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please allow camera permissions.",
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
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (!startPoint) {
      setStartPoint({ x, y });
      toast({
        title: "First point set",
        description: "Tap the second point to complete measurement",
      });
    } else {
      setEndPoint({ x, y });
      calculateMeasurement({ x, y });
    }
  };

  const calculateMeasurement = (end: {x: number, y: number}) => {
    if (!startPoint) return;
    
    if (question.type === "length") {
      const distance = Math.sqrt(Math.pow(end.x - startPoint.x, 2) + Math.pow(end.y - startPoint.y, 2));
      const measurementInCm = distance / calibrationFactor;
      setUserMeasurement(Math.round(measurementInCm));
    } else if (question.type === "angle") {
      const angle = Math.atan2(end.y - startPoint.y, end.x - startPoint.x) * (180 / Math.PI);
      const positiveAngle = angle < 0 ? angle + 360 : angle;
      setUserMeasurement(Math.round(positiveAngle));
    }
    
    setMeasurementMode("waiting");
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
    setMeasurementMode("measuring");
  };

  const calibrateWithQR = () => {
    // Assuming QR code is 2cm x 2cm for calibration
    if (startPoint && endPoint) {
      const qrSizeInPixels = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      setCalibrationFactor(qrSizeInPixels / 2); // 2cm QR code
      setMeasurementMode("measuring");
      resetMeasurement();
      
      toast({
        title: "Calibration complete! ✅",
        description: "Now you can accurately measure objects",
      });
    }
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

              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="absolute top-0 left-0 w-full h-64 cursor-crosshair"
                  width={400}
                  height={256}
                />
                
                {/* Measurement overlay */}
                {startPoint && (
                  <div 
                    className="absolute w-2 h-2 bg-red-500 rounded-full"
                    style={{ 
                      left: `${(startPoint.x / 400) * 100}%`, 
                      top: `${(startPoint.y / 256) * 100}%` 
                    }}
                  />
                )}
                {endPoint && (
                  <div 
                    className="absolute w-2 h-2 bg-red-500 rounded-full"
                    style={{ 
                      left: `${(endPoint.x / 400) * 100}%`, 
                      top: `${(endPoint.y / 256) * 100}%` 
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {!qrCodeDetected && (
                  <div className="flex items-center gap-2 text-warning">
                    <QrCode className="w-5 h-5" />
                    <span>Scan a QR code to calibrate</span>
                  </div>
                )}
                
                {measurementMode === "calibrating" && (
                  <Button onClick={calibrateWithQR} variant="secondary" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Calibrate with QR
                  </Button>
                )}
                
                <Button onClick={resetMeasurement} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
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