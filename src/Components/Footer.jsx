import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">SolidBase Cement</h3>
                        <p className="text-muted-foreground mb-4">
                            Building the foundation of your dreams with premium quality cement and construction materials.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
                            <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a></li>
                            <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Our Services</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Bulk Delivery</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Quality Testing</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Expert Consultation</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Site Support</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-muted-foreground">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <span>123 Construction Ave, Industrial Zone, City, State 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>info@solidbasecement.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} SolidBase Cement. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
