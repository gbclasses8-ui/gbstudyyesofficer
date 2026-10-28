import React from 'react';
import { Send, X, ShieldCheck, Sparkles, Bell } from 'lucide-react';
import { APP_LOGO, TELEGRAM_LINK } from '../services/api';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#18111e] to-[#0e0a14] border-2 border-pink-500/50 rounded-2xl shadow-2xl shadow-pink-500/20 overflow-hidden text-center p-6 sm:p-7 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-600/25 blur-3xl rounded-full pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-pink-500/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Icon Header */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 shadow-lg shadow-pink-500/40">
          <img
            src={APP_LOGO}
            alt="GB STUDY"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              // fallback if network issue
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-pink-600 text-white rounded-full p-1.5 shadow-md">
            <Send className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/15 text-pink-400 border border-pink-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Official Channel
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500">GB STUDY</span> Telegram Channel
        </h2>

        {/* Subtitle / Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Get instant access to free batch updates, daily handwritten class notes, 
          DPP sheets, current affairs capsules, and direct exam notifications!
        </p>

        {/* Features list */}
        <div className="bg-pink-950/30 border border-pink-500/20 rounded-xl p-3.5 mb-6 text-left space-y-2 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
            <span>100% Free daily Banking & SSC study materials</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Latest notifications for Aashish Sir & Ankush Sir classes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleJoin}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-bold text-white bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:via-rose-400 hover:to-pink-500 rounded-xl shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
          >
            Close
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Over 50,000+ students already learning together with GB STUDY
        </p>
      </div>
    </div>
  );
};
