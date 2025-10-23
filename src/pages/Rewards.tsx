import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { ArrowLeft, Gift, Coffee, Ticket, Star, Home, Trophy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import owlMascot from "@/assets/owl-mascot.png";

interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: typeof Gift;
  description: string;
}

const rewards: Reward[] = [
  { id: "drink", name: "Drink Voucher", cost: 100, icon: Coffee, description: "Redeem a refreshing drink!" },
  { id: "voucher", name: "$10 Voucher", cost: 150, icon: Ticket, description: "Shopping voucher worth $10" },
  { id: "gift", name: "Special Gift", cost: 200, icon: Gift, description: "Mystery surprise gift!" },
];

const Rewards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(() => {
    const scores = JSON.parse(localStorage.getItem('mathGameScores') || '[]');
    return scores.reduce((total: number, score: any) => total + score.score, 0);
  });

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.cost) {
      setUserPoints(userPoints - reward.cost);
      toast({
        title: "Reward Redeemed! 🎉",
        description: `You got ${reward.name}!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Not enough points 😢",
        description: `You need ${reward.cost - userPoints} more points!`,
        variant: "destructive",
      });
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
        </div>

        <div className="text-center mb-12">
          <Gift className="w-20 h-20 text-accent mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Rewards Store
          </h1>
          <div className="flex items-center justify-center gap-2 bg-card border-2 border-accent/30 px-6 py-3 rounded-3xl shadow-xl inline-flex">
            <Star className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold text-accent">{userPoints} points</span>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = userPoints >= reward.cost;
            
            return (
              <GameCard 
                key={reward.id} 
                className={`text-center border-2 ${canAfford ? 'border-accent/50' : 'border-accent/20'}`}
              >
                <Icon className={`w-16 h-16 mx-auto mb-4 ${canAfford ? 'text-accent' : 'text-muted-foreground'}`} />
                <h3 className="text-xl font-bold text-foreground mb-2">{reward.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-bold text-lg text-accent">{reward.cost} points</span>
                </div>
                <Button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  variant={canAfford ? "default" : "outline"}
                  className="w-full"
                >
                  {canAfford ? "Redeem" : "Locked"}
                </Button>
              </GameCard>
            );
          })}
        </div>

        <GameCard className="text-center border-2 border-accent/20">
          <p className="text-muted-foreground">
            🎯 Keep playing to earn more points and unlock amazing rewards!
          </p>
          <Button
            onClick={() => navigate('/game')}
            size="lg"
            className="mt-4 gap-2"
          >
            Play Now
          </Button>
        </GameCard>
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

export default Rewards;
