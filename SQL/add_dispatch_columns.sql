-- Add Dispatch Information Columns to Orders Table

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS driver_phone TEXT,
ADD COLUMN IF NOT EXISTS truck_number TEXT,
ADD COLUMN IF NOT EXISTS atc_number TEXT; -- Authority to carry / Manifest number

COMMENT ON COLUMN public.orders.atc_number IS 'Authority to Carry (ATC) or Dispatch Manifest Number';
