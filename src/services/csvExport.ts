import { Customer } from '../types';

export function exportCustomersToCsv(customers: Customer[], filename?: string): void {
  // UTF-8 BOM for Excel compatibility (\uFEFF)
  let csvContent = '\uFEFF';
  
  // Headers
  const headers = [
    'Customer Code',
    'Full Name',
    'Phone',
    'Email',
    'Gender',
    'DOB',
    'Address',
    'City',
    'State',
    'PIN Code',
    'Aadhaar Number',
    'PAN Number',
    'KYC Status',
    'Service Name',
    'Category',
    'Fee (INR)',
    'Paid (INR)',
    'Balance (INR)',
    'Payment Status',
    'Payment Mode',
    'Invoice No',
    'Service Date',
    'Customer Created Date'
  ];

  csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';

  customers.forEach(customer => {
    const kycStatus = customer.isAadhaarVerified && customer.isPanVerified ? 'Fully Verified' : 'Pending';
    
    if (!customer.services || customer.services.length === 0) {
      const row = [
        customer.customerCode,
        customer.fullName,
        customer.phone,
        customer.email,
        customer.gender,
        customer.dob,
        customer.address,
        customer.city,
        customer.state,
        customer.pincode,
        `'${customer.aadhaarNumber}`, // Single quote forces Excel to treat as string
        customer.panNumber,
        kycStatus,
        'N/A (No Services)',
        '-',
        0,
        0,
        0,
        'No Services',
        '-',
        '-',
        '-',
        customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'
      ];
      csvContent += row.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(',') + '\r\n';
    } else {
      customer.services.forEach(srv => {
        const balance = Math.max(0, srv.feeAmount - srv.paidAmount);
        const row = [
          customer.customerCode,
          customer.fullName,
          customer.phone,
          customer.email,
          customer.gender,
          customer.dob,
          customer.address,
          customer.city,
          customer.state,
          customer.pincode,
          `'${customer.aadhaarNumber}`,
          customer.panNumber,
          kycStatus,
          srv.serviceName,
          srv.serviceCategory,
          srv.feeAmount,
          srv.paidAmount,
          balance,
          srv.paymentStatus,
          srv.paymentMode,
          srv.invoiceNumber,
          srv.serviceDate,
          customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'
        ];
        csvContent += row.map(val => `"${String(val !== undefined && val !== null ? val : '').replace(/"/g, '""')}"`).join(',') + '\r\n';
      });
    }
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `Customer_Database_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
