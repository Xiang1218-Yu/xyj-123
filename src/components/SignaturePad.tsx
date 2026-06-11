import { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Check, X } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onCancel: () => void;
  signatoryName: string;
  signatoryRoleLabel: string;
}

export default function SignaturePad({ onSave, onCancel, signatoryName, signatoryRoleLabel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1f2937';
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPosRef.current = getPosition(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPosRef.current) return;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
      <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary-900">电子签名</h3>
            <p className="text-sm text-neutral-muted mt-1">
              <span className="font-medium text-primary-700">{signatoryRoleLabel}：</span>
              {signatoryName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative border-2 border-dashed border-primary-300 rounded-xl bg-primary-50/30 h-64">
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-xl cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-neutral-muted text-lg">请在此区域手写签名...</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-muted">
            提示：请使用鼠标或触屏手写签名，签名将作为合同有效凭证
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-neutral-text hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              清除重签
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
            <button
              type="button"
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-800 text-white hover:bg-primary-900 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Check className="w-4 h-4" />
              确认签名
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
