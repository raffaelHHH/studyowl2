import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GameCard from "@/components/GameCard";
import { useToast } from "@/hooks/use-toast";
import { Camera, QrCode, Home } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";
import owlMascot from "@/assets/owl-mascot.png";

interface MathQuestion {
  question: string;
  answer: number;
}

const MeasurementGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    codeReader.current = new BrowserQRCodeReader();
    return () => {
      // Cleanup camera stream when component unmounts
    };
  }, []);

  const startCamera = async () => {
    try {
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
            
            // Start QR code scanning
            if (codeReader.current && videoRef.current) {
              codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
                if (result && !currentQuestion) {
                  handleQRCodeDetected(result.getText());
                }
              });
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
    
    try {
      // Try to parse QR content as JSON with question and answer
      const parsed = JSON.parse(qrContent);
      if (parsed.question && parsed.answer !== undefined) {
        setCurrentQuestion(parsed);
        stopCamera();
        toast({
          title: "Question Loaded! 🎯",
          description: "Answer the math question to earn points!",
        });
      } else {
        throw new Error("Invalid QR format");
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "QR code must contain a math question. Format: {\"question\":\"2+2=?\",\"answer\":4}",
        variant: "destructive",
      });
    }
  };

  const submitAnswer = () => {
    if (!currentQuestion || userAnswer.trim() === "") return;
    
    const userAnswerNum = parseFloat(userAnswer);
    const isCorrect = userAnswerNum === currentQuestion.answer;
    
    if (isCorrect) {
      const points = 20;
      setScore(score + points);
      setQuestionsAnswered(questionsAnswered + 1);
      
      toast({
        title: "Correct! 🎉",
        description: `You earned ${points} points!`,
      });
      
      // Reset for next question
      setCurrentQuestion(null);
      setUserAnswer("");
      startCamera();
    } else {
      toast({
        title: "Incorrect 😢",
        description: `The correct answer was ${currentQuestion.answer}. Try scanning another QR code!`,
        variant: "destructive",
      });
      
      // Reset for next question
      setCurrentQuestion(null);
      setUserAnswer("");
      startCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4" />
            </Button>
            <img src={owlMascot} alt="StudyOwl" className="w-12 h-12" />
          </div>
          
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-2xl shadow-lg">
            <QrCode className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg">{score} pts</span>
          </div>
        </div>

        {/* Game Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            QR Code Math Challenge
          </h2>
          <p className="text-lg text-muted-foreground">
            Questions Answered: {questionsAnswered}
          </p>
        </div>

        <GameCard className="max-w-2xl mx-auto">
          {currentQuestion ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <QrCode className="w-16 h-16 text-primary mx-auto" />
                <h3 className="text-2xl font-bold text-primary">
                  Math Question
                </h3>
                <div className="bg-accent/10 p-6 rounded-lg">
                  <p className="text-3xl font-bold text-foreground mb-4">
                    {currentQuestion.question}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-center text-xl h-14"
                  onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                />
                <Button 
                  onClick={submitAnswer}
                  size="lg"
                  className="w-full"
                  disabled={userAnswer.trim() === ""}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          ) : !cameraActive ? (
            <div className="text-center space-y-6">
              <QrCode className="w-24 h-24 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-primary">
                Scan QR Code
              </h3>
              <p className="text-lg text-muted-foreground">
                Scan a QR code containing a math question to start playing!
              </p>
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-left">
                <p className="font-semibold mb-2">QR Code Format:</p>
                <code className="block bg-background p-2 rounded">
                  {`{"question":"5+3=?","answer":8}`}
                </code>
              </div>
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
                  Point camera at QR code
                </h3>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 object-cover"
                />
                
                <div className="absolute top-4 left-4 right-4 bg-primary/90 text-primary-foreground p-3 rounded-lg">
                  <p className="text-sm text-center">📱 Scanning for QR code...</p>
                </div>
              </div>

              <Button onClick={stopCamera} variant="outline" className="w-full">
                Cancel Scanning
              </Button>
            </div>
          )}
        </GameCard>
      </div>
    </div>
  );
};

export default MeasurementGame;