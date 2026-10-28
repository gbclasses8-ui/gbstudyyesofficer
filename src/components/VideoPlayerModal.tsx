import React, { useState } from 'react';
import { X, Play, Maximize2, CheckCircle2, ChevronRight, ChevronLeft, FileText, Send, Sparkles, BookOpen } from 'lucide-react';
import { Lecture, Batch, NotePdf } from '../types';
import { APP_LOGO, TELEGRAM_LINK } from '../data/coursesData';

interface VideoPlayerModalProps {
  lecture: Lecture | null;
  batch: Batch | null;
  onClose: () => void;
  onNextLecture?: () => void;
  onPrevLecture?: () => void;
  onOpenPdf?: (pdf: NotePdf) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lecture,
  batch,
  onClose,
  onNextLecture,
  onPrevLecture,
  onOpenPdf
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTheater, setIsTheater] = useState(false);

  if (!lecture || !batch) return null;

  // Find corresponding PDF if any
  let matchedPdf: NotePdf | undefined;
  if (lecture.hasNotes) {
    batch.subjects.forEach(s => {
      s.chapters.forEach(c => {
        const found = c.notes.find(n => n.id === lecture.notesPdfId);
        if (found) matchedPdf = found;
        if (!matchedPdf && c.notes.length > 0 && c.id === lecture.chapterId) {
          matchedPdf = c.notes[0];
        }
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div 
        className={`relative w-full ${isTheater ? 'max-w-6xl' : 'max-w-4xl'} bg-[#120b18] border-2 border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/30 overflow-hidden flex flex-col my-auto transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 py-3 bg-[#1c1026] border-b border-pink-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={APP_LOGO}
              alt="GB STUDY"
              className="w-8 h-8 rounded-lg object-cover border border-pink-500/50 shadow-sm shadow-pink-500/30 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block truncate">
                GB STUDY • {batch.title}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {lecture.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTheater(!isTheater)}
              title="Toggle Theatre Mode"
              className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition hidden sm:block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-pink-600/30 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full bg-black aspect-video overflow-hidden">
          {lecture.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
              title={lecture.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <iframe
              src={lecture.videoUrl}
              title={lecture.title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          )}

          {/* Top Brand Watermark */}
          <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-pink-500/30 text-[11px] font-bold text-pink-300">
            <img src={APP_LOGO} alt="" className="w-4 h-4 rounded object-cover" />
            <span>GB STUDY</span>
          </div>
        </div>

        {/* Player Controls & Info Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#180e22] to-[#120a1a] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Lecture #{lecture.lectureNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {lecture.chapterTitle}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-pink-400 font-semibold">
                  By {lecture.faculty}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {lecture.description || 'Comprehensive conceptual class covering basic theory, shortcuts, exam questions, and tips for preliminary and mains examination.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-pink-950/40 border-pink-500/30 text-pink-300 hover:bg-pink-900/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              {matchedPdf && onOpenPdf && (
                <button
                  onClick={() => onOpenPdf(matchedPdf!)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 hover:from-pink-500 hover:to-rose-500 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Class PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Controls between lectures */}
          <div className="flex items-center justify-between pt-3 border-t border-pink-500/15 text-xs text-slate-300">
            <button
              onClick={onPrevLecture}
              disabled={!onPrevLecture}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-pink-500/20 transition ${
                onPrevLecture ? 'bg-slate-800/80 hover:bg-pink-600/20 hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Lecture</span>
            </button>

            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Doubt on Telegram</span>
            </a>

            <button
              onClick={onNextLecture}
              disabled={!onNextLecture}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-pink-500/20 transition ${
                onNextLecture ? 'bg-slate-800/80 hover:bg-pink-600/20 hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <span>Next Lecture</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
