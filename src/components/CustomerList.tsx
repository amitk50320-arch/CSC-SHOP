import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  LayoutGrid, 
  Table as TableIcon,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Customer } from '../types';
import { exportCustomersToCsv } from '../services/csvExport';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onAddNew: () => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onAddNew
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'fees'>('newest');

  // Compute stats
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        customer.fullName.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.aadhaarNumber.includes(q) ||
        customer.panNumber.toLowerCase().includes(q) ||
        customer.customerCode.toLowerCase().includes(q) ||
        customer.city.toLowerCase().includes(q) ||
        customer.services?.some(s => s.serviceName.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'All') return true;
      
      const totalFees = customer.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
      const totalPaid = customer.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
      const balance = Math.max(0, totalFees - totalPaid);

      if (statusFilter === 'Paid') return balance === 0 && totalFees > 0;
      if (statusFilter === 'Partial') return totalPaid > 0 && balance > 0;
      if (statusFilter === 'Pending') return totalPaid === 0 && totalFees > 0;
      if (statusFilter === 'NoServices') return !customer.services || customer.services.length === 0;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'fees') {
        const feesA = a.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
        const feesB = b.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
        return feesB - feesA;
      }
      return 0;
    });
  }, [customers, searchQuery, statusFilter, sortBy]);

  const handleExportCsv = () => {
    exportCustomersToCsv(filteredCustomers, `Customers_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Customer Directory & KYC Records</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {filteredCustomers.length} records
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Room SQLite reactive queries with Aadhaar / PAN indexes
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CSV Export */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export filtered records to Microsoft Excel compatible CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV / Excel</span>
          </button>

          {/* Add Customer */}
          <button
            type="button"
            onClick={onAddNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Customer</span>
          </button>
        </div>
      </div>

      {/* Search, Filters, and View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, PAN, Aadhaar, Phone, Service, City..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="fees">Highest Fees</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                title="Data Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Fee Status:
          </span>
          {[
            { id: 'All', label: 'All Records' },
            { id: 'Paid', label: 'Paid in Full' },
            { id: 'Partial', label: 'Partial Balance' },
            { id: 'Pending', label: 'Unpaid / Pending' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            No customer records matched your search query "{searchQuery}" or selected filter.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* View Mode 1: GRID CARDS */}
      {viewMode === 'grid' && filteredCustomers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map(customer => {
            const totalFees = customer.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
            const totalPaid = customer.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
            const balance = Math.max(0, totalFees - totalPaid);
            const isPaid = balance === 0 && totalFees > 0;
            const isPartial = totalPaid > 0 && balance > 0;

            return (
              <div
                key={customer.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  {/* Top Bar: Code + Status Badge */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {customer.customerCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800'
                          : totalFees === 0
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPaid ? 'Paid' : isPartial ? 'Partial Paid' : totalFees === 0 ? 'No Service' : 'Payment Due'}
                    </span>
                  </div>

                  {/* Customer Header (Photo + Name) */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="relative shrink-0">
                      {customer.photoUrl ? (
                        <img
                          src={customer.photoUrl}
                          alt={customer.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {customer.fullName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {customer.isAadhaarVerified && customer.isPanVerified && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[8px]" title="Fully KYC Verified">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => onSelectCustomer(customer)}
                        className="text-sm font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer truncate transition-colors"
                      >
                        {customer.fullName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{customer.phone}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{customer.city}, {customer.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* KYC Pills */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Aadhaar</span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        XXXX XXXX {customer.aadhaarNumber.slice(-4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">PAN No</span>
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {customer.panNumber}
                      </span>
                    </div>
                  </div>

                  {/* Services & Fees Info */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Total Services:</span>
                      <span className="font-bold text-slate-800">{customer.services?.length || 0} registered</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Total Fees:</span>
                      <span className="font-bold text-slate-900">₹{totalFees.toLocaleString('en-IN')}</span>
                    </div>
                    {balance > 0 ? (
                      <div className="flex items-center justify-between font-bold text-rose-600">
                        <span>Balance Due:</span>
                        <span>₹{balance.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between font-semibold text-emerald-600">
                        <span>Collected:</span>
                        <span>₹{totalPaid.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditCustomer(customer)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Customer from Room DB"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCustomer(customer)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: DATA TABLE */}
      {viewMode === 'table' && filteredCustomers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code & Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Aadhaar / PAN</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Fee Status</th>
                  <th className="px-4 py-3 text-right">Total / Balance</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCustomers.map(customer => {
                  const totalFees = customer.services?.reduce((acc, s) => acc + s.feeAmount, 0) || 0;
                  const totalPaid = customer.services?.reduce((acc, s) => acc + s.paidAmount, 0) || 0;
                  const balance = Math.max(0, totalFees - totalPaid);
                  const isPaid = balance === 0 && totalFees > 0;
                  const isPartial = totalPaid > 0 && balance > 0;

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {customer.photoUrl ? (
                            <img
                              src={customer.photoUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                              {customer.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectCustomer(customer)}
                              className="font-bold text-slate-900 hover:text-blue-600 text-left"
                            >
                              {customer.fullName}
                            </button>
                            <p className="text-[10px] text-slate-400 font-mono">{customer.customerCode}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <p className="text-slate-800 font-medium">{customer.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{customer.email || '-'}</p>
                      </td>

                      {/* Aadhaar / PAN */}
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <p className="text-slate-700">Aadhaar: <span className="font-bold">XXXX {customer.aadhaarNumber.slice(-4)}</span></p>
                        <p className="text-indigo-700">PAN: <span className="font-bold">{customer.panNumber}</span></p>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <p className="text-slate-800">{customer.city}</p>
                        <p className="text-[11px] text-slate-400">{customer.state}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPartial
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                        </span>
                      </td>

                      {/* Total / Balance */}
                      <td className="px-4 py-3 text-right font-mono">
                        <p className="font-bold text-slate-900">₹{totalFees.toLocaleString('en-IN')}</p>
                        {balance > 0 ? (
                          <p className="text-[10px] text-rose-600 font-bold">Due: ₹{balance.toLocaleString('en-IN')}</p>
                        ) : (
                          <p className="text-[10px] text-emerald-600 font-bold">Paid Full</p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectCustomer(customer)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditCustomer(customer)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCustomer(customer.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
