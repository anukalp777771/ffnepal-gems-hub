import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Upload, Smartphone, CreditCard, Wallet, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { name: "eSewa", number: "982-7868024", icon: Wallet },
  { name: "Khalti", number: "982-7633530", icon: CreditCard },
  { name: "IME Pay", number: "9817615513", icon: Smartphone },
];

interface Offer {
  id: string;
  name: string;
  price: number;
  original_price: number;
  duration: string;
  features: string[];
  badge: string;
  popular: boolean;
}

const PurchasePage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    uid: "",
    ign: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) return;
      
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('id', offerId)
          .eq('active', true)
          .single();
          
        if (error) throw error;
        
        // Parse features from JSON to string array
        const offerData = {
          ...data,
          features: Array.isArray(data.features) ? data.features as string[] : []
        };
        
        setOffer(offerData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load offer details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffer();
  }, [offerId, toast]);

  const handleSubmitOrder = async () => {
    if (!offer || !formData.uid || !formData.ign || !paymentProof || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and upload payment proof",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload payment proof to storage
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof);
        
      if (uploadError) {
        throw new Error('Failed to upload payment proof');
      }
      
      // Create offer order in database
      const { error: orderError } = await supabase
        .from('offer_orders')
        .insert({
          user_id: user.id,
          offer_id: offer.id,
          uid: formData.uid,
          ign: formData.ign,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId || null,
          payment_proof_url: fileName,
          notes: formData.notes || null,
        });
        
      if (orderError) {
        throw new Error('Failed to create order');
      }
      
      toast({
        title: "Order Submitted Successfully!",
        description: "Your pass will be activated within 5 minutes.",
      });
      
      // Reset form
      setFormData({ uid: "", ign: "", paymentMethod: "", transactionId: "", notes: "" });
      setPaymentProof(null);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Offer Not Found</h1>
          <p className="text-muted-foreground mb-6">The offer you're looking for doesn't exist or is no longer available.</p>
          <Button asChild variant="gaming">
            <Link to="/offers">Browse All Offers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/offers">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Purchase {offer.name}</h1>
              <p className="text-sm text-muted-foreground">Complete your order</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Offer Details */}
          <div>
            <Card className="p-6 bg-gradient-card border-primary/50 h-fit">
              <div className="text-center mb-6">
                <Badge className={`mb-4 ${offer.popular ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                  {offer.badge}
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-2">{offer.name}</h2>
                <p className="text-muted-foreground mb-4">{offer.duration}</p>
                
                <div className="price-section mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">Rs {offer.price}</span>
                    {offer.original_price > offer.price && (
                      <span className="text-xl text-muted-foreground line-through">
                        Rs {offer.original_price}
                      </span>
                    )}
                  </div>
                  {offer.original_price > offer.price && (
                    <div className="text-lg text-accent font-semibold">
                      Save Rs {offer.original_price - offer.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground mb-4">What's Included:</h3>
                {offer.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Form */}
          <div>
            <Card className="p-6 bg-gradient-card border-primary/50">
              <h3 className="text-xl font-bold text-foreground mb-6">Order Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="uid" className="text-foreground">
                    Free Fire UID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="uid"
                    placeholder="Enter your Free Fire UID"
                    value={formData.uid}
                    onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="ign" className="text-foreground">
                    In-Game Name (IGN) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ign"
                    placeholder="Enter your in-game name"
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-foreground mb-3 block">
                    Payment Method <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.name}
                        className={`p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === method.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.name })}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-foreground">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.number}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="transactionId" className="text-foreground">
                    Transaction ID (Optional)
                  </Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID if available"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentProof" className="text-foreground">
                    Payment Screenshot <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="paymentProof"
                      accept="image/*"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Label
                      htmlFor="paymentProof"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {paymentProof ? paymentProof.name : "Upload payment screenshot"}
                      </span>
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-foreground">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  variant="topup"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Processing..." : `Purchase ${offer.name} - Rs ${offer.price}`}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Pass will be activated instantly after payment confirmation
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;