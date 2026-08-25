import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  Fingerprint, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Database,
  ArrowRight,
  Code
} from 'lucide-react';
import { UserSession } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  onExploreCodeDirectly: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onExploreCodeDirectly
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin123') {
        const session: UserSession = {
          username: username.trim(),
          role: 'Administrator',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        onLoginSuccess(session);
      } else {
        setError('Invalid username or password. Please use default credentials: admin / admin123');
        setLoading(false);
      }
    }, 300);
  };

  const handleBiometricLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const session: UserSession = {
        username: 'admin (Biometrics Verified)',
        role: 'Administrator',
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      onLoginSuccess(session);
    }, 400);
  };

  const fillDefaults = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex flex-col justify-center items-center p-4 selection:bg-blue-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-lg">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Room SQLite 2.6 • Material 3 • Kotlin Jetpack</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-3 transform hover:scale-105 transition-transform">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Hub Studio
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Secure Room SQLite KYC & Service Fee Ledger
            </p>
          </div>

          {/* Default Credentials Callout Box */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 mb-6 text-xs text-amber-900 flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950">Default Credentials</span>
                <button
                  type="button"
                  onClick={fillDefaults}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-amber-100/80 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors"
                >
                  Auto Fill
                </button>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Username: <code className="bg-amber-200/70 px-1 py-0.5 rounded font-mono font-bold text-amber-950">admin</code>
                {'  '}• Password: <code className="bg-amber-200/70 px-1 py-0.5 rounded font-mono font-bold text-amber-950">admin123</code>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Default: admin123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Authenticate & Enter Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Biometric & Code Exploration Shortcut */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleBiometricLogin}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span>Simulate Android Biometric Unlock</span>
            </button>

            <button
              type="button"
              onClick={onExploreCodeDirectly}
              className="w-full py-2 text-indigo-700 hover:text-indigo-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Inspect Android Studio Source Code & Download ZIP</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Ready for Android Studio Ladybug / Koala • Min SDK 24 • Target SDK 34
        </p>
      </div>
    </div>
  );
};
