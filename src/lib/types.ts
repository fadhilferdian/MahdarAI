export type SummarizeMeetingMinutesOutput = {
  summary: string;
};

export type TranscribeAudioAndExtractTextOutput = {
  extractedText: string;
  language: 'id' | 'ar' | 'en';
};
