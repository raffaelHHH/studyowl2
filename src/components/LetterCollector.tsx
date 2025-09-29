interface LetterCollectorProps {
  collectedLetters: string[];
  targetWord: string;
  className?: string;
}

const LetterCollector = ({ collectedLetters, targetWord, className }: LetterCollectorProps) => {
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {targetWord.split('').map((letter, index) => {
        const isCollected = collectedLetters.includes(letter.toUpperCase());
        return (
          <div
            key={index}
            className={`
              w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold
              transition-all duration-300 transform
              ${isCollected 
                ? 'bg-success text-success-foreground border-success shadow-lg scale-110' 
                : 'bg-card border-muted-foreground/30 text-muted-foreground'
              }
            `}
          >
            {isCollected ? letter.toUpperCase() : '?'}
          </div>
        );
      })}
    </div>
  );
};

export default LetterCollector;