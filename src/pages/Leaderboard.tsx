import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { ArrowLeft, Trophy, Medal, Award, Star, Home, Gift, Info } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

interface Score {
  score: number;
  word: string;
  date: string;
  playerName: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('mathGameScores') || '[]');
    // Sort by score (highest first)
    const sortedScores = savedScores.sort((a: Score, b: Score) => b.score - a.score);
    setScores(sortedScores);
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-accent" />;
      case 1:
        return <Medal className="w-8 h-8 text-muted-foreground" />;
      case 2:
        return <Award className="w-8 h-8 text-orange-500" />;
      default:
        return <Star className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case 2:
        return "bg-gradient-to-r from-orange-300 to-orange-500 text-orange-900";
      default:
        return "bg-card text-card-foreground";
    }
  };

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
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/rewards')}
              className="gap-2"
            >
              <Gift className="w-4 h-4" />
              Rewards
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <Trophy className="w-20 h-20 text-accent mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Leaderboard
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Top Math Champions
          </p>
        </div>

        {/* Leaderboard */}
        {scores.length > 0 ? (
          <div className="space-y-4">
            {scores.slice(0, 10).map((score, index) => (
              <GameCard
                key={index}
                className={`transition-all duration-200 hover:scale-102 border-2 ${
                  index === 0 ? 'border-accent/50' : 'border-accent/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl
                      ${index === 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {index < 3 ? (
                        getRankIcon(index)
                      ) : (
                        <span>#{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">
                        {score.playerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Spelled: <span className="font-semibold text-accent">{score.word}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-accent">
                      {score.score}
                    </div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </GameCard>
            ))}
          </div>
        ) : (
          /* Empty State */
          <GameCard className="text-center py-12 border-2 border-accent/20">
            <Trophy className="w-24 h-24 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No scores yet!
            </h2>
            <p className="text-muted-foreground mb-8">
              Be the first to play and get on the leaderboard.
            </p>
            <Button
              onClick={() => navigate('/game')}
              size="lg"
              className="gap-2"
            >
              <Star className="w-5 h-5" />
              Start Playing
            </Button>
          </GameCard>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (confirm('Are you sure you want to clear all scores?')) {
                localStorage.removeItem('mathGameScores');
                setScores([]);
              }
            }}
          >
            Clear Scores
          </Button>
          
          <Button
            size="lg"
            onClick={() => navigate('/game')}
            className="gap-2"
          >
            Play Again
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

export default Leaderboard;