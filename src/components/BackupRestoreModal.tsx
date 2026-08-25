import React, { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Table, 
  Key, 
  ShieldCheck, 
  Copy, 
  Check,
  Sparkles
} from 'lucide-react';
import { Customer } from '../types';
import { downloadJsonBackup, downloadSqliteDump, generateSqliteDump, saveStoredCustomers } from '../services/storage';
import { INITIAL_CUSTOMERS } from '../data/sampleCustomers';

interface DatabaseBackupViewProps {
  customers: Customer[];
  onCustomersUpdated: (newCustomers: Customer[]) => void;
}

export const DatabaseBackupView: React.FC<DatabaseBackupViewProps> = ({
  customers,
  onCustomersUpdated
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalServices = customers.reduce((acc, c) => acc + (c.services?.length || 0), 0);
  const sqlDump = generateSqliteDump(customers);

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        let newCustomerList: Customer[] = [];
        if (Array.isArray(parsed)) {
          newCustomerList = parsed;
        } else if (parsed.customers && Array.isArray(parsed.customers)) {
          newCustomerList = parsed.customers;
        } else {
          throw new Error('Invalid JSON backup structure');
        }

        if (newCustomerList.length === 0) {
          throw new Error('Backup contains 0 customers');
        }

        saveStoredCustomers(newCustomerList);
        onCustomersUpdated(newCustomerList);
        setSuccessMessage(`Successfully restored ${newCustomerList.length} customer records from backup!`);
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage(`Failed to restore database: ${err.message || 'Invalid format'}`);
        setSuccessMessage(null);
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSample = () => {
    if (confirm('Reset database to default sample records? Current modifications will be replaced.')) {
      saveStoredCustomers(INITIAL_CUSTOMERS);
      onCustomersUpdated(INITIAL_CUSTOMERS);
      setSuccessMessage('Database successfully reset to initial sample customers.');
      setErrorMessage(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Room SQLite Database Management & Backups
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live SQLite schema: <code>customers</code> (Parent) ↔ <code>service_records</code> (Child ForeignKey)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => downloadSqliteDump(customers)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export SQLite .sql Dump</span>
          </button>

          <button
            type="button"
            onClick={() => downloadJsonBackup(customers)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Restore JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={handleResetToSample}
            className="px-3.5 py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset database to initial samples"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Database Schema Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: customers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Table: customers ({customers.length} rows)</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Primary Entity</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-3 py-2">Column Name</th>
                  <th className="px-3 py-2">SQLite Type</th>
                  <th className="px-3 py-2">Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                <tr>
                  <td className="px-3 py-2 text-blue-600 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-500" /> id
                  </td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-500">PRIMARY KEY</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold">customerCode</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-amber-700 font-bold">UNIQUE INDEX</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">fullName</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-500">NOT NULL</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">phone</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-blue-600">INDEX</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-emerald-700 font-bold">aadhaarNumber</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-blue-600">INDEX (12 Digits)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-indigo-700 font-bold">panNumber</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-blue-600">INDEX (10 Chars)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">photoPath</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-400">NULLABLE (URI / Base64)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">signaturePath</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-400">NULLABLE (PNG Canvas)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: service_records */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Table: service_records ({totalServices} rows)</h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Child Entity</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-3 py-2">Column Name</th>
                  <th className="px-3 py-2">SQLite Type</th>
                  <th className="px-3 py-2">Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                <tr>
                  <td className="px-3 py-2 text-indigo-600 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-500" /> id
                  </td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-500">PRIMARY KEY</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-indigo-700 font-bold">customerId</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-indigo-700 font-semibold">FK → customers(id) CASCADE</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">serviceName</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-500">NOT NULL</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">feeAmount</td>
                  <td className="px-3 py-2">REAL</td>
                  <td className="px-3 py-2 text-slate-500">NOT NULL</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">paidAmount</td>
                  <td className="px-3 py-2">REAL</td>
                  <td className="px-3 py-2 text-slate-500">NOT NULL</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">paymentStatus</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-slate-500">Paid / Partial / Pending</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold">invoiceNumber</td>
                  <td className="px-3 py-2">TEXT</td>
                  <td className="px-3 py-2 text-amber-700 font-bold">UNIQUE INDEX</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SQL Dump Viewer */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200">Generated Room SQLite DDL & Insert Statements</h3>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copied SQL' : 'Copy SQL'}</span>
          </button>
        </div>

        <pre className="font-mono text-[11px] text-emerald-400/90 max-h-60 overflow-y-auto overflow-x-auto leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80">
          <code>{sqlDump}</code>
        </pre>
      </div>
    </div>
  );
};
