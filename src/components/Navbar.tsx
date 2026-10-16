import React, { useState } from 'react';
import { Search, Send, Menu, X, BookOpen, Layers, FileText, Bell, Sparkles } from 'lucide-react';
import { APP_LOGO, TELEGRAM_LINK } from '../data/coursesData';

interface NavbarProps {
  currentView: 'home' | 'batches' | 'notes' | 'batch-detail';
  onNavigate: (view: 'home' | 'batches' | 'notes') => void;
  onOpenSearch: () => void;
  onOpenTelegramModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenTelegramModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'batches' | 'notes') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#100918]/95 backdrop-blur-md border-b border-pink-500/20 shadow-lg shadow-pink-950/40">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-pink-700 via-rose-600 to-pink-700 text-white text-[11px] sm:text-xs py-1 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-pink-200 animate-pulse" />
        <span>Free Banking & Exam Preparation Portal • Target SBI, IBPS & RRB 2025-2026</span>
        <button
          onClick={onOpenTelegramModal}
          className="underline hover:text-pink-100 font-extrabold ml-1 inline-flex items-center gap-1"
        >
          Join Telegram <Send className="w-3 h-3" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 shadow-md shadow-pink-500/40 group-hover:scale-105 transition-transform duration-200">
              <img
                src={APP_LOGO}
                alt="GB STUDY"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-[#100918]" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
              GB STUDY
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                PRO
              </span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-pink-300 font-semibold tracking-wider uppercase">
              Free Yes Officer Batches
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
              currentView === 'home'
                ? 'text-white bg-pink-600/30 border border-pink-500/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('batches')}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              currentView === 'batches' || currentView === 'batch-detail'
                ? 'text-white bg-pink-600/30 border border-pink-500/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <Layers className="w-4 h-4 text-pink-400" />
            <span>All Batches</span>
          </button>
          <button
            onClick={() => handleNav('notes')}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              currentView === 'notes'
                ? 'text-white bg-pink-600/30 border border-pink-500/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Notes & PDFs</span>
          </button>
        </nav>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#1b1026] hover:bg-[#251534] border border-pink-500/30 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition shadow-sm"
          >
            <Search className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Search courses, lectures...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-black/40 border border-pink-500/20 rounded text-pink-300 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Telegram Pink CTA */}
          <button
            onClick={onOpenTelegramModal}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:via-rose-400 hover:to-pink-500 rounded-xl shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Join Telegram</span>
            <span className="xs:hidden">Telegram</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-pink-500/30 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#150b1f] border-b border-pink-500/30 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'home' ? 'bg-pink-600 text-white' : 'text-slate-200 bg-[#1c1028]'
            }`}
          >
            <span>Home Page</span>
          </button>

          <button
            onClick={() => handleNav('batches')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'batches' ? 'bg-pink-600 text-white' : 'text-slate-200 bg-[#1c1028]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              All Batches & Courses
            </span>
          </button>

          <button
            onClick={() => handleNav('notes')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'notes' ? 'bg-pink-600 text-white' : 'text-slate-200 bg-[#1c1028]'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-400" />
              Notes, DPP & PDFs
            </span>
          </button>

          <div className="pt-2 border-t border-pink-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTelegramModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-pink-600 to-rose-600 shadow-md shadow-pink-600/40"
            >
              <Send className="w-4 h-4" />
              Join GB STUDY Official Telegram
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
