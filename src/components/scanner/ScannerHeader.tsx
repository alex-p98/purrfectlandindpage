import { Badge } from "@/components/ui/badge";

interface ScannerHeaderProps {
  scansLeft: number;
}

export const ScannerHeader = ({ scansLeft }: ScannerHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Free scans remaining this month:
        </p>
        <Badge variant={scansLeft === 0 ? "destructive" : "default"}>
          {scansLeft}/2
        </Badge>
      </div>
    </div>
  );
};