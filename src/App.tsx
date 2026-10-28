import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Bookmark, Search, X, ChevronDown, Check, Plus, 
  ArrowRight, FolderOpen, Send, Loader2, LayoutGrid, FileText, Bell 
} from 'lucide-react';
import { fetchAllBatches, APP_LOGO, TELEGRAM_LINK, openPdfInNewTab } from './services/api';
import { BatchItem, NotePdf, Batch, Lecture, FolderContentItem } from './types';
import { RealBatchContent } from './components/RealBatchContent';
import { RealVideoPlayer } from './components/RealVideoPlayer';
import { TelegramModal } from './components/TelegramModal';
import { SearchModal } from './components/SearchModal';
import { NotesSection } from './components/NotesSection';

const ITEMS_PER_PAGE = 12;

export default function App() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'new' | 'wishlist' | 'notes'>('new');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gbstudy_wishlist') || '[]').map(String);
    } catch {
      return [];
    }
  });

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Navigation states
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{
    courseId: string | number;
    videoId: string | number;
    initialItem?: FolderContentItem;
  } | null>(null);

  // Search & Telegram modals
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Initial load
  useEffect(() => {
    // Show Telegram Popup on visit (as required by prompt)
    const timer = setTimeout(() => {
      setIsTelegramModalOpen(true);
    }, 800);

    // Fetch batches
    fetchAllBatches().then(data => {
      setBatches(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync wishlist to localStorage
  const toggleEnroll = (e: React.MouseEvent, batchId: string | number) => {
    e.stopPropagation();
    const id = String(batchId);
    setWishlist(prev => {
      const exists = prev.includes(id);
      let updated: string[];
      if (exists) {
        updated = prev.filter(item => item !== id);
        showToast('Removed from enrolled batches');
      } else {
        updated = [...prev, id];
        showToast('Enrolled in batch successfully!');
      }
      try {
        localStorage.setItem('gbstudy_wishlist', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Filter batches
  const filteredBatches = useMemo(() => {
    let list = batches;
    if (currentTab === 'wishlist') {
      list = batches.filter(b => wishlist.includes(String(b.id)));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => b.title.toLowerCase().includes(q) || String(b.id).includes(q));
    }

    return list;
  }, [batches, currentTab, wishlist, searchQuery]);

  // Displayed batches for pagination
  const visibleBatches = filteredBatches.slice(0, displayCount);

  return (
    <div className="min-h-screen relative flex flex-col bg-[#0a0a0a] text-[#e5e5e5] font-sans pb-12 selection:bg-pink-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm bg-pink-950/95 border border-pink-500 text-pink-300 shadow-2xl shadow-pink-950/80 animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Telegram Micro Banner */}
      <div className="bg-gradient-to-r from-pink-700 via-rose-600 to-pink-700 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-pink-200 animate-pulse" />
        <span>Join Official GB STUDY Channel For Daily Banking PDFs & Class Notes</span>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-pink-100 font-black inline-flex items-center gap-1 ml-1"
        >
          Join Telegram <Send className="w-3 h-3" />
        </a>
      </div>

      {/* Navbar matching original structure */}
      <nav className="w-full z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 h-[70px] sticky top-0">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => {
              setSelectedBatch(null);
              setPlayingVideo(null);
              setCurrentTab('new');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer btn-click-effect"
          >
            <div className="w-9 h-9 bg-black border border-pink-500/40 rounded-lg flex items-center justify-center relative z-10 overflow-hidden shadow-sm shadow-pink-500/30">
              <img 
                src={APP_LOGO} 
                alt="GB STUDY Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h1 className="text-xl font-black tracking-wider text-white">
              GB<span className="text-pink-500"> STUDY</span>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => {
                setSelectedBatch(null);
                setCurrentTab('new');
              }} 
              className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect ${
                currentTab === 'new' && !selectedBatch ? 'text-pink-500' : 'text-white hover:text-pink-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Batches
            </button>

            <button 
              onClick={() => {
                setSelectedBatch(null);
                setCurrentTab('notes');
              }} 
              className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect ${
                currentTab === 'notes' && !selectedBatch ? 'text-pink-500' : 'text-stone-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Notes & PDFs
            </button>

            <button 
              onClick={() => {
                setSelectedBatch(null);
                setCurrentTab('wishlist');
              }} 
              className={`font-bold text-sm transition-colors flex items-center gap-2 relative ${
                currentTab === 'wishlist' && !selectedBatch ? 'text-pink-500' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" /> My Enrollments
              {wishlist.length > 0 && (
                <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Quick Search Shortcut */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-semibold transition"
            >
              <Search className="w-3.5 h-3.5 text-pink-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-stone-400 border border-white/10 font-mono">
                Ctrl+K
              </kbd>
            </button>

            {/* Telegram Pink CTA */}
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-black shadow-md shadow-pink-600/30 transition btn-click-effect"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>
          </div>

          {/* Mobile Right Action */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-stone-300 p-2 border border-white/10 rounded-lg hover:text-pink-500 hover:border-pink-500 transition-colors btn-click-effect bg-white/5"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button 
              onClick={() => {
                setSelectedBatch(null);
                setCurrentTab('notes');
              }}
              className="text-stone-300 p-2 border border-white/10 rounded-lg hover:text-pink-500 hover:border-pink-500 transition-colors btn-click-effect bg-white/5"
              aria-label="Notes"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button 
              onClick={() => {
                setSelectedBatch(null);
                setCurrentTab('wishlist');
              }}
              className="text-stone-300 p-2 border border-white/10 rounded-lg hover:text-pink-500 hover:border-pink-500 transition-colors btn-click-effect relative bg-white/5"
              aria-label="Enrollments"
            >
              <Bookmark className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="p-2 rounded-lg bg-pink-600 text-white border border-pink-400 btn-click-effect"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* RENDER VIEW 1: REAL BATCH CONTENT (Folders & Lectures) */}
      {selectedBatch ? (
        <RealBatchContent
          batch={selectedBatch}
          onBack={() => setSelectedBatch(null)}
          onWatchVideo={(courseId, videoId, item) => {
            setPlayingVideo({ courseId, videoId, initialItem: item });
          }}
          onOpenPdf={(url, title) => {
            openPdfInNewTab(url, title);
          }}
          onOpenTelegram={() => setIsTelegramModalOpen(true)}
        />
      ) : currentTab === 'notes' ? (
        /* RENDER VIEW 2: DEDICATED NOTES & PDF REPOSITORY */
        <NotesSection
          onSelectPdf={(pdf: NotePdf) => {
            openPdfInNewTab(pdf.pdfUrl || pdf.downloadUrl, pdf.title);
          }}
          onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        />
      ) : (
        /* RENDER VIEW 3: MAIN HOMEPAGE / BATCHES LIST */
        <main className="flex-1 w-full max-w-[90rem] mx-auto px-4 sm:px-6 pt-8 relative z-10">
          {/* Top Bar: Tabs & Search Input */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            {/* Tabs matching old site */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scroll w-full md:w-auto p-1 bg-[#121212] rounded-xl border border-white/5 shadow-inner">
              <button
                onClick={() => {
                  setCurrentTab('new');
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className={`tab-btn shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'new'
                    ? 'bg-white/10 text-white border border-pink-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
                Latest <span className="hidden sm:inline">Batches</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('wishlist');
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className={`tab-btn shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'wishlist'
                    ? 'bg-white/10 text-white border border-pink-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">My </span>Enrolled
                <span className="bg-pink-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                  {wishlist.length}
                </span>
              </button>
            </div>

            {/* Search Input matching old site */}
            <div className="relative w-full md:w-[350px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-stone-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search batches..."
                className="w-full bg-[#121212] border border-white/10 text-white text-sm rounded-lg block pl-10 pr-10 py-2.5 transition-all placeholder:text-stone-600 focus:outline-none focus:border-pink-500/70 focus:bg-[#1a1a1a]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-3" />
              <p className="text-stone-400 font-medium text-sm">Loading batches...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && visibleBatches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <FolderOpen className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">No Batches Found</h3>
              <p className="text-stone-500 text-sm">Try adjusting your search or enrolling in new batches.</p>
            </div>
          )}

          {/* Batches Grid matching exact old website card structure */}
          {!loading && visibleBatches.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleBatches.map((batch) => {
                const id = String(batch.id);
                const isEnrolled = wishlist.includes(id);

                return (
                  <div
                    key={batch.id}
                    className="premium-card rounded-xl overflow-hidden group flex flex-col relative bg-[#121212] border border-white/5 hover:border-pink-500/40 hover:-translate-y-1 transition-all duration-200 shadow-lg cursor-pointer"
                    onClick={() => {
                      setSelectedBatch(batch);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {/* Thumbnail & FREE Badge */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-black border-b border-white/5">
                      <img
                        src={batch.thumbnail}
                        alt={batch.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = APP_LOGO;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
                      
                      {/* FREE badge styled in pink */}
                      <div className="absolute top-3 right-3 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 px-2 py-1 rounded flex items-center justify-center z-10 shadow-sm">
                        <span className="text-pink-400 text-[9px] font-black tracking-widest uppercase">FREE</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 relative z-20 justify-between">
                      <h3 className="text-gray-200 font-semibold text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-white transition-colors">
                        {batch.title}
                      </h3>

                      {/* Bottom row: Enroll toggle & Let's Study in pink */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 gap-2">
                        <div>
                          {isEnrolled ? (
                            <button
                              onClick={(e) => toggleEnroll(e, batch.id)}
                              className="bg-pink-500/15 text-pink-400 border border-pink-500/30 px-3 py-1.5 rounded text-[11px] font-bold tracking-wider flex items-center gap-1.5 hover:bg-pink-500/25 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" /> ENROLLED
                            </button>
                          ) : (
                            <button
                              onClick={(e) => toggleEnroll(e, batch.id)}
                              className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded text-[11px] font-bold tracking-wider flex items-center gap-1.5 transition-colors btn-click-effect shadow-md shadow-pink-600/30"
                            >
                              <Plus className="w-3.5 h-3.5" /> ENROLL
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedBatch(batch);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors btn-click-effect shadow-md shadow-pink-600/30"
                        >
                          <span>Let&apos;s Study</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button matching old site */}
          {!loading && visibleBatches.length < filteredBatches.length && (
            <div className="w-full flex justify-center mt-10 mb-6">
              <button
                onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                className="px-8 py-2.5 bg-[#121212] border border-white/10 hover:border-pink-500/40 rounded-lg text-white font-semibold text-sm transition-all btn-click-effect flex items-center gap-2 hover:bg-pink-600/10"
              >
                <span>Load More Batches ({filteredBatches.length - visibleBatches.length} remaining)</span>
                <ChevronDown className="w-4 h-4 text-pink-400" />
              </button>
            </div>
          )}
        </main>
      )}

      {/* Floating Telegram Action Button */}
      <aside aria-label="Join Telegram" className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsTelegramModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-pink-600/60 border-2 border-pink-400 hover:scale-105 transition-all btn-click-effect"
        >
          <Send className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">Join GB STUDY Telegram</span>
          <span className="sm:hidden">Telegram</span>
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        </button>
      </aside>

      {/* VIDEO PLAYER MODAL / VIEW */}
      {playingVideo && (
        <RealVideoPlayer
          courseId={playingVideo.courseId}
          videoId={playingVideo.videoId}
          initialItem={playingVideo.initialItem}
          onBack={() => setPlayingVideo(null)}
          onOpenPdf={(url, title) => openPdfInNewTab(url, title)}
        />
      )}

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectBatch={(batch: Batch) => {
          setSelectedBatch({
            id: batch.id,
            title: batch.title,
            thumbnail: batch.thumbnail
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectLecture={(lecture: Lecture, batch: Batch) => {
          setSelectedBatch({
            id: batch.id,
            title: batch.title,
            thumbnail: batch.thumbnail
          });
          setPlayingVideo({ courseId: batch.id, videoId: lecture.id });
        }}
        onSelectPdf={(pdf: NotePdf) => {
          openPdfInNewTab(pdf.pdfUrl || pdf.downloadUrl, pdf.title);
        }}
      />

      {/* TELEGRAM MODAL (Opens on page visit) */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
}
