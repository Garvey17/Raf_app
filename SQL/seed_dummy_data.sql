-- Seed Data for Dashboard Analytics
-- This script inserts sample orders to populate the dashboard metrics.
-- It attempts to link to the first existing user in public.profiles.

WITH first_user AS (
    SELECT id FROM public.profiles LIMIT 1
)
INSERT INTO public.orders (
    order_number, 
    user_id, 
    customer_name, 
    customer_phone, 
    address, 
    delivery_date, 
    status, 
    total_amount, 
    items, 
    created_at
)
SELECT 
    'ORD-TEST-' || to_char(datum, 'YYYYMMDD') || '-' || row_number() OVER (),
    (SELECT id FROM first_user),
    'Test Customer ' || row_number() OVER (),
    '08012345678',
    '123 Test St, Lagos',
    datum + INTERVAL '3 days',
    CASE 
        WHEN row_number() OVER () % 5 = 0 THEN 'pending'
        WHEN row_number() OVER () % 5 = 1 THEN 'approved'
        WHEN row_number() OVER () % 5 = 2 THEN 'in_transit'
        WHEN row_number() OVER () % 5 = 3 THEN 'delivered'
        ELSE 'paid'
    END,
    (FLOOR(RANDOM() * 50) + 1) * 5000, -- Random amount between 5k and 250k
    jsonb_build_array(
        jsonb_build_object(
            'productName', 'Dangote Cement 3X',
            'quantity', FLOOR(RANDOM() * 50) + 10,
            'price', 5000
        )
    ),
    datum
FROM generate_series(NOW() - INTERVAL '60 days', NOW(), INTERVAL '2 days') as datum;

-- Verify insertion
SELECT count(*) as orders_created FROM public.orders WHERE order_number LIKE 'ORD-TEST-%';
