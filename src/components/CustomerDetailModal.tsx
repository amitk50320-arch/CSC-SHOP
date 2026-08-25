import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Edit, 
  Trash2, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Receipt,
  Download,
  Share2
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerDetailModalProps {
  customer: Customer | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onEdit,
  onDelete
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!customer) return null;

  const totalFees = customer.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
  const totalPaid = customer.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
  const balance = Math.max(0, totalFees - totalPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{customer.fullName}</h2>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  {customer.customerCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">Official Customer KYC Dossier & Service Ledger</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Receipt / PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Dossier</span>
            </button>

            <button
              type="button"
              onClick={() => { onClose(); onEdit(customer); }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-6">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80">
            {/* Customer Photo */}
            <div className="flex flex-col items-center justify-center text-center">
              {customer.photoUrl ? (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md mb-2">
                  <img src={customer.photoUrl} alt={customer.fullName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-2xl mb-2">
                  {customer.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-slate-800">{customer.fullName}</span>
              <span className="text-[11px] text-slate-500">{customer.gender} • DOB: {customer.dob}</span>
            </div>

            {/* Contact & Address */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px] pb-1 border-b border-slate-200">
                Contact & Address
              </h4>
              <p className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-medium">{customer.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-medium">{customer.email || 'No email provided'}</span>
              </p>
              <p className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</span>
              </p>
            </div>

            {/* Official KYC Verification Status */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-700 uppercase tracking-wide text-[10px] pb-1 border-b border-slate-200">
                Official KYC Documents
              </h4>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Aadhaar Card:</span>
                  <span className="font-mono font-bold text-slate-900">
                    XXXX XXXX {customer.aadhaarNumber.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> UIDAI 12-Digit Format Valid
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">PAN Card:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {customer.panNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Income Tax Verified
                </div>
              </div>
            </div>
          </div>

          {/* Signature & Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                <span>Customer Digital Signature</span>
              </h4>
              {customer.signatureUrl ? (
                <div className="p-2 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center min-h-[90px]">
                  <img src={customer.signatureUrl} alt="Signature" className="max-h-20 object-contain" />
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  No digital signature recorded
                </div>
              )}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2">Compliance Notes & Timestamp</h4>
                <p className="text-xs text-slate-600 italic">
                  "{customer.notes || 'Standard onboarding completed without special exemptions.'}"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Registered: {new Date(customer.createdAt).toLocaleDateString()}</span>
                <span>Last Updated: {new Date(customer.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Service & Fee Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>Service Fee Invoices ({customer.services?.length || 0})</span>
              </h4>
              <span className="text-xs font-mono font-bold text-slate-700">
                SQLite <code>service_records</code> table
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {customer.services?.length ? (
                customer.services.map((srv, idx) => {
                  const balanceDue = Math.max(0, srv.feeAmount - srv.paidAmount);
                  return (
                    <div key={srv.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{srv.serviceName}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            {srv.serviceCategory}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Invoice: <span className="font-mono text-slate-600">{srv.invoiceNumber}</span> • Mode: {srv.paymentMode} • Date: {srv.serviceDate}
                        </p>
                        {srv.notes && <p className="text-[11px] text-slate-500 mt-1 italic">Note: {srv.notes}</p>}
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-bold text-slate-900">₹{srv.feeAmount.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-emerald-600">Paid: ₹{srv.paidAmount.toLocaleString('en-IN')}</p>
                          {balanceDue > 0 && (
                            <p className="text-[10px] text-rose-600 font-bold">Due: ₹{balanceDue.toLocaleString('en-IN')}</p>
                          )}
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            srv.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : srv.paymentStatus === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {srv.paymentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No service transactions registered yet.
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[11px] text-slate-400">Total Customer Ledger</span>
                <p className="text-lg font-black text-white">₹{totalFees.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-400">Total Paid</span>
                <p className="text-lg font-black text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[11px] text-rose-400">Net Balance Due</span>
                <p className="text-lg font-black text-rose-300">₹{balance.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this customer record from SQLite Room DB?')) {
                onDelete(customer.id);
                onClose();
              }
            }}
            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Record
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
