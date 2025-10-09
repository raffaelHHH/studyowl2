import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Home } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 flex items-center justify-center p-4">
      <GameCard className="text-center max-w-2xl">
        <img 
          src={owlMascot} 
          alt="StudyOwl" 
          className="w-32 h-32 mx-auto mb-6 opacity-50"
        />
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">Oops! Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Looks like this page flew away! Let's get you back to learning.
        </p>
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </Button>
      </GameCard>
    </div>
  );
};

export default NotFound;
