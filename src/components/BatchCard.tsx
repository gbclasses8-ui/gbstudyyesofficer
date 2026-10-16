import React from 'react';
import { PlayCircle, FileText, Star, Users, ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Batch } from '../types';
import { APP_LOGO } from '../data/coursesData';

interface BatchCardProps {
  batch: Batch;
  onSelect: (batch: Batch) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(batch)}
      className="group relative bg-[#150d1e] hover:bg-[#1a1026] border-2 border-pink-500/30 hover:border-pink-500/80 rounded-2xl overflow-hidden shadow-lg shadow-pink-950/40 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Banner & Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={batch.thumbnail}
          alt={batch.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#150d1e] via-[#150d1e]/40 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-600 text-white shadow-md shadow-pink-600/50">
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>{batch.badge}</span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-pink-300 border border-pink-500/30">
          {batch.category}
        </div>

        {/* Watermark Logo */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-pink-500/30 text-[10px] font-bold text-pink-200">
          <img src={APP_LOGO} alt="" className="w-3.5 h-3.5 rounded object-cover" />
          <span>GB STUDY</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Faculty Header */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="line-clamp-1">{batch.facultySummary}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug mb-2">
            {batch.title}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {batch.tagline}
          </p>
        </div>

        {/* Stats & Meta row */}
        <div>
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-pink-950/20 border border-pink-500/20 mb-4 text-center">
            <div>
              <span className="block text-xs font-extrabold text-white flex items-center justify-center gap-1">
                <PlayCircle className="w-3.5 h-3.5 text-pink-400" />
                {batch.totalLectures}
              </span>
              <span className="text-[10px] text-pink-300/80 font-medium">Lectures</span>
            </div>
            <div className="border-x border-pink-500/20">
              <span className="block text-xs font-extrabold text-white flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                {batch.totalNotes}
              </span>
              <span className="text-[10px] text-pink-300/80 font-medium">PDF Notes</span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-white flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {batch.rating}
              </span>
              <span className="text-[10px] text-pink-300/80 font-medium">Rating</span>
            </div>
          </div>

          {/* Pink Action Buttons: "Let's Study" & "Enroll Free" */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(batch);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:via-rose-400 hover:to-pink-500 rounded-xl shadow-lg shadow-pink-600/30 group-hover:shadow-pink-500/50 transition-all duration-200"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Let&apos;s Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(batch);
              }}
              className="px-3.5 py-2.5 text-xs font-extrabold text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 hover:border-pink-500 rounded-xl transition"
            >
              Enroll Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
