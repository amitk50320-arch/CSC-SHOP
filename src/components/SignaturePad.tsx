import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Undo, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  initialSignature?: string;
  onSave: (signatureDataUrl: string) => void;
  onClear?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialSignature,
  onSave,
  onClear
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [penColor, setPenColor] = useState('#1e3a8a');
  const [penWidth, setPenWidth] = useState(2.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 380;
    const height = 160;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        setHasSignature(true);
        saveState();
      };
      img.src = initialSignature;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      saveState();
    }
  }, [initialSignature]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-10), state]);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
    exportSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    setHasSignature(false);
    setHistory([]);
    if (onClear) onClear();
    onSave('');
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
      exportSignature();
    }
  };

  const exportSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700">Digital Signature Pad (Stylus / Touch)</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Pen Color Selectors */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
            {[
              { color: '#1e3a8a', label: 'Navy' },
              { color: '#0f172a', label: 'Black' },
              { color: '#047857', label: 'Green' }
            ].map(c => (
              <button
                key={c.color}
                type="button"
                onClick={() => setPenColor(c.color)}
                className={`w-4 h-4 rounded-full transition-transform ${penColor === c.color ? 'scale-125 ring-2 ring-blue-500' : 'opacity-70'}`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={undo}
            disabled={history.length <= 1}
            className="p-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 rounded hover:bg-slate-100 flex items-center gap-1"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 text-xs text-red-600 hover:text-red-800 rounded hover:bg-red-50 flex items-center gap-1 font-medium"
            title="Clear signature"
          >
            <Eraser className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      <div className="relative border border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50/50 touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full block"
        />
        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-medium select-none">
            ✍️ Sign above with finger, stylus, or mouse
          </div>
        )}
      </div>

      {hasSignature && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-600">
          <span className="flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" /> Signature Captured & Ready
          </span>
          <span className="text-slate-400">Stored as PNG blob for Room DB</span>
        </div>
      )}
    </div>
  );
};
