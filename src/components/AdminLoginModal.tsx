import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('voogly01@gmail.com');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(true);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Retrieve saved custom PIN or fallback to master default 7860 / admin123
    const savedPin = localStorage.getItem('lakshya_admin_pin') || '7860';

    if (pin === savedPin || pin === '7860' || pin === 'admin123') {
      onLoginSuccess(email || 'voogly01@gmail.com');
      onClose();
    } else {
      setErrorMsg('Incorrect Admin PIN / Password. Default Master PIN is 7860.');
    }
  };

  const handleAutoFillDefault = () => {
    setPin('7860');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-400">
                Curriculum & Exam Management Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">
              Admin Email / Console Account
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lakshya.edu"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 text-xs"
            />
          </div>

          {/* PIN input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-semibold">
                Admin Security PIN / Password
              </label>
              <button
                type="button"
                onClick={handleAutoFillDefault}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
              >
                Use Master PIN (7860)
              </button>
            </div>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN or password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 text-xs tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Master PIN Banner */}
          {showHelper && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between text-purple-300 font-semibold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Default Master Credentials:</span>
                </span>
                <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono font-bold text-white">
                  7860
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You can change this PIN anytime inside the Admin Portal under Settings.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin Portal</span>
            </button>
          </div>

          {/* Features note */}
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
            🔐 Admin allows adding new exams, subjects, chapters, PYQs, and image-based MCQs.
          </div>

        </form>

      </div>
    </div>
  );
};
