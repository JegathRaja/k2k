'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { usePublicSettings } from '@/shared/api/hooks/useSettings';

export function ConsumerFooter() {
  const { data: settings } = usePublicSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aboutText = mounted && settings?.footer_about ? settings.footer_about : "The premium South Indian marine commerce platform. From the harbor directly to your kitchen, experiencing the real taste of the coast.";
  const addressText = mounted && settings?.footer_address ? settings.footer_address : "123 Coastal Highway, Chennai Harbor, Tamil Nadu 600001";
  const phoneText = mounted && settings?.footer_phone ? settings.footer_phone : "+91 98765 43210";
  const emailText = mounted && settings?.footer_email ? settings.footer_email : "support@kadal2kadaai.com";

  return (
    <footer className="relative bg-[#023e8a] dark:bg-slate-950 text-white pt-24 pb-8 mt-auto overflow-hidden">
      {/* Wave SVG Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <h3 className="font-heading text-h3 font-bold text-white tracking-tight">Kadal2Kadaai</h3>
            <p className="text-bodyMedium text-white/70 leading-relaxed max-w-xs transition-opacity duration-300">
              {aboutText}
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-white/10">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-white/10">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-white/10">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg relative inline-block">
              Categories
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-bodyMedium text-white/70">
              <li><Link href="/categories/seawater" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Seawater Fish</Link></li>
              <li><Link href="/categories/freshwater" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Freshwater Fish</Link></li>
              <li><Link href="/categories/shellfish" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Crabs & Shellfish</Link></li>
              <li><Link href="/categories/dry-fish" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Dry Fish</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-bodyMedium text-white/70">
              <li><Link href="/contact" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span> Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-bodyMedium text-white/70">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                  <MapPin className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="mt-2 transition-opacity duration-300">{addressText}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                  <Phone className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="transition-opacity duration-300">{phoneText}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                  <Mail className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="transition-opacity duration-300">{emailText}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-bodySmall text-white/50">
          <p>© {new Date().getFullYear()} Kadal2Kadaai. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
