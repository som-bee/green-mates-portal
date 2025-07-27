// src/components/Navbar.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mock user data - replace with actual auth context
  const user = null; // Will be replaced with actual user data

  return (
    <nav className="bg-white shadow-sm border-b border-secondary sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🌱</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-primary">
                Tarakeswar Green Mates
              </h1>
              <p className="text-xs text-slate-500">Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/programs" className="text-slate-700 hover:text-primary transition-colors">
              Programs
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-slate-700 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span>John Doe</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-secondary">
                    <Link href="/dashboard" className="block px-4 py-2 text-slate-700 hover:bg-gray-50">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-slate-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <hr className="my-2" />
                    <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-primary hover:text-secondary transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition-colors font-medium"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700 hover:text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-secondary">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-slate-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/programs" className="text-slate-700 hover:text-primary transition-colors">
                Programs
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-primary transition-colors">
                Contact
              </Link>
              <hr className="border-secondary" />
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/dashboard" className="text-slate-700 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-slate-700 hover:text-primary transition-colors">
                    Profile
                  </Link>
                  <button className="text-left text-slate-700 hover:text-primary transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" className="text-primary font-medium">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-full text-center">
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
