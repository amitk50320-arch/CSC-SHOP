import { Customer, DatabaseBackup, UserSession } from '../types';
import { INITIAL_CUSTOMERS } from '../data/sampleCustomers';

const CUSTOMERS_KEY = 'kanoon_customers_v1';
const SESSION_KEY = 'kanoon_session_v1';

export function getStoredCustomers(): Customer[] {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    if (!data) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading customers from storage', err);
    return INITIAL_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: Customer[]): void {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Error saving customers to storage', err);
  }
}

export function getStoredSession(): UserSession | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

export function saveStoredSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (err) {
    console.error('Error saving session', err);
  }
}

export function exportDatabaseBackup(customers: Customer[]): DatabaseBackup {
  const serviceCount = customers.reduce((acc, c) => acc + (c.services?.length || 0), 0);
  return {
    version: '1.0.0',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    app: 'Customer Room SQLite Hub',
    customerCount: customers.length,
    serviceCount: serviceCount,
    customers: customers
  };
}

export function downloadJsonBackup(customers: Customer[]): void {
  const backup = exportDatabaseBackup(customers);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CustomerRoomHub_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateSqliteDump(customers: Customer[]): string {
  let sql = `-- Room SQLite Database Dump for Customer Hub\n`;
  sql += `-- Generated on ${new Date().toISOString()}\n\n`;
  sql += `CREATE TABLE IF NOT EXISTS customers (\n`;
  sql += `  id TEXT PRIMARY KEY NOT NULL,\n`;
  sql += `  customerCode TEXT NOT NULL UNIQUE,\n`;
  sql += `  fullName TEXT NOT NULL,\n`;
  sql += `  phone TEXT NOT NULL,\n`;
  sql += `  email TEXT NOT NULL,\n`;
  sql += `  gender TEXT NOT NULL,\n`;
  sql += `  dob TEXT NOT NULL,\n`;
  sql += `  address TEXT NOT NULL,\n`;
  sql += `  city TEXT NOT NULL,\n`;
  sql += `  state TEXT NOT NULL,\n`;
  sql += `  pincode TEXT NOT NULL,\n`;
  sql += `  aadhaarNumber TEXT NOT NULL,\n`;
  sql += `  panNumber TEXT NOT NULL,\n`;
  sql += `  isAadhaarVerified INTEGER NOT NULL DEFAULT 0,\n`;
  sql += `  isPanVerified INTEGER NOT NULL DEFAULT 0,\n`;
  sql += `  photoPath TEXT,\n`;
  sql += `  signaturePath TEXT,\n`;
  sql += `  notes TEXT,\n`;
  sql += `  status TEXT NOT NULL DEFAULT 'Active',\n`;
  sql += `  createdAt INTEGER NOT NULL,\n`;
  sql += `  updatedAt INTEGER NOT NULL\n`;
  sql += `);\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS service_records (\n`;
  sql += `  id TEXT PRIMARY KEY NOT NULL,\n`;
  sql += `  customerId TEXT NOT NULL,\n`;
  sql += `  serviceName TEXT NOT NULL,\n`;
  sql += `  serviceCategory TEXT NOT NULL,\n`;
  sql += `  feeAmount REAL NOT NULL,\n`;
  sql += `  paidAmount REAL NOT NULL,\n`;
  sql += `  paymentStatus TEXT NOT NULL,\n`;
  sql += `  paymentMode TEXT NOT NULL,\n`;
  sql += `  serviceDate TEXT NOT NULL,\n`;
  sql += `  invoiceNumber TEXT NOT NULL UNIQUE,\n`;
  sql += `  notes TEXT,\n`;
  sql += `  createdAt INTEGER NOT NULL,\n`;
  sql += `  FOREIGN KEY (customerId) REFERENCES customers (id) ON DELETE CASCADE\n`;
  sql += `);\n\n`;

  customers.forEach(c => {
    const esc = (s?: string) => s ? `'${s.replace(/'/g, "''")}'` : 'NULL';
    const cTime = new Date(c.createdAt || Date.now()).getTime();
    const uTime = new Date(c.updatedAt || Date.now()).getTime();

    sql += `INSERT INTO customers (id, customerCode, fullName, phone, email, gender, dob, address, city, state, pincode, aadhaarNumber, panNumber, isAadhaarVerified, isPanVerified, photoPath, signaturePath, notes, status, createdAt, updatedAt) VALUES (\n`;
    sql += `  ${esc(c.id)}, ${esc(c.customerCode)}, ${esc(c.fullName)}, ${esc(c.phone)}, ${esc(c.email)}, ${esc(c.gender)}, ${esc(c.dob)}, ${esc(c.address)}, ${esc(c.city)}, ${esc(c.state)}, ${esc(c.pincode)}, ${esc(c.aadhaarNumber)}, ${esc(c.panNumber)}, ${c.isAadhaarVerified ? 1 : 0}, ${c.isPanVerified ? 1 : 0}, ${esc(c.photoUrl)}, ${esc(c.signatureUrl)}, ${esc(c.notes)}, ${esc(c.status)}, ${cTime}, ${uTime}\n`;
    sql += `);\n`;

    c.services?.forEach(s => {
      const sTime = Date.now();
      sql += `INSERT INTO service_records (id, customerId, serviceName, serviceCategory, feeAmount, paidAmount, paymentStatus, paymentMode, serviceDate, invoiceNumber, notes, createdAt) VALUES (\n`;
      sql += `  ${esc(s.id)}, ${esc(c.id)}, ${esc(s.serviceName)}, ${esc(s.serviceCategory)}, ${s.feeAmount}, ${s.paidAmount}, ${esc(s.paymentStatus)}, ${esc(s.paymentMode)}, ${esc(s.serviceDate)}, ${esc(s.invoiceNumber)}, ${esc(s.notes)}, ${sTime}\n`;
      sql += `);\n`;
    });
  });

  return sql;
}

export function downloadSqliteDump(customers: Customer[]): void {
  const sql = generateSqliteDump(customers);
  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CustomerHub_SQLite_Room_${new Date().toISOString().slice(0, 10)}.sql`;
  a.click();
  URL.revokeObjectURL(url);
}
