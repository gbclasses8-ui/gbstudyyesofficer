import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize, Minimize, Settings, FileText, Send, Sparkles, RefreshCw, 
  Layers, Check, ExternalLink, AlertCircle
} from 'lucide-react';
import { fetchVideoDetails, APP_LOGO, TELEGRAM_LINK } from '../services/api';
import { VideoDetails, FolderContentItem } from '../types';

interface RealVideoPlayerProps {
  courseId: string | number;
  videoId: string | number;
  initialItem?: FolderContentItem;
  onBack: () => void;
  onOpenPdf?: (url: string, title: string) => void;
}

export const RealVideoPlayer: React.FC<RealVideoPlayerProps> = ({
  courseId,
  videoId,
  initialItem,
  onBack,
  onOpenPdf
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [videoData, setVideoData] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Settings menus
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'speed' | 'quality'>('main');

  // Video stream source & qualities
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto');
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');
  const [serverMode, setServerMode] = useState<'hls' | 'webplayer'>('hls');

  // Skip indicator
  const [skipIndicator, setSkipIndicator] = useState<{ type: 'left' | 'right' | 'play' | 'pause'; text?: string } | null>(null);
  const lastTapRef = useRef<{ time: number; zone: 'left' | 'center' | 'right' }>({ time: 0, zone: 'center' });

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Auto-hide controls
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showSettings) {
        setShowControls(false);
      }
    }, 3500);
  }, [isPlaying, showSettings]);

  // Load stream into video / Hls
  const loadStream = useCallback((rawStreamUrl: string, startPos: number = 0) => {
    if (!rawStreamUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const videoEl = videoRef.current;
    if (!videoEl) return;

    setIsBuffering(true);
    setError(null);

    // Build stream proxy URL:
    // Try remote proxy first (has CORS open and generates segment ts URLs), fallback to local proxy
    const remoteProxy = `https://studybeepro.site/video?url=${encodeURIComponent(rawStreamUrl)}`;
    const localProxy = `/video?url=${encodeURIComponent(rawStreamUrl)}`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30,
        startPosition: startPos > 0 ? startPos : -1,
      });
      hlsRef.current = hls;

      hls.loadSource(remoteProxy);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        setError(null);
        videoEl.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay policy prevented unmuted play - video is ready, user can tap center play button
          setIsPlaying(false);
        });
      });

      let retriedWithLocal = false;
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!retriedWithLocal) {
                retriedWithLocal = true;
                console.warn('Remote proxy failed, retrying with local proxy...');
                try {
                  hls.loadSource(localProxy);
                  hls.startLoad();
                } catch {
                  setError('Network stream error. Tap to retry.');
                }
              } else {
                setError('Network connection error. Tap retry.');
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError('Stream playback error. Tap retry.');
              break;
          }
        }
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari/iOS
      videoEl.src = remoteProxy;
      videoEl.addEventListener('loadedmetadata', function onMeta() {
        if (startPos > 0) videoEl.currentTime = startPos;
        videoEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        videoEl.removeEventListener('loadedmetadata', onMeta);
      });
    } else {
      setError('HLS playback is not supported in this browser.');
    }
  }, []);

  // Fetch video details on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Pre-populate metadata from initialItem if available
    if (initialItem) {
      setVideoData({
        success: true,
        video_id: String(videoId),
        course_id: String(courseId),
        title: initialItem.Title || initialItem.title || 'Lecture Video',
        duration: initialItem.duration || '1 hr 10 min',
        thumbnail: initialItem.thumbnail || '',
        decoded_pdf_link: initialItem.pdf_link || initialItem.pdf_link2,
      });
    }

    // Always fetch the authentic signed stream token from fetchVideoDetails
    fetchVideoDetails(courseId, videoId).then(data => {
      if (!isMounted) return;
      if (data && data.success) {
        setVideoData(data);

        // Extract signed stream URL with edge-cache-token
        let stream = '';
        if (data.qualities && data.qualities.length > 0) {
          const preferred = data.qualities.find(q => q.quality === '720p') || data.qualities[0];
          stream = preferred.url;
          setSelectedQuality(preferred.quality);
        } else if (data.decoded_video_link && data.decoded_video_link.includes('edge-cache-token')) {
          stream = data.decoded_video_link;
        }

        if (stream) {
          setCurrentStreamUrl(stream);
          setLoading(false);
          loadStream(stream, 0);
        } else {
          setLoading(false);
          setError('Valid video stream token was not found.');
        }
      } else {
        setLoading(false);
        setError('Could not retrieve video details from server.');
      }
    }).catch(err => {
      if (!isMounted) return;
      setLoading(false);
      setError(err?.message || 'Failed to load video.');
    });

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [courseId, videoId, initialItem, loadStream]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsBuffering(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        showIndicator('play');
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      showIndicator('pause');
    }
    triggerShowControls();
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    triggerShowControls();
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(videoRef.current.duration || 999999, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    showIndicator(seconds < 0 ? 'left' : 'right', `${Math.abs(seconds)}s`);
    triggerShowControls();
  };

  const showIndicator = (type: 'left' | 'right' | 'play' | 'pause', text?: string) => {
    setSkipIndicator({ type, text });
    setTimeout(() => {
      setSkipIndicator(null);
    }, 600);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
    setShowSettings(false);
    triggerShowControls();
  };

  const handleQualityChange = (qualityName: string, streamUrl: string) => {
    setSelectedQuality(qualityName);
    setCurrentStreamUrl(streamUrl);
    setShowSettings(false);
    const pos = videoRef.current ? videoRef.current.currentTime : 0;
    loadStream(streamUrl, pos);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleVolumeChange = (v: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mobile / Touch controls
  const handleZoneClick = (zone: 'left' | 'center' | 'right') => {
    if (zone === 'left') {
      handleSkip(-10);
    } else if (zone === 'right') {
      handleSkip(10);
    } else if (zone === 'center') {
      togglePlay();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Derived notes link
  const pdfUrl = videoData?.decoded_pdf_link || videoData?.pdf_viewer || '';

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerShowControls}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Visual Skip & Play/Pause Center Indicator */}
      {skipIndicator && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="p-5 rounded-full bg-black/80 border border-pink-500/40 text-pink-400 backdrop-blur-md shadow-2xl flex items-center gap-2 animate-scaleUp">
            {skipIndicator.type === 'left' && <RotateCcw className="w-8 h-8" />}
            {skipIndicator.type === 'right' && <RotateCw className="w-8 h-8" />}
            {skipIndicator.type === 'play' && <Play className="w-8 h-8 fill-pink-500" />}
            {skipIndicator.type === 'pause' && <Pause className="w-8 h-8 fill-pink-500" />}
            {skipIndicator.text && (
              <span className="text-lg font-black text-white">{skipIndicator.text}</span>
            )}
          </div>
        </div>
      )}

      {/* TOP HEADER CONTROLS */}
      <div 
        className={`w-full z-40 bg-gradient-to-b from-black/95 via-black/80 to-transparent p-3 sm:p-4 flex items-center justify-between gap-3 shrink-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-pink-600 text-white border border-white/10 hover:border-pink-500 transition-colors btn-click-effect shrink-0"
            title="Back to lectures"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-lg overflow-hidden border border-pink-500/40 shrink-0">
            <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-black tracking-widest uppercase text-pink-400 block flex items-center gap-1.5">
              <span>GB STUDY PLAYER</span>
              <span className="text-[9px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-1.5 rounded">
                {serverMode === 'hls' ? `STREAM (${selectedQuality})` : 'OFFICIAL PLAYER'}
              </span>
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {videoData?.title || 'Interactive Lecture'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quality Selector Button */}
          <button
            onClick={() => {
              setShowSettings(true);
              setSettingsTab('quality');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-pink-600/30 text-stone-200 hover:text-white text-xs font-bold border border-white/10 transition btn-click-effect"
            title="Change Video Quality"
          >
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>Quality: {selectedQuality}</span>
          </button>

          {/* Real Notes PDF button if available */}
          {pdfUrl && (
            <button
              onClick={() => {
                if (onOpenPdf) {
                  onOpenPdf(pdfUrl, videoData?.title || 'Lecture Notes');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/40 transition btn-click-effect"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Class Notes</span>
            </button>
          )}

          {/* Telegram Channel Button */}
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telegram</span>
          </a>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-stone-300 hover:text-white bg-white/10 rounded-xl transition"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN VIDEO AREA */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90 text-center p-4">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3"></div>
            <p className="text-white font-bold text-sm">Connecting to GB STUDY Lecture Stream...</p>
            <p className="text-xs text-pink-400 mt-1">Decryption keys verified</p>
          </div>
        )}

        {/* Error Fallback */}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/95 text-center p-6 space-y-4">
            <AlertCircle className="w-12 h-12 text-pink-500" />
            <div className="max-w-md">
              <h3 className="text-white font-bold text-base mb-1">Lecture Playback Notice</h3>
              <p className="text-xs text-stone-400">{error}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchVideoDetails(courseId, videoId).then(data => {
                    if (data && data.success && data.qualities && data.qualities.length > 0) {
                      setVideoData(data);
                      const q = data.qualities[0];
                      setSelectedQuality(q.quality);
                      setCurrentStreamUrl(q.url);
                      setLoading(false);
                      loadStream(q.url, 0);
                    } else {
                      setLoading(false);
                      setError('Failed to refresh lecture stream tokens. Try another lecture or check Telegram.');
                    }
                  }).catch(() => {
                    setLoading(false);
                    setError('Connection error. Please try again.');
                  });
                }}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-pink-600/40"
              >
                Retry Lecture Playback
              </button>

              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask on Telegram</span>
              </a>
            </div>
          </div>
        )}

        {/* Video Element */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Touch Zones: Left (-10s), Center (Play/Pause), Right (+10s) */}
          <div 
            onClick={() => handleZoneClick('left')} 
            className="absolute top-0 bottom-0 left-0 w-1/4 z-20 cursor-pointer"
            title="Double click or tap to rewind 10s"
          />
          <div 
            onClick={() => handleZoneClick('center')} 
            className="absolute top-0 bottom-0 left-1/4 w-2/4 z-20 cursor-pointer"
            title="Click to Play or Pause"
          />
          <div 
            onClick={() => handleZoneClick('right')} 
            className="absolute top-0 bottom-0 right-0 w-1/4 z-20 cursor-pointer"
            title="Double click or tap to forward 10s"
          />

          {/* Large Center Play Button when paused / waiting for user click */}
          {!isPlaying && !loading && !error && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-pink-600/95 hover:bg-pink-500 text-white flex items-center justify-center shadow-2xl shadow-pink-600/50 transition-transform duration-200 hover:scale-110 z-30 cursor-pointer pointer-events-auto"
              aria-label="Play Lecture"
            >
              <Play className="w-10 h-10 fill-white ml-1.5" />
            </button>
          )}

          {/* Buffering indicator */}
          {isBuffering && !loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-14 h-14 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Watermark in top right */}
        <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-pink-500/30 text-[11px] font-bold text-pink-300 z-30">
          <img src={APP_LOGO} alt="" className="w-4 h-4 rounded object-cover" />
          <span>GB STUDY</span>
        </div>

        {/* Settings Popup Menu (Quality & Speed) */}
        {showSettings && (
          <div className="absolute bottom-20 right-4 z-40 w-64 bg-[#140a1c] border border-pink-500/40 rounded-2xl shadow-2xl p-3 text-white text-xs animate-fadeIn backdrop-blur-xl">
            {settingsTab === 'main' && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-pink-400 px-2 py-1 border-b border-white/10">
                  Player Settings
                </div>
                <button
                  onClick={() => setSettingsTab('quality')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition text-stone-200"
                >
                  <span>Video Quality</span>
                  <span className="text-pink-400 font-bold">{selectedQuality} ›</span>
                </button>
                <button
                  onClick={() => setSettingsTab('speed')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition text-stone-200"
                >
                  <span>Playback Speed</span>
                  <span className="text-pink-400 font-bold">{playbackRate}x ›</span>
                </button>
                <button
                  onClick={() => {
                    setServerMode(prev => (prev === 'hls' ? 'webplayer' : 'hls'));
                    setShowSettings(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition text-stone-200"
                >
                  <span>Switch Stream Server</span>
                  <span className="text-pink-400 font-bold">
                    {serverMode === 'hls' ? 'Server 2' : 'Server 1'}
                  </span>
                </button>
              </div>
            )}

            {settingsTab === 'speed' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">Select Speed</span>
                  <button
                    onClick={() => setSettingsTab('main')}
                    className="text-stone-400 hover:text-white"
                  >
                    Back
                  </button>
                </div>
                {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition ${
                      playbackRate === s
                        ? 'bg-pink-600 text-white font-bold'
                        : 'hover:bg-white/10 text-stone-300'
                    }`}
                  >
                    <span>{s === 1.0 ? 'Normal (1x)' : `${s}x`}</span>
                    {playbackRate === s && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}

            {settingsTab === 'quality' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-400">Stream Quality</span>
                  <button
                    onClick={() => setSettingsTab('main')}
                    className="text-stone-400 hover:text-white"
                  >
                    Back
                  </button>
                </div>
                {videoData?.qualities && videoData.qualities.length > 0 ? (
                  videoData.qualities.map(q => (
                    <button
                      key={q.quality}
                      onClick={() => handleQualityChange(q.quality, q.url)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition ${
                        selectedQuality === q.quality
                          ? 'bg-pink-600 text-white font-bold'
                          : 'hover:bg-white/10 text-stone-300'
                      }`}
                    >
                      <span>{q.quality}</span>
                      {selectedQuality === q.quality && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))
                ) : (
                  <p className="text-stone-400 p-2">Auto resolution active</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div 
        className={`w-full bg-gradient-to-t from-black via-[#0d0714]/95 to-transparent p-3 sm:p-4 z-40 transition-opacity duration-300 shrink-0 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar with scrubber */}
        {serverMode === 'hls' && (
          <div className="w-full mb-3 flex items-center gap-3">
            <span className="font-mono text-[11px] text-stone-300 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 group py-2 cursor-pointer">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:h-2 transition-all"
              />
            </div>
            <span className="font-mono text-[11px] text-stone-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {serverMode === 'hls' && (
              <>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center transition shadow-lg shadow-pink-600/40 btn-click-effect"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleSkip(-10)}
                  className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                  title="Forward 10s"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Volume slider */}
                <div className="hidden sm:flex items-center gap-2 group">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-stone-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded accent-pink-500 cursor-pointer"
                  />
                </div>
              </>
            )}

            <div className="text-xs text-stone-300 truncate max-w-[200px] sm:max-w-xs">
              <span className="text-pink-400 font-bold">Now Playing: </span>
              <span className="text-white font-semibold">{videoData?.title || 'Interactive Session'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Class Notes shortcut */}
            {pdfUrl && (
              <button
                onClick={() => {
                  if (onOpenPdf) {
                    onOpenPdf(pdfUrl, videoData?.title || 'Lecture Notes');
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes PDF</span>
              </button>
            )}

            {/* Settings button */}
            <button
              onClick={() => {
                setShowSettings(prev => !prev);
                setSettingsTab('main');
              }}
              className={`p-2 rounded-xl transition ${
                showSettings ? 'bg-pink-600 text-white' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
