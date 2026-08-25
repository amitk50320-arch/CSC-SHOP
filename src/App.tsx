/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Customer, UserSession } from './types';
import { getStoredCustomers, saveStoredCustomers, getStoredSession, saveStoredSession } from './services/storage';
import { exportCustomersToCsv } from './services/csvExport';
import { downloadAndroidProjectZip } from './services/zipGenerator';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { AndroidCodeExplorer } from './components/AndroidCodeExplorer';
import { DatabaseBackupView } from './components/BackupRestoreModal';
import { PhoneEmulator } from './components/PhoneEmulator';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredSession());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'register' | 'android-studio' | 'database'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [phoneEmulatorOpen, setPhoneEmulatorOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    saveStoredCustomers(customers);
  }, [customers]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    saveStoredSession(newSession);
    showToast(`Welcome back, ${newSession.username}! Default login verified.`);
  };

  const handleLogout = () => {
    setSession(null);
    saveStoredSession(null);
    showToast('Logged out successfully.', 'info');
  };

  const handleSaveCustomer = (customer: Customer) => {
    const exists = customers.some(c => c.id === customer.id);
    let updated: Customer[];

    if (exists) {
      updated = customers.map(c => (c.id === customer.id ? customer : c));
      showToast(`Updated customer: ${customer.fullName}`);
    } else {
      updated = [customer, ...customers];
      showToast(`Registered new customer: ${customer.fullName} into Room SQLite!`);
    }

    setCustomers(updated);
    setEditingCustomer(null);
    setActiveTab('customers');
  };

  const handleDeleteCustomer = (id: string) => {
    const target = customers.find(c => c.id === id);
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    showToast(`Deleted customer: ${target?.fullName || 'Record'} from Room SQLite.`, 'info');
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadAndroidProjectZip();
      showToast('Android Studio Project ZIP downloaded successfully! Extract and open in Android Studio.');
    } catch (err) {
      console.error('Error generating project ZIP', err);
      showToast('Failed to create ZIP package. Please try again.', 'error');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleExportCsv = () => {
    exportCustomersToCsv(customers);
    showToast(`Exported ${customers.length} customer records to CSV/Excel.`);
  };

  // If user is not authenticated and hasn't chosen to directly inspect code, show Login Screen
  if (!session) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onExploreCodeDirectly={() => {
          // Allow guest exploration of code with temporary guest session
          setSession({
            username: 'admin (Guest Explorer)',
            role: 'Administrator',
            isAuthenticated: true,
            loginTime: new Date().toISOString()
          });
          setActiveTab('android-studio');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-bounce flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-bold bg-white text-slate-800 border-slate-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setEditingCustomer(null);
          setActiveTab(tab);
        }}
        session={session}
        onLogout={handleLogout}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
        totalCustomers={customers.length}
        phoneEmulatorOpen={phoneEmulatorOpen}
        setPhoneEmulatorOpen={setPhoneEmulatorOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            customers={customers}
            onNavigate={(tab) => {
              setEditingCustomer(null);
              setActiveTab(tab);
            }}
            onSelectCustomer={(cust) => setSelectedCustomer(cust)}
            onExportCsv={handleExportCsv}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {activeTab === 'customers' && !editingCustomer && (
          <CustomerList
            customers={customers}
            onSelectCustomer={(cust) => setSelectedCustomer(cust)}
            onEditCustomer={(cust) => setEditingCustomer(cust)}
            onDeleteCustomer={handleDeleteCustomer}
            onAddNew={() => {
              setEditingCustomer(null);
              setActiveTab('register');
            }}
          />
        )}

        {(activeTab === 'register' || editingCustomer) && (
          <CustomerForm
            initialCustomer={editingCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => {
              setEditingCustomer(null);
              setActiveTab('customers');
            }}
          />
        )}

        {activeTab === 'android-studio' && (
          <AndroidCodeExplorer
            onDownloadZip={handleDownloadZip}
            isDownloading={isDownloadingZip}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseBackupView
            customers={customers}
            onCustomersUpdated={(newCustomers) => {
              setCustomers(newCustomers);
              showToast(`Database updated with ${newCustomers.length} customer records.`);
            }}
          />
        )}
      </main>

      {/* Customer Full Profile & KYC Dossier Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={(cust) => {
            setSelectedCustomer(null);
            setEditingCustomer(cust);
          }}
          onDelete={handleDeleteCustomer}
        />
      )}

      {/* Android Device Mobile Emulator Frame */}
      {phoneEmulatorOpen && (
        <PhoneEmulator
          customers={customers}
          onClose={() => setPhoneEmulatorOpen(false)}
          onOpenRegister={() => {
            setEditingCustomer(null);
            setActiveTab('register');
          }}
          onOpenCustomerDetail={(cust) => setSelectedCustomer(cust)}
        />
      )}
    </div>
  );
}
