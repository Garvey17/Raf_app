"use client";

import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header({ title, onMenuClick }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex items-center gap-4 h-16 px-4 lg:px-6">
                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Page title */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>

                {/* Search */}
                <div className="hidden md:flex items-center flex-1 max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Theme Toggle */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <Badge
                        variant="danger"
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                    >
                        3
                    </Badge>
                </Button>

                {/* User avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-medium">AJ</span>
                </div>
            </div>
        </header>
    );
}
