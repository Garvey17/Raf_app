-- Refactor Schema for Simplified Delivery Flow

-- 1. Drop complex tables
DROP TABLE IF EXISTS public.deliveries;
DROP TABLE IF EXISTS public.dispatches;

-- 2. Update Orders Status Check Constraint
-- Postgres doesn't allow easy modification of check constraints, so we drop and re-add.
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'approved', 'paid', 'in_transit', 'delivered', 'cancelled'));

-- 3. Add comment or ensuring column exists (already check is enough)
COMMENT ON COLUMN public.orders.status IS 'Order logic: pending -> approved -> paid -> in_transit -> delivered';
