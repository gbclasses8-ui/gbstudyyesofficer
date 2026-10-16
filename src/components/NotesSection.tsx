import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Send, BookOpen, Sparkles, Check } from 'lucide-react';
import { getAllNotesAndPdfs, APP_LOGO, TELEGRAM_LINK } from '../data/coursesData';
import { NotePdf } from '../types';

interface NotesSectionProps {
  onSelectPdf: (pdf: NotePdf) => void;
  onOpenTelegramModal: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ onSelectPdf, onOpenTelegramModal }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allNotes = getAllNotesAndPdfs();

  const filteredNotes = allNotes.filter(note => {
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'FORMULA' && note.type === 'Formula Book') ||
      (filterType === 'DPP' && note.type === 'DPP Sheet') ||
      (filterType === 'CLASS' && note.type === 'Class Notes') ||
      (filterType === 'QUANT' && note.subjectName.toLowerCase().includes('quant')) ||
      (filterType === 'REASONING' && note.subjectName.toLowerCase().includes('reasoning')) ||
      (filterType === 'ENGLISH' && note.subjectName.toLowerCase().includes('english')) ||
      (filterType === 'GA' && note.subjectName.toLowerCase().includes('awareness'));

    const matchesSearch =
      !searchQuery.trim() ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.batchTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0e0716] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/15 text-pink-400 border border-pink-500/30">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Free PDF & Study Material Repository
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            GB STUDY <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500">Notes & DPP Sheets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Download high-yield banking examination handwritten notes, formula books, 120 grammar rules, daily problem sheets, and current affairs capsules.
          </p>
        </div>

        {/* Telegram Promo Banner */}
        <div className="bg-gradient-to-r from-pink-900/60 via-[#1e0f2b] to-pink-950/60 border border-pink-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-pink-950/50">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="" className="w-12 h-12 rounded-xl object-cover border border-pink-500/40" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Want Instant Daily Classroom PDFs on your Phone?
              </h3>
              <p className="text-xs text-pink-300 mt-0.5">
                Join 50,000+ Aspirants receiving direct PDF study packages every single morning on Telegram.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTelegramModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 shrink-0 transition"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram Channel</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#150d1e] border border-pink-500/25 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by subject, formula, DPP, or topic name..."
                className="w-full bg-[#1e112a] border border-pink-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {[
              { id: 'ALL', label: 'All PDFs' },
              { id: 'FORMULA', label: 'Formula Books' },
              { id: 'DPP', label: 'DPP Practice Sheets' },
              { id: 'CLASS', label: 'Class Notes' },
              { id: 'QUANT', label: 'Quant Notes' },
              { id: 'REASONING', label: 'Reasoning Notes' },
              { id: 'ENGLISH', label: 'English Notes' },
              { id: 'GA', label: 'Banking & GA' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  filterType === tab.id
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/40'
                    : 'bg-[#1e112a] text-slate-300 hover:bg-pink-500/15 hover:text-white border border-pink-500/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => onSelectPdf(note)}
              className="bg-[#150d1e] hover:bg-[#1c1128] border-2 border-pink-500/25 hover:border-pink-500/60 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between group shadow-md shadow-pink-950/30 cursor-pointer btn-click-effect"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    {note.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {note.fileSize}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-300 transition line-clamp-2 leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {note.subjectName} • {note.chapterName}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-pink-300/80 mb-4 line-clamp-1">
                  Batch: {note.batchTitle}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-pink-500/15">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPdf(note);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow transition text-center"
                  title="Open full page PDF in new tab"
                >
                  Open Full Page ({note.pages}p)
                </button>
                <a
                  href={note.downloadUrl || TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 rounded-xl transition"
                  title="Direct Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
