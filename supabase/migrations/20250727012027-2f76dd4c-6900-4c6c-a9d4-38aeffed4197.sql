-- Create orders table for diamond top-up orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uid TEXT NOT NULL,
  ign TEXT NOT NULL,
  package_price INTEGER NOT NULL,
  package_diamonds INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  payment_proof_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders access
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create offers table for special packages
CREATE TABLE public.offers (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  features JSONB NOT NULL,
  badge TEXT NOT NULL,
  popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Create policy for offers - everyone can view active offers
CREATE POLICY "Everyone can view active offers" 
ON public.offers 
FOR SELECT 
USING (active = true);

-- Create offers orders table
CREATE TABLE public.offer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id TEXT NOT NULL REFERENCES public.offers(id),
  uid TEXT NOT NULL,
  ign TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  payment_proof_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.offer_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for offer orders
CREATE POLICY "Users can view their own offer orders" 
ON public.offer_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own offer orders" 
ON public.offer_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all offer orders" 
ON public.offer_orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update all offer orders" 
ON public.offer_orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_offer_orders_updated_at
BEFORE UPDATE ON public.offer_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default offers data
INSERT INTO public.offers (id, name, price, original_price, duration, features, badge, popular) VALUES
('weekly-lite', 'Weekly Lite', 80, 100, '7 Days', 
 '["Access to exclusive events", "Daily login rewards", "Special character skins", "Priority matchmaking"]', 
 'Save 20%', false),
('weekly', 'Weekly Pass', 220, 280, '7 Days', 
 '["All Weekly Lite benefits", "Premium character unlocks", "Weapon skin collection", "Double XP boost", "Exclusive emotes"]', 
 'Most Popular', true),
('monthly', 'Monthly Pass', 1050, 1400, '30 Days', 
 '["All Weekly benefits", "Elite character collection", "Premium weapon skins", "Unlimited revival cards", "VIP customer support", "Monthly exclusive rewards"]', 
 'Best Value', false);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);

-- Create policies for payment proof uploads
CREATE POLICY "Users can upload their own payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));