import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Play, Trophy, Home, Info, Gift, LogOut } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <img src={owlMascot} alt="StudyOwl" className="w-24 h-24 mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header with User Info */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img src={owlMascot} alt="StudyOwl" className="w-16 h-16" />
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="text-xl font-bold text-accent">{profile?.name || 'Student'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={signOut}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Math Quest
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer math questions to collect letters and spell words!
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-6">
          {/* Start Game Card */}
          <GameCard className="text-center border-2 border-accent/30">
            <Play className="w-20 h-20 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
              Math Quest
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Answer math questions to collect letters and spell words!
            </p>
            <Button
              onClick={() => navigate('/game')}
              size="lg"
              className="w-full h-16 text-xl gap-3"
            >
              <Play className="w-6 h-6" />
              Start Game
            </Button>
          </GameCard>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Rewards Card */}
            <GameCard className="text-center border-2 border-accent/20">
              <Gift className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-accent mb-3">
                Rewards Store
              </h3>
              <p className="text-muted-foreground mb-6">
                Redeem points for amazing prizes!
              </p>
              <Button
                onClick={() => navigate('/rewards')}
                variant="outline"
                size="lg"
                className="w-full h-14 text-lg gap-2"
              >
                <Gift className="w-5 h-5" />
                View Rewards
              </Button>
            </GameCard>

            {/* Leaderboard Card */}
            <GameCard className="text-center border-2 border-accent/20">
              <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-accent mb-3">
                Leaderboard
              </h3>
              <p className="text-muted-foreground mb-6">
                See how you rank against others!
              </p>
              <Button
                onClick={() => navigate('/leaderboard')}
                variant="outline"
                size="lg"
                className="w-full h-14 text-lg gap-2"
              >
                <Trophy className="w-5 h-5" />
                View Rankings
              </Button>
            </GameCard>
          </div>
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

export default Index;
