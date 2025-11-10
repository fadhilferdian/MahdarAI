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
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an AI expert in creating summaries of meeting minutes.

  The input text is in {{sourceLanguage}}.

  Create a summary of the following meeting minutes in {{targetLanguage}}.

  The summary must strictly follow this structure, translated to the {{targetLanguage}}:
  - The heading for the conclusion section must be 'KESIMPULAN' (for Indonesian), 'الخلاصة' (for Arabic), or 'CONCLUSIONS' (for English).
  - The heading for the action items section must be 'ACTION ITEMS' (for Indonesian), 'المهام المطلوبة' (for Arabic), or 'ACTION ITEMS' (for English).
  - Each heading MUST be followed by a numbered list (e.g., 1., 2., 3. or ١., ٢., ٣. for Arabic).

  Structure example in Indonesian:
  KESIMPULAN
  1. Poin pertama kesimpulan.
  2. Poin kedua kesimpulan.

  ACTION ITEMS
  1. Tindakan pertama yang harus dilakukan.
  2. Tindakan kedua yang harus dilakukan.

  Structure example in Arabic:
  الخلاصة
  ١. النقطة الأولى في الخلاصة.
  ٢. النقطة الثانية في الخلاصة.

  المهام المطلوبة
  ١. المهمة الأولى المطلوبة.
  ٢. المهمة الثانية المطلوبة.

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
