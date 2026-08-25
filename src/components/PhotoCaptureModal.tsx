import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw, User, Image as ImageIcon } from 'lucide-react';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (dataUrl: string) => void;
  currentPhoto?: string;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected,
  currentPhoto
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'presets'>('camera');
  const [previewImage, setPreviewImage] = useState<string | null>(currentPhoto || null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample avatar presets
  const presets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
  ];

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Webcam API is not available in this browser environment. You can upload a photo or pick a preset.');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera access not granted or unavailable. Please use file upload or preset.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewImage(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (previewImage) {
      onPhotoSelected(previewImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Customer Passport Photo</h3>
              <p className="text-xs text-slate-500">Camera snapshot, device upload, or preset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 m-3 rounded-xl">
          <button
            type="button"
            onClick={() => { setActiveTab('camera'); setPreviewImage(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'camera' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Camera className="w-3.5 h-3.5" /> Live Camera
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Upload className="w-3.5 h-3.5" /> File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'presets' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <User className="w-3.5 h-3.5" /> Presets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex-1 flex flex-col items-center justify-center min-h-[260px]">
          {previewImage ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake / Change
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            <div className="w-full flex flex-col items-center">
              {cameraError ? (
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  <p className="font-semibold mb-1">Camera Stream Unavailable</p>
                  <p className="text-amber-700 mb-3">{cameraError}</p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 font-medium rounded-lg text-xs"
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('presets')}
                      className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 font-medium rounded-lg text-xs"
                    >
                      Select Preset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="relative w-56 h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                    <div className="absolute inset-4 border border-dashed border-white/50 rounded-xl pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" /> Capture Snapshot
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'upload' ? (
            <div className="w-full flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">Click to choose image file</p>
                  <p className="text-[11px] text-slate-400">PNG, JPG or WEBP up to 5MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-xs text-slate-500 mb-2.5 text-center font-medium">Select a sample passport photo preset:</p>
              <div className="grid grid-cols-3 gap-2.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewImage(preset)}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!previewImage}
            onClick={handleConfirm}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Use This Photo
          </button>
        </div>
      </div>
    </div>
  );
};
