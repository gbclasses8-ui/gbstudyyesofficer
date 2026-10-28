export interface BatchItem {
  id: number | string;
  title: string;
  thumbnail: string;
}

export interface FolderContentItem {
  id: string;
  parent_id: string;
  Title: string;
  title?: string;
  description?: string;
  material_type: 'FOLDER' | 'VIDEO' | 'PDF' | 'NOTES' | string;
  type?: string;
  file_link?: string;
  thumbnail?: string;
  course_id: string;
  event_date?: string;
  date_and_time?: string;
  duration?: string;
  duration_in_secs?: string | number;
  videos_count?: string | number;
  files_count?: string | number;
  tests_count?: string | number;
  pdf_link?: string;
  pdf_link2?: string;
  download_link?: string;
  livestream_links?: { quality: string; path: string }[];
  download_links?: { bitrate: string; quality: string; path: string }[];
  live_status?: number | string;
}

export interface VideoDetails {
  success: boolean;
  video_id: string;
  course_id: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  date?: string;
  decoded_video_link?: string;
  player_url?: string;
  qualities?: { quality: string; url: string; player_url?: string }[];
  decoded_pdf_link?: string | null;
  pdf_viewer?: string | null;
}

export interface NotePdf {
  id: string;
  title: string;
  type: string;
  chapterName: string;
  subjectName: string;
  batchId: string;
  batchTitle: string;
  fileSize: string;
  pages: number;
  pdfUrl: string;
  downloadUrl: string;
  dateAdded: string;
}

export interface Lecture {
  id: string;
  title: string;
  lectureNumber: number;
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchTitle: string;
  faculty: string;
  duration: string;
  videoUrl: string;
  youtubeId?: string;
  thumbnail: string;
  dateUploaded: string;
  description?: string;
  hasNotes: boolean;
  notesPdfId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  description: string;
  lectures: Lecture[];
  notes: NotePdf[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  faculty: string;
  facultyPhoto?: string;
  facultyRole: string;
  chapters: Chapter[];
}

export interface Batch {
  id: string;
  title: string;
  tagline: string;
  category: string;
  badge: string;
  facultySummary: string;
  thumbnail: string;
  bannerImage: string;
  description: string;
  targetExams: string[];
  totalLectures: number;
  totalNotes: number;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: string;
  validity: string;
  highlights: string[];
  subjects: Subject[];
}

