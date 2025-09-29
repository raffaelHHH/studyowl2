import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Play, Trophy, BookOpen, Calculator, Star, Camera, Ruler } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 p-4">
      <div className="container mx-auto max-w-6xl py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Calculator className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-purple bg-clip-text text-transparent mb-6">
              Math Adventure
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Learn math while collecting letters to spell amazing words! 
              Answer questions correctly and become a math champion! 🏆
            </p>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Start Game */}
          <GameCard variant="primary" className="text-center hover:scale-105 transition-transform">
            <Play className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-primary mb-4">START</h2>
            <p className="text-muted-foreground mb-6">
              Begin your math adventure! Answer questions and collect letters.
            </p>
            <Button 
              onClick={() => navigate('/game')}
              size="lg"
              variant="default"
              className="w-full gap-2"
            >
              <Star className="w-5 h-5" />
              Start Playing
            </Button>
          </GameCard>

          {/* Leaderboard */}
          <GameCard variant="secondary" className="text-center hover:scale-105 transition-transform">
            <Trophy className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-secondary mb-4">RANKING</h2>
            <p className="text-muted-foreground mb-6">
              See who the top math champions are! Check your ranking and scores.
            </p>
            <Button 
              onClick={() => navigate('/leaderboard')}
              size="lg"
              variant="secondary"
              className="w-full gap-2"
            >
              <Trophy className="w-5 h-5" />
              View Rankings
            </Button>
          </GameCard>

          {/* AR Measurement Game */}
          <GameCard variant="purple" className="text-center hover:scale-105 transition-transform">
            <Camera className="w-16 h-16 text-purple mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-purple mb-4">AR MEASURE</h2>
            <p className="text-muted-foreground mb-6">
              Use your camera to measure real objects and solve geometry puzzles!
            </p>
            <Button 
              onClick={() => navigate('/measurement-game')}
              size="lg"
              variant="purple"
              className="w-full gap-2"
            >
              <Ruler className="w-5 h-5" />
              Start Measuring
            </Button>
          </GameCard>

          {/* Rules */}
          <GameCard variant="accent" className="text-center hover:scale-105 transition-transform">
            <BookOpen className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-accent mb-4">RULES</h2>
            <p className="text-muted-foreground mb-6">
              Learn how to play and discover tips to become the best math player!
            </p>
            <Button 
              onClick={() => navigate('/rules')}
              size="lg"
              variant="accent"
              className="w-full gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Read Rules
            </Button>
          </GameCard>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <GameCard variant="purple" className="text-center">
            <h3 className="text-2xl font-bold text-purple mb-4">🎯 Fun Learning</h3>
            <p className="text-muted-foreground">
              Answer math questions to collect letters and spell words. Learning has never been this exciting!
            </p>
          </GameCard>
          
          <GameCard className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">🏆 Compete & Win</h3>
            <p className="text-muted-foreground">
              Earn points for every correct answer and climb the leaderboard to become the ultimate math champion!
            </p>
          </GameCard>
        </div>
      </div>
    </div>
  );
};

export default Index;
