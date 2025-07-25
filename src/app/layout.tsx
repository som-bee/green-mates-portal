// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css'; // This line is crucial
import {
  Plus_Jakarta_Sans,
  Work_Sans,
  Inter,
} from 'next/font/google';

const jakarta_Sans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

const work_Sans = Work_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TGM Portal | Tarakeswar Green Mates',
  description: 'Member and Admin portal for Tarakeswar Green Mates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${jakarta_Sans.variable} ${work_Sans.variable} ${inter.variable} font-jakarta antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
