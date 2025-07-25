// src/app/(auth)/layout.tsx
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

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
          },
          success: {
            style: {
              background: '#3D8D7A',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4">
                Tarakeswar Green Mates
              </h1>
              <p className="text-xl opacity-90">
                Member & Admin Portal
              </p>
            </div>
            <div className="space-y-4 text-lg opacity-80">
              <p>🌱 Environmental Conservation</p>
              <p>🐾 Wildlife Protection</p>
              <p>❤️ Community Welfare</p>
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
