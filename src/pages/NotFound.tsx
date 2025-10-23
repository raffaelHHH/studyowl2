import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <img 
          src={owlMascot} 
          alt="StudyOwl" 
          className="w-48 h-48 mx-auto mb-8 opacity-70"
        />
        
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-accent mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Whoops! This page flew away like a wise owl in the night. 🦉
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate('/game')}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Search className="w-5 h-5" />
            Start Playing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
