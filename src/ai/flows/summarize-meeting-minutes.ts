'use server';

/**
 * @fileOverview A meeting minutes summarization AI agent.
 *
 * - summarizeMeetingMinutes - A function that handles the meeting minutes summarization process.
 * - SummarizeMeetingMinutesInput - The input type for the summarizeMeetingMinutes function.
 * - SummarizeMeetingMinutesOutput - The return type for the summarizeMeetingMinutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const SummarizeMeetingMinutesInputSchema = z.object({
  text: z
    .string()
    .describe("The text to summarize, extracted from either an audio transcription or a document."),
  sourceLanguage: z.enum(['id', 'ar', 'en']).describe('The language of the input text (Indonesian, Arabic, or English).'),
  targetLanguage: z.enum(['id', 'ar', 'en']).describe('The target language for the summary (Indonesian, Arabic, or English).'),
});
export type SummarizeMeetingMinutesInput = z.infer<typeof SummarizeMeetingMinutesInputSchema>;

const SummarizeMeetingMinutesOutputSchema = z.object({
  summary: z.string().describe('The summary of the meeting minutes in the target language.'),
});
export type SummarizeMeetingMinutesOutput = z.infer<typeof SummarizeMeetingMinutesOutputSchema>;

export async function summarizeMeetingMinutes(input: SummarizeMeetingMinutesInput): Promise<SummarizeMeetingMinutesOutput> {
  return summarizeMeetingMinutesFlow(input);
}

const languageMap = {
  id: 'Indonesian',
  ar: 'Arabic',
  en: 'English',
};


const prompt = ai.definePrompt({
  name: 'summarizeMeetingMinutesPrompt',
  input: {schema: SummarizeMeetingMinutesInputSchema},
  output: {schema: SummarizeMeetingMinutesOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an AI expert in creating summaries of meeting minutes.

  The input text is in {{sourceLanguage}}.

  Create a summary of the following meeting minutes in {{targetLanguage}}.

  The summary must strictly follow this structure, translated to the {{targetLanguage}}:
  - The heading for the agenda section must be 'AGENDA RAPAT' (for Indonesian), 'جدول الأعمال' (for Arabic), or 'MEETING AGENDA' (for English).
  - The heading for the discussion points section must be 'POIN PEMBAHASAN' (for Indonesian), 'نقاط النقاش' (for Arabic), or 'DISCUSSION POINTS' (for English).
  - The heading for the action items section must be 'ACTION ITEMS' (for Indonesian), 'المهام المطلوبة' (for Arabic), or 'ACTION ITEMS' (for English).
  - Each heading MUST be followed by a numbered list (e.g., 1., 2., 3. or ١., ٢., ٣. for Arabic).

  Structure example in Indonesian (Strictly follow this formatting with newlines):
AGENDA RAPAT
1. Pembukaan dan perkenalan.
2. Pembahasan proyek X.

POIN PEMBAHASAN
1. Progres proyek X mencapai 50%.
2. Ditemukan kendala pada bagian integrasi API.

ACTION ITEMS
1. Tim teknis segera memperbaiki masalah API.
2. Manajer proyek menyiapkan laporan progres terbaru.

  Structure example in Arabic (Strictly follow this formatting with newlines):
جدول الأعمال
١. الافتتاح والتعارف.
٢. مناقشة مشروع X.

نقاط النقاش
١. تقدم مشروع X وصل إلى 50٪.
٢. تم العثور على عقبة في جزء تكامل واجهة برمجة التطبيقات.

المهام المطلوبة
١. يقوم الفريق الفني بإصلاح مشكلة واجهة برمجة التطبيقات على الفور.
٢. يقوم مدير المشروع بإعداد أحدث تقرير مرحلي.

  Structure example in English (Strictly follow this formatting with newlines):
MEETING AGENDA
1. Opening and introductions.
2. Discussion of project X.

DISCUSSION POINTS
1. Project X progress has reached 50%.
2. An obstacle was found in the API integration part.

ACTION ITEMS
1. The technical team to fix the API issue immediately.
2. The project manager to prepare the latest progress report.

  Text to summarize: {{{text}}} `,
});

const summarizeMeetingMinutesFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingMinutesFlow',
    inputSchema: SummarizeMeetingMinutesInputSchema,
    outputSchema: SummarizeMeetingMinutesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      ...input,
      sourceLanguage: languageMap[input.sourceLanguage],
      targetLanguage: languageMap[input.targetLanguage],
    });
    return output!;
  }
);
