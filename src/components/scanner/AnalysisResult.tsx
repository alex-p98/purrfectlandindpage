import { PawRating } from "./PawRating";

interface AnalysisResultProps {
  score: number;
  explanation: string;
}

export const AnalysisResult = ({ score, explanation }: AnalysisResultProps) => {
  return (
    <div className="p-4 bg-muted rounded-lg space-y-4">
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium">Health Score:</span>
        <PawRating score={score} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        {explanation}
      </p>
    </div>
  );
};