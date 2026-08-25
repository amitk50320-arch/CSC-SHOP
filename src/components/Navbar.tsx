import React from 'react';
import { 
  Download, 
  Users, 
  UserPlus, 
  Database, 
  FileCode2, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import { UserSession } from '../types';
import confetti from 'canvas-confetti';

interface NavbarProps {
  activeTab: 'dashboard' | 'customers' | 'register' | 'android-studio' | 'database';
  setActiveTab: (tab: 'dashboard' | 'customers' | 'register' | 'android-studio' | 'database') => void;
  session: UserSession | null;
  onLogout: () => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
  totalCustomers: number;
  phoneEmulatorOpen: boolean;
  setPhoneEmulatorOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  session,
  onLogout,
  onDownloadZip,
  isDownloadingZip,
  totalCustomers,
  phoneEmulatorOpen,
  setPhoneEmulatorOpen
}) => {
  const triggerConfettiDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 }
    });
    onDownloadZip();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                  Kanoon & Customer Hub
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Android Studio Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Material 3 • Room SQLite • Aadhaar / PAN KYC • Jetpack Compose
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'customers'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                {totalCustomers}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register KYC</span>
            </button>

            <button
              onClick={() => setActiveTab('android-studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'android-studio'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <FileCode2 className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600" />
              <span>Android Studio Code</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'database'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Room SQLite</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Phone Emulator Toggle */}
            <button
              type="button"
              onClick={() => setPhoneEmulatorOpen(!phoneEmulatorOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                phoneEmulatorOpen
                  ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Android Device Frame Simulation"
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Phone UI</span>
            </button>

            {/* Download Complete Android Studio ZIP */}
            <button
              type="button"
              onClick={triggerConfettiDownload}
              disabled={isDownloadingZip}
              className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isDownloadingZip ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
              <span className="hidden sm:inline">Download Android ZIP</span>
              <span className="sm:hidden">ZIP</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </button>

            {/* User Session & Logout */}
            <div className="flex items-center pl-2 border-l border-slate-200 gap-2">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {session?.username || 'admin'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Administrator
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'customers' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
            }`}
          >
            Customers ({totalCustomers})
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'register' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
            }`}
          >
            Register KYC
          </button>
          <button
            onClick={() => setActiveTab('android-studio')}
            className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap ${
              activeTab === 'android-studio' ? 'bg-indigo-600 text-white' : 'text-indigo-700 bg-indigo-50'
            }`}
          >
            Android Code
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'database' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
            }`}
          >
            Room DB
          </button>
        </div>
      </div>
    </header>
  );
};
