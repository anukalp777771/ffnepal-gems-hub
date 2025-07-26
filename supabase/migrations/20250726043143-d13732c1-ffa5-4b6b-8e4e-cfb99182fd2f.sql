-- Fix security warnings by updating functions with proper search_path

-- Update the timestamp function with security definer and set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the user creation function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Add RLS policy for the FF TOPUP HUB table that was missing policies
ALTER TABLE "FF TOPUP HUB" ENABLE ROW LEVEL SECURITY;

-- Add a basic policy for the FF TOPUP HUB table (adjust as needed)
CREATE POLICY "Allow authenticated users to view FF TOPUP HUB" 
ON "FF TOPUP HUB" 
FOR SELECT 
TO authenticated
USING (true);