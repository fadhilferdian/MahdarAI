'use server';
/**
 * @fileOverview This file defines a Genkit flow for transcribing audio files and extracting text from document files.
 *
 * - transcribeAudioAndExtractText - A function that handles the transcription and text extraction process.
 * - TranscribeAudioAndExtractTextInput - The input type for the transcribeAudioAndExtractText function.
 * - TranscribeAudioAndExtractTextOutput - The return type for the transcribeAudioAndExtractText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioAndExtractTextInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The file data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  filename: z.string().describe('The name of the uploaded file.'),
});
export type TranscribeAudioAndExtractTextInput = z.infer<typeof TranscribeAudioAndExtractTextInputSchema>;

const TranscribeAudioAndExtractTextOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the file.'),
  language: z.string().describe('The detected language of the text (Arabic or Indonesian).'),
});
export type TranscribeAudioAndExtractTextOutput = z.infer<typeof TranscribeAudioAndExtractTextOutputSchema>;

export async function transcribeAudioAndExtractText(
  input: TranscribeAudioAndExtractTextInput
): Promise<TranscribeAudioAndExtractTextOutput> {
  return transcribeAudioAndExtractTextFlow(input);
}

const transcribeAudioAndExtractTextPrompt = ai.definePrompt({
  name: 'transcribeAudioAndExtractTextPrompt',
  input: {schema: TranscribeAudioAndExtractTextInputSchema},
  output: {schema: TranscribeAudioAndExtractTextOutputSchema},
  prompt: `You are a helpful assistant designed to extract text from files and detect the language.

  Extract the text from the file and detect whether the language is Arabic or Indonesian. Return the extracted text and the detected language.

  Filename: {{{filename}}}
  File Data: {{fileDataUri}}`,
});

const transcribeAudioAndExtractTextFlow = ai.defineFlow(
  {
    name: 'transcribeAudioAndExtractTextFlow',
    inputSchema: TranscribeAudioAndExtractTextInputSchema,
    outputSchema: TranscribeAudioAndExtractTextOutputSchema,
  },
  async input => {
    const {output} = await transcribeAudioAndExtractTextPrompt(input);
    return output!;
  }
);
