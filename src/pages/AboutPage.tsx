import React from 'react';
import { useRouter } from '../router/RouterContext';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ChevronRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();
  const { navigateToHome, navigateToShop, navigateToContact } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">About ZEN TACH</span>
        </div>

        <div className="max-w-2xl">
          <span className="text-[#E53935] font-black text-xs uppercase tracking-wider">
            Smarter Tech. Better Life.
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-1">
            Empowering Bangladesh with Authentic Gadgets & Technology
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            ZEN TACH was founded to solve the trust gap in the consumer electronics market with 100% genuine hardware, verifiable serial numbers, and rapid Cash on Delivery.
          </p>
        </div>
      </div>

      {/* Brand Hero & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-xs">
        <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
            Our Mission: Reliable Technology for Every Smartphone Buyer, Creator, and Gamer
          </h2>
          <p>
            In a fast-evolving digital era, accessing high-performance devices should not be accompanied by anxiety over refurbished units or counterfeit accessories.
          </p>
          <p>
            At <strong>ZEN TACH</strong>, every flagship smartphone (Apple iPhone, Samsung Galaxy), laptop (MacBook Pro, Asus ROG), noise-cancelling earbud, and GaN charger is directly inspected and sourced through certified regional distributors.
          </p>
          <p>
            We operate transparently with verified BDT (৳) pricing, official brand warranties, and a customer-first policy that enables doorstep inspection before cash handover.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={navigateToShop}
              className="px-6 py-3 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Explore Our Gadgets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={navigateToContact}
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm flex items-center justify-center p-8">
          <img
            src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
            alt="ZEN TACH"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">100% Genuine Tech</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Zero counterfeits or gray units. Every gadget comes with sealed distributor packaging and authentic manufacturer serials.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Fast Nationwide Dispatch</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Delivered inside Dhaka in 24–48 hours and across all 64 districts in 72 hours via premium courier networks.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">7-Day Replacement</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Hassle-free replacement guarantee if any electronic hardware defect is identified within 7 days of receiving your package.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Dedicated Support</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Direct customer assistance hotline at <strong>{settings.phone}</strong> and instant email communication 7 days a week.
          </p>
        </div>
      </div>

      {/* Official Corporate Coordinates */}
      <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 space-y-6">
        <h3 className="text-xl font-bold">Official Headquarters & Contact Coordinates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-300">
          <div className="space-y-1">
            <span className="text-neutral-500 font-bold block uppercase tracking-wider">Official Domain</span>
            <p className="font-bold text-white text-sm">https://zentack.zya.me</p>
            <p className="text-neutral-400">Dhaka, Bangladesh</p>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-500 font-bold block uppercase tracking-wider">Customer Hotline</span>
            <p className="font-bold text-white text-sm">{settings.phone}</p>
            <p className="text-neutral-400">Available 10:00 AM – 10:00 PM</p>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-500 font-bold block uppercase tracking-wider">Corporate Email</span>
            <p className="font-bold text-white text-sm">{settings.email}</p>
            <p className="text-neutral-400">Response within 2 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
