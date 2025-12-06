"use client";

import React from 'react';
import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Toggle from './Toggle';

import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useRef } from 'react';

function Header() {
  const { data: session, status } = useSession();
  const { cart, syncCart, fetchCart } = useCartStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && !hasSynced.current) {
      if (cart.length > 0) {
        syncCart(cart);
      } else {
        fetchCart();
      }
      hasSynced.current = true;
    }
  }, [status, cart, syncCart, fetchCart]);
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '#products' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SolidBase</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Toggle />
          <Button variant="default" size="sm" className="gap-2">
            <Phone className="w-4 h-4" />
            <span>Get Quote</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <Toggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button className="w-full gap-2 mt-4">
                  <Phone className="w-4 h-4" />
                  <span>Get Quote</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;