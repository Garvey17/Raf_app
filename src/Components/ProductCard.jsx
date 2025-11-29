import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
// import { Badge } from './ui/badge'; // Assuming Badge component exists or I might need to use standard div if not

const ProductCard = ({ product }) => {
    const { addToCart } = useCartStore();
    const { status } = useSession();

    const handleAddToCart = () => {
        addToCart({
            ...product,
            _id: product.id // Ensure _id is present for store logic
        }, status === 'authenticated');
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border bg-card">
            <div className="relative h-48 w-full bg-muted flex items-center justify-center p-4">
                {/* Placeholder for image if not available or using Next/Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                    />
                </div>
                {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded">
                        Out of Stock
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-primary font-medium mb-1">{product.category}</p>
                        <CardTitle className="text-lg font-bold line-clamp-2">{product.name}</CardTitle>
                    </div>
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                        {product.weight}
                    </span>
                </div>
                <ul className="space-y-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-primary mr-1" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button className="w-full gap-2" disabled={!product.inStock} onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? 'Add to Quote' : 'Unavailable'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
