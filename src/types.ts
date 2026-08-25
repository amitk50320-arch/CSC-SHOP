export interface ServiceRecord {
  id: string;
  customerId: string;
  serviceName: string;
  serviceCategory: 'Legal' | 'Taxation' | 'Registration' | 'Documentation' | 'Licensing' | 'Custom';
  feeAmount: number;
  paidAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
  serviceDate: string;
  invoiceNumber: string;
  notes?: string;
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. CUST-2026-001
  fullName: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // KYC details
  aadhaarNumber: string; // 12 digits
  panNumber: string;     // 10 chars e.g. ABCDE1234F
  isAadhaarVerified?: boolean;
  isPanVerified?: boolean;
  
  // Media / Biometrics
  photoUrl?: string;     // Base64 or image URL
  signatureUrl?: string; // Base64 Canvas signature
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Pending Verification';
  
  // Nested or joined services
  services: ServiceRecord[];
}

export interface UserSession {
  username: string;
  role: 'Administrator' | 'Manager' | 'Staff';
  isAuthenticated: boolean;
  loginTime: string;
}

export interface DatabaseBackup {
  version: string;
  schemaVersion: number;
  exportedAt: string;
  app: string;
  customerCount: number;
  serviceCount: number;
  customers: Customer[];
}
