// src/components/Footer.tsx
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-secondary mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white">🌱</span>
              </div>
              <span className="font-serif font-bold text-primary">TGM Portal</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Empowering environmental conservation and community welfare since 2012.
            </p>
            <p className="text-slate-500 text-xs">
              Reg No: SO205630 (Societies Registration Act 1961)
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-primary transition-colors">Programs</Link></li>
              <li><Link href="/impact" className="hover:text-primary transition-colors">Our Impact</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Portal Access</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-primary transition-colors">Member Login</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Join Us</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:tgreenmates@gmail.com" className="hover:text-primary transition-colors">
                  tgreenmates@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary" />
                <a href="tel:+919749660361" className="hover:text-primary transition-colors">
                  +91 97496 60361
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span>Tarakeswar, Hooghly, WB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe size={16} className="text-primary" />
                <a href="http://www.greenmates.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  www.greenmates.org
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Tarakeswar Green Mates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
