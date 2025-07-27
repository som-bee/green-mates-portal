import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-background`}>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#3D8D7A', // Using your primary color
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      <div className="flex min-h-screen">
        {/* Left Panel - Using Theme Colors */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative items-center justify-center p-12 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          <div className="relative z-10 text-white space-y-8 max-w-lg">
            {/* Logo and Title */}
             <Link href='/'>
             
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 p-2">
                <Image
                  src="/logo.png"
                  alt="Tarakeswar Green Mates Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                  Tarakeswar Green Mates
                </h1>
                <p className="text-lg opacity-80">Member & Admin Portal</p>
              </div>
            </div>
            </Link>

            {/* Divider */}
            <div className="w-1/4 h-px bg-white/30"></div>

            {/* Featured Quote / Testimonial */}
            <div className="bg-black/20 p-8 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
              <Quote className="text-white/50 mb-4" size={32} />
              <blockquote className="text-xl italic leading-relaxed opacity-90">
                &quot;The greatest threat to our planet is the belief that someone else will save it. We are the ones we&apos;ve been waiting for.&quot;
              </blockquote>
              <p className="text-right mt-4 font-semibold opacity-70">— Robert Swan, OBE</p>
            </div>

            {/* Organization Details */}
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Registered NGO since 2012</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>124+ Active Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Environmental Conservation • Wildlife Protection • Community Welfare</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
