-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

-- Create admin policy using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

-- Also fix the orders and offer_orders policies to use the same pattern
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all offer orders" ON public.offer_orders;
DROP POLICY IF EXISTS "Admins can update all offer orders" ON public.offer_orders;

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view all offer orders" 
ON public.offer_orders 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all offer orders" 
ON public.offer_orders 
FOR UPDATE 
USING (public.is_admin_user(auth.uid()));