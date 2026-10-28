import { BatchItem, FolderContentItem, VideoDetails } from '../types';

export const APP_LOGO = 'https://i.ibb.co/0R7qc34v/1093.jpg';
export const TELEGRAM_LINK = 'https://t.me/GBFreestudy';
export const BASE_API_URL = 'https://studybeepro.site';

export async function fetchAllBatches(): Promise<BatchItem[]> {
  try {
    // Try local public/batches.json first
    const res = await fetch('/batches.json');
    if (res.ok) {
      const data = await res.json();
      return [...(data.new || []), ...(data.old || [])];
    }
  } catch {
    // fallback
  }

  try {
    const res = await fetch(`${BASE_API_URL}/yesoff/batches.json`);
    if (res.ok) {
      const data = await res.json();
      return [...(data.new || []), ...(data.old || [])];
    }
  } catch (err) {
    console.error('Failed to fetch batches from server', err);
  }

  return [];
}

export async function fetchFolderContents(courseId: string | number, parentId: string | number = '-1', start: number = 0): Promise<FolderContentItem[]> {
  const query = `course_id=${courseId}&parent_id=${parentId}&start=${start}`;
  
  // 1. Try local proxy (which injects Referer header in Vite and Vercel)
  try {
    const res = await fetch(`/get/folder_contentsv3?${query}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // fallback to direct API
  }

  // 2. Direct API call (CORS is open on studybeepro.site)
  try {
    const res = await fetch(`${BASE_API_URL}/get/folder_contentsv3?${query}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch folder contents', err);
  }

  return [];
}

export async function fetchVideoDetails(courseId: string | number, videoId: string | number): Promise<VideoDetails | null> {
  const query = `course_id=${courseId}&video_id=${videoId}`;

  // 1. Try local proxy
  try {
    const res = await fetch(`/get/fetchVideoDetailsById?${query}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json;
      }
    }
  } catch {
    // fallback to direct
  }

  // 2. Direct API call
  try {
    const res = await fetch(`${BASE_API_URL}/get/fetchVideoDetailsById?${query}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json;
      }
    }
  } catch (err) {
    console.error('Failed to fetch video details', err);
  }

  return null;
}

/**
 * Opens course notes and PDFs directly in a new browser tab in full-page view.
 * Handles AppX / ClassX secured PDFs via /pdf proxy (works on both local dev and Vercel),
 * external direct URLs, and Telegram fallback.
 */
export function openPdfInNewTab(rawUrl?: string | null, _title?: string) {
  if (!rawUrl || rawUrl === 'pdf' || rawUrl === 'pdf-notes') {
    triggerNewTab(TELEGRAM_LINK);
    return;
  }

  // If already a relative proxy path or telegram link or google drive
  if (rawUrl.includes('t.me') || rawUrl.includes('drive.google')) {
    triggerNewTab(rawUrl);
    return;
  }

  // If it's an AppX or ClassX or YesOfficer PDF requiring proxy headers for inline viewing
  if (
    rawUrl.includes('appx.co.in') ||
    rawUrl.includes('classx.co.in') ||
    rawUrl.includes('studybeepro') ||
    rawUrl.includes('yesofficer')
  ) {
    // Use https://studybeepro.site/pdf?url=... which guarantees full-page native PDF rendering in new tab
    const fullPagePdfUrl = `https://studybeepro.site/pdf?url=${encodeURIComponent(rawUrl)}`;
    triggerNewTab(fullPagePdfUrl);
    return;
  }

  // Any other direct HTTP/HTTPS URL
  if (rawUrl.startsWith('http')) {
    triggerNewTab(rawUrl);
    return;
  }

  triggerNewTab(TELEGRAM_LINK);
}

function triggerNewTab(url: string) {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Fallback if popup blocked
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch {
    window.location.href = url;
  }
}
