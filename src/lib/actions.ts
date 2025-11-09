'use server';

import {
  summarizeMeetingMinutes,
  SummarizeMeetingMinutesInput,
} from '@/ai/flows/summarize-meeting-minutes';
import {
  transcribeAudioAndExtractText,
  TranscribeAudioAndExtractTextInput,
} from '@/ai/flows/transcribe-audio-extract-text';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { SummarizeMeetingMinutesOutput } from '@/lib/types';

export async function transcribeAndExtract(dataUri: string, filename: string) {
  'use server';
  try {
    if (!dataUri) {
      throw new Error('No data URI provided.');
    }

    const input: TranscribeAudioAndExtractTextInput = {
      fileDataUri: dataUri,
      filename: filename,
    };

    const result = await transcribeAudioAndExtractText(input);

    if (!result || !result.extractedText) {
        throw new Error('AI failed to extract text.');
    }

    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error in transcribeAndExtract:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, data: null, error: errorMessage };
  }
}

export async function summarize(
  text: string,
  language: 'id' | 'ar'
): Promise<{ success: boolean, data: SummarizeMeetingMinutesOutput | null, error: string | null }> {
  'use server';
  try {
    const input: SummarizeMeetingMinutesInput = {
      text,
      language,
    };
    const result = await summarizeMeetingMinutes(input);
     if (!result || !result.arabicSummary || !result.indonesianSummary || !result.englishSummary) {
        throw new Error('AI failed to generate summary.');
    }
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error in summarize:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, data: null, error: errorMessage };
  }
}

export async function saveHistory(
  summary: SummarizeMeetingMinutesOutput,
  originalFilename: string,
  userId: string
): Promise<{ success: boolean; error: string | null; }> {
  'use server';
  if (!userId) {
    return { success: false, error: 'User is not authenticated.' };
  }
  try {
    await addDoc(collection(db, 'summaries'), {
      userId,
      originalFilename,
      indonesianSummary: summary.indonesianSummary,
      arabicSummary: summary.arabicSummary,
      englishSummary: summary.englishSummary,
      createdAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving history to Firestore:', error);
    return { success: false, error: 'Failed to save history.' };
  }
}
