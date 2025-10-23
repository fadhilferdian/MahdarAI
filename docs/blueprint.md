# **App Name**: Mahdar AI

## Core Features:

- File Upload: Upload audio (.mp3, .wav, .m4a) and document (.pdf, .docx) files to Firebase Storage with progress tracking and automatic file type detection.
- Transcription & Text Extraction: Transcribe audio files using Speech-to-Text API (e.g., OpenAI Whisper) and extract text from documents using PDF/DOC parsers. Automatically detect the language (Arabic or Indonesian).
- Minutes of Meeting Summarization: Generate automatic summaries in a Minutes of Meeting format (Pembukaan, Daftar Hadir, Poin Pembahasan, Keputusan & Rekomendasi, Penutup) in both Indonesian and formal Arabic using an LLM, and act as a tool.
- Save & Download: Save summaries to Firestore and allow users to download them as PDF or DOCX files, or copy the text to the clipboard.
- Dual-Language UI: Display summaries in a dual-column view (Arabic on the right, Indonesian on the left) with a language toggle in the navbar.
- User Authentication: Implement user authentication via Firebase Auth (Google Login).
- Summary History: Maintain a history of generated summaries accessible to the user.

## Style Guidelines:

- Primary color: A serene blue (#64B5F6), evoking trust and professionalism suitable for document processing. In HSL it is 204, 74, 68.
- Background color: Light blue (#E3F2FD), a muted, desaturated variant of the primary, providing a clean backdrop. In HSL it is 204, 47, 95.
- Accent color: A calming green (#81C784) placed on the left of the primary hue in HSL terms, for important actions. In HSL it is 123, 52, 64.
- Headline font: 'Playfair', a modern serif for an elegant and high-end feel; body font: 'PT Sans', a humanist sans-serif. Note: currently only Google Fonts are supported.
- Code font: 'Source Code Pro' for any displayed code snippets. Note: currently only Google Fonts are supported.
- Use a consistent set of minimalist icons to represent file types, actions, and status indicators.
- Employ a clean and minimal layout with clear sections for file upload, text preview, and summary display.
- Use subtle animations for loading states and transitions to enhance user experience.