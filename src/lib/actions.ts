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

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    // This is a server action, but FileReader is a browser API.
    // To make this work, we need a workaround. A better approach for production would be
    // to upload to a bucket and pass the URL. For this exercise, we will assume
    // the client converts it to a data URI before calling the action.
    // However, since we must use FormData, we'll convert the array buffer.
    file.arrayBuffer().then(buffer => {
        const base64 = Buffer.from(buffer).toString('base64');
        resolve(`data:${file.type};base64,${base64}`);
    });
  });
}

export async function transcribeAndExtract(formData: FormData) {
  'use server';
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const dataUri = await fileToDataURI(file);

    const input: TranscribeAudioAndExtractTextInput = {
      fileDataUri: dataUri,
      filename: file.name,
    };

    const result = await transcribeAudioAndExtractText(input);

    if (!result || !result.extractedText) {
        throw new Error('AI failed to extract text.');
    }

    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error in transcribeAndExtract:', error);
    return { success: false, data: null, error: (error as Error).message };
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
     if (!result || !result.arabicSummary || !result.indonesianSummary) {
        throw new Error('AI failed to generate summary.');
    }
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error in summarize:', error);
    return { success: false, data: null, error: (error as Error).message };
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
      createdAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving history to Firestore:', error);
    return { success: false, error: 'Failed to save history.' };
  }
}
