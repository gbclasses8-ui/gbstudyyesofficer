import React, { useState, useMemo } from 'react';
import { Search, X, PlayCircle, FileText, Layers, ArrowRight, User } from 'lucide-react';
import { BATCHES_DATA, APP_LOGO } from '../data/coursesData';
import { Batch, Lecture, NotePdf } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBatch: (batch: Batch) => void;
  onSelectLecture: (lecture: Lecture, batch: Batch) => void;
  onSelectPdf: (pdf: NotePdf) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectBatch,
  onSelectLecture,
  onSelectPdf
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'batches' | 'lectures' | 'notes'>('all');

  // Search indexing
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { batches: [], lectures: [], notes: [] };
    }

    const matchedBatches: Batch[] = [];
    const matchedLectures: { lecture: Lecture; batch: Batch }[] = [];
    const matchedNotes: NotePdf[] = [];

    BATCHES_DATA.forEach(batch => {
      // Check batch matches
      const batchMatches =
        batch.title.toLowerCase().includes(q) ||
        batch.tagline.toLowerCase().includes(q) ||
        batch.facultySummary.toLowerCase().includes(q) ||
        batch.description.toLowerCase().includes(q) ||
        batch.targetExams.some(e => e.toLowerCase().includes(q));

      if (batchMatches) {
        matchedBatches.push(batch);
      }

      // Check subjects & chapters & lectures
      batch.subjects.forEach(subject => {
        const subjectMatches = subject.name.toLowerCase().includes(q) || subject.faculty.toLowerCase().includes(q);
        
        subject.chapters.forEach(chapter => {
          const chapterMatches = chapter.title.toLowerCase().includes(q) || chapter.description.toLowerCase().includes(q);

          chapter.lectures.forEach(lec => {
            if (
              lec.title.toLowerCase().includes(q) ||
              lec.faculty.toLowerCase().includes(q) ||
              subjectMatches ||
              chapterMatches
            ) {
              matchedLectures.push({ lecture: lec, batch });
            }
          });

          chapter.notes.forEach(note => {
            if (
              note.title.toLowerCase().includes(q) ||
              note.type.toLowerCase().includes(q) ||
              chapterMatches ||
              subjectMatches
            ) {
              matchedNotes.push(note);
            }
          });
        });
      });
    });

    return {
      batches: matchedBatches,
      lectures: matchedLectures,
      notes: matchedNotes
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    (filterType === 'all' || filterType === 'batches' ? searchResults.batches.length : 0) +
    (filterType === 'all' || filterType === 'lectures' ? searchResults.lectures.length : 0) +
    (filterType === 'all' || filterType === 'notes' ? searchResults.notes.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#140e1b] border-2 border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/20 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-pink-500/20 bg-[#1c1226] flex items-center gap-3">
          <Search className="w-5 h-5 text-pink-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search batches, lectures, chapters, PDFs or teachers (e.g. Aashish Sir, Puzzles, Grammar)..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#120a1a] border-b border-pink-500/10 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium mr-1">Filter:</span>
          {(['all', 'batches', 'lectures', 'notes'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full font-semibold capitalize transition ${
                filterType === type
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Search className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Search GB STUDY Platform</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Explore Yes Officer foundation batches, speed maths lectures, reasoning puzzles, grammar rules, and free downloadable PDFs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400">Popular:</span>
                {['Speed Maths', 'Ankush Lamba Puzzles', '120 Rules of Grammar', 'Banking Awareness', 'SBI PO Mains'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 border border-pink-500/20 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm mb-2">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400">Try searching with a teacher name like &quot;Aashish Arora&quot;, &quot;Nimisha&quot;, or topics like &quot;Number Series&quot;.</p>
            </div>
          ) : (
            <>
              {/* Batches Section */}
              {(filterType === 'all' || filterType === 'batches') && searchResults.batches.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Batches ({searchResults.batches.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.batches.map(batch => (
                      <div
                        key={batch.id}
                        onClick={() => {
                          onSelectBatch(batch);
                          onClose();
                        }}
                        className="p-3 bg-pink-950/20 hover:bg-pink-900/30 border border-pink-500/20 hover:border-pink-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={APP_LOGO}
                            alt="Logo"
                            className="w-10 h-10 rounded-lg object-cover border border-pink-500/30"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-pink-400 bg-pink-500/15 px-2 py-0.5 rounded">
                                {batch.category}
                              </span>
                              <h5 className="font-bold text-sm text-white group-hover:text-pink-300 transition">
                                {batch.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {batch.facultySummary} • {batch.totalLectures} Lectures • {batch.totalNotes} Notes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition shrink-0 ml-2">
                          <span>Open Batch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lectures Section */}
              {(filterType === 'all' || filterType === 'lectures') && searchResults.lectures.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5" /> Video Lectures ({searchResults.lectures.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.lectures.map(({ lecture, batch }) => (
                      <div
                        key={lecture.id}
                        onClick={() => {
                          onSelectLecture(lecture, batch);
                          onClose();
                        }}
                        className="p-3 bg-[#1b1224] hover:bg-[#251833] border border-pink-500/15 hover:border-pink-500/40 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <PlayCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-xs sm:text-sm text-white group-hover:text-pink-300 transition line-clamp-1">
                              {lecture.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1 text-pink-300">
                                <User className="w-3 h-3" /> {lecture.faculty}
                              </span>
                              <span>•</span>
                              <span>{lecture.duration}</span>
                              <span>•</span>
                              <span className="text-slate-500">{batch.title}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-pink-600 text-white rounded-lg font-bold shrink-0 ml-2 group-hover:bg-pink-500">
                          Watch
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes / PDF Section */}
              {(filterType === 'all' || filterType === 'notes') && searchResults.notes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Notes & PDFs ({searchResults.notes.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.notes.map(note => (
                      <div
                        key={note.id}
                        onClick={() => {
                          onSelectPdf(note);
                          onClose();
                        }}
                        className="p-3 bg-[#1b1224] hover:bg-[#251833] border border-pink-500/15 hover:border-pink-500/40 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-xs sm:text-sm text-white group-hover:text-pink-300 transition line-clamp-1">
                              {note.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="text-pink-400 font-semibold">{note.type}</span>
                              <span>•</span>
                              <span>{note.pages} pages</span>
                              <span>•</span>
                              <span>{note.fileSize}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-slate-800 text-pink-300 hover:text-white hover:bg-pink-600 border border-pink-500/30 rounded-lg font-semibold shrink-0 ml-2">
                          View PDF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
