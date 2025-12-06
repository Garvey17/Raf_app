-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROFILES (instead of USERS) ====================
-- Linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT, -- Copied from auth.users for convenience, but auth.users is source of truth
    name TEXT NOT NULL,
    phone TEXT,
    location JSONB DEFAULT '{}'::jsonb,
    image TEXT,
    verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified')) DEFAULT 'unverified',
    last_purchase_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, location)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->'location', '{}'::jsonb)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==================== PRODUCTS ====================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PAYMENTS ====================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number TEXT UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Changed from users to profiles
    customer_name TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    verified_by TEXT, 
    verified_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ORDERS ====================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Changed from users to profiles
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb, 
    total_amount NUMERIC DEFAULT 0 CHECK (total_amount >= 0),
    status TEXT CHECK (status IN ('pending', 'approved', 'paid', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    address TEXT NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    instructions TEXT,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add order_id to payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;

-- ==================== CART ====================
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE, -- Changed from users to profiles
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== STAFF ====================
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('admin', 'transport_officer', 'warehouse_manager', 'sales_representative', 'customer_service', 'accountant', 'driver', 'other')) NOT NULL,
    department TEXT CHECK (department IN ('administration', 'logistics', 'warehouse', 'sales', 'customer_service', 'finance', 'operations', 'other')) NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    date_joined TIMESTAMPTZ DEFAULT NOW(),
    password TEXT,
    last_login TIMESTAMPTZ,
    permissions TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DRIVERS ====================
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'driver',
    department TEXT DEFAULT 'logistics',
    vehicle_assigned TEXT,
    total_deliveries INTEGER DEFAULT 0,
    date_joined TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN ('active', 'inactive', 'on_leave', 'suspended')) DEFAULT 'active',
    license_number TEXT,
    license_expiry TIMESTAMPTZ,
    password TEXT,
    current_location TEXT,
    last_delivery_date TIMESTAMPTZ,
    rating NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DISPATCHES ====================
CREATE TABLE IF NOT EXISTS public.dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    product_quantity INTEGER NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    destination TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    dispatch_status TEXT CHECK (dispatch_status IN ('ready_for_dispatch', 'dispatched', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'ready_for_dispatch',
    driver_id TEXT, 
    driver_phone TEXT,
    vehicle_number TEXT,
    assigned_by TEXT, 
    assigned_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DELIVERIES ====================
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_number TEXT UNIQUE,
    order_id UUID UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    dispatch_id UUID REFERENCES public.dispatches(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    drop_location TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    driver TEXT NOT NULL, 
    driver_phone TEXT NOT NULL,
    truck_number TEXT NOT NULL,
    dispatched_at TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    received_by TEXT,
    delivery_status TEXT CHECK (delivery_status IN ('in_transit', 'delivered', 'failed', 'returned')) DEFAULT 'in_transit',
    delivery_notes TEXT,
    proof_of_delivery TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Changed from users to profiles
    type TEXT CHECK (type IN ('success', 'info', 'warning', 'alert')) DEFAULT 'info',
    category TEXT CHECK (category IN ('order', 'shipment', 'payment', 'stock', 'system', 'company')) DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    icon TEXT,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
-- idx_users_email removed as it's on profiles now, and email might not be unique in profiles if synced imperfectly, but logically should be. 
-- However, profiles.id is PK so indexed by default.
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_drivers_email ON public.drivers(email);
CREATE INDEX IF NOT EXISTS idx_dispatches_status ON public.dispatches(dispatch_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE read = FALSE;
