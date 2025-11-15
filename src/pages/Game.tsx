import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GameCard from "@/components/GameCard";
import LetterCollector from "@/components/LetterCollector";
import { FeedbackModal } from "@/components/FeedbackModal";
import { QRScanner } from "@/components/QRScanner";
import { ProgressTracker } from "@/components/ProgressTracker";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Star, Home, Info } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

interface Question {
  id: number;
  question: string;
  answer: number;
  letter: string;
}

const mathQuestions: Question[] = [
  { id: 1, question: "2 × 2 =", answer: 4, letter: "L" },
  { id: 2, question: "5 + 3 =", answer: 8, letter: "E" },
  { id: 3, question: "10 - 4 =", answer: 6, letter: "N" },
  { id: 4, question: "3 × 3 =", answer: 9, letter: "G" },
  { id: 5, question: "15 ÷ 3 =", answer: 5, letter: "T" },
  { id: 6, question: "7 + 8 =", answer: 15, letter: "H" },
];

const Game = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedLetter, setEarnedLetter] = useState("");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(true);
  const [waitingForQR, setWaitingForQR] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const processingRef = useRef(false);
  const targetWord = "LENGTH";

  const question = mathQuestions[currentQuestion];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) {
      toast({
        title: "Please enter an answer",
        description: "Type your answer before submitting!",
        variant: "destructive",
      });
      return;
    }
    
    const answer = parseInt(userAnswer);
    
    if (answer === question.answer) {
      // Correct answer
      setIsCorrect(true);
      setEarnedLetter(question.letter);
      setShowFeedback(true);
      setCollectedLetters([...collectedLetters, question.letter]);
      setScore(score + 10);
    } else {
      // Wrong answer
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };

  const handleQRScan = (result: string) => {
    if (processingRef.current) return;
    
    processingRef.current = true;
    setIsProcessingScan(true);
    
    // Close scanner immediately
    setShowQRScanner(false);
    setWaitingForQR(false);
    
    toast({
      title: "QR Code Scanned!",
      description: gameStarted ? "Moving to next question..." : "Starting game...",
      duration: 2000,
    });
    
    // Delay state updates to ensure scanner closes
    setTimeout(() => {
      if (!gameStarted) {
        setGameStarted(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setUserAnswer("");
      }
      
      setTimeout(() => {
        setIsProcessingScan(false);
        processingRef.current = false;
      }, 500);
    }, 500);
  };

  const handleFeedbackContinue = () => {
    setShowFeedback(false);
    
    if (isCorrect) {
      if (currentQuestion < mathQuestions.length - 1) {
        // Show QR scanner for next checkpoint
        setShowQRScanner(true);
        setWaitingForQR(true);
      } else {
        // Game completed
        const existingScores = JSON.parse(localStorage.getItem('mathGameScores') || '[]');
        const newScore = {
          score: score,
          word: targetWord,
          date: new Date().toISOString(),
          playerName: "Player"
        };
        existingScores.push(newScore);
        localStorage.setItem('mathGameScores', JSON.stringify(existingScores));
        
        setTimeout(() => {
          navigate('/leaderboard');
        }, 500);
      }
    } else {
      setUserAnswer("");
    }
  };


  const isGameComplete = collectedLetters.length === targetWord.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Show QR Scanner at start or between questions */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => {
            if (!gameStarted) {
              navigate('/');
            } else {
              setShowQRScanner(false);
            }
          }}
          questionNumber={gameStarted ? currentQuestion + 2 : 1}
        />
      )}

      {/* Only show game content after initial QR scan */}
      {gameStarted && (
        <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowExitDialog(true)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src={owlMascot} alt="StudyOwl" className="w-12 h-12" />
          </div>
          
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-2xl shadow-lg border-2 border-accent/30">
            <Star className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg text-accent">{score} pts</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-accent">
              Collect letters to spell: <span className="text-accent">{targetWord}</span>
            </h2>
          </div>
          <LetterCollector 
            collectedLetters={collectedLetters} 
            targetWord={targetWord}
            className="mb-6" 
          />
          
          {/* Visual Progress Tracker */}
          <div className="mb-6 p-4 bg-card/50 rounded-2xl border border-accent/20">
            <p className="text-center text-sm text-muted-foreground mb-3">Journey Progress</p>
            <ProgressTracker 
              totalSteps={mathQuestions.length}
              currentStep={currentQuestion + 1}
            />
          </div>

          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-accent via-accent to-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(collectedLetters.length / targetWord.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-muted-foreground">
            Question {currentQuestion + 1} of {mathQuestions.length}
          </p>
        </div>

        {!isGameComplete ? (
          /* Question Card */
          <GameCard className="text-center max-w-2xl mx-auto border-2 border-accent/20">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-accent mb-4">
                {question.question}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Answer to earn the letter "<span className="text-accent font-bold">{question.letter}</span>"
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="text-2xl md:text-3xl text-center h-16 text-accent font-bold rounded-2xl border-2 border-accent/30 focus:border-accent bg-background"
                autoFocus
              />
              
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-16 text-xl"
                disabled={!userAnswer}
              >
                Submit Answer
              </Button>
            </form>
          </GameCard>
        ) : (
          /* Game Complete */
          <GameCard variant="success" className="text-center max-w-2xl mx-auto border-2 border-success/30">
            <div className="space-y-6">
              <Trophy className="w-24 h-24 text-accent mx-auto" />
              <h1 className="text-4xl font-bold text-accent">
                Congratulations!
              </h1>
              <p className="text-xl text-foreground">
                You successfully spelled <span className="font-bold text-accent">{targetWord}</span>!
              </p>
              <p className="text-lg text-muted-foreground">
                Final Score: <span className="font-bold text-accent">{score} points</span>
              </p>
              <Button 
                onClick={() => navigate('/leaderboard')}
                size="lg"
                className="gap-2 w-full"
              >
                <Trophy className="w-5 h-5" />
                View Leaderboard
              </Button>
            </div>
          </GameCard>
        )}

        {/* Feedback Modal */}
        <FeedbackModal 
          isOpen={showFeedback}
          isCorrect={isCorrect}
          letter={isCorrect ? earnedLetter : undefined}
          onContinue={handleFeedbackContinue}
        />

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent className="bg-card border-2 border-accent/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-accent">Exit Game?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate('/')}>
                Exit
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-4 px-8 max-w-2xl mx-auto">
          <button
            onClick={() => setShowExitDialog(true)}
            className="flex flex-col items-center gap-1 text-accent"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/rules')}
            className="flex flex-col items-center gap-1 text-accent"
          >
            <Info className="w-6 h-6" />
            <span className="text-xs font-medium">Instructions</span>
          </button>
          
          <button
            onClick={() => navigate('/leaderboard')}
            className="flex flex-col items-center gap-1 text-accent"
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;