import React, { useState } from 'react';
import { X, Download, FileText, ExternalLink, Send, ZoomIn, ZoomOut, RotateCw, CheckCircle } from 'lucide-react';
import { NotePdf } from '../types';
import { APP_LOGO, TELEGRAM_LINK } from '../data/coursesData';

interface PdfViewerModalProps {
  pdf: NotePdf | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ pdf, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!pdf) return null;

  const handleDownload = () => {
    // Open download link or telegram channel
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    window.open(pdf.downloadUrl || TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#130b1a] border-2 border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/30 overflow-hidden flex flex-col h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 py-3 bg-[#1d1026] border-b border-pink-500/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-pink-400 bg-pink-500/15 px-2 py-0.5 rounded">
                  {pdf.type}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {pdf.batchTitle}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {pdf.title}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 border border-slate-700/80 rounded-lg p-1 text-slate-300">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                className="p-1 hover:text-pink-400 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1 hover:text-pink-400 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Download / Open Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:to-rose-400 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-600/30 transition transform hover:-translate-y-0.5"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Opening PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF ({pdf.fileSize})</span>
                  <span className="sm:hidden">Download</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-pink-600/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Quick Notice Bar */}
        <div className="px-4 py-2 bg-pink-950/40 border-b border-pink-500/20 flex items-center justify-between text-xs text-pink-300 shrink-0">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="" className="w-4 h-4 rounded-sm object-cover" />
            <span>Join our Telegram for daily 50+ fresh handwritten PDF notes & daily quizzes</span>
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-white bg-pink-600/80 hover:bg-pink-500 px-2.5 py-0.5 rounded-full transition"
          >
            <Send className="w-3 h-3" />
            <span>Join @GBFreestudy</span>
          </a>
        </div>

        {/* PDF Reader Canvas / Preview */}
        <div className="flex-1 bg-[#0d0713] overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden transition-transform duration-200"
          >
            {/* Simulated High-Res Document Preview Header */}
            <div className="bg-gradient-to-r from-pink-900 via-purple-900 to-pink-950 text-white p-6 border-b-4 border-pink-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={APP_LOGO}
                    alt="GB STUDY"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-pink-400 shadow"
                  />
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight">GB STUDY</h1>
                    <p className="text-xs text-pink-200">Official Exam Preparation Notes & DPP</p>
                  </div>
                </div>
                <div className="text-right text-xs text-pink-200">
                  <p className="font-semibold">{pdf.batchTitle}</p>
                  <p className="text-pink-300">{pdf.chapterName}</p>
                </div>
              </div>
              <h2 className="text-lg font-bold text-white bg-black/30 p-3 rounded-lg border border-pink-400/30">
                {pdf.title}
              </h2>
            </div>

            {/* Document Content Sample / Study Sheets */}
            <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-800">
              <div className="border-b pb-4">
                <h3 className="font-bold text-base text-pink-700 mb-2 flex items-center gap-2">
                  <span>📌 Key Exam Formulas & High-Yield Rules</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li><strong>Speed Maths Rule:</strong> Multiplying any 2-digit number with 11: Add the digits and place in between. (e.g., 45 × 11 = 4 [4+5] 5 = 495).</li>
                  <li><strong>Base 100 Multiplication:</strong> 96 × 94 = (96-6) and (-4 × -6) = 9024 in 2 seconds.</li>
                  <li><strong>Venn Diagram for Only a Few:</strong> &quot;Only a few A are B&quot; = Some A are B AND Some A are NOT B. Can never have &quot;All A are B&quot;.</li>
                  <li><strong>Subject-Verb Agreement:</strong> Whenever sentences use &quot;along with&quot;, &quot;as well as&quot;, &quot;in addition to&quot;, verb agrees with the First Subject.</li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold text-base text-pink-700 mb-2 flex items-center gap-2">
                  <span>🎯 Daily Practice Questions (DPP Sample)</span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="font-semibold text-slate-900">Q1. Solve for X: (45% of 640) + √(3136) - 18² = ?</p>
                    <p className="text-xs text-slate-600 mt-1">Options: (a) 288 (b) 20 (c) 14 (d) 42 (e) None of these</p>
                    <p className="text-xs font-bold text-pink-700 mt-1">Answer: (b) 20 [Step: 288 + 56 - 324 = 20]</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="font-semibold text-slate-900">Q2. Statements: Only a few Pens are Pencils. All Pencils are Erasers.</p>
                    <p className="text-xs text-slate-600 mt-1">Conclusion I: Some Pens are not Pencils. Conclusion II: All Pens can never be Pencils.</p>
                    <p className="text-xs font-bold text-pink-700 mt-1">Answer: Both Conclusions I and II follow strictly.</p>
                  </div>
                </div>
              </div>

              {/* Watermark & Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <p>Curated exclusively for GB STUDY Aspirants • Total {pdf.pages} Pages in complete PDF</p>
                <div className="flex items-center gap-1 font-semibold text-pink-600">
                  <Send className="w-3.5 h-3.5" />
                  <span>t.me/GBFreestudy</span>
                </div>
              </div>
            </div>

            {/* Bottom Download Promotion */}
            <div className="bg-pink-100 p-4 border-t border-pink-200 text-center">
              <p className="text-xs font-semibold text-pink-900 mb-2">
                Download the complete {pdf.pages}-page document with full detailed solutions & answer key
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Save Full PDF to Storage ({pdf.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
