import React, { useState } from 'react';
import { 
  ArrowLeft, PlayCircle, FileText, Star, Clock, CheckCircle, 
  Send, Share2, Layers, BookOpen, ChevronDown, ChevronUp, User, Sparkles, Download
} from 'lucide-react';
import { Batch, Subject, Chapter, Lecture, NotePdf } from '../types';
import { APP_LOGO, TELEGRAM_LINK } from '../data/coursesData';

interface BatchDetailViewProps {
  batch: Batch;
  onBack: () => void;
  onSelectLecture: (lecture: Lecture, batch: Batch) => void;
  onSelectPdf: (pdf: NotePdf) => void;
  onOpenTelegramModal: () => void;
}

export const BatchDetailView: React.FC<BatchDetailViewProps> = ({
  batch,
  onBack,
  onSelectLecture,
  onSelectPdf,
  onOpenTelegramModal
}) => {
  const [activeTab, setActiveTab] = useState<'lectures' | 'notes' | 'overview'>('lectures');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    batch.subjects.length > 0 ? batch.subjects[0].id : ''
  );
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Open all chapters by default for easy access
    const initial: Record<string, boolean> = {};
    batch.subjects.forEach(s => {
      s.chapters.forEach(c => {
        initial[c.id] = true;
      });
    });
    return initial;
  });

  const activeSubject = batch.subjects.find(s => s.id === selectedSubjectId) || batch.subjects[0];

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Collect all notes for the active batch
  const allBatchNotes: NotePdf[] = [];
  batch.subjects.forEach(s => {
    s.chapters.forEach(c => {
      allBatchNotes.push(...c.notes);
    });
  });

  return (
    <div className="min-h-screen bg-[#0e0716] text-slate-100 pb-20">
      {/* Back button navigation bar */}
      <div className="sticky top-16 sm:top-18 z-30 bg-[#140b20]/95 backdrop-blur-md border-b border-pink-500/20 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 text-pink-300 hover:text-white text-xs sm:text-sm font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Batches</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs text-slate-400">
              Exam: <strong className="text-pink-300">{batch.targetExams.join(', ')}</strong>
            </span>
            <button
              onClick={onOpenTelegramModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get Batch on Telegram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-b from-[#1e0f2d] via-[#140a1e] to-[#0e0716] border-b border-pink-500/20 pt-8 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-600 text-white shadow-md shadow-pink-600/40">
                {batch.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                {batch.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Validity: <span className="text-pink-400 font-bold">{batch.validity}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {batch.title}
            </h1>

            <p className="text-sm sm:text-base text-pink-200/90 leading-relaxed font-medium">
              {batch.tagline}
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-pink-400 font-bold">
              <User className="w-4 h-4 shrink-0" />
              <span>Faculties: {batch.facultySummary}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {batch.description}
            </p>

            {/* Target Exams Tags */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 mr-2">Target Exams:</span>
              <div className="inline-flex flex-wrap gap-1.5">
                {batch.targetExams.map((exam, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-pink-300 border border-pink-500/20"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{batch.rating}</span>
                <span className="text-xs text-slate-400">({batch.reviewsCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <PlayCircle className="w-4 h-4 text-pink-400" />
                <span>{batch.totalLectures} Video Lectures</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <FileText className="w-4 h-4 text-pink-400" />
                <span>{batch.totalNotes} DPP & Notes PDFs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Card preview / CTA */}
          <div className="lg:col-span-4">
            <div className="bg-[#1a0f26] border-2 border-pink-500/40 rounded-2xl p-5 shadow-xl shadow-pink-500/20 space-y-4">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-pink-500/30">
                <img
                  src={batch.thumbnail}
                  alt={batch.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg shadow-pink-600/50 animate-pulse">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Start Studying CTA Buttons */}
              <button
                onClick={() => {
                  // Play first lecture
                  if (batch.subjects[0]?.chapters[0]?.lectures[0]) {
                    onSelectLecture(batch.subjects[0].chapters[0].lectures[0], batch);
                  }
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:via-rose-400 hover:to-pink-500 text-white rounded-xl font-black text-sm shadow-lg shadow-pink-600/40 transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Learning / Let&apos;s Study</span>
              </button>

              <button
                onClick={onOpenTelegramModal}
                className="w-full py-3 px-4 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 text-pink-300 hover:text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Get Daily Study Material on Telegram</span>
              </button>

              <div className="text-center">
                <p className="text-[11px] text-pink-300/80">
                  ⚡ 100% Free Full Course Access • No Login Required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs: Lectures vs Notes vs Overview */}
        <div className="flex items-center gap-2 border-b border-pink-500/20 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lectures')}
            className={`px-4 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'lectures'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Course Lectures ({batch.totalLectures})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'notes'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes & DPP PDFs ({allBatchNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40'
                : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Batch Syllabus & Features</span>
          </button>
        </div>

        {/* Tab 1: Course Lectures */}
        {activeTab === 'lectures' && (
          <div className="space-y-6">
            {/* Subject Selector Tabs */}
            {batch.subjects.length > 1 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Subject / Educator:
                </span>
                <div className="flex flex-wrap gap-2">
                  {batch.subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border ${
                        selectedSubjectId === subject.id
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md shadow-pink-600/30'
                          : 'bg-[#180e22] text-slate-300 border-pink-500/20 hover:border-pink-500/50 hover:text-white'
                      }`}
                    >
                      <span>{subject.name}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/40 text-pink-300 font-semibold">
                        {subject.faculty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Subject Faculty Info */}
            {activeSubject && (
              <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/20 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-400" />
                    <span>Faculty: {activeSubject.faculty}</span>
                    <span className="text-xs text-pink-300 font-normal">({activeSubject.facultyRole})</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Subject: <strong>{activeSubject.name}</strong> • Total {activeSubject.chapters.length} Chapters
                  </p>
                </div>
                <button
                  onClick={onOpenTelegramModal}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Discussion</span>
                </button>
              </div>
            )}

            {/* Chapters and Lectures Accordions */}
            <div className="space-y-4">
              {activeSubject?.chapters.map(chapter => {
                const isExpanded = expandedChapters[chapter.id] ?? true;
                return (
                  <div
                    key={chapter.id}
                    className="bg-[#160d21] border border-pink-500/25 rounded-2xl overflow-hidden shadow-md"
                  >
                    {/* Chapter Header */}
                    <div
                      onClick={() => toggleChapter(chapter.id)}
                      className="p-4 sm:p-5 bg-gradient-to-r from-[#1c102b] to-[#160d21] flex items-center justify-between cursor-pointer hover:bg-[#221334] transition select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          #{chapter.order}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                            {chapter.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {chapter.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-xs font-semibold text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                          {chapter.lectures.length} Lectures
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-pink-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-pink-400" />
                        )}
                      </div>
                    </div>

                    {/* Chapter Lectures & Notes List */}
                    {isExpanded && (
                      <div className="p-3 sm:p-4 space-y-2.5 bg-[#12091c] border-t border-pink-500/15">
                        {chapter.lectures.map(lecture => (
                          <div
                            key={lecture.id}
                            onClick={() => onSelectLecture(lecture, batch)}
                            className="p-3 bg-[#190e24] hover:bg-[#231433] border border-pink-500/15 hover:border-pink-500/50 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30 group-hover:scale-105 transition">
                                <PlayCircle className="w-6 h-6 text-pink-400" />
                                <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-pink-600 text-white px-1 rounded">
                                  L{lecture.lectureNumber}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition line-clamp-2">
                                  {lecture.title}
                                </h5>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                                  <span className="text-pink-400 font-semibold">{lecture.faculty}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {lecture.duration}
                                  </span>
                                  <span>•</span>
                                  <span>{lecture.dateUploaded}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons for Lecture */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {lecture.hasNotes && chapter.notes.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPdf(chapter.notes[0]);
                                  }}
                                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-pink-950/50 hover:bg-pink-900/60 text-pink-300 border border-pink-500/30 flex items-center gap-1 transition"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>PDF Notes</span>
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectLecture(lecture, batch);
                                }}
                                className="px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-lg shadow-sm shadow-pink-600/30 flex items-center gap-1 transition"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Watch Lecture</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Chapter PDF Notes Inline */}
                        {chapter.notes.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block mb-1.5">
                              Chapter Notes & DPPs:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {chapter.notes.map(note => (
                                <div
                                  key={note.id}
                                  onClick={() => onSelectPdf(note)}
                                  className="p-2.5 rounded-lg bg-pink-950/20 hover:bg-pink-900/30 border border-pink-500/20 hover:border-pink-500/40 cursor-pointer flex items-center justify-between text-xs transition"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 text-pink-400 shrink-0" />
                                    <span className="font-medium text-slate-200 truncate">
                                      {note.title}
                                    </span>
                                  </div>
                                  <span className="text-pink-400 font-bold shrink-0 ml-2">
                                    View PDF
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Notes & DPP PDFs */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-400" />
                  <span>All Downloadable Notes, DPP Sheets & Formula Books</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Read online or download complete official high-resolution study material prepared by educators.
                </p>
              </div>
              <button
                onClick={onOpenTelegramModal}
                className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Telegram for 500+ More PDFs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allBatchNotes.map(note => (
                <div
                  key={note.id}
                  className="p-4 bg-[#160d21] hover:bg-[#1f122e] border border-pink-500/20 hover:border-pink-500/50 rounded-xl transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30">
                          {note.type}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {note.subjectName}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition truncate">
                        {note.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {note.pages} Pages • {note.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectPdf(note)}
                      className="px-3 py-1.5 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-lg shadow transition"
                    >
                      Read PDF
                    </button>
                    <a
                      href={note.downloadUrl || TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Batch Overview & Syllabus */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#160d21] border border-pink-500/25 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>Batch Features & Study Highlights</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {batch.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/20 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                  >
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#160d21] border border-pink-500/25 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white">Full Syllabus Breakdown</h3>
              <div className="space-y-3">
                {batch.subjects.map(sub => (
                  <div key={sub.id} className="p-3.5 rounded-xl bg-black/40 border border-pink-500/20">
                    <h4 className="text-sm font-bold text-pink-300 mb-1">
                      {sub.name} — By {sub.faculty}
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">Role: {sub.facultyRole}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.chapters.map(ch => (
                        <span
                          key={ch.id}
                          className="px-2.5 py-1 rounded-md text-xs bg-pink-950/40 text-slate-300 border border-pink-500/15"
                        >
                          {ch.title} ({ch.lectures.length} classes)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
