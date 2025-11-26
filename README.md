# CoachRX Data Liberation & Workout Tracker

A Next.js web application that liberates your workout data from CoachRX screenshots using AI-powered OCR. Track your progress, visualize your gains, and own your fitness data.

## ✨ Features

- **📸 Screenshot Upload**: Drag-and-drop CoachRX workout screenshots
- **🤖 AI-Powered Extraction**: Uses Google Gemini Vision API to extract workout data
- **🔐 User Authentication**: Secure sign-in with Clerk (Google, Email)
- **☁️ Cloud Storage**: All workouts stored securely in Supabase
- **📊 Progress Tracking**: View exercise history and weight progression charts
- **📈 Visual Analytics**: Interactive charts powered by Recharts
- **📤 Data Export**: Export workouts as JSON for backup or migration
- **🔄 Multi-Screenshot Merging**: Combine multiple screenshots into one workout session
- **👤 User Isolation**: Each user can only access their own workout data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- A Clerk account ([Sign up here](https://clerk.com))
- A Supabase project ([Create one here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/coachrx-export.git
   cd coachrx-export
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Clerk JWT Template**
   - Go to Clerk Dashboard → JWT Templates
   - Create a new template named "supabase"
   - Select "Supabase" from template options
   - Save the template

5. **Set up Supabase Database**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL schema from `SETUP_GUIDE.md`
   - Configure Third Party Auth with your Clerk domain

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Authentication

**⚠️ Authentication Required**: You must sign in to use this application. All workout data is stored in the cloud and associated with your account.

1. Click "Sign In" in the header
2. Sign in with Google or create an account with email
3. You're ready to start uploading workouts!

### Uploading Workouts

1. Take screenshots of your CoachRX workouts
2. Select a date for the workout
3. Check "Merge all uploads into one session" if uploading multiple screenshots of the same workout
4. Drag and drop your screenshots onto the upload zone
5. Wait for AI processing (2-10 seconds per image)

### Viewing Progress

1. Click on any workout in your library to see details
2. Click on an exercise name to view its history and progress chart
3. Your PR (personal record) is automatically calculated and displayed

### Managing Data

- **Export**: Click the export button on any workout detail page to download as JSON
- **Delete**: Hover over a workout card and click the trash icon
- **Sign Out**: Click your profile picture in the header

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **AI**: Google Gemini 2.0 Flash API
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloud-based (Supabase)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── actions.ts              # Server actions for Gemini API
│   ├── page.tsx                # Home page with upload
│   ├── workouts/
│   │   ├── page.tsx            # Workout library
│   │   └── [id]/page.tsx       # Workout detail view
│   └── exercises/
│       └── [name]/page.tsx     # Exercise history & charts
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Header.tsx              # Navigation with auth
│   ├── upload-zone.tsx         # Drag-and-drop upload
│   ├── date-picker.tsx         # Date selection
│   └── exercise-chart.tsx      # Progress chart
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── storage.ts              # Supabase storage hook
    ├── supabase.ts             # Supabase client
    ├── useSupabaseClient.ts    # Clerk + Supabase integration
    └── utils.ts                # Utility functions
```

## 🔒 Privacy & Security

- **Authentication Required**: All users must sign in to access the application
- **Cloud Storage**: Workout data is stored securely in Supabase
- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **API Key Security**: Your Gemini API key is stored server-side and never exposed to the client
- **JWT Authentication**: Clerk JWTs are used to authenticate Supabase requests
- **No Cross-User Access**: Users cannot see or access other users' workout data

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel's project settings:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Configure Clerk for your production domain
5. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with Docker

**Important**: Make sure to set all environment variables in your hosting platform and configure Clerk for your production domain.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is an unofficial tool and is not affiliated with or endorsed by CoachRX. Use at your own discretion.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Authentication by [Clerk](https://clerk.com/)
- Database by [Supabase](https://supabase.com/)
