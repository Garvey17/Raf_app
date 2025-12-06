-- Create a comprehensive view for Dashboard Analytics
-- This view aggregates data into a JSON structure matching the frontend requirements

DROP VIEW IF EXISTS public.dashboard_analytics_view;

CREATE OR REPLACE VIEW public.dashboard_analytics_view AS
WITH 
-- 1. Date Ranges
date_ranges AS (
    SELECT 
        NOW() as current_date,
        NOW() - INTERVAL '30 days' as start_30_days,
        NOW() - INTERVAL '60 days' as start_60_days,
        DATE_TRUNC('week', NOW()) as start_of_week
),

-- 2. Revenue Calculations (Current 30 days vs Previous 30 days)
revenue_metrics AS (
    SELECT 
        COALESCE(SUM(CASE 
            WHEN created_at >= (SELECT start_30_days FROM date_ranges) 
            AND status IN ('paid', 'delivered') 
            THEN total_amount ELSE 0 END), 0) as current_revenue,
        COALESCE(SUM(CASE 
            WHEN created_at >= (SELECT start_60_days FROM date_ranges) 
            AND created_at < (SELECT start_30_days FROM date_ranges) 
            AND status IN ('paid', 'delivered') 
            THEN total_amount ELSE 0 END), 0) as prev_revenue
    FROM public.orders
),

-- 3. Active Orders Count
active_orders_metrics AS (
    SELECT COUNT(*) as active_count
    FROM public.orders
    WHERE status IN ('pending', 'approved', 'in_transit', 'ready_for_dispatch')
),

-- 4. Volume Metric (Sum of quantities from JSONB items for this week)
-- Assuming items is like '[{"quantity": 5}, {"quantity": 2}]'
volume_metrics AS (
    SELECT COALESCE(SUM((item->>'quantity')::numeric), 0) as weekly_volume
    FROM public.orders,
         jsonb_array_elements(items) as item
    WHERE created_at >= (SELECT start_of_week FROM date_ranges)
    AND status != 'cancelled'
),

-- 5. Sales Performance (Daily revenue for last 30 days)
daily_sales AS (
    SELECT 
        to_char(date_trunc('day', d)::date, 'YYYY-MM-DD') as day_str,
        COALESCE(SUM(o.total_amount), 0) as day_revenue
    FROM generate_series(
        (SELECT start_30_days FROM date_ranges), 
        (SELECT current_date FROM date_ranges), 
        '1 day'::interval
    ) d
    LEFT JOIN public.orders o ON date_trunc('day', o.created_at) = date_trunc('day', d) 
        AND o.status IN ('paid', 'delivered')
    GROUP BY 1
    ORDER BY 1
)

SELECT 
    -- Revenue Object
    jsonb_build_object(
        'current', rm.current_revenue,
        'percentageChange', CASE 
            WHEN rm.prev_revenue = 0 THEN 0 
            ELSE ROUND(((rm.current_revenue - rm.prev_revenue) / rm.prev_revenue) * 100, 1) 
        END
    ) as revenue,
    
    -- Orders Object
    jsonb_build_object(
        'active', aom.active_count
    ) as orders,
    
    -- Volume Object
    jsonb_build_object(
        'current', vm.weekly_volume
    ) as volume,
    
    -- Sales Performance Array
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'date', ds.day_str,
                'revenue', ds.day_revenue
            )
        ) FROM daily_sales ds
    ) as sales_performance

FROM revenue_metrics rm
CROSS JOIN active_orders_metrics aom
CROSS JOIN volume_metrics vm;

-- Comment for documentation
COMMENT ON VIEW public.dashboard_analytics_view IS 'Aggregates dashboard metrics (Revenue, Active Orders, Volume, Sales Trend) into a single JSON-ready row';
