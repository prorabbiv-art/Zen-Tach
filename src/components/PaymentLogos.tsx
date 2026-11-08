import React from 'react';

/**
 * Official Payment Logos for ZEN TACH E-Commerce
 * Uses the authentic bKash and Nagad brand graphics from the /paymant folder,
 * alongside Cash on Delivery, Visa, Mastercard, AMEX, and SSLCommerz
 */

export const BKashLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const imgHeight = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';
  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 bg-white rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all select-none ${className}`}
    >
      <img
        src="/payments/bkash.png"
        alt="bKash"
        className={`${imgHeight} w-auto object-contain`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/paymant/bkash-logo_brandlogos.net_2qvpe.png';
        }}
      />
    </div>
  );
};

export const NagadLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const imgHeight = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';
  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 bg-white rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all select-none ${className}`}
    >
      <img
        src="/payments/nagad.png"
        alt="Nagad"
        className={`${imgHeight} w-auto object-contain`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/paymant/1725618513nagad-logo.png';
        }}
      />
    </div>
  );
};

export const VisaLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center justify-center px-2.5 py-1.5 bg-[#1A1F71] text-white rounded-xl shadow-xs select-none ${className}`}>
    <span className="font-black tracking-tighter text-white italic text-[14px] px-1 font-serif leading-none">
      VISA
    </span>
  </div>
);

export const MastercardLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center justify-center px-3 py-1.5 bg-[#171717] text-white rounded-xl shadow-xs select-none ${className}`}>
    <div className="flex items-center -space-x-2">
      <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
      <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90" />
    </div>
  </div>
);

export const AmexLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center justify-center px-2.5 py-1.5 bg-[#006FCF] text-white rounded-xl shadow-xs select-none ${className}`}>
    <span className="font-black tracking-tight text-white text-[11px] leading-none">
      AMEX
    </span>
  </div>
);

export const CodLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white rounded-xl shadow-xs select-none ${className}`}>
    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
    <span className="font-extrabold text-[12px] text-white tracking-wide">
      Cash on Delivery
    </span>
  </div>
);

export const SSLCommerzLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-xl border border-neutral-700 shadow-xs select-none ${className}`}>
    <span className="text-emerald-400 font-black text-xs">🔒</span>
    <span className="font-black text-[11px] text-neutral-100 tracking-tight">
      SSL<span className="text-[#E53935]">COMMERZ</span>
    </span>
  </div>
);

/**
 * Accepted Payments Showcase Bar
 * Displays authentic payment badges with real brand images (bKash & Nagad from /paymant)
 */
export const AcceptedPaymentGrid: React.FC<{ variant?: 'light' | 'dark'; showTitle?: boolean }> = ({
  variant = 'dark',
  showTitle = true
}) => {
  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${variant === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Accepted Payment Methods
          </span>
          <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Secure &amp; Verified
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Cash on Delivery */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <CodLogo />
        </div>

        {/* Official bKash (from paymant folder) */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <BKashLogo />
        </div>

        {/* Official Nagad (from paymant folder) */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <NagadLogo />
        </div>

        {/* Visa */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <VisaLogo />
        </div>

        {/* Mastercard */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <MastercardLogo />
        </div>

        {/* AMEX */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <AmexLogo />
        </div>

        {/* SSLCommerz */}
        <div className="group relative transition-transform hover:-translate-y-0.5">
          <SSLCommerzLogo />
        </div>
      </div>
    </div>
  );
};
