import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { settings, submitContactInquiry, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    await submitContactInquiry(name, email, phone, subject, message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto">
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              Contact ZEN TACH Support
            </h2>
            <p className="text-xs text-neutral-500">Official Customer Service & Inquiries</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-5 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Left: Contact Info (2 cols) */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <span className="font-bold text-neutral-900 block text-xs uppercase tracking-wider">
                Direct Contact
              </span>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2.5 text-neutral-700 hover:text-[#E53935] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E53935]" />
                <span className="font-bold">{settings.phone}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 text-neutral-700 hover:text-[#E53935] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E53935]" />
                <span className="break-all">{settings.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-neutral-600">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-neutral-700 space-y-2 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-[#E53935]">
                <Clock className="w-3.5 h-3.5" />
                <span>Support Hours</span>
              </div>
              <p>Saturday – Thursday: 10:00 AM – 10:00 PM</p>
              <p>Friday: 3:00 PM – 10:00 PM</p>
            </div>
          </div>

          {/* Right: Contact Form (3 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-neutral-800 mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="01705285855"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Order inquiry, product availability, warranty..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">Message *</label>
              <textarea
                rows={4}
                required
                placeholder="How can we assist you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-300 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto max-h-[85vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-base sm:text-lg font-black text-neutral-900">About ZEN TACH</h2>
            <p className="text-xs text-neutral-500">Smarter Tech. Better Life.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-xs text-neutral-600 leading-relaxed overflow-y-auto">
          <div className="flex justify-center mb-2">
            <img
              src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
              alt="ZEN TACH"
              className="h-14 object-contain"
            />
          </div>

          <p>
            <strong>ZEN TACH</strong> is an online gadget and consumer technology shopping platform founded to bring authentic, high-performance electronics to technology enthusiasts and shoppers across Bangladesh.
          </p>

          <p>
            From the latest flagship smartphones (Apple iPhone, Samsung Galaxy) and high-performance creative laptops (MacBook Pro, Asus ROG) to noise-cancelling audiophile earbuds, smartwatches, mechanical keyboards, and GaN desktop chargers, every item in our catalog is verified for genuine quality and official warranty support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <ShieldCheck className="w-5 h-5 text-[#E53935] mx-auto mb-1.5" />
              <h4 className="font-bold text-neutral-900 text-xs">Authenticity</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">100% genuine tech with serial validation</p>
            </div>
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <Truck className="w-5 h-5 text-[#E53935] mx-auto mb-1.5" />
              <h4 className="font-bold text-neutral-900 text-xs">Fast BD Delivery</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Reliable dispatch in Dhaka & districts</p>
            </div>
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <CheckCircle2 className="w-5 h-5 text-[#E53935] mx-auto mb-1.5" />
              <h4 className="font-bold text-neutral-900 text-xs">Customer Care</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Instant phone and WhatsApp assistance</p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-[11px] space-y-1">
            <p><strong>Official Web Domain:</strong> https://zentack.zya.me</p>
            <p><strong>Support Hotline:</strong> 01705285855</p>
            <p><strong>Corporate Contact:</strong> prorabbiv@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PolicyModalProps {
  type: 'terms' | 'privacy' | 'refund' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 my-auto max-h-[85vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="text-base sm:text-lg font-black text-neutral-900">
            {type === 'terms' && 'Terms and Conditions'}
            {type === 'privacy' && 'Privacy & Data Policy'}
            {type === 'refund' && 'Return and Refund Policy'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4 text-xs text-neutral-600 leading-relaxed overflow-y-auto">
          {type === 'terms' && (
            <>
              <p>Welcome to <strong>ZEN TACH</strong> (https://zentack.zya.me). By accessing our website, browsing gadgets, or placing orders, you agree to comply with and be bound by the following terms.</p>
              <h4 className="font-bold text-neutral-900 text-sm">1. Orders and Pricing</h4>
              <p>All prices are listed in Bangladesh Taka (BDT ৳) and are inclusive of standard applicable charges. We reserve the right to revise catalog pricing, stock availability, and delivery fees based on official market distributor updates.</p>
              <h4 className="font-bold text-neutral-900 text-sm">2. Cash on Delivery & Order Verification</h4>
              <p>For Cash on Delivery orders, our customer operations team will place a verification phone call to the customer phone number provided before dispatching goods. Refusal or unreachability may lead to order hold.</p>
              <h4 className="font-bold text-neutral-900 text-sm">3. Customer Information</h4>
              <p>You agree to provide true, current, and complete shipping information. ZEN TACH is not liable for dispatch delays resulting from incorrect address inputs.</p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>At <strong>ZEN TACH</strong>, customer privacy and data security are our top priorities. This policy details how we treat customer information.</p>
              <h4 className="font-bold text-neutral-900 text-sm">1. Information We Collect</h4>
              <p>When you register or check out, we collect your name, phone number, email address, delivery district, and street address solely to fulfill purchases and provide order tracking updates.</p>
              <h4 className="font-bold text-neutral-900 text-sm">2. Payment Data Protection</h4>
              <p>ZEN TACH never stores sensitive payment pins, OTPs, or credit card passwords. All transaction records adhere to strict Firebase Firestore security rules ensuring customers access only their private records.</p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p>We strive to ensure every customer receives authentic, brand-new technology in pristine operational condition.</p>
              <h4 className="font-bold text-neutral-900 text-sm">1. 7-Day Replacement Warranty</h4>
              <p>If your received electronic device exhibits any genuine manufacturing defect within 7 days of delivery, you are eligible for an immediate inspection and unit replacement.</p>
              <h4 className="font-bold text-neutral-900 text-sm">2. Doorstep Inspection</h4>
              <p>Customers are warmly encouraged to inspect physical packaging and seals upon receiving the parcel from the delivery agent before completing Cash on Delivery handover.</p>
              <h4 className="font-bold text-neutral-900 text-sm">3. Support Contact</h4>
              <p>To initiate a return or claim warranty, contact our official support hotline at <strong>01705285855</strong> or email <strong>prorabbiv@gmail.com</strong> with your Order ID.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
