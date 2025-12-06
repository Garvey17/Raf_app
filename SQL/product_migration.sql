-- Insert 4 Cement Products from src/app/products/page.jsx
-- Note: IDs are auto-generated as UUIDs. 
-- Images are set to placeholders. valid public URLs (e.g. from Supabase Storage) should be updated later.

INSERT INTO public.products (title, description, price, category, stock, images, is_active)
VALUES 
    ('Dangote 3x', 'Premium Dangote 3x Cement for all construction needs.', 5800, 'Construction', 1000, '{"https://placehold.co/600x400?text=Dangote+3x"}', true),
    
    ('BUA Cement ', 'High-quality BUA Cement, strong and durable.', 5700, 'Construction', 1000, '{"https://placehold.co/600x400?text=BUA+Cement"}', true),
    
    ('Mangal', 'Mangal Cement for general purpose construction.', 950, 'Construction', 1000, '{"https://placehold.co/600x400?text=Mangal"}', true),
    
    ('Blockmaster', 'Dangote Blockmaster, specially formulated for block making.', 630, 'Construction', 1000, '{"https://placehold.co/600x400?text=Blockmaster"}', true);
