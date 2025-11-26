# CoachRX Data Liberation & Workout Tracker

A Next.js web application that liberates your workout data from CoachRX screenshots using AI-powered OCR. Track your progress, visualize your gains, and own your fitness data.

## ✨ Features

- **📸 Screenshot Upload**: Drag-and-drop CoachRX workout screenshots
- **🤖 AI-Powered Extraction**: Uses Google Gemini Vision API to extract workout data
- **📊 Progress Tracking**: View exercise history and weight progression charts
- **📈 Visual Analytics**: Interactive charts powered by Recharts
- **💾 Local Storage**: All data stored in your browser (no server required)
- **📤 Data Export**: Export workouts as JSON for backup or migration
- **🔄 Multi-Screenshot Merging**: Combine multiple screenshots into one workout session
- **🧹 Duplicate Cleanup**: Automatically remove duplicate exercises from merged workouts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

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
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

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
- **Cleanup Duplicates**: Use the "Cleanup Duplicates" button in the workout library to remove duplicate exercises
- **Delete**: Hover over a workout card and click the trash icon

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **AI**: Google Gemini 2.0 Flash API
- **Storage**: Browser LocalStorage

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
│   ├── upload-zone.tsx         # Drag-and-drop upload
│   ├── date-picker.tsx         # Date selection
│   └── exercise-chart.tsx      # Progress chart
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── storage.ts              # LocalStorage wrapper
    └── utils.ts                # Utility functions
```

## 🔒 Privacy & Security

- **No Server Storage**: All workout data is stored locally in your browser
- **API Key Security**: Your Gemini API key is stored server-side and never exposed to the client
- **No Tracking**: No analytics or tracking scripts

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `GEMINI_API_KEY` environment variable in Vercel's project settings
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with Docker

**Important**: Make sure to set the `GEMINI_API_KEY` environment variable in your hosting platform.

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
