-- Function to handle new order notifications
CREATE OR REPLACE FUNCTION public.handle_new_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            category,
            title,
            message,
            metadata
        ) VALUES (
            NEW.user_id,
            'success',
            'order',
            'Order Placed Successfully',
            'Order #' || NEW.order_number || ' has been placed. Status: ' || NEW.status,
            jsonb_build_object('link', '/orders', 'orderId', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new order
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_order_notification();


-- Function to handle order status updates
CREATE OR REPLACE FUNCTION public.handle_order_status_change_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            category,
            title,
            message,
            metadata
        ) VALUES (
            NEW.user_id,
            CASE WHEN NEW.status = 'delivered' THEN 'success' ELSE 'info' END,
            'order',
            'Order Status Updated',
            'Your order #' || NEW.order_number || ' is now ' || NEW.status || '. Click to check details.',
            jsonb_build_object('link', '/orders', 'orderId', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for status update
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_change_notification();
