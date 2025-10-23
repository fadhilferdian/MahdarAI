# Mahdar AI

This is a Next.js application called **محضر (Mahdar AI)**. It's a bilingual (Arabic–Indonesian) app that can summarize audio recordings, PDF files, or DOCX files into Minutes of Meeting (محضر الاجتماع) automatically.

## Getting Started

First, set up your Firebase project and create a `.env.local` file in the root of the project with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
