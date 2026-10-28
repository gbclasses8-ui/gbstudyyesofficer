import React from 'react';
import { Send, BookOpen, Layers, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { APP_LOGO, TELEGRAM_LINK, TELEGRAM_HANDLE } from '../data/coursesData';

interface FooterProps {
  onNavigate: (view: 'home' | 'batches' | 'notes') => void;
  onOpenTelegramModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTelegramModal }) => {
  return (
    <footer className="bg-[#0c0613] border-t-2 border-pink-500/30 text-slate-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-pink-500/15">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl p-0.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 shadow-md shadow-pink-500/40">
                <img
                  src={APP_LOGO}
                  alt="GB STUDY"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">GB STUDY</span>
                <p className="text-[11px] text-pink-400 font-bold uppercase tracking-wider">
                  Banking Exam Hub
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering bank exam aspirants across India with high quality, free video lectures, class notes, DPP sheets, and exam guidance for SBI, IBPS, RRB and RBI.
            </p>

            <button
              onClick={onOpenTelegramModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Join Telegram ({TELEGRAM_HANDLE})</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-300 transition"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('batches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-300 transition"
                >
                  All Yes Officer Batches
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('notes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-300 transition"
                >
                  Free Notes & DPP PDFs
                </button>
              </li>
              <li>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-300 transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-pink-400" />
                  <span>Official Telegram Updates</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Top Subjects */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-400">
              Featured Subjects
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">
                <span className="text-white font-semibold">Quantitative Aptitude:</span> Aashish Arora Sir
              </li>
              <li className="text-slate-400">
                <span className="text-white font-semibold">Reasoning Ability:</span> Ankush Lamba Sir
              </li>
              <li className="text-slate-400">
                <span className="text-white font-semibold">English Language:</span> Nimisha Bansal Ma&apos;am
              </li>
              <li className="text-slate-400">
                <span className="text-white font-semibold">General & Banking:</span> Kush Pandey Sir
              </li>
              <li className="text-slate-400">
                <span className="text-white font-semibold">Computer Knowledge:</span> Special Modules
              </li>
            </ul>
          </div>

          {/* Exam Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-400">
              Exam Coverage
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['SBI PO 2025', 'SBI Clerk', 'IBPS PO', 'IBPS Clerk', 'RRB Scale 1', 'RRB Assistant', 'RBI Assistant', 'LIC AAO'].map((exam, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-pink-950/30 border border-pink-500/20 text-pink-300 font-medium"
                >
                  {exam}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
              Updated for 2025-2026 exam syllabus, latest exam pattern, and negative marking schemes.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="" className="w-5 h-5 rounded object-cover" />
            <span>© {new Date().getFullYear()} <strong>GB STUDY</strong>. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-bold inline-flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Channel</span>
            </a>
            <span>•</span>
            <span className="text-slate-400">No Login Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
