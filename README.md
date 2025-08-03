# UNKNOWN ITEMS

A social media platform for sharing and discovering unknown facts, internet mysteries, unidentified objects, and unexplained events.

## Overview

UNKNOWN ITEMS is a community-driven platform similar to Twitter and Reddit, designed specifically for sharing and discussing mysterious, unknown, or unexplained content. Users can post about:

- Unknown facts and trivia
- Internet mysteries and unsolved cases
- Unidentified objects and artifacts
- Unexplained events and phenomena
- Historical mysteries
- Scientific anomalies
- And more...

## Features

- **Post Creation**: Share your discoveries with text, images, and links
- **Community Interaction**: Like, comment, and share posts
- **Categories**: Organize content by type (facts, objects, events, mysteries)
- **Search & Discovery**: Find posts by keywords, tags, or categories
- **User Profiles**: Build your reputation as a mystery enthusiast
- **Trending Topics**: See what unknown items are captivating the community

## Tech Stack

- **Frontend**: Next.js 15.4.5 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: Prisma ORM
- **TypeScript**: Full type safety throughout the application
- **Authentication**: TBD
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd unknown-items
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
unknown-items/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and configurations
│   └── styles/       # Global styles
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── ...
```

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

[License information to be added]
