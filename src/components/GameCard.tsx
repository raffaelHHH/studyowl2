import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "purple" | "success";
}

const GameCard = ({ children, className, variant = "primary" }: GameCardProps) => {
  const variantStyles = {
    primary: "bg-card border-primary/20 shadow-primary/10",
    secondary: "bg-secondary/20 border-secondary/30 shadow-secondary/10", 
    accent: "bg-accent/20 border-accent/30 shadow-accent/10",
    purple: "bg-purple/20 border-purple/30 shadow-purple/10",
    success: "bg-success/20 border-success/30 shadow-success/10"
  };

  return (
    <div className={cn(
      "rounded-3xl border-2 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:shadow-2xl hover:scale-102",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default GameCard;