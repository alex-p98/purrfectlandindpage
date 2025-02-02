import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentOption {
  price: number;
  scans: number;
  priceId: string;
}

const paymentOptions: PaymentOption[] = [
  { price: 5, scans: 1, priceId: 'price_1Qo8TUCOvOG1UFSmRbo38vLP' },
  { price: 10, scans: 5, priceId: 'price_1Qo8TGCOvOG1UFSm5GlRMQju' },
  { price: 15, scans: 20, priceId: 'price_1Qo8TzCOvOG1UFSm5uR6YpH8' },
];

export const PaymentOptions = () => {
  const { toast } = useToast();

  const handlePayment = async (option: PaymentOption) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-scan-payment', {
        body: { priceId: option.priceId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Get More Scans</h3>
        <p className="text-sm text-muted-foreground">
          Choose a package to continue scanning ingredients
        </p>
      </div>

      <div className="grid gap-4">
        {paymentOptions.map((option) => (
          <Card 
            key={option.priceId}
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePayment(option)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{option.scans} Scans</h4>
                <p className="text-sm text-muted-foreground">
                  ${option.price.toFixed(2)}
                </p>
              </div>
              <Button>Buy Now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};