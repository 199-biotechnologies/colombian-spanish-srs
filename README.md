# Colombian Spanish SRS

A beautiful spaced repetition system (SRS) app for learning Colombian Spanish, featuring the Anki SM-2 algorithm, cloud sync, and a book-inspired design.

## Features

- 📚 **1,000+ Colombian Spanish Cards** - Authentic phrases and dialogues
- 🧠 **Anki SM-2 Algorithm** - Scientifically proven spaced repetition
- ⭐ **Favorites System** - Star important cards for quick review
- ☁️ **Cloud Sync** - Progress syncs across all devices via Vercel KV
- 🎨 **Beautiful Typography** - Serif fonts with book-like design
- 🔊 **Audio Support** - Text-to-speech with Colombian accent
- 📱 **PWA Ready** - Install on iPhone home screen
- 💾 **Offline First** - Works without internet, syncs when online

## Tech Stack

- Next.js 15 with TypeScript
- Tailwind CSS
- Vercel KV (Upstash Redis)
- Web Speech API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Vercel account (for deployment and KV storage)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/199-biotechnologies/colombian-spanish-srs.git
cd colombian-spanish-srs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Vercel KV credentials (get them from Vercel dashboard)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git push origin main
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel:
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all KV credentials from your `.env.local`

### Environment Variables

Required environment variables (set in Vercel dashboard):
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `REDIS_URL`

**⚠️ NEVER commit `.env.local` to git!** It's already in `.gitignore`.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes for KV storage
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── BrowseView.tsx    # Card browser with search
│   ├── FlashCard.tsx     # Flashcard component
│   └── Navigation.tsx    # Navigation bar
├── lib/                   # Utilities and logic
│   ├── data.ts           # CSV parser
│   ├── formatText.ts     # Text formatting
│   ├── kv.ts             # Vercel KV functions
│   ├── srs.ts            # Anki SM-2 algorithm
│   ├── storage.ts        # Storage layer
│   └── types.ts          # TypeScript types
└── public/               # Static files
    ├── cards.csv         # 1,000+ Spanish cards
    └── *.svg             # App icons
```

## Usage

### Study Mode
- Review cards with Anki's spaced repetition
- Rate difficulty: Again, Hard, Good, Easy
- Star cards to favorite them
- Audio playback with Colombian accent

### Browse Mode
- Search all 1,000+ cards
- Filter by favorites
- View card details
- Star/unstar cards

### Adding to iPhone Home Screen
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Enjoy the native app experience!

## How It Works

### Spaced Repetition Algorithm
Uses the Anki SM-2 algorithm:
- New cards start with 1-day interval
- Quality rating (0-5) adjusts future intervals
- Failed cards (<3) restart from day 1
- Success increases intervals exponentially

### Cloud Sync
- Progress saves to localStorage (instant)
- Background sync to Vercel KV (Redis)
- Loads from cloud first, falls back to local
- User ID cookie enables cross-device sync

### Text Formatting
- Removes Anki markers (`{{}}`, `[[]]`)
- Adds line breaks for dialogue (A: ... B: ...)
- Clean, readable card display

## License

ISC

## Credits

Built with ❤️ using Claude Code

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
