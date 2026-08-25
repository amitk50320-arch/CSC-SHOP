import React, { useState } from 'react';
import { 
  Save, 
  UserPlus, 
  Camera, 
  PenTool, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Customer, ServiceRecord } from '../types';
import { SignaturePad } from './SignaturePad';
import { PhotoCaptureModal } from './PhotoCaptureModal';

interface CustomerFormProps {
  onSave: (customer: Customer) => void;
  onCancel: () => void;
  initialCustomer?: Customer | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSave,
  onCancel,
  initialCustomer
}) => {
  // Personal Info
  const [fullName, setFullName] = useState(initialCustomer?.fullName || '');
  const [phone, setPhone] = useState(initialCustomer?.phone || '');
  const [email, setEmail] = useState(initialCustomer?.email || '');
  const [gender, setGender] = useState<Customer['gender']>(initialCustomer?.gender || 'Male');
  const [dob, setDob] = useState(initialCustomer?.dob || '1992-07-20');
  const [address, setAddress] = useState(initialCustomer?.address || '');
  const [city, setCity] = useState(initialCustomer?.city || '');
  const [state, setState] = useState(initialCustomer?.state || 'Delhi');
  const [pincode, setPincode] = useState(initialCustomer?.pincode || '');

  // KYC Fields
  const [aadhaarNumber, setAadhaarNumber] = useState(initialCustomer?.aadhaarNumber || '');
  const [maskAadhaar, setMaskAadhaar] = useState(false);
  const [panNumber, setPanNumber] = useState(initialCustomer?.panNumber || '');

  // Media
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialCustomer?.photoUrl);
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>(initialCustomer?.signatureUrl);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Services
  const [services, setServices] = useState<ServiceRecord[]>(
    initialCustomer?.services?.length
      ? initialCustomer.services
      : [
          {
            id: `srv-${Date.now()}`,
            customerId: initialCustomer?.id || '',
            serviceName: 'GST Registration & Filing',
            serviceCategory: 'Taxation',
            feeAmount: 4500,
            paidAmount: 4500,
            paymentStatus: 'Paid',
            paymentMode: 'UPI',
            serviceDate: new Date().toISOString().slice(0, 10),
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            notes: 'Standard consultation and GST portal filing.'
          }
        ]
  );

  const [notes, setNotes] = useState(initialCustomer?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Aadhaar formatter: only numeric, max 12
  const handleAadhaarChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(raw);
  };

  // PAN formatter: 10 chars uppercase
  const handlePanChange = (val: string) => {
    const raw = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(raw);
  };

  const isAadhaarValid = aadhaarNumber.length === 12;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);

  // Service Management
  const addService = () => {
    const newService: ServiceRecord = {
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      customerId: initialCustomer?.id || '',
      serviceName: 'Affidavit & Agreement Drafting',
      serviceCategory: 'Documentation',
      feeAmount: 2500,
      paidAmount: 2500,
      paymentStatus: 'Paid',
      paymentMode: 'UPI',
      serviceDate: new Date().toISOString().slice(0, 10),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: ''
    };
    setServices([...services, newService]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof ServiceRecord, value: any) => {
    const updated = [...services];
    const item = { ...updated[index], [field]: value };
    
    // Auto calculate status if fee or paid changed
    if (field === 'feeAmount' || field === 'paidAmount') {
      const fee = field === 'feeAmount' ? Number(value) || 0 : item.feeAmount;
      const paid = field === 'paidAmount' ? Number(value) || 0 : item.paidAmount;
      if (paid >= fee && fee > 0) {
        item.paymentStatus = 'Paid';
      } else if (paid > 0 && paid < fee) {
        item.paymentStatus = 'Partial';
      } else {
        item.paymentStatus = 'Pending';
      }
    }
    
    updated[index] = item;
    setServices(updated);
  };

  // Demo auto-filler
  const fillSampleData = () => {
    setFullName('Suresh Ramanathan');
    setPhone('+91 98401 23456');
    setEmail('suresh.r@chennailogistics.in');
    setGender('Male');
    setDob('1984-04-12');
    setAddress('88 Anna Salai, Mount Road');
    setCity('Chennai');
    setState('Tamil Nadu');
    setPincode('600002');
    setAadhaarNumber('987654321098');
    setPanNumber('AAQPR9876Q');
    setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300');
    setNotes('Import Export License consultation and MSME Udyam registration.');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Mobile number is required';
    if (!aadhaarNumber) newErrors.aadhaarNumber = 'Aadhaar number is required';
    else if (aadhaarNumber.length !== 12) newErrors.aadhaarNumber = 'Aadhaar must be exactly 12 digits';
    
    if (!panNumber) newErrors.panNumber = 'PAN number is required';
    else if (!isPanValid) newErrors.panNumber = 'PAN must match format: ABCDE1234F';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const custId = initialCustomer?.id || `cust-${Date.now()}`;
    const custCode = initialCustomer?.customerCode || `CUST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const formattedServices = services.map(s => ({
      ...s,
      customerId: custId
    }));

    const customer: Customer = {
      id: custId,
      customerCode: custCode,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gender,
      dob,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      aadhaarNumber,
      panNumber: panNumber.toUpperCase(),
      isAadhaarVerified: isAadhaarValid,
      isPanVerified: isPanValid,
      photoUrl,
      signatureUrl,
      createdAt: initialCustomer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active',
      notes,
      services: formattedServices
    };

    onSave(customer);
  };

  const totalFees = services.reduce((acc, s) => acc + (Number(s.feeAmount) || 0), 0);
  const totalPaid = services.reduce((acc, s) => acc + (Number(s.paidAmount) || 0), 0);
  const totalBalance = Math.max(0, totalFees - totalPaid);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {initialCustomer ? 'Edit Customer KYC & Services' : 'Register New Customer'}
            </h1>
            <p className="text-xs text-slate-500">
              Room SQLite Schema with PAN, Aadhaar, Photo & Signature
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillSampleData}
            className="px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Sample Data</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Personal Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Verma"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh.verma@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No, Street, Landmark"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN Code</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6 digits PIN"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Official KYC Documents (Aadhaar & PAN) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Identity & KYC Verification (Aadhaar / PAN)
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Government Compliant Schema
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aadhaar Field */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Aadhaar Number (12 Digits)</span>
                  <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMaskAadhaar(!maskAadhaar)}
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium"
                >
                  {maskAadhaar ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{maskAadhaar ? 'Unmask' : 'Mask'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={
                    maskAadhaar && aadhaarNumber.length === 12
                      ? `XXXX XXXX ${aadhaarNumber.slice(8)}`
                      : aadhaarNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
                  }
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  placeholder="e.g. 1234 5678 9012"
                  className={`w-full px-3.5 py-2.5 bg-white border ${errors.aadhaarNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isAadhaarValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {aadhaarNumber.length}/12
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px]">
                <span className={isAadhaarValid ? 'text-emerald-600 font-semibold flex items-center gap-1' : 'text-slate-400'}>
                  {isAadhaarValid ? '✓ 12-Digit Aadhaar Format Validated' : 'Must contain exactly 12 digits'}
                </span>
                <span className="text-slate-400">UIDAI SQLite Indexed</span>
              </div>
              {errors.aadhaarNumber && <p className="text-[11px] text-red-500 mt-1">{errors.aadhaarNumber}</p>}
            </div>

            {/* PAN Field */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>PAN Card Number (10 Chars)</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Format: AAAAA9999A</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => handlePanChange(e.target.value)}
                  placeholder="e.g. ABCDE1234F"
                  className={`w-full px-3.5 py-2.5 bg-white border ${errors.panNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isPanValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {panNumber.length}/10
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px]">
                <span className={isPanValid ? 'text-emerald-600 font-semibold flex items-center gap-1' : 'text-slate-400'}>
                  {isPanValid ? '✓ Valid Income Tax Dept PAN Regex' : '5 Alphabets + 4 Digits + 1 Alphabet'}
                </span>
                <span className="text-slate-400">ITD Format</span>
              </div>
              {errors.panNumber && <p className="text-[11px] text-red-500 mt-1">{errors.panNumber}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Photo & Digital Signature Capture */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Photo & Digital Signature Selection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Passport Photo */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Customer Passport Photo</span>
                  </label>
                  {photoUrl && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {photoUrl ? (
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md bg-white">
                      <img src={photoUrl} alt="Customer" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-white">
                      <Camera className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-[10px] font-medium">No Photo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{photoUrl ? 'Change / Take Photo' : 'Take or Upload Photo'}</span>
                    </button>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(undefined)}
                        className="w-full py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Saved into SQLite Room entity and exportable in KYC dossiers.
              </p>
            </div>

            {/* Signature Pad */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>Digital Signature Pad</span>
              </label>
              <SignaturePad
                initialSignature={signatureUrl}
                onSave={(sig) => setSignatureUrl(sig)}
                onClear={() => setSignatureUrl(undefined)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Service & Fee Records */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Services & Fee Records
                </h2>
                <p className="text-xs text-slate-500">
                  Multiple service entries with invoice numbering & payment mode
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addService}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Another Service
            </button>
          </div>

          {/* Service items */}
          <div className="space-y-4">
            {services.map((srv, idx) => {
              const balance = Math.max(0, (Number(srv.feeAmount) || 0) - (Number(srv.paidAmount) || 0));
              return (
                <div
                  key={srv.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        Item #{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {srv.invoiceNumber}
                      </span>
                    </div>

                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Service Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        value={srv.serviceName}
                        onChange={(e) => updateService(idx, 'serviceName', e.target.value)}
                        placeholder="e.g. GST Annual Filing / Trademark"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Category
                      </label>
                      <select
                        value={srv.serviceCategory}
                        onChange={(e) => updateService(idx, 'serviceCategory', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Legal">Legal Consultation</option>
                        <option value="Taxation">Taxation & GST</option>
                        <option value="Registration">Company Registration</option>
                        <option value="Documentation">Affidavits & Deeds</option>
                        <option value="Licensing">FSSAI / IEC Licensing</option>
                        <option value="Custom">Custom Service</option>
                      </select>
                    </div>

                    {/* Service Date */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Service Date
                      </label>
                      <input
                        type="date"
                        value={srv.serviceDate}
                        onChange={(e) => updateService(idx, 'serviceDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Total Fee */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Total Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={srv.feeAmount}
                        onChange={(e) => updateService(idx, 'feeAmount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Paid Fee */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Paid Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={srv.paidAmount}
                        onChange={(e) => updateService(idx, 'paidAmount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Payment Mode */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={srv.paymentMode}
                        onChange={(e) => updateService(idx, 'paymentMode', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="UPI">UPI / QR Code</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Card">Credit / Debit Card</option>
                      </select>
                    </div>

                    {/* Status & Balance Badge */}
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-400 mb-1">Payment Status</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            srv.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : srv.paymentStatus === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {srv.paymentStatus}
                        </span>
                        {balance > 0 && (
                          <span className="text-[11px] font-semibold text-rose-600">
                            Due: ₹{balance.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fee Summary Bar */}
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-300 font-medium">Fee Summary Ledger</span>
              <div className="flex items-center gap-6 mt-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Total Fees</span>
                  <p className="text-base font-extrabold text-white">₹{totalFees.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase">Paid Total</span>
                  <p className="text-base font-extrabold text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-rose-400 uppercase">Balance Due</span>
                  <p className="text-base font-extrabold text-rose-300">₹{totalBalance.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-indigo-300">
                Foreign Key: customerId in <code>service_records</code> table
              </span>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Internal Case & Compliance Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add special instructions, client background, or follow-up milestones..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Record to Room SQLite</span>
          </button>
        </div>
      </form>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoSelected={(photo) => setPhotoUrl(photo)}
        currentPhoto={photoUrl}
      />
    </div>
  );
};
