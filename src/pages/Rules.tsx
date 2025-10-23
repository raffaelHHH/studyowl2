import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { ArrowLeft, Play, Target, Trophy, Star, Calculator, BookOpen, Home, Info } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src={owlMascot} alt="StudyOwl" className="w-12 h-12" />
          </div>
          
          <Button
            onClick={() => navigate('/game')}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Start Playing
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <BookOpen className="w-16 md:w-20 h-16 md:h-20 text-accent mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Game Rules
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Learn how to become a champion!
          </p>
        </div>

        {/* Rules Cards */}
        <div className="space-y-6">
          {/* How to Play */}
          <GameCard className="border-2 border-accent/20">
            <div className="flex items-start gap-4">
              <Target className="w-10 md:w-12 h-10 md:h-12 text-accent mt-2 flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4">How to Play</h2>
                <div className="space-y-3 text-base md:text-lg text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-accent font-bold">1.</span>
                    Click "START" to begin your math adventure
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent font-bold">2.</span>
                    Answer the math question correctly to earn a letter
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent font-bold">3.</span>
                    Collect all letters to spell the target word
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent font-bold">4.</span>
                    Complete the word to finish the game!
                  </p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Scoring */}
          <GameCard className="border-2 border-accent/20">
            <div className="flex items-start gap-4">
              <Calculator className="w-10 md:w-12 h-10 md:h-12 text-accent mt-2 flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4">Scoring System</h2>
                <div className="space-y-3 text-base md:text-lg text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent" />
                    <span className="font-bold text-accent">10 points</span> for each correct answer
                  </p>
                  <p className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-accent" />
                    Higher scores mean better ranking on the leaderboard
                  </p>
                  <p className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-accent" />
                    Answer quickly and accurately to maximize your score
                  </p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Tips */}
          <GameCard className="border-2 border-accent/20">
            <div className="flex items-start gap-4">
              <Trophy className="w-10 md:w-12 h-10 md:h-12 text-accent mt-2 flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4">Tips to Win</h2>
                <div className="space-y-3 text-base md:text-lg text-muted-foreground">
                  <p>🧮 Take your time to think through each math problem</p>
                  <p>🎯 Double-check your answer before submitting</p>
                  <p>📚 Practice basic math facts to get faster</p>
                  <p>🏆 Keep playing to improve your ranking!</p>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Example */}
          <GameCard className="border-2 border-accent/20">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6">Example</h2>
              <div className="space-y-4">
                <div className="text-3xl md:text-4xl font-bold text-accent">2 × 3 = ?</div>
                <div className="text-lg md:text-xl text-muted-foreground">Answer: 6</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-accent text-accent-foreground rounded-xl flex items-center justify-center text-2xl font-bold">
                    L
                  </div>
                </div>
                <p className="text-base md:text-lg text-muted-foreground">
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
            size="lg"
            className="gap-3 h-16 text-lg"
          >
            <Play className="w-6 h-6" />
            Ready to Play!
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-4 px-8 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
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

export default Rules;