import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode2, 
  Folder, 
  FolderOpen, 
  Code, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, AndroidProjectFile } from '../data/androidProjectFiles';
import confetti from 'canvas-confetti';

interface AndroidCodeExplorerProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const AndroidCodeExplorer: React.FC<AndroidCodeExplorerProps> = ({
  onDownloadZip,
  isDownloading
}) => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(
    ANDROID_PROJECT_FILES.find(f => f.name === 'AppDatabase.kt') || ANDROID_PROJECT_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'room', label: 'Room SQLite DB' },
    { id: 'viewmodel', label: 'ViewModels' },
    { id: 'ui', label: 'Compose Material 3 UI' },
    { id: 'gradle', label: 'Gradle Build' },
    { id: 'utils', label: 'CSV & Backup' },
    { id: 'manifest', label: 'Manifest & Res' }
  ];

  const filteredFiles = ANDROID_PROJECT_FILES.filter(f => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'manifest') return f.category === 'manifest' || f.category === 'res';
    return f.category === activeCategoryFilter;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWithConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.3 }
    });
    onDownloadZip();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Top Banner with Download Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production-Ready Kotlin & Gradle Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Android Studio Project Source Code
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Complete, compile-ready Android project structured with Kotlin 2.0, Jetpack Compose Material 3, Room SQLite 2.6 database, CameraX, Canvas digital signature pad, CSV export, and database backup helper.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownloadWithConfetti}
              disabled={isDownloading}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>Download Complete ZIP (.zip)</span>
            </button>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Room SQLite 2.6 + KSP</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>Material 3 Dynamic Theme</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aadhaar & PAN Validator</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Coroutines + StateFlow</span>
          </div>
        </div>
      </div>

      {/* Code Explorer Main IDE Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[640px]">
        {/* IDE Top Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-3">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span>{selectedFile.path}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              {selectedFile.description}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* IDE Body: Split View (File Tree Sidebar + Code Viewer) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Sidebar: File Tree (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 flex flex-col">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-3 border-b border-slate-800 scrollbar-none">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryFilter(c.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeCategoryFilter === c.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="space-y-1 overflow-y-auto max-h-[500px] pr-1 font-mono text-xs">
              {filteredFiles.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 ml-1">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Android Studio Quick Setup Helper */}
            <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to open in Android Studio:</span>
              </p>
              <p>1. Click "Download Complete ZIP (.zip)"</p>
              <p>2. Extract the folder</p>
              <p>3. In Android Studio: <code className="text-indigo-300">File &gt; Open</code></p>
              <p>4. Gradle will sync dependencies and Room KSP</p>
            </div>
          </div>

          {/* Right Code Display Area (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 p-4 sm:p-6 overflow-x-auto flex flex-col justify-between">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto selection:bg-indigo-600 selection:text-white">
              <code>{selectedFile.content}</code>
            </pre>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Path: <code className="text-indigo-300">{selectedFile.path}</code></span>
              <span className="text-[11px]">Ready for Android SDK 24 - 34</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
