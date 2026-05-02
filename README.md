# StudyBuddy 📚

An AI-powered study assistant where students upload PDF notes, ask questions, and generate quizzes — all with per-user data privacy.

---

## Features

- **PDF Upload & Processing** — Upload your notes and the app extracts, chunks, and indexes them automatically
- **AI Q&A (RAG)** — Ask questions about your PDFs; answers are grounded in your content, not hallucinated
- **Quiz Generation** — Generate multiple-choice quizzes from any topic in your notes
- **Google Authentication** — Secure, per-user data isolation via Google OAuth
- **Streaming Responses** — Answers stream token-by-token for a fast, responsive feel

---

## How It Works

### 1. Authentication
NextAuth v5 with Google OAuth handles identity. Your PDFs are tagged to your user ID and never mix with other users' data.

### 2. PDF Processing
When you upload a PDF, the browser uses **PDF.js** to extract text client-side. The text is then:
1. Split into 500-word overlapping chunks (LangChain `RecursiveCharacterTextSplitter`)
2. Converted to 384-dimensional vectors via **Hugging Face** (`BAAI/bge-small-en-v1.5`)
3. Stored in **Neon Postgres** with the `pgvector` extension

### 3. RAG (Retrieval Augmented Generation)
When you ask a question:
1. The question is embedded into a vector
2. `pgvector` cosine similarity search finds the 4 most relevant chunks from your PDF
3. Those chunks + your question are assembled into a prompt sent to **Groq** (`llama-3.3-70b-versatile`)
4. The answer streams back word-by-word

### 4. Quiz Generation
Same pipeline — but the prompt instructs Groq to return a JSON array of 5 MCQs. React renders them as interactive cards with green/red feedback.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 | Frontend + Backend |
| Language | TypeScript | Type-safe JS |
| Auth | NextAuth v5 + Google | User identity |
| PDF Parsing | PDF.js (browser) | Extract text from PDFs |
| Text Splitting | LangChain.js | Chunk text |
| Embeddings | Hugging Face BAAI/bge | Text → vectors |
| Vector DB | Neon + pgvector | Store & search vectors |
| LLM | Groq + Llama 3.3 70B | Answers & quizzes |
| Styling | Tailwind CSS | UI |
| Deployment | Vercel | Hosting & CI/CD |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon Postgres database with `pgvector` enabled
- Google OAuth credentials
- Hugging Face API key
- Groq API key

### Environment Variables

Create a `.env.local` file:

```env
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database
DATABASE_URL=

# AI
HUGGINGFACE_API_KEY=
GROQ_API_KEY=
```

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

The app is deployed on **Vercel**. On every push to `main`, Vercel automatically builds and deploys.

To deploy your own instance:
1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Update your Google OAuth app's authorized redirect URIs to include your production URL
