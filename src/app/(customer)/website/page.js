import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ServiceCard from "@/components/ServiceCard";
import { cementProducts, services } from "@/data/cementData";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// Placeholder image for hero if needed, or use a colored background
// import heroBg from "@/Assets/hero-bg.jpg"; 

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
                Building Stronger Foundations for <span className="text-primary">Tomorrow</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Premium quality cement and construction materials delivered directly to your site.
                Trusted by top contractors and builders for over 20 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Get a Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Products
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>ISO Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>24/7 Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Best Price Guarantee</span>
                </div>
              </div>
            </div>
          </div>
          {/* Abstract Background Element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-muted">
                {/* Placeholder for About Image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  About Us Image
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose SolidBase?</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  We understand that the quality of your construction depends on the materials you use.
                  That's why we source only the finest cement products that meet rigorous industry standards.
                </p>
                <ul className="space-y-4">
                  {[
                    "Direct sourcing from top manufacturers",
                    "Rigorous quality control testing",
                    "Timely delivery fleet",
                    "Competitive wholesale pricing"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Premium Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our range of high-grade cement tailored for various construction needs,
                from residential homes to industrial infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cementProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">View Full Catalog</Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We go beyond just selling cement. We provide end-to-end solutions to ensure your project runs smoothly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get in touch with our team for a custom quote or expert advice on your construction needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg font-semibold">
                Contact Sales
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg">
                Find a Dealer
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
