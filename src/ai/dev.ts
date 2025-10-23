import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-meeting-minutes.ts';
import '@/ai/flows/transcribe-audio-extract-text.ts';