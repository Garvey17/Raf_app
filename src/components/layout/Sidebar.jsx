"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logo } from "@/Assets/assets";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    CreditCard,
    Truck,
    Package,
    UserCog,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Dispatch", href: "/admin/dispatch", icon: Truck },
    { name: "Deliveries", href: "/admin/deliveries", icon: Package },
    { name: "Drivers", href: "/admin/drivers", icon: Truck },
    { name: "Staff", href: "/admin/staff", icon: UserCog },
];

export default function Sidebar({ className, isMobile = false, onClose }) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            isMobile
                ? "flex flex-col w-full h-full bg-card border-r border-border"
                : "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border",
            className
        )}>
            {/* Logo */}
            <div className="flex items-center justify-center h-24 px-6 py-4 border-b border-border">
                <div className="w-20 h-20 relative">
                    <Image src={logo} width={120} alt="Logo" className="drop-shadow-sm" />
                </div>
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="lg:hidden ml-auto absolute right-4 top-4"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={isMobile ? onClose : undefined}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">AJ</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Adebayo Johnson</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
