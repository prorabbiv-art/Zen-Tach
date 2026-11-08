import React from 'react';
import { Order } from '../types';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">Official Tax Invoice</span>
            <span className="text-neutral-400">| Order #{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#E53935] hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-12 space-y-8 print:p-0 print:m-0 text-neutral-900 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-neutral-200">
            <div>
              <img
                src="/assets/aistudio/Zen_Tach_Smart_Tech_Logo_b93b53fb.png"
                alt="ZEN TACH"
                className="h-10 w-auto object-contain mb-2"
              />
              <p className="text-xs text-neutral-500 font-semibold">Smarter Tech. Better Life.</p>
              <div className="text-xs text-neutral-600 mt-2 space-y-0.5">
                <p>Website: <span className="font-medium text-neutral-900">https://zentack.zya.me</span></p>
                <p>Hotline: <span className="font-medium text-neutral-900">01705285855</span></p>
                <p>Support: <span className="font-medium text-neutral-900">prorabbiv@gmail.com</span></p>
                <p>Multiplan Center / Bashundhara City, Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="px-3 py-1 bg-red-50 text-[#E53935] text-xs font-black uppercase rounded-lg tracking-wider inline-block">
                TAX INVOICE & RECEIPT
              </span>
              <h3 className="text-lg font-black mt-1">Invoice #{order.id}</h3>
              <p className="text-xs text-neutral-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs">
                Status:{' '}
                <span className="font-bold uppercase text-emerald-600">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
            <div>
              <span className="font-black uppercase tracking-wider text-neutral-400 text-[10px] block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-neutral-900 text-sm">{order.customerName}</p>
              <p className="text-neutral-700 mt-0.5 font-medium">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-neutral-500">{order.customerEmail}</p>}
              <p className="text-neutral-600 mt-2">
                {order.shippingAddress.fullAddress}, {order.shippingAddress.cityOrArea}
              </p>
              <p className="font-semibold text-neutral-800">{order.shippingAddress.district}</p>
            </div>

            <div className="sm:text-right space-y-1.5">
              <span className="font-black uppercase tracking-wider text-neutral-400 text-[10px] block mb-1">
                Payment Information:
              </span>
              <p className="text-neutral-800">
                Method:{' '}
                <strong className="uppercase font-bold text-neutral-900">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                </strong>
              </p>
              <p className="text-neutral-800">
                Payment Status:{' '}
                <span
                  className={`font-bold uppercase ${
                    order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              {order.transactionId && (
                <p className="text-neutral-600">
                  TrxID: <span className="font-mono font-bold text-neutral-900">{order.transactionId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[11px] uppercase tracking-wider font-bold text-neutral-700">
                  <th className="py-2.5">Item & Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-3 pr-4">
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">
                        Brand: {item.brand} {item.selectedColor ? `| Color: ${item.selectedColor}` : ''}
                      </p>
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">৳{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-bold text-neutral-900">
                      ৳{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-neutral-200">
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Official Brand Warranty Covered</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Thank you for choosing ZEN TACH Bangladesh. Keep this invoice safe for claiming brand warranty services at authorized support centers.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-neutral-900">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-neutral-900">৳{order.deliveryFee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-2 border-t-2 border-neutral-900 text-neutral-900">
                <span>Total Amount:</span>
                <span className="text-[#E53935]">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="pt-8 border-t border-dashed border-neutral-300 flex items-center justify-between text-[11px] text-neutral-400">
            <div>
              <p className="font-bold text-neutral-700">ZEN TACH Verified Authentic E-Receipt</p>
              <p>Computer-generated invoice. No physical signature required.</p>
            </div>
            <div className="border border-neutral-300 p-2.5 rounded-xl text-center text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider block">QC Passed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
