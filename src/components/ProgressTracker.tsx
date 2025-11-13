import { MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export const ProgressTracker = ({ totalSteps, currentStep, className }: ProgressTrackerProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Checkpoint node */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-success border-success shadow-[0_0_12px_rgba(34,197,94,0.5)]",
                  isCurrent && "bg-accent border-accent shadow-[0_0_16px_rgba(234,179,8,0.6)] animate-pulse",
                  isUpcoming && "bg-muted border-border"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success-foreground" />
                ) : isCurrent ? (
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">{stepNumber}</span>
                )}
              </div>
              
              {/* Step label */}
              <span
                className={cn(
                  "mt-1 text-[10px] sm:text-xs font-medium",
                  isCompleted && "text-success",
                  isCurrent && "text-accent font-bold",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                Q{stepNumber}
              </span>
            </div>

            {/* Connecting line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-4 sm:w-8 h-0.5 mb-5 transition-all duration-300",
                  stepNumber < currentStep ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
