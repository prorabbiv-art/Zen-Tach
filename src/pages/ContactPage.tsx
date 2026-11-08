import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../router/RouterContext';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  ChevronRight,
  MessageSquare,
  Package,
  ShieldCheck
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, submitContactInquiry, showToast } = useStore();
  const { navigateToHome, navigateToTracking } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    await submitContactInquiry(name, email, phone, subject, message);
    setIsSubmitting(false);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <button onClick={navigateToHome} className="hover:text-neutral-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-neutral-900">Contact Support</span>
        </div>

        <div className="max-w-2xl">
          <span className="text-[#E53935] font-black text-xs uppercase tracking-wider">
            We Are Here To Assist
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-1">
            Get in Touch with ZEN TACH
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Have questions about gadget specifications, order delivery status, or warranty claims? Our Dhaka support team is available 7 days a week.
          </p>
        </div>
      </div>

      {/* Main Grid: Info Cards (5 cols) + Inquiry Form (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
            <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider">
              Customer Support Channels
            </h2>

            <div className="space-y-4 text-xs">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-[#E53935] transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase text-[10px]">
                    Hotline & WhatsApp
                  </span>
                  <span className="font-bold text-neutral-900 text-sm">{settings.phone}</span>
                  <p className="text-neutral-500 mt-0.5">Direct line for instant order placement & queries</p>
                </div>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-[#E53935] transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase text-[10px]">
                    Customer Inquiries
                  </span>
                  <span className="font-bold text-neutral-900 text-sm break-all">{settings.email}</span>
                  <p className="text-neutral-500 mt-0.5">Corporate correspondence & bulk order quotes</p>
                </div>
              </a>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase text-[10px]">
                    Store Location & Dispatch Hub
                  </span>
                  <span className="font-bold text-neutral-900 text-xs sm:text-sm">{settings.address}</span>
                  <p className="text-neutral-500 mt-0.5">Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase text-[10px]">
                    Support Operating Hours
                  </span>
                  <p className="font-bold text-neutral-900 text-xs">Sat – Thu: 10:00 AM – 10:00 PM</p>
                  <p className="text-neutral-500">Friday: 3:00 PM – 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tracking Card */}
          <div className="bg-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-[#E53935]" />
              <div>
                <h4 className="font-bold text-sm text-white">Already Have an Order ID?</h4>
                <p className="text-xs text-neutral-400">Track delivery status instantly</p>
              </div>
            </div>
            <button
              onClick={() => navigateToTracking()}
              className="px-4 py-2 bg-[#E53935] hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Track Now
            </button>
          </div>
        </div>

        {/* Right: Working Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E53935]">
                <MessageSquare className="w-4 h-4" />
                <span>Send Us a Message</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                Drop Your Inquiry or Feedback
              </h2>
              <p className="text-xs text-neutral-500">
                Messages submitted here are reviewed by our authorized support managers and saved securely to Firebase.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Phone Number (BD Mobile)
                  </label>
                  <input
                    type="tel"
                    placeholder="01705285855"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Subject / Inquiry Topic
                </label>
                <input
                  type="text"
                  placeholder="Product availability, delivery time, bulk orders..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Message Description *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can our technical support team help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-neutral-900 focus:outline-none focus:border-[#E53935] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#E53935] hover:bg-red-600 disabled:bg-neutral-300 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
