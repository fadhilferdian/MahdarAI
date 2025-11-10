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

  The summary must follow this structure, translated to the {{targetLanguage}}:
  ### KESIMPULAN
  (A numbered list of the main conclusion points)

  ### ACTION ITEMS
  (A numbered list of action items or tasks)

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
