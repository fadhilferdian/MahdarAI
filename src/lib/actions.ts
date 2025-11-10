'use server';

import {
  summarizeMeetingMinutes,
  SummarizeMeetingMinutesInput,
} from '@/ai/flows/summarize-meeting-minutes';
import {
  transcribeAudioAndExtractText,
  TranscribeAudioAndExtractTextInput,
} from '@/ai/flows/transcribe-audio-extract-text';

import type { SummarizeMeetingMinutesOutput } from '@/lib/types';

export async function transcribeAndExtract(dataUri: string, filename: string) {
  'use server';
  try {
    if (!dataUri) {
      throw new Error('Tidak ada data URI yang diberikan.');
    }

    const input: TranscribeAudioAndExtractTextInput = {
      fileDataUri: dataUri,
      filename: filename,
    };

    const result = await transcribeAudioAndExtractText(input);

    if (!result || !result.extractedText) {
        throw new Error('AI gagal mengekstrak teks.');
    }

    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Kesalahan dalam transcribeAndExtract:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server yang tidak diketahui.';
    return { success: false, data: null, error: errorMessage };
  }
}

export async function summarize(
  text: string,
  sourceLanguage: 'id' | 'ar' | 'en',
  targetLanguage: 'id' | 'ar' | 'en',
): Promise<{ success: boolean, data: SummarizeMeetingMinutesOutput | null, error: string | null }> {
  'use server';
  try {
    const input: SummarizeMeetingMinutesInput = {
      text,
      sourceLanguage,
      targetLanguage,
    };
    const result = await summarizeMeetingMinutes(input);
     if (!result || !result.summary) {
        throw new Error('AI gagal menghasilkan ringkasan.');
    }
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Kesalahan dalam summarize:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server yang tidak diketahui.';
    return { success: false, data: null, error: errorMessage };
  }
}
