import React from 'react';
import { Truck, ClipboardCheck, HardHat, Hammer, Ruler, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const iconMap = {
    Truck: Truck,
    ClipboardCheck: ClipboardCheck,
    HardHat: HardHat,
    Hammer: Hammer,
    Ruler: Ruler,
    ShieldCheck: ShieldCheck
};

const ServiceCard = ({ service }) => {
    const Icon = iconMap[service.icon] || ShieldCheck;

    return (
        <Card className="hover:shadow-md transition-shadow duration-300 border-border bg-card h-full">
            <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
