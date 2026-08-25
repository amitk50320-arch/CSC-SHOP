import React from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  UserPlus, 
  FileSpreadsheet, 
  Database, 
  FileCode2, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Customer } from '../types';

interface DashboardProps {
  customers: Customer[];
  onNavigate: (tab: 'dashboard' | 'customers' | 'register' | 'android-studio' | 'database') => void;
  onSelectCustomer: (customer: Customer) => void;
  onExportCsv: () => void;
  onDownloadZip: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  customers,
  onNavigate,
  onSelectCustomer,
  onExportCsv,
  onDownloadZip
}) => {
  // Metrics
  const totalCustomers = customers.length;
  const verifiedCount = customers.filter(c => c.isAadhaarVerified && c.isPanVerified).length;
  const verifiedRate = totalCustomers > 0 ? Math.round((verifiedCount / totalCustomers) * 100) : 0;

  const allServices = customers.flatMap(c => c.services || []);
  const totalFees = allServices.reduce((acc, s) => acc + s.feeAmount, 0);
  const totalCollected = allServices.reduce((acc, s) => acc + s.paidAmount, 0);
  const pendingFees = Math.max(0, totalFees - totalCollected);

  // Category breakdown
  const categoryCounts = allServices.reduce((acc, s) => {
    acc[s.serviceCategory] = (acc[s.serviceCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Room SQLite 2.6 • Material 3 Android Studio Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Customer Hub & KYC Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Manage Indian KYC (Aadhaar & PAN), photos, digital signatures, service fee billing, and export complete production-ready Android Studio source code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Customer</span>
            </button>

            <button
              onClick={() => onNavigate('android-studio')}
              className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold border border-indigo-400/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Inspect Android Code</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalCustomers}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {verifiedRate}% KYC Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Stored in Room SQLite entities</p>
        </div>

        {/* Metric 2: Total Revenue Booked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Fees Booked</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{totalFees.toLocaleString('en-IN')}</span>
            <span className="text-xs font-semibold text-slate-500">{allServices.length} Invoices</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across all service records</p>
        </div>

        {/* Metric 3: Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">₹{totalCollected.toLocaleString('en-IN')}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0}% Paid
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">UPI, Cash, Bank Transfers</p>
        </div>

        {/* Metric 4: Pending Balances */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pending Balances</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">₹{pendingFees.toLocaleString('en-IN')}</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              Due to Collect
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Outstanding client receivables</p>
        </div>
      </div>

      {/* Main Grid: Recent Registrations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Registrations</h3>
                <p className="text-xs text-slate-500">Latest KYC entries saved in Room SQLite database</p>
              </div>

              <button
                onClick={() => onNavigate('customers')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All ({customers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentCustomers.map(c => {
                const fees = c.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCustomer(c)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {c.photoUrl ? (
                        <img src={c.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {c.fullName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.fullName}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {c.customerCode} • Aadhaar: XXXX {c.aadhaarNumber.slice(-4)} • PAN: {c.panNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900">₹{fees.toLocaleString('en-IN')}</span>
                      <p className="text-[10px] text-slate-400">{c.city}, {c.state}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fast reactive Flow observation via Kotlin Coroutines</span>
            <button
              onClick={onExportCsv}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export All to CSV
            </button>
          </div>
        </div>

        {/* Quick Operations & Services Distribution */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Quick Operations
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('register')}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Register KYC Customer</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                onClick={onExportCsv}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV / Excel Sheet</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                onClick={() => onNavigate('database')}
                className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-slate-600" />
                  <span>Room SQLite DB Backup</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => onNavigate('android-studio')}
                className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  <span>Download Android Project ZIP</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Service Categories Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Active Service Categories
            </h3>
            <div className="space-y-2.5 text-xs">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (Number(count) / (allServices.length || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
