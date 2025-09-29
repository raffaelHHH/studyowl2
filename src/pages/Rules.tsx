import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { ArrowLeft, Play, Target, Trophy, Star, Calculator, BookOpen } from "lucide-react";

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 p-4">
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
          
          <Button
            variant="default"
            onClick={() => navigate('/game')}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Start Playing
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <BookOpen className="w-20 h-20 text-accent mx-auto mb-6" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
            Game Rules
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn how to become a Math Adventure champion!
          </p>
        </div>

        {/* Rules Cards */}
        <div className="space-y-8">
          {/* How to Play */}
          <GameCard variant="primary">
            <div className="flex items-start gap-4">
              <Target className="w-12 h-12 text-primary mt-2" />
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">How to Play</h2>
                <div className="space-y-3 text-lg text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Click "START" to begin your math adventure
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Answer the math question correctly to earn a letter
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    Collect all letters to spell the target word
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    Complete the word to finish the game!
                  </p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Scoring */}
          <GameCard variant="secondary">
            <div className="flex items-start gap-4">
              <Calculator className="w-12 h-12 text-secondary mt-2" />
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">Scoring System</h2>
                <div className="space-y-3 text-lg text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent" />
                    <span className="font-bold text-accent">10 points</span> for each correct answer
                  </p>
                  <p className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-success" />
                    Higher scores mean better ranking on the leaderboard
                  </p>
                  <p className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Answer quickly and accurately to maximize your score
                  </p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Tips */}
          <GameCard variant="accent">
            <div className="flex items-start gap-4">
              <Trophy className="w-12 h-12 text-accent mt-2" />
              <div>
                <h2 className="text-3xl font-bold text-accent mb-4">Tips to Win</h2>
                <div className="space-y-3 text-lg text-muted-foreground">
                  <p>🧮 Take your time to think through each math problem</p>
                  <p>🎯 Double-check your answer before submitting</p>
                  <p>📚 Practice basic math facts to get faster</p>
                  <p>🏆 Keep playing to improve your ranking!</p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Example */}
          <GameCard variant="purple">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple mb-6">Example</h2>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-foreground">2 × 3 = ?</div>
                <div className="text-xl text-muted-foreground">Answer: 6</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-success text-success-foreground rounded-xl flex items-center justify-center text-2xl font-bold">
                    L
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">
                  Correct! You earned the letter "L" and 10 points! 🎉
                </p>
              </div>
            </div>
          </GameCard>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/game')}
            size="mega"
            variant="default"
            className="gap-3"
          >
            <Play className="w-6 h-6" />
            Ready to Play!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;