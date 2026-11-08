import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Lock, CheckCircle2 } from 'lucide-react';
import { AcceptedPaymentGrid } from './PaymentLogos';

export const Footer: React.FC = () => {
  const { categories, settings } = useStore();
  const {
    navigateToHome,
    navigateToShop,
    navigateToCategory,
    navigateToTracking,
    navigate
  } = useRouter();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8 border-t border-neutral-800">
      {/* 1. Value Proposition Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-neutral-950/70 border border-neutral-800 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-red-500/30 hover:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">100% Genuine Tech</h4>
              <p className="text-xs text-neutral-400">Authentic gadgets with brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-red-500/30 hover:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Fast BD Shipping</h4>
              <p className="text-xs text-neutral-400">Dhaka in 24-48 hrs, Outside in 72 hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-red-500/30 hover:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Hassle-Free Return</h4>
              <p className="text-xs text-neutral-400">7-day replacement warranty guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-red-500/30 hover:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all duration-300 shadow-sm">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Dedicated Support</h4>
              <p className="text-xs text-neutral-400">Direct hotline &amp; instant WhatsApp assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToHome}>
              <img
                src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
                alt="ZEN TACH"
                className="h-12 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              ZEN TACH is Bangladesh's premier technology shopping destination. We provide authentic flagship smartphones, high-performance laptops, noise-cancelling earbuds, smartwatches, and premium accessories with Cash on Delivery and verified warranty.
            </p>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E53935] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E53935] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span className="text-neutral-400">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.id)}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-[#E53935] hover:underline font-semibold cursor-pointer"
                >
                  View All Categories Directory →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service Dedicated Pages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateToTracking()}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Support Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  About ZEN TACH
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/refund')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Accepted Payments
            </h4>
            <p className="text-xs text-neutral-400">
              We support instant Cash on Delivery across all 64 districts and 100% encrypted digital gateways.
            </p>

            {/* Authentic Payment Logos */}
            <AcceptedPaymentGrid variant="dark" showTitle={false} />

            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>256-Bit SSL Encrypted Transactions</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                <span>Doorstep Parcel Inspection Allowed</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 pt-1">
              Official Website: <a href="https://zentack.zya.me" target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-white underline">zentack.zya.me</a>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} ZEN TACH. All rights reserved. Made for Bangladesh tech enthusiasts.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/terms')} className="hover:text-neutral-300 cursor-pointer">Terms</button>
            <span>•</span>
            <button onClick={() => navigate('/privacy')} className="hover:text-neutral-300 cursor-pointer">Privacy</button>
            <span>•</span>
            <button onClick={() => navigate('/refund')} className="hover:text-neutral-300 cursor-pointer">Refunds</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
