// src/app/page.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Users,
  Award,
  ArrowRight,
  TreePine,
  Heart,
  Shield,
  CheckCircle,
  Quote,
  Star,
  ExternalLink,
  Globe
} from 'lucide-react';

export default function HomePage() {
  const [fade, setFade] = useState(false);
  useEffect(() => { setFade(true); }, []);

  return (
    <div className="min-h-screen bg-background text-slate-900 relative overflow-x-hidden">
      {/* Layered Animated Background */}
      <div className="pointer-events-none select-none fixed inset-0 z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[380px] h-[360px] rounded-full bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/10 blur-[110px] animate-pulse" />
        <div className="absolute bottom-[-13%] right-[-10%] w-[360px] h-[330px] rounded-full bg-gradient-to-br from-accent/15 to-primary/20 blur-[100px] animate-pulse" />
      </div>

      {/* NAV */}
      <nav className="backdrop-blur border-b border-secondary/10 sticky top-0 z-40 bg-white/85">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href={'/'}>
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-sm p-2">
              <Image src="/logo.png" alt="TGM Logo" width={36} height={36} className="object-contain" />
            </div>
            <span className="font-serif font-bold text-xl text-primary">TGM Portal</span>
          </div>
          </Link>
          <div className="flex space-x-3 items-center">
            <a
              href="https://greenmates.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/50 hover:bg-white/80 hover:text-primary transition text-sm font-medium"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">Main&nbsp;Site</span>
            </a>
            <Link
              href="/login"
              className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full font-medium shadow hover:shadow-md transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center py-14 md:py-24 bg-gradient-to-br from-white via-accent/10 to-secondary/10 z-10 relative">
        <div className="container mx-auto px-6">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center shadow-md border-4 border-white p-3 ring-2 ring-primary/20">
              <Image src="/logo.png" alt="Tarakeswar Green Mates Logo" width={65} height={65} className="object-contain" priority />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-5 leading-tight drop-shadow-sm">
              TGM Portal
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded mb-6" />
            <div className="max-w-xl mx-auto text-lg md:text-xl text-slate-700 font-light mb-9">
              <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-12">
                Your gateway to{' '}
                <span className="font-semibold text-primary">environmental conservation</span>,{' '}
                <span className="font-semibold text-secondary">wildlife protection</span>, and{' '}
                <span className="font-semibold text-accent">community welfare</span> initiatives.
                <br className="hidden md:block" />
                Join our mission to create a sustainable future.
              </p>
            </div>
            {/* Fancy CTA */}
            <div className="flex gap-3 items-center justify-center mb-8">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
              >
                Access Portal
                <ArrowRight size={16} />
              </Link>
              <Link
                href="https://greenmates.org/about"
                className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary hover:text-white transition"
              >
                Learn More
              </Link>
            </div>
            {/* Modern Trust Badges */}
            <div className="flex items-center justify-center gap-2 text-sm font-medium mt-6">
              <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 shadow border border-green-200/50">
                <CheckCircle size={14} /> NGO
              </span>
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 shadow border border-yellow-200/50">
                <Star size={14} /> Since 2012
              </span>
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-3 py-1 shadow border border-blue-200/50">
                <Shield size={14} /> Impact
              </span>
            </div>
          </div>
          {/* Portal stats with subtle glass + gradient on hover */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-14 md:mt-20">
            {[
              { number: '124+', label: 'Active Members', icon: Users },
              { number: '1000+', label: 'Animals Rescued', icon: Shield },
              { number: '3547', label: 'Trees Planted', icon: TreePine },
              { number: '612', label: 'Blood Units', icon: Heart },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-white/80 backdrop-blur border border-secondary/30 shadow-md flex flex-col items-center text-center cursor-default transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-primary"
              >
                <stat.icon
                  className="w-14 h-14 text-primary mb-4 transition-filter duration-300 group-hover:drop-shadow-[0_0_10px_rgba(61,141,122,0.7)]"
                  aria-hidden="true"
                />
                <div className="text-3xl font-extrabold text-primary">{stat.number}</div>
                <div className="text-slate-600 text-base mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/60 to-white border-y border-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Portal Features</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Calendar,
                title: 'Activity Management',
                desc: 'Join, track, and relive events and operations.',
                features: ['Wildlife rescue', 'Tree plantation', 'Blood donation']
              },
              {
                icon: Users,
                title: 'Member Network',
                desc: 'Connect and collaborate in a supportive community.',
                features: ['Directory', 'Skill sharing', 'Teams']
              },
              {
                icon: Award,
                title: 'Impact Tracking',
                desc: 'Measure your efforts and our milestones.',
                features: ['Stats', 'Personal goals', 'Milestones']
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative bg-white p-10 rounded-3xl border border-secondary/25 shadow-lg group hover:shadow-xl transition-shadow duration-500">
                <div className="icon-container relative mb-8 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow duration-500">
                  <feature.icon className="text-white w-14 h-14 relative z-10 shine-icon" />
                  <div className="shine-layer absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-xl"></div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-lg text-slate-700 mb-6">{feature.desc}</p>
                <ul className="list-disc list-inside ml-5 text-slate-600">
                  {feature.features.map((item, i) => (
                    <li key={i} className="mb-2 text-base">{item}</li>
                  ))}
                </ul>

                <style jsx>{`
            .shine-icon {
              filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
              transition: filter 0.5s ease-in-out;
            }
            .group:hover .shine-icon {
              animation: shine 1.5s ease-in-out forwards;
            }
            @keyframes shine {
              0% {
                filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0));
              }
              50% {
                filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));
              }
              100% {
                filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0));
              }
            }
          `}</style>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission Areas */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 tracking-tight">
              Our Mission
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: TreePine,
                title: 'Environmental Conservation',
                description: 'Biodiversity protection, restoration, sustainable practices.',
                stats: '3547+ Trees Planted'
              },
              {
                icon: Shield,
                title: 'Wildlife Protection',
                description: 'Rescue and rehabilitation for animal conservation.',
                stats: '1000+ Animals Rescued'
              },
              {
                icon: Heart,
                title: 'Community Welfare',
                description: 'Health, education, and relief for locals.',
                stats: '612+ Blood Units'
              }
            ].map((area, idx) => (
              <div
                key={idx}
                className="relative bg-white/85 rounded-3xl p-12 border border-secondary/20 flex flex-col items-center text-center group hover:shadow-2xl hover:scale-105 hover:border-primary transition-all"
              >
                {/* Shining Icon */}
                <div className="icon-container relative mb-7 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <area.icon className="text-white w-16 h-16 shine-icon relative z-10" />
                  <div className="shine-layer absolute inset-0 bg-white opacity-0 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">{area.title}</h3>
                <p className="text-lg text-slate-700 mb-6">{area.description}</p>
                <div className="inline-block px-4 py-2 bg-primary text-white rounded-full text-base font-bold drop-shadow">
                  {area.stats}
                </div>

                <style jsx>{`
            .shine-icon {
              filter: drop-shadow(0 0 6px rgba(255,255,255,0.7));
              transition: filter 0.5s;
            }
            .group:hover .shine-icon {
              animation: shine 1.2s forwards;
            }
            @keyframes shine {
              0% { filter: drop-shadow(0 0 6px rgba(255,255,255,0)); }
              40% { filter: drop-shadow(0 0 26px rgba(255,255,255,0.9)); }
              100% { filter: drop-shadow(0 0 6px rgba(255,255,255,0)); }
            }
          `}</style>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white border-t border-b border-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 tracking-tight">What Members Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                quote: "Being part of TGM has been incredibly rewarding.",
                author: "Priya Sharma",
                role: "Wildlife Volunteer"
              },
              {
                quote: "The plantation drives are impactful. I've seen real change.",
                author: "Rajesh Kumar",
                role: "Environmental Activist"
              },
              {
                quote: "TGM's blood donation camps have saved countless lives.",
                author: "Dr. Anjali Das",
                role: "Medical Professional"
              }
            ].map((t, i) => (
              <div
                key={i}
                className="relative bg-white/90 rounded-3xl p-10 border border-secondary/15 flex flex-col items-center shadow-lg group hover:shadow-2xl hover:scale-105 transition-all text-center"
              >
                <div className="icon-container relative mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:shadow-lg">
                  <Quote className="text-primary w-12 h-12 shine-icon" />
                  <div className="shine-layer absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity rounded-full pointer-events-none" />
                </div>
                <p className="text-xl text-slate-700 mb-6 italic flex-1">&quot;{t.quote}&quot;</p>
                <div className="flex items-center mt-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">{t.author.charAt(0)}</div>
                  <div className="text-left">
                    <div className="font-bold text-primary text-lg">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>

                <style jsx>{`
            .shine-icon {
              filter: drop-shadow(0 0 6px rgba(61,141,122,0.5));
              transition: filter 0.5s;
            }
            .group:hover .shine-icon {
              animation: shinequote 1.2s;
            }
            @keyframes shinequote {
              0% { filter: drop-shadow(0 0 6px rgba(61,141,122,0)); }
              50% { filter: drop-shadow(0 0 28px rgba(122,186,146,0.8)); }
              100% { filter: drop-shadow(0 0 6px rgba(61,141,122,0)); }
            }
          `}</style>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action Above Footer */}
      <section className="py-14 bg-gradient-to-r from-primary to-secondary/90 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Ready to Make a Difference?
            </h2>
            <p className="text-base mb-5">
              Join us and shape a greener, better tomorrow.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link
                href="/register"
                className="bg-white text-primary px-7 py-3 rounded-full font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
              >
                Join Our Mission <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="border border-white text-white px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern, Enhanced Footer */}
      <footer className="border-t border-secondary/10 pt-10 pb-6 bg-white/90 text-slate-600">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <Image src="/logo.png" alt="TGM Logo" width={22} height={22} className="object-contain" />
            </div>
            <span className="font-serif font-bold text-xs text-primary">Tarakeswar Green Mates</span>
            <span className="text-slate-400 text-xs">— a project for change</span>
          </div>
          <nav className="flex gap-6 text-xs font-medium">
            <a href="/about" className="hover:text-primary transition">About</a>
            <a href="/contact" className="hover:text-primary transition">Contact</a>
            <a href="/register" className="hover:text-primary transition">Join</a>
            <a
              href="https://greenmates.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 hover:text-primary"
            >
              greenmates.org <ExternalLink size={11} />
            </a>
          </nav>
        </div>
        <div className="text-xs text-center text-slate-400 mt-3">
          © 2024 Tarakeswar Green Mates. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
