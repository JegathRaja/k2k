'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { Ship, Clock, ShieldCheck, ArrowRight, Loader2, ChevronLeft, ChevronRight, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/shared/api/hooks/useProducts';
import { useCategories } from '@/shared/api/hooks/useCategories';

// High quality generated placeholder images
const HERO_IMAGES = [
  "/hero1_hq.png", 
  "/hero2_hq.png",
  "/hero3_hq.png"
];

export default function Homepage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Wait 5 seconds before sliding
    return () => clearInterval(timer);
  }, []);
  
  const { data: categories } = useCategories();
  const queryCategory = activeTab === 'all' ? undefined : activeTab;
  const { data: productsData, isLoading } = useProducts(queryCategory ? { category: queryCategory } : undefined);
  const products = productsData?.data || [];

  const tabs = [
    { id: 'all', label: "Today's Local Catch" },
    ...(categories || []).map(cat => ({ id: cat.slug, label: cat.name }))
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500">

      {/* ═══════════════════════════════════════════════════
          NEW HERO SECTION (From Screenshot)
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-slate-900">
        
        {/* Animated Slideshow Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {/* Lighter, less opaque gradient to remove heavy blue tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/30 to-transparent z-10"></div>
          
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentHeroImage}
              src={HERO_IMAGES[currentHeroImage]}
              alt="Ocean Background"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.8 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center min-h-[50vh]">
            
            {/* Text and CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8 max-w-2xl py-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight">
                THE DEEP OCEAN'S FRESHNESS, DELIVERED DIRECT.
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100/80 font-light leading-relaxed">
                Kadal2Kadaai (K2K) bridges South India's local fishermen directly to your kitchen. Discover traceable, premium-grade marine catch, eliminating cold-storage middlemen for unparalleled taste and quality.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/products">
                  <Button size="lg" className="bg-[#2A75C3] hover:bg-[#1e5a99] text-white rounded-full px-8 h-14 text-lg font-medium transition-colors border-none shadow-lg shadow-blue-900/50">
                    Explore All Catch <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/products?sort=newest">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-medium border-white text-white hover:bg-white/10 bg-transparent transition-colors">
                    Today's Fresh Arrivals
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators in Hero */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-sm font-medium text-blue-100/90">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
                  <Anchor className="w-5 h-5" />
                  Direct from Harbor
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
                  <Clock className="w-5 h-5" />
                  Same-Day Delivery
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5" />
                  Quality Verified
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DYNAMIC PRODUCT SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 pb-32">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground">Explore Our Catch</h2>
              <p className="text-muted-foreground text-lg">Premium seafood curated for the finest kitchens.</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide snap-x">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-center shadow-sm ${
                    activeTab === tab.id
                      ? 'bg-primary text-white scale-105'
                      : 'bg-card text-muted-foreground hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">Reeling in the fresh catch...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {products && products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6 xl:gap-8">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id.toString()} 
                        slug={product.slug}
                        name={product.name} 
                        price={product.sale_price || product.price} 
                        weight={product.weight_unit || "1kg"} 
                        category={product.category?.name || "Uncategorized"}
                        image={product.images?.[0]?.image_url}
                        isAvailable={product.available_quantity > 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 glass-panel rounded-3xl text-center p-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Anchor className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">No Catch Today</h3>
                    <p className="text-muted-foreground max-w-md">Our fishermen haven't brought in anything for this category yet today. Check back soon!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          
          <div className="mt-20 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-card text-foreground hover:bg-primary hover:text-white border border-border shadow-md rounded-full px-10 h-14 font-bold text-base transition-all group">
                View Entire Catalog 
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
