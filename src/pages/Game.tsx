import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GameCard from "@/components/GameCard";
import LetterCollector from "@/components/LetterCollector";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Star } from "lucide-react";

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
  const targetWord = "LENGTH";

  const question = mathQuestions[currentQuestion];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    
    if (answer === question.answer) {
      // Correct answer
      setCollectedLetters([...collectedLetters, question.letter]);
      setScore(score + 10);
      
      toast({
        title: "Correct! 🎉",
        description: `You earned the letter "${question.letter}"!`,
        variant: "default",
      });

      // Move to next question
      if (currentQuestion < mathQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer("");
      } else {
        // Game completed
        toast({
          title: "Congratulations! 🏆",
          description: `You spelled "${targetWord}" and earned ${score + 10} points!`,
          variant: "default",
        });
        
        // Save score to localStorage
        const existingScores = JSON.parse(localStorage.getItem('mathGameScores') || '[]');
        const newScore = {
          score: score + 10,
          word: targetWord,
          date: new Date().toISOString(),
          playerName: "Player" // Could be extended to allow custom names
        };
        existingScores.push(newScore);
        localStorage.setItem('mathGameScores', JSON.stringify(existingScores));
        
        // Navigate to leaderboard after 2 seconds
        setTimeout(() => {
          navigate('/leaderboard');
        }, 2000);
      }
    } else {
      // Wrong answer
      toast({
        title: "Not quite right! 🤔",
        description: "Try again!",
        variant: "destructive",
      });
    }
  };

  const isGameComplete = collectedLetters.length === targetWord.length;

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
              <Star className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">{score} pts</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Collect letters to spell: <span className="text-primary">{targetWord}</span>
            </h2>
          </div>
          <LetterCollector 
            collectedLetters={collectedLetters} 
            targetWord={targetWord}
            className="mb-6" 
          />
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${(collectedLetters.length / targetWord.length) * 100}%` }}
            />
          </div>
          <p className="text-center mt-2 text-muted-foreground">
            Question {currentQuestion + 1} of {mathQuestions.length}
          </p>
        </div>

        {!isGameComplete ? (
          /* Question Card */
          <GameCard className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-primary mb-4">
                {question.question}
              </h1>
              <p className="text-xl text-muted-foreground">
                Answer to earn the letter "{question.letter}"
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="text-3xl text-center h-16 text-primary font-bold rounded-2xl border-2 border-primary/30 focus:border-primary"
                autoFocus
              />
              
              <Button 
                type="submit" 
                size="mega"
                variant="default"
                disabled={!userAnswer}
                className="w-full"
              >
                Submit Answer
              </Button>
            </form>
          </GameCard>
        ) : (
          /* Game Complete */
          <GameCard variant="success" className="text-center max-w-2xl mx-auto">
            <div className="space-y-6">
              <Trophy className="w-24 h-24 text-success mx-auto" />
              <h1 className="text-4xl font-bold text-success">
                Congratulations!
              </h1>
              <p className="text-xl">
                You successfully spelled <span className="font-bold text-success">{targetWord}</span>!
              </p>
              <p className="text-lg text-muted-foreground">
                Final Score: <span className="font-bold text-success">{score} points</span>
              </p>
              <Button 
                onClick={() => navigate('/leaderboard')}
                size="lg"
                variant="default"
                className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
              >
                <Trophy className="w-5 h-5" />
                View Leaderboard
              </Button>
            </div>
          </GameCard>
        )}
      </div>
    </div>
  );
};

export default Game;