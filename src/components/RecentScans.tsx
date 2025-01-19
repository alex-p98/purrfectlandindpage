import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ScanEntry {
  id: number;
  image: string;
  timestamp: Date;
  brand: string;
  ingredients: string[];
}

const mockScans: ScanEntry[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    timestamp: new Date(2024, 2, 15, 14, 30),
    brand: "Whiskas",
    ingredients: ["Chicken", "Fish", "Rice"]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    timestamp: new Date(2024, 2, 14, 9, 15),
    brand: "Royal Canin",
    ingredients: ["Salmon", "Sweet Potato", "Vitamins"]
  }
];

export const RecentScans = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Scans
      </h2>
      <div className="space-y-3">
        {mockScans.length > 0 ? (
          mockScans.map((scan) => (
            <Card key={scan.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={scan.image}
                  alt={`Scan for ${scan.brand}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{scan.brand}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(scan.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scan.ingredients.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 bg-accent/20">
            <p className="text-sm font-medium">No recent scans</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your scanned ingredients will appear here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};