import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const RecentScans = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Scans
      </h2>
      <div className="space-y-3">
        <Card className="p-6 bg-accent/20">
          <p className="text-sm font-medium">No recent scans</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your scanned ingredients will appear here
          </p>
        </Card>
      </div>
    </div>
  );
};