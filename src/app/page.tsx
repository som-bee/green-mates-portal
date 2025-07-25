// src/app/page.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Award, 
  ArrowRight, 
  TreePine, 
  Heart, 
  Shield,
  Leaf,
  Target,
  Globe,
  Star,
  CheckCircle,
  Play,
  ChevronRight,
  Quote
} from 'lucide-react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-accent/20 to-secondary/30 py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/15 rounded-full blur-md"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Enhanced Logo */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <Leaf className="text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-500" size={48} />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl animate-pulse"></div>
            </div>

            {/* Enhanced Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-4 tracking-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  TGM Portal
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            </div>

            <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-12">
              Your gateway to{' '}
              <span className="font-semibold text-primary">environmental conservation</span>,{' '}
              <span className="font-semibold text-secondary">wildlife protection</span>, and{' '}
              <span className="font-semibold text-accent">community welfare</span> initiatives.
              <br className="hidden md:block" />
              Join our mission to create a sustainable future for West Bengal.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex gap-6 items-center justify-center flex-col sm:flex-row mb-12">
              <Link
                href="/login"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-full hover:shadow-2xl transition-all duration-500 font-semibold text-lg inline-flex items-center space-x-3 transform hover:scale-105 hover:-translate-y-1"
              >
                <span>Access Portal</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/about"
                className="group border-2 border-primary text-primary px-10 py-5 rounded-full hover:bg-primary hover:text-white transition-all duration-500 font-semibold text-lg inline-flex items-center space-x-2 hover:shadow-lg transform hover:scale-105"
              >
                <span>Learn More</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={16} />
                <span>Registered NGO</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500" size={16} />
                <span>Since 2012</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-blue-500" size={16} />
                <span>Verified Impact</span>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { number: '124+', label: 'Active Members', icon: Users, color: 'from-blue-500 to-blue-600' },
              { number: '1000+', label: 'Animals Rescued', icon: Shield, color: 'from-green-500 to-green-600' },
              { number: '3547', label: 'Trees Planted', icon: TreePine, color: 'from-emerald-500 to-emerald-600' },
              { number: '612', label: 'Blood Units', icon: Heart, color: 'from-red-500 to-red-600' },
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 text-center transform hover:scale-105 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:rotate-12`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('3D8D7A')}' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Portal Features
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to participate in our conservation efforts and track our collective impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Calendar,
                title: 'Activity Management',
                description: 'Join upcoming activities, track your participation, and see the impact of our collective efforts.',
                features: ['Wildlife rescue operations', 'Tree plantation drives', 'Blood donation camps', 'Community awareness programs'],
                color: 'blue',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: Users,
                title: 'Member Network',
                description: 'Connect with fellow environmental enthusiasts and collaborate on conservation projects.',
                features: ['Member directory', 'Skill sharing', 'Team collaboration', 'Achievement recognition'],
                color: 'green',
                gradient: 'from-green-500 to-green-600'
              },
              {
                icon: Award,
                title: 'Impact Tracking',
                description: 'Monitor our collective environmental impact and celebrate milestones together.',
                features: ['Real-time statistics', 'Personal contributions', 'Monthly reports', 'Goal tracking'],
                color: 'primary',
                gradient: 'from-primary to-secondary'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full transform hover:scale-105 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:rotate-12`}>
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4 group-hover:text-secondary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                        <div className={`w-2 h-2 bg-gradient-to-br ${feature.gradient} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl blur-xl transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Areas */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Our Mission Areas
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Three core pillars guide our environmental and social impact initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: TreePine,
                title: 'Environmental Conservation',
                description: 'Protecting biodiversity, restoring ecosystems, and promoting sustainable practices across West Bengal.',
                gradient: 'from-green-400 via-green-500 to-green-600',
                stats: '3547+ Trees Planted'
              },
              {
                icon: Shield,
                title: 'Wildlife Protection',
                description: 'Rescuing injured wildlife, rehabilitation programs, and creating awareness about animal conservation.',
                gradient: 'from-blue-400 via-blue-500 to-blue-600',
                stats: '1000+ Animals Rescued'
              },
              {
                icon: Heart,
                title: 'Community Welfare',
                description: 'Supporting local communities through health camps, education initiatives, and emergency relief programs.',
                gradient: 'from-red-400 via-red-500 to-red-600',
                stats: '612+ Blood Units Donated'
              }
            ].map((area, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${area.gradient} rounded-full mx-auto flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2`}>
                    <area.icon className="text-white drop-shadow-lg" size={36} />
                  </div>
                  <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4 group-hover:text-secondary transition-colors duration-300">
                  {area.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {area.description}
                </p>
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${area.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}>
                  {area.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              What Our Members Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Being part of TGM has been incredibly rewarding. The wildlife rescue programs have taught me so much about conservation.",
                author: "Priya Sharma",
                role: "Wildlife Volunteer",
                rating: 5
              },
              {
                quote: "The tree plantation drives are well-organized and impactful. I've seen real change in our community.",
                author: "Rajesh Kumar",
                role: "Environmental Activist",
                rating: 5
              },
              {
                quote: "TGM's blood donation camps have saved countless lives. Proud to be contributing to such a noble cause.",
                author: "Dr. Anjali Das",
                role: "Medical Professional",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative group">
                <Quote className="text-primary/20 absolute top-4 left-4" size={32} />
                <div className="relative z-10">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{testimonial.author}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
              Ready to Make a{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Difference
              </span>
              ?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our community of changemakers and help us create a sustainable future for generations to come.
            </p>
            <div className="flex gap-8 justify-center flex-col sm:flex-row">
              <Link
                href="/register"
                className="group relative bg-white text-primary px-10 py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-500 inline-flex items-center justify-center space-x-3 shadow-2xl transform hover:scale-105 hover:-translate-y-1 text-lg"
              >
                <span>Join Our Mission</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/contact"
                className="group border-3 border-white text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all duration-500 inline-flex items-center justify-center space-x-2 backdrop-blur-sm text-lg"
              >
                <span>Get in Touch</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" size={24} />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center space-x-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold">124+</div>
                <div className="text-sm">Members</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">12+</div>
                <div className="text-sm">Years</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
