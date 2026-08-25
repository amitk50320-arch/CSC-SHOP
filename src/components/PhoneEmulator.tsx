import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  Wifi, 
  Battery, 
  Signal, 
  ArrowLeft, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  CreditCard, 
  Receipt,
  Download,
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { Customer } from '../types';
import { exportCustomersToCsv } from '../services/csvExport';

interface PhoneEmulatorProps {
  customers: Customer[];
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenCustomerDetail: (customer: Customer) => void;
}

export const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  customers,
  onClose,
  onOpenRegister,
  onOpenCustomerDetail
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [mobileSearch, setMobileSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Partial' | 'Pending'>('All');

  const filtered = customers.filter(c => {
    const q = mobileSearch.toLowerCase();
    const match = !q || c.fullName.toLowerCase().includes(q) || c.phone.includes(q) || c.panNumber.toLowerCase().includes(q);
    if (!match) return false;

    const fees = c.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
    const paid = c.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
    const bal = Math.max(0, fees - paid);

    if (filter === 'Paid') return bal === 0 && fees > 0;
    if (filter === 'Partial') return paid > 0 && bal > 0;
    if (filter === 'Pending') return paid === 0 && fees > 0;
    return true;
  });

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in shadow-2xl">
      {/* Device Body */}
      <div className="w-[360px] h-[680px] bg-slate-900 rounded-[44px] p-3.5 border-4 border-slate-700 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/20">
        {/* Device Notch & Status Bar */}
        <div className="bg-black text-white px-6 pt-2 pb-1.5 rounded-t-[32px] flex items-center justify-between text-[10px] font-semibold select-none">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* App Container Screen (Material 3 Surface) */}
        <div className="flex-1 bg-slate-50 rounded-b-[32px] overflow-hidden flex flex-col text-slate-800 relative">
          {/* Material 3 Top App Bar */}
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CH
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Customer Hub</h4>
                <p className="text-[9px] text-slate-400 font-mono">Room SQLite • M3</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => exportCustomersToCsv(customers)}
                className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-md"
                title="CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar inside mobile */}
          <div className="p-3 bg-white border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search customers, PAN..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Filter chips */}
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {(['All', 'Paid', 'Partial', 'Pending'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Customer list in phone */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filtered.map(c => {
              const fees = c.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
              const paid = c.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
              const bal = Math.max(0, fees - paid);

              return (
                <div
                  key={c.id}
                  onClick={() => onOpenCustomerDetail(c)}
                  className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                      {c.customerCode}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      bal === 0 && fees > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bal === 0 && fees > 0 ? 'Paid' : bal > 0 ? `Due ₹${bal}` : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.photoUrl ? (
                      <img src={c.photoUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                        {c.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{c.fullName}</h5>
                      <p className="text-[10px] text-slate-400 font-mono">PAN: {c.panNumber}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Action Button (FAB) */}
          <button
            type="button"
            onClick={onOpenRegister}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            title="Register Customer"
          >
            <UserPlus className="w-5 h-5" />
          </button>

          {/* Home indicator */}
          <div className="h-4 bg-slate-50 flex items-center justify-center pb-1">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
