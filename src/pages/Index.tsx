import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Trophy, Home, Info } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-24">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-accent mb-12 text-center">
          Math Quest
        </h1>

        {/* Owl Mascot */}
        <div className="mb-16">
          <img 
            src={owlMascot} 
            alt="StudyOwl Mascot" 
            className="w-48 h-48 md:w-64 md:h-64 mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Main Buttons */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={() => navigate('/game')}
            className="w-full h-16 text-2xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl shadow-lg"
          >
            Start Game
          </Button>
          
          <Button
            onClick={() => navigate('/leaderboard')}
            variant="outline"
            className="w-full h-16 text-2xl font-bold border-2 border-accent text-accent bg-transparent hover:bg-accent/10 rounded-2xl"
          >
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
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
