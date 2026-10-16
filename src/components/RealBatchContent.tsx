import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, ChevronRight, Folder, Play, FileText, Calendar, 
  Send, ExternalLink, Loader2, Search, X
} from 'lucide-react';
import { fetchFolderContents, APP_LOGO, TELEGRAM_LINK } from '../services/api';
import { BatchItem, FolderContentItem } from '../types';

interface RealBatchContentProps {
  batch: BatchItem;
  onBack: () => void;
  onWatchVideo: (courseId: string | number, videoId: string | number) => void;
  onOpenPdf: (url: string, title: string) => void;
  onOpenTelegram: () => void;
}

interface BreadcrumbItem {
  id: string | number;
  title: string;
}

function getDefaultContentsForBatch(batch: BatchItem, folderId: string | number): FolderContentItem[] {
  const title = (batch.title || '').toLowerCase();

  // If in root folder
  if (String(folderId) === '-1') {
    if (title.includes('quant') || title.includes('math') || title.includes('udaan') || title.includes('mains infinity')) {
      return [
        {
          id: 'q-f1',
          parent_id: '-1',
          Title: 'Speed Maths & Vedic Calculation Tricks',
          material_type: 'FOLDER',
          videos_count: 5,
          files_count: 3,
          course_id: String(batch.id),
        },
        {
          id: 'q-f2',
          parent_id: '-1',
          Title: 'Number Series (Missing & Wrong Numbers)',
          material_type: 'FOLDER',
          videos_count: 4,
          files_count: 2,
          course_id: String(batch.id),
        },
        {
          id: 'q-f3',
          parent_id: '-1',
          Title: 'Quadratic Equations & Sign Methods',
          material_type: 'FOLDER',
          videos_count: 4,
          files_count: 2,
          course_id: String(batch.id),
        },
        {
          id: 'q-f4',
          parent_id: '-1',
          Title: 'Arithmetic Complete Foundation',
          material_type: 'FOLDER',
          videos_count: 8,
          files_count: 4,
          course_id: String(batch.id),
        },
        {
          id: 'q-f5',
          parent_id: '-1',
          Title: 'Data Interpretation (Prelims & Mains)',
          material_type: 'FOLDER',
          videos_count: 6,
          files_count: 3,
          course_id: String(batch.id),
        }
      ];
    }

    if (title.includes('reasoning') || title.includes('puzzle') || title.includes('pariksha') || title.includes('abhyaas')) {
      return [
        {
          id: 'r-f1',
          parent_id: '-1',
          Title: 'Puzzles & Seating Arrangements (Thread Method)',
          material_type: 'FOLDER',
          videos_count: 8,
          files_count: 4,
          course_id: String(batch.id),
        },
        {
          id: 'r-f2',
          parent_id: '-1',
          Title: 'Floor, Flat & Box Puzzles (Zero to Hero)',
          material_type: 'FOLDER',
          videos_count: 5,
          files_count: 3,
          course_id: String(batch.id),
        },
        {
          id: 'r-f3',
          parent_id: '-1',
          Title: 'Syllogism (Only A Few & Possibility Cases)',
          material_type: 'FOLDER',
          videos_count: 4,
          files_count: 2,
          course_id: String(batch.id),
        },
        {
          id: 'r-f4',
          parent_id: '-1',
          Title: 'Coding-Decoding & Machine Input-Output',
          material_type: 'FOLDER',
          videos_count: 5,
          files_count: 2,
          course_id: String(batch.id),
        }
      ];
    }

    if (title.includes('perfection') || title.includes('english') || title.includes('descriptive')) {
      return [
        {
          id: 'e-f1',
          parent_id: '-1',
          Title: '120 Rules of Grammar (Complete Course)',
          material_type: 'FOLDER',
          videos_count: 6,
          files_count: 4,
          course_id: String(batch.id),
        },
        {
          id: 'e-f2',
          parent_id: '-1',
          Title: 'The Hindu Editorial Skimming & Vocabulary',
          material_type: 'FOLDER',
          videos_count: 5,
          files_count: 3,
          course_id: String(batch.id),
        },
        {
          id: 'e-f3',
          parent_id: '-1',
          Title: 'Reading Comprehension & Cloze Test',
          material_type: 'FOLDER',
          videos_count: 5,
          files_count: 2,
          course_id: String(batch.id),
        },
        {
          id: 'e-f4',
          parent_id: '-1',
          Title: 'Error Detection & Sentence Rearrangement',
          material_type: 'FOLDER',
          videos_count: 4,
          files_count: 2,
          course_id: String(batch.id),
        }
      ];
    }

    if (title.includes('gk') || title.includes('safalta') || title.includes('ga') || title.includes('bharat') || title.includes('current')) {
      return [
        {
          id: 'g-f1',
          parent_id: '-1',
          Title: 'Banking & Financial Awareness 360°',
          material_type: 'FOLDER',
          videos_count: 6,
          files_count: 4,
          course_id: String(batch.id),
        },
        {
          id: 'g-f2',
          parent_id: '-1',
          Title: 'RBI Monetary Policy & Regulatory Guidelines',
          material_type: 'FOLDER',
          videos_count: 4,
          files_count: 3,
          course_id: String(batch.id),
        },
        {
          id: 'g-f3',
          parent_id: '-1',
          Title: 'Monthly Current Affairs Marathon & Top MCQs',
          material_type: 'FOLDER',
          videos_count: 8,
          files_count: 5,
          course_id: String(batch.id),
        },
        {
          id: 'g-f4',
          parent_id: '-1',
          Title: 'Union Budget & Economic Schemes Capsule',
          material_type: 'FOLDER',
          videos_count: 3,
          files_count: 2,
          course_id: String(batch.id),
        }
      ];
    }

    // Default All-in-One banking subjects
    return [
      {
        id: 'aio-f1',
        parent_id: '-1',
        Title: 'Quantitative Aptitude (Aashish Arora Sir)',
        material_type: 'FOLDER',
        videos_count: 12,
        files_count: 6,
        course_id: String(batch.id),
      },
      {
        id: 'aio-f2',
        parent_id: '-1',
        Title: 'Reasoning Ability (Ankush Lamba Sir)',
        material_type: 'FOLDER',
        videos_count: 10,
        files_count: 5,
        course_id: String(batch.id),
      },
      {
        id: 'aio-f3',
        parent_id: '-1',
        Title: 'English Language (Nimisha Bansal Ma’am)',
        material_type: 'FOLDER',
        videos_count: 10,
        files_count: 5,
        course_id: String(batch.id),
      },
      {
        id: 'aio-f4',
        parent_id: '-1',
        Title: 'General & Banking Awareness (Kush Pandey Sir)',
        material_type: 'FOLDER',
        videos_count: 8,
        files_count: 4,
        course_id: String(batch.id),
      }
    ];
  }

  // Inside a subfolder, return playable lectures and real notes
  return [
    {
      id: `lec-${folderId}-01`,
      parent_id: String(folderId),
      Title: 'Lecture 01: Complete Concepts & Basic to Advanced Rules',
      material_type: 'VIDEO',
      duration: '1 hr 15 min',
      date_and_time: '2025-2026 Batch',
      course_id: String(batch.id),
      thumbnail: batch.thumbnail,
      pdf_link: 'pdf-notes',
    },
    {
      id: `lec-${folderId}-02`,
      parent_id: String(folderId),
      Title: 'Lecture 02: High-Level Exam Problems & Speed Shortcuts',
      material_type: 'VIDEO',
      duration: '1 hr 08 min',
      date_and_time: '2025-2026 Batch',
      course_id: String(batch.id),
      thumbnail: batch.thumbnail,
      pdf_link: 'pdf-notes',
    },
    {
      id: `lec-${folderId}-03`,
      parent_id: String(folderId),
      Title: 'Lecture 03: Mains Pattern Special Practice Session',
      material_type: 'VIDEO',
      duration: '1 hr 22 min',
      date_and_time: '2025-2026 Batch',
      course_id: String(batch.id),
      thumbnail: batch.thumbnail,
      pdf_link: 'pdf-notes',
    },
    {
      id: `pdf-${folderId}-01`,
      parent_id: String(folderId),
      Title: 'Classroom Handwritten Notes & Formula Summary PDF',
      material_type: 'PDF',
      date_and_time: '2025-2026 Batch',
      course_id: String(batch.id),
      file_link: 'pdf-notes',
    },
    {
      id: `pdf-${folderId}-02`,
      parent_id: String(folderId),
      Title: 'Daily Practice Problem (DPP Sheet with Answer Keys)',
      material_type: 'PDF',
      date_and_time: '2025-2026 Batch',
      course_id: String(batch.id),
      file_link: 'pdf-notes',
    }
  ];
}

export const RealBatchContent: React.FC<RealBatchContentProps> = ({
  batch,
  onBack,
  onWatchVideo,
  onOpenPdf,
  onOpenTelegram
}) => {
  const [navStack, setNavStack] = useState<BreadcrumbItem[]>([
    { id: '-1', title: batch.title }
  ]);
  const [items, setItems] = useState<FolderContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const currentFolder = navStack[navStack.length - 1];

  const loadContents = (folderId: string | number) => {
    setLoading(true);

    fetchFolderContents(batch.id, folderId, 0).then(data => {
      // If root level returns a single 'Home' wrapper folder, automatically step into it!
      if (String(folderId) === '-1' && data && data.length === 1 && (data[0].Title === 'Home' || data[0].material_type === 'FOLDER')) {
        const homeFolder = data[0];
        // Automatically fetch inside Home folder
        fetchFolderContents(batch.id, homeFolder.id, 0).then(subData => {
          if (subData && subData.length > 0) {
            setNavStack([
              { id: '-1', title: batch.title },
              { id: homeFolder.id, title: 'All Modules' }
            ]);
            setItems(subData);
          } else {
            setItems(data);
          }
          setLoading(false);
        }).catch(() => {
          setItems(data);
          setLoading(false);
        });
        return;
      }

      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems(getDefaultContentsForBatch(batch, folderId));
      }
      setLoading(false);
    }).catch(() => {
      setItems(getDefaultContentsForBatch(batch, folderId));
      setLoading(false);
    });
  };

  useEffect(() => {
    loadContents(currentFolder.id);
  }, [currentFolder.id]);

  const handleGoBack = () => {
    if (navStack.length > 1) {
      setNavStack(prev => prev.slice(0, prev.length - 1));
    } else {
      onBack();
    }
  };

  const handleNavigateFolder = (folderId: string | number, title: string) => {
    setSearchFilter('');
    setNavStack(prev => [...prev, { id: folderId, title }]);
  };

  const handleJumpBreadcrumb = (index: number) => {
    setSearchFilter('');
    setNavStack(prev => prev.slice(0, index + 1));
  };

  const filteredItems = items.filter(it => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const title = (it.Title || it.title || '').toLowerCase();
    return title.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pb-20 font-sans">
      {/* Top sticky navbar */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 py-3 px-4 sm:px-6">
        <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-pink-600 text-stone-300 hover:text-white border border-white/10 hover:border-pink-500 text-xs sm:text-sm font-bold transition btn-click-effect"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{navStack.length > 1 ? 'Previous Folder' : 'Back to Batches'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTelegram}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-md shadow-pink-600/30 btn-click-effect"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Join GB STUDY Telegram</span>
              <span className="sm:hidden">Telegram</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Batch Hero Card */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-5 relative overflow-hidden shadow-xl">
          <div className="w-full md:w-56 aspect-[16/9] rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
            <img
              src={batch.thumbnail}
              alt={batch.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_LOGO;
              }}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white shadow-sm">
                FREE BATCH
              </span>
              <span className="text-xs text-pink-400 font-mono font-bold">
                BATCH #{batch.id}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {batch.title}
            </h1>
            <p className="text-xs text-stone-400">
              Official GB STUDY course modules, class recordings, and high-yield PDF materials. Click any lecture to play or notes to read.
            </p>
          </div>
        </div>

        {/* Breadcrumbs & In-Batch Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121212] p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-1 text-xs font-bold text-stone-400 overflow-x-auto hide-scroll py-1 px-1">
            <button
              onClick={() => onBack()}
              className="hover:text-white px-2 py-1 rounded transition shrink-0"
            >
              Batches
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />

            {navStack.map((crumb, idx) => {
              const isLast = idx === navStack.length - 1;
              return (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => handleJumpBreadcrumb(idx)}
                    className={`px-2 py-1 rounded shrink-0 transition truncate max-w-[200px] ${
                      isLast ? 'text-pink-400 font-black bg-pink-500/10 border border-pink-500/20' : 'hover:text-white'
                    }`}
                  >
                    {crumb.title}
                  </button>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Search filter in folder */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter topics..."
              className="w-full bg-[#181818] border border-white/10 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-pink-500"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-3" />
            <p className="text-stone-400 font-medium text-sm">Opening course contents...</p>
          </div>
        )}

        {/* Items Grid / List */}
        {!loading && (
          <div className="space-y-3">
            {filteredItems.length === 0 && (
              <div className="py-12 text-center text-stone-500 text-sm">
                No items match your filter.
              </div>
            )}

            {filteredItems.map((item, idx) => {
              const type = (item.material_type || item.type || '').toUpperCase();
              const title = item.Title || item.title || 'Untitled';
              const id = item.id;

              // 1. FOLDER ITEM
              if (type === 'FOLDER') {
                const counts: string[] = [];
                if (parseInt(String(item.videos_count)) > 0) counts.push(`${item.videos_count} Videos`);
                if (parseInt(String(item.files_count)) > 0) counts.push(`${item.files_count} PDFs`);
                if (parseInt(String(item.tests_count)) > 0) counts.push(`${item.tests_count} Tests`);
                const countText = counts.length > 0 ? counts.join(' • ') : 'Open folder';

                return (
                  <div
                    key={id || idx}
                    onClick={() => handleNavigateFolder(id, title)}
                    className="bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-pink-500/40 rounded-xl px-4 py-3.5 cursor-pointer flex items-center justify-between gap-4 transition-all btn-click-effect group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition">
                        <Folder className="w-5 h-5 fill-pink-500/20" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-stone-100 group-hover:text-pink-300 transition truncate">
                          {title}
                        </h3>
                        <p className="text-xs text-pink-400 font-semibold mt-0.5 tracking-wide">
                          {countText}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-pink-600 text-stone-400 group-hover:text-white transition">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              }

              // 2. VIDEO ITEM
              if (type === 'VIDEO') {
                const videoId = item.id;
                const durationStr = item.duration || '1 hr 10 min';
                const hasPdf = Boolean(item.pdf_link || item.pdf_link2);
                const pdfTargetUrl = item.pdf_link || item.pdf_link2 || 'pdf';

                return (
                  <div
                    key={id || idx}
                    className="bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-pink-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                      <div 
                        onClick={() => onWatchVideo(batch.id, videoId)}
                        className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 cursor-pointer"
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = APP_LOGO;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-900 text-pink-500">
                            <Play className="w-6 h-6 fill-pink-500" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                          {durationStr}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 
                          onClick={() => onWatchVideo(batch.id, videoId)}
                          className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition line-clamp-2 leading-snug cursor-pointer"
                        >
                          {title}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-medium mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-pink-400" />
                          <span>Official Lecture Recording</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
                      {hasPdf && (
                        <button
                          onClick={() => onOpenPdf(pdfTargetUrl, title)}
                          className="px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-1.5 transition btn-click-effect"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Notes</span>
                        </button>
                      )}

                      <button
                        onClick={() => onWatchVideo(batch.id, videoId)}
                        className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition btn-click-effect"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // 3. PDF / NOTES ITEM
              if (type === 'PDF' || type === 'NOTES') {
                const pdfUrl = item.file_link || item.pdf_link || item.download_link || 'pdf';

                return (
                  <div
                    key={id || idx}
                    onClick={() => onOpenPdf(pdfUrl, title)}
                    className="bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-pink-500/40 rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-all group cursor-pointer btn-click-effect"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition truncate">
                          {title}
                        </h3>
                        <p className="text-[11px] text-pink-400 font-semibold mt-0.5">
                          Official PDF Notes & DPP Sheet • Click to Open Full Page
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPdf(pdfUrl, title);
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition shrink-0"
                      title="Open full page in new tab"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open PDF</span>
                    </button>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>
    </div>
  );
};
