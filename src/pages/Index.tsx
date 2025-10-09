import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Play, Trophy, BookOpen, Star, Camera, Ruler, Gift } from "lucide-react";
import { InstructionsDialog } from "@/components/InstructionsDialog";
import owlMascot from "@/assets/owl-mascot.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 p-4">
      <div className="container mx-auto max-w-6xl py-12">
        {/* Header with Instructions */}
        <div className="flex justify-end mb-4">
          <InstructionsDialog />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src={owlMascot} 
              alt="StudyOwl Mascot" 
              className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-purple bg-clip-text text-transparent mb-6">
              StudyOwl
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Learn math while collecting letters to spell amazing words! 
              Answer questions correctly and become a math champion! 🏆
            </p>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

          {/* Rewards */}
          <GameCard variant="purple" className="text-center hover:scale-105 transition-transform">
            <Gift className="w-16 h-16 text-purple mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-purple mb-4">REWARDS</h2>
            <p className="text-muted-foreground mb-6">
              Redeem your points for awesome prizes and vouchers!
            </p>
            <Button 
              onClick={() => navigate('/rewards')}
              size="lg"
              variant="purple"
              className="w-full gap-2"
            >
              <Gift className="w-5 h-5" />
              Get Rewards
            </Button>
          </GameCard>
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* AR Measurement Game */}
          <GameCard variant="success" className="text-center hover:scale-105 transition-transform">
            <Camera className="w-16 h-16 text-success mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-success mb-4">AR MEASURE</h2>
            <p className="text-muted-foreground mb-6">
              Use your camera to measure real objects and solve geometry puzzles!
            </p>
            <Button 
              onClick={() => navigate('/measurement-game')}
              size="lg"
              variant="default"
              className="w-full gap-2 bg-success hover:bg-success/90"
            >
              <Ruler className="w-5 h-5" />
              Start Measuring
            </Button>
          </GameCard>

          <GameCard className="text-center flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-primary mb-4">🎯 Track Your Progress</h3>
            <p className="text-muted-foreground">
              Earn points, unlock achievements, and compete with friends to climb the leaderboard!
            </p>
          </GameCard>
        </div>

        {/* Bottom Navigation Hint */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            💡 Tap the <span className="font-semibold">?</span> button to learn how to play
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
