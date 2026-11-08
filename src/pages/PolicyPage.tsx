import React from 'react';
import { useRouter } from '../router/RouterContext';
import { ChevronRight, ShieldCheck, FileText, RefreshCw, Lock } from 'lucide-react';

interface PolicyPageProps {
  policyType: 'terms' | 'privacy' | 'refund';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ policyType }) => {
  const { navigateToHome } = useRouter();

  const getTitle = () => {
    switch (policyType) {
      case 'terms':
        return 'Terms and Conditions';
      case 'privacy':
        return 'Privacy & Data Protection Policy';
      case 'refund':
        return 'Return and Replacement Policy';
    }
  };

  const getIcon = () => {
    switch (policyType) {
      case 'terms':
        return <FileText className="w-6 h-6" />;
      case 'privacy':
        return <Lock className="w-6 h-6" />;
      case 'refund':
        return <RefreshCw className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">{getTitle()}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">{getTitle()}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Official store rules and consumer protection guidelines for ZEN TACH (https://zentack.zya.me)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-xs space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
        {policyType === 'terms' && (
          <>
            <p>
              Welcome to <strong>ZEN TACH</strong>. These Terms and Conditions govern your use of our gadget e-commerce platform and all purchases conducted through https://zentack.zya.me.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">1. Authentic Tech Guarantee</h3>
            <p>
              ZEN TACH supplies authentic, brand-new consumer technology hardware. Each product includes manufacturer-provided serial packaging and distributor warranty validation.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">2. Pricing & Currency</h3>
            <p>
              All prices are stated in Bangladesh Taka (BDT ৳) and include applicable taxes. We reserve the right to modify catalog pricing and promotional discounts in accordance with distributor updates.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">3. Cash on Delivery Policy</h3>
            <p>
              Cash on Delivery (COD) orders require telephone verification by our support desk before shipping dispatch. Customers agree to provide accurate phone numbers and inspect the parcel upon delivery.
            </p>
          </>
        )}

        {policyType === 'privacy' && (
          <>
            <p>
              At <strong>ZEN TACH</strong>, customer privacy is paramount. We take rigorous technical precautions to protect your personal information in compliance with Firebase ABAC security standards.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">1. Data Collection</h3>
            <p>
              We collect your name, phone number, email address, delivery district, and shipping address strictly for processing purchases, dispatching goods, and providing real-time order tracking updates.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">2. Payment Security</h3>
            <p>
              ZEN TACH does not store customer financial PINs, passwords, or OTPs. All Firestore records are isolated so that customers access only their authorized order history.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">3. Communication</h3>
            <p>
              You will only receive order status confirmations and notifications you have opted in to receive. We never sell customer records to third-party telemarketers.
            </p>
          </>
        )}

        {policyType === 'refund' && (
          <>
            <p>
              Our goal is 100% customer satisfaction with every gadget purchased. We provide a transparent replacement and warranty policy for tech shoppers across Bangladesh.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">1. 7-Day Replacement Warranty</h3>
            <p>
              If your delivered device exhibits any genuine manufacturing or hardware defect within 7 days of receiving the package, you are entitled to an immediate unit inspection and replacement.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">2. Doorstep Parcel Verification</h3>
            <p>
              For Cash on Delivery orders, customers are warmly encouraged to inspect the external packaging and device seals in front of the delivery officer prior to completing payment.
            </p>

            <h3 className="text-base font-bold text-neutral-900 pt-2">3. Claiming Warranty</h3>
            <p>
              To initiate a claim, please contact our support desk at <strong>01705285855</strong> or email <strong>prorabbiv@gmail.com</strong> with your Order ID and an explanation of the issue.
            </p>
          </>
        )}

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500 mt-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Last revised and verified for Bangladesh consumer protection standards.</span>
        </div>
      </div>
    </div>
  );
};
