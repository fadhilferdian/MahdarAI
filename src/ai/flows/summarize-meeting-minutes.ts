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
  language: z.enum(['id', 'ar']).describe('The language of the input text (Indonesian or Arabic).'),
});
export type SummarizeMeetingMinutesInput = z.infer<typeof SummarizeMeetingMinutesInputSchema>;

const SummarizeMeetingMinutesOutputSchema = z.object({
  indonesianSummary: z.string().describe('The summary of the meeting minutes in Indonesian.'),
  arabicSummary: z.string().describe('The summary of the meeting minutes in formal Arabic.'),
});
export type SummarizeMeetingMinutesOutput = z.infer<typeof SummarizeMeetingMinutesOutputSchema>;

export async function summarizeMeetingMinutes(input: SummarizeMeetingMinutesInput): Promise<SummarizeMeetingMinutesOutput> {
  return summarizeMeetingMinutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMeetingMinutesPrompt',
  input: {schema: SummarizeMeetingMinutesInputSchema},
  output: {schema: SummarizeMeetingMinutesOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an AI expert in creating summaries of meeting minutes in both Indonesian and formal Arabic.

  The input text is in {{language}}.

  Create a summary of the following meeting minutes in both Indonesian and formal Arabic, using the following format:

  **Indonesian Summary:**
  📜 Pembukaan (Opening)
  👥 Daftar Hadir (Attendees)
  💬 المحاور (Discussion Points)
  ✅ التوصيات (Decisions & Recommendations)
  🏁 الختام (Closing)

  **Arabic Summary:**
  📜 المقدمة (Opening)
  👥 الحضور (Attendees)
  💬 المحاور (Discussion Points)
  ✅ التوصيات (Decisions & Recommendations)
  🏁 الختام (Closing)

  Text to summarize: {{{text}}} `,
});

const summarizeMeetingMinutesFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingMinutesFlow',
    inputSchema: SummarizeMeetingMinutesInputSchema,
    outputSchema: SummarizeMeetingMinutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
