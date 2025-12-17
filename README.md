# CoachRX Data Exporter

> **From static screenshots to actionable SQL data.**

## 📖 The Story

### The Problem: Data Jail
I rely on CoachRX for my daily programming, and it's fantastic. But as a user who loves data, I faced a wall: my workout history was trapped in this app. 

After a few months of training, I was able to access my workouts, but no way of exporting them.

Another problem was that sometimes the coachRX app had this annoying bug where my workout history would not be saved.

### The Solution: "See" the Data
I built this tool to own my workout data and use it any way I wanted to. Data analysis, social media posting, a backup, or just to have a record of my progress in case I need to switch to a different app. 

**The Pipeline:**
1.  **Drop**: Drag and drop raw screenshots from the CoachRX app.
2.  **Extract**: Use **Google Gemini 2.0 Flash** (Multimodal AI) to "read" the complex, non-standardized workout cards. It identifies exercises, sets, reps, and weights with near-perfect accuracy.
3.  **Structure**: The AI returns structured JSON, which is instantly normalized and stored in a **Supabase** (PostgreSQL) database.
4.  **Analyze**: The frontend visualizes this data, calculating PRs and volume progression in real-time.

### The Impact
-   **User Ownership**: I now own my fitness data in a portable, open format.
-   **Instant Insights**: Historical analysis that used to be impossible is now automated.
-   **Privacy First**: Row-Level Security ensures my data is mine alone.

---

## 🛠️ Under the Hood

This project demonstrates a modern "AI-native" web architecture, optimizing for speed and user experience.

*   **Frontend**: Built with **Next.js 16 (App Router)** for server-side rendering and snappy transitions.
*   **AI Engine**: **Gemini 2.0 Flash**. Chosen for its speed and multimodal native capabilities—eliminating the need for a separate OCR pipeline.
*   **Backend & Auth**: **Supabase** & **Clerk**. Clerk handles identity (social login + email), while Supabase handles data persistence with strict Row Level Security (RLS) policies.
*   **UI**: **shadcn/ui** & **Tailwind CSS** for a polished, accessible design system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Keys for: Google AI Studio, Clerk, and Supabase.

### Installation

1.  **Clone & Install**
    ```bash
    git clone https://github.com/0xcasio/coachRX-workout-exporter.git
    cd coachrx-export
    npm install
    ```

2.  **Environment Setup**
    Create `.env.local` with your keys:
    ```bash
    GEMINI_API_KEY=...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```

3.  **Run It**
    ```bash
    npm run dev
    ```

## 🔒 Security Note
This application uses industry-standard security practices. Authenticated user sessions are verified via Clerk JWTs, and Supabase RLS policies strictly enforce that users can only read/write their own rows. AI processing happens server-side; API keys are never exposed to the client.

---
*This is an unofficial tool and is not affiliated with CoachRX. Use at your own discretion.*
