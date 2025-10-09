import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { ArrowLeft, Gift, Coffee, Ticket, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple/10 to-accent/20 p-4">
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
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent mb-4">
            Rewards Store
          </h1>
          <div className="flex items-center justify-center gap-2 bg-card px-6 py-3 rounded-3xl shadow-xl inline-flex">
            <Star className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold text-primary">{userPoints} points</span>
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
                variant={canAfford ? "primary" : "secondary"}
                className="text-center"
              >
                <Icon className={`w-16 h-16 mx-auto mb-4 ${canAfford ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-bold text-lg">{reward.cost} points</span>
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

        <GameCard className="text-center">
          <p className="text-muted-foreground">
            🎯 Keep playing to earn more points and unlock amazing rewards!
          </p>
        </GameCard>
      </div>
    </div>
  );
};

export default Rewards;
