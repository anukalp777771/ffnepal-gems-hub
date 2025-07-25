import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Diamond, Upload, Smartphone, CreditCard, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { topUpFormSchema, validateImageFile, sanitizeString } from "@/lib/validations";
import { generateCSRFToken } from "@/lib/security";
import diamondIcon from "@/assets/diamond-icon.png";

const diamondPackages = [
  { price: 100, diamonds: 115, popular: false },
  { price: 200, diamonds: 240, popular: false },
  { price: 300, diamonds: 355, popular: false },
  { price: 410, diamonds: 480, popular: true },
  { price: 520, diamonds: 610, popular: false },
  { price: 600, diamonds: 725, popular: false },
  { price: 710, diamonds: 850, popular: false },
  { price: 820, diamonds: 965, popular: false },
  { price: 910, diamonds: 1090, popular: false },
  { price: 1130, diamonds: 1240, popular: true },
  { price: 1260, diamonds: 1480, popular: false },
  { price: 1400, diamonds: 1595, popular: false },
  { price: 1500, diamonds: 1720, popular: false },
  { price: 1750, diamonds: 1965, popular: false },
  { price: 1830, diamonds: 2090, popular: false },
  { price: 2200, diamonds: 2530, popular: true },
  { price: 4500, diamonds: 5060, popular: false },
  { price: 9000, diamonds: 10120, popular: false },
  { price: 18000, diamonds: 20240, popular: false },
];

const paymentMethods = [
  { name: "eSewa", number: "982-7868024", icon: Wallet },
  { name: "Khalti", number: "982-7633530", icon: CreditCard },
  { name: "IME Pay", number: "9817615513", icon: Smartphone },
];

const TopUpPage = () => {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<typeof diamondPackages[0] | null>(null);
  const [formData, setFormData] = useState({
    uid: "",
    ign: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken] = useState(() => generateCSRFToken());

  const handlePackageSelect = (pkg: typeof diamondPackages[0]) => {
    setSelectedPackage(pkg);
  };

  const handleSubmitOrder = () => {
    // Clear previous errors
    setErrors({});

    // Validate required fields
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a diamond package",
        variant: "destructive",
      });
      return;
    }

    if (!paymentProof) {
      toast({
        title: "Error", 
        description: "Please upload payment proof",
        variant: "destructive",
      });
      return;
    }

    // Validate file
    const fileValidation = validateImageFile(paymentProof);
    if (!fileValidation.valid) {
      toast({
        title: "Invalid File",
        description: fileValidation.error,
        variant: "destructive",
      });
      return;
    }

    // Sanitize and validate form data
    const sanitizedData = {
      uid: sanitizeString(formData.uid),
      ign: sanitizeString(formData.ign),
      paymentMethod: formData.paymentMethod,
      transactionId: sanitizeString(formData.transactionId),
      notes: sanitizeString(formData.notes),
    };

    // Validate with Zod
    const validation = topUpFormSchema.safeParse(sanitizedData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the order to your backend with CSRF token
    const orderData = {
      ...validation.data,
      package: selectedPackage,
      paymentProof: paymentProof,
      csrfToken,
      timestamp: new Date().toISOString(),
    };

    console.log("Secure order submission:", orderData);
    
    toast({
      title: "Order Submitted",
      description: "Your order has been submitted successfully! We will process it within 5 minutes.",
    });
    
    // Reset form
    setSelectedPackage(null);
    setFormData({ uid: "", ign: "", paymentMethod: "", transactionId: "", notes: "" });
    setPaymentProof(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <img src={diamondIcon} alt="Diamond" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Diamond Top-Up</h1>
              <p className="text-sm text-muted-foreground">Choose your package</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Diamond Packages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Diamond Packages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {diamondPackages.map((pkg) => (
              <Card
                key={pkg.price}
                className={`p-4 cursor-pointer transition-all duration-300 bg-gradient-card border-2 hover:scale-105 ${
                  selectedPackage?.price === pkg.price
                    ? "border-primary shadow-gaming"
                    : "border-border hover:border-primary/50"
                } ${pkg.popular ? "ring-2 ring-accent/50" : ""}`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <Badge className="mb-2 bg-accent text-accent-foreground text-xs">
                    Popular
                  </Badge>
                )}
                <div className="text-center">
                  <img src={diamondIcon} alt="Diamond" className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {pkg.diamonds}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Diamonds</div>
                  <div className="text-lg font-semibold text-foreground">
                    Rs {pkg.price}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Order Form */}
        {selectedPackage && (
          <section className="max-w-2xl mx-auto">
            <Card className="p-6 bg-gradient-card border-primary/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <img src={diamondIcon} alt="Diamond" className="h-6 w-6" />
                  <span className="text-lg font-semibold text-primary">
                    {selectedPackage.diamonds} Diamonds
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    - Rs {selectedPackage.price}
                  </span>
                </div>
              </div>

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
                    className={`bg-background border-border ${errors.uid ? 'border-destructive' : ''}`}
                  />
                  {errors.uid && (
                    <p className="text-sm text-destructive mt-1">{errors.uid}</p>
                  )}
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
                    className={`bg-background border-border ${errors.ign ? 'border-destructive' : ''}`}
                  />
                  {errors.ign && (
                    <p className="text-sm text-destructive mt-1">{errors.ign}</p>
                  )}
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
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          const validation = validateImageFile(file);
                          if (validation.valid) {
                            setPaymentProof(file);
                          } else {
                            toast({
                              title: "Invalid File",
                              description: validation.error,
                              variant: "destructive",
                            });
                            e.target.value = '';
                          }
                        } else {
                          setPaymentProof(null);
                        }
                      }}
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
                >
                  <Diamond className="w-5 h-5 mr-2" />
                  Submit Order - Rs {selectedPackage.price}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Orders are processed within 5 minutes during business hours
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
};

export default TopUpPage;