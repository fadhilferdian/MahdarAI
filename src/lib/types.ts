import type { Timestamp } from 'firebase/firestore';

export type Summary = {
  id: string;
  userId: string;
  originalFilename: string;
  indonesianSummary: string;
  arabicSummary: string;
  englishSummary: string;
  createdAt: Timestamp;
};

export type SummarizeMeetingMinutesOutput = {
  indonesianSummary: string;
  arabicSummary: string;
  englishSummary: string;
};

export type TranscribeAudioAndExtractTextOutput = {
  extractedText: string;
  language: 'id' | 'ar';
};
