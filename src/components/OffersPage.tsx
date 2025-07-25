import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Calendar, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const specialOffers = [
  {
    id: "weekly-lite",
    name: "Weekly Lite",
    price: 80,
    originalPrice: 100,
    duration: "7 Days",
    features: [
      "Access to exclusive events",
      "Daily login rewards",
      "Special character skins",
      "Priority matchmaking"
    ],
    badge: "Save 20%",
    popular: false
  },
  {
    id: "weekly",
    name: "Weekly Pass",
    price: 220,
    originalPrice: 280,
    duration: "7 Days",
    features: [
      "All Weekly Lite benefits",
      "Premium character unlocks",
      "Weapon skin collection",
      "Double XP boost",
      "Exclusive emotes"
    ],
    badge: "Most Popular",
    popular: true
  },
  {
    id: "monthly",
    name: "Monthly Pass",
    price: 1050,
    originalPrice: 1400,
    duration: "30 Days",
    features: [
      "All Weekly benefits",
      "Elite character collection",
      "Premium weapon skins",
      "Unlimited revival cards",
      "VIP customer support",
      "Monthly exclusive rewards"
    ],
    badge: "Best Value",
    popular: false
  }
];

const OffersPage = () => {
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
            <Crown className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Special Offers</h1>
              <p className="text-sm text-muted-foreground">Limited time deals</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Exclusive <span className="text-accent">Weekly & Monthly</span> Passes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get premium Free Fire experiences with our special subscription packages. 
            Unlock exclusive content and save money!
          </p>
        </section>

        {/* Offers Grid */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <Card
                key={offer.id}
                className={`relative p-6 bg-gradient-card border-2 transition-all duration-300 hover:scale-105 ${
                  offer.popular
                    ? "border-accent shadow-neon ring-2 ring-accent/30"
                    : "border-border hover:border-primary/50 hover:shadow-gaming"
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    className={`px-3 py-1 ${
                      offer.popular
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {offer.badge}
                  </Badge>
                </div>

                {/* Header */}
                <div className="text-center mb-6 pt-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{offer.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{offer.duration}</span>
                  </div>
                  
                  <div className="price-section">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">Rs {offer.price}</span>
                      {offer.originalPrice > offer.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          Rs {offer.originalPrice}
                        </span>
                      )}
                    </div>
                    {offer.originalPrice > offer.price && (
                      <div className="text-sm text-accent font-semibold">
                        Save Rs {offer.originalPrice - offer.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {offer.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  variant={offer.popular ? "topup" : "gaming"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to={`/purchase/${offer.id}`}>
                    <Crown className="w-5 h-5 mr-2" />
                    Get {offer.name}
                  </Link>
                </Button>

                {/* Processing Time */}
                <div className="text-center mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Instant activation
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-card border-primary/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Why Choose Our Passes?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Exclusive Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Access premium skins, characters, and weapons not available elsewhere
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Instant Activation</h4>
                  <p className="text-sm text-muted-foreground">
                    Your pass activates immediately after payment confirmation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Best Value</h4>
                  <p className="text-sm text-muted-foreground">
                    Save up to 25% compared to buying items individually
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Need Regular Diamonds Too?
          </h3>
          <Button asChild variant="gaming" size="lg">
            <Link to="/topup">
              Browse Diamond Packages
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default OffersPage;