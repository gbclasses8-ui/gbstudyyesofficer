import React, { useState } from 'react';
import { 
  X, Download, FileText, Send, Sparkles, ZoomIn, ZoomOut, 
  CheckCircle2, ExternalLink, Printer, Loader2, RefreshCw
} from 'lucide-react';
import { APP_LOGO, TELEGRAM_LINK } from '../services/api';

interface RealPdfViewerProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

export const RealPdfViewer: React.FC<RealPdfViewerProps> = ({ url, title, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [useRemoteProxy, setUseRemoteProxy] = useState(false);

  if (!url) return null;

  const isRealUrl = url.startsWith('http') || url.startsWith('/pdf');

  // Build PDF stream URLs
  const localStreamUrl = isRealUrl
    ? url.startsWith('/pdf')
      ? url
      : `/pdf?url=${encodeURIComponent(url)}`
    : '';

  const remoteStreamUrl = isRealUrl
    ? `https://yesofficer.studybeepro.site/pdf?url=${encodeURIComponent(url)}`
    : '';

  const activePdfUrl = useRemoteProxy ? remoteStreamUrl : localStreamUrl;

  const handleDownload = async () => {
    if (!isRealUrl) {
      window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
      return;
    }

    setDownloading(true);
    try {
      // Fetch blob via proxy
      let res = await fetch(activePdfUrl);
      if (!res.ok) {
        res = await fetch(remoteStreamUrl);
      }

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const cleanTitle = (title || 'GB_STUDY_Class_Notes').replace(/[^a-zA-Z0-9_-]/g, '_');
        a.download = `${cleanTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else {
        // Fallback open in new tab
        window.open(activePdfUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(activePdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenExternal = () => {
    if (isRealUrl) {
      window.open(activePdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-hidden font-sans">
      <div 
        className="relative w-full max-w-5xl bg-[#120a1a] border-2 border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/30 overflow-hidden flex flex-col h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#180e22] border-b border-pink-500/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-pink-500/40 shrink-0">
              <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-pink-400 block tracking-wider flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-pink-400" />
                <span>GB STUDY OFFICIAL PDF READER</span>
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-sm sm:max-w-md lg:max-w-xl">
                {title || 'Classroom Study Notes & DPP Sheet'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Switch Server / Retry button */}
            {isRealUrl && (
              <button
                onClick={() => setUseRemoteProxy(prev => !prev)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs border border-white/10 transition"
                title="Switch PDF proxy route"
              >
                <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
                <span>{useRemoteProxy ? 'Direct Route' : 'Local Route'}</span>
              </button>
            )}

            {/* Open in New Window */}
            <button
              onClick={handleOpenExternal}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition hidden sm:flex items-center gap-1 text-xs font-bold"
              title="Open full page PDF"
            >
              <ExternalLink className="w-4 h-4 text-pink-400" />
              <span>Full Page</span>
            </button>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition btn-click-effect disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{downloadSuccess ? 'Downloaded!' : downloading ? 'Saving...' : 'Download PDF'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Promo Banner */}
        <div className="px-4 py-2 bg-pink-950/40 border-b border-pink-500/20 flex items-center justify-between text-xs text-pink-300 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">Download 500+ daily handwritten class PDFs on our official Telegram channel</span>
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-white bg-pink-600 hover:bg-pink-500 px-3 py-0.5 rounded-full transition shrink-0 ml-2 shadow-sm"
          >
            <Send className="w-3 h-3" />
            <span>@GBFreestudy</span>
          </a>
        </div>

        {/* Real PDF Viewer Area */}
        <div className="flex-1 w-full bg-[#0d0714] relative overflow-hidden flex flex-col">
          {isRealUrl ? (
            <iframe
              src={activePdfUrl}
              title={title || 'GB STUDY PDF Document'}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            /* Fallback when lecture doesn't have an attached file */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-white">Classroom Notes & DPP Channel</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  The complete PDF notes, formula sheets, and DPP sets for &ldquo;{title}&rdquo; are archived in our free Telegram study group.
                </p>
              </div>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-600/40 transition btn-click-effect"
              >
                <Send className="w-4 h-4" />
                <span>Open @GBFreestudy on Telegram</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
