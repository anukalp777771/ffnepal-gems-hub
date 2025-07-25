import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Diamond, Sparkles, Users, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import appLogo from "@/assets/app-logo.png";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="FF TopUp Nepal" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">FF TopUp Nepal</h1>
              <p className="text-sm text-muted-foreground">Premium Diamond Service</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-[400px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Get <span className="text-primary">Diamonds</span> Instantly
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Fast, reliable, and secure Free Fire diamond top-up service for Nepal
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="topup" size="xl">
                  <Link to="/topup">
                    <Diamond className="w-5 h-5" />
                    Top-Up Now
                  </Link>
                </Button>
                <Button asChild variant="gaming" size="xl">
                  <Link to="/offers">
                    <Crown className="w-5 h-5" />
                    Special Offers
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-gradient-card border-primary/30 hover:border-primary/50 transition-all duration-300">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-card border-secondary/30 hover:border-secondary/50 transition-all duration-300">
              <Diamond className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">1M+</div>
              <div className="text-sm text-muted-foreground">Diamonds Delivered</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-card border-accent/30 hover:border-accent/50 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Service Available</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-card border-primary/30 hover:border-primary/50 transition-all duration-300">
              <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">5 Min</div>
              <div className="text-sm text-muted-foreground">Delivery Time</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Service
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the best diamond packages and special offers for Free Fire Nepal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center bg-gradient-card border-primary/50 hover:border-primary hover:shadow-gaming transition-all duration-300 group">
              <Diamond className="w-16 h-16 text-primary mx-auto mb-6 group-hover:animate-float" />
              <h4 className="text-xl font-bold text-foreground mb-4">Diamond Top-Up</h4>
              <p className="text-muted-foreground mb-6">
                Choose from 20+ diamond packages with competitive rates
              </p>
              <Button asChild variant="gaming" size="lg" className="w-full">
                <Link to="/topup">Buy Diamonds</Link>
              </Button>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-accent/50 hover:border-accent hover:shadow-neon transition-all duration-300 group">
              <Crown className="w-16 h-16 text-accent mx-auto mb-6 group-hover:animate-float" />
              <h4 className="text-xl font-bold text-foreground mb-4">Special Offers</h4>
              <p className="text-muted-foreground mb-6">
                Weekly & Monthly passes at discounted prices
              </p>
              <Button asChild variant="topup" size="lg" className="w-full">
                <Link to="/offers">View Offers</Link>
              </Button>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-secondary/50 hover:border-secondary hover:shadow-secondary transition-all duration-300 group">
              <MessageCircle className="w-16 h-16 text-secondary mx-auto mb-6 group-hover:animate-float" />
              <h4 className="text-xl font-bold text-foreground mb-4">Support</h4>
              <p className="text-muted-foreground mb-6">
                24/7 customer support via WhatsApp
              </p>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <a href="https://wa.me/9827868024" target="_blank" rel="noopener noreferrer">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src={appLogo} alt="FF TopUp Nepal" className="h-8 w-auto" />
              <span className="text-lg font-semibold text-foreground">FF TopUp Nepal</span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <a href="https://wa.me/9827868024" target="_blank" rel="noopener noreferrer">
                  WhatsApp Support
                </a>
              </Button>
              <div className="text-sm text-muted-foreground">
                © 2024 FF TopUp Nepal. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;