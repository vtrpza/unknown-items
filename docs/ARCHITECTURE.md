# UNKNOWN ITEMS - System Architecture

## Overview

UNKNOWN ITEMS is a social media platform designed for sharing and discovering mysterious content, unknown facts, and unexplained phenomena. This document outlines the complete system architecture, technical decisions, and implementation strategy.

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [API Architecture](#api-architecture)
5. [Authentication & Security](#authentication--security)
6. [Frontend Architecture](#frontend-architecture)
7. [Real-time Features](#real-time-features)
8. [Content Management](#content-management)
9. [Performance Strategy](#performance-strategy)
10. [Deployment Architecture](#deployment-architecture)

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)    │    Mobile Web    │   Future: Native App │
└───────────────────────┴──────────────────┴─────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Application Layer                        │
├─────────────────────────────────────────────────────────────────┤
│   Next.js App Router  │  API Routes  │  WebSocket Server        │
│   React Components    │  tRPC/REST   │  Real-time Updates       │
└───────────────────────┴──────────────┴─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Service Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service   │  Content Service  │  Feed Algorithm  │  Search │
│  User Service   │  Media Service    │  Notification    │  Cache  │
└─────────────────┴──────────────────┴─────────────────┴─────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                           Data Layer                             │
├─────────────────────────────────────────────────────────────────┤
│   PostgreSQL    │    Redis Cache    │   S3/Cloudinary  │  Search│
│   (Primary DB)  │   (Session/Cache) │   (Media Storage) │  (Algolia)│
└─────────────────┴──────────────────┴──────────────────┴────────┘
```

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth.js v5
- **API Layer**: tRPC or REST with Next.js API Routes
- **Real-time**: Socket.io or Pusher
- **Testing**: Jest, React Testing Library, Playwright

### Infrastructure
- **Hosting**: Vercel (Primary), with AWS services
- **Database**: Supabase or Railway (PostgreSQL)
- **Media Storage**: Cloudinary or AWS S3
- **Caching**: Redis (Upstash)
- **Search**: Algolia or PostgreSQL Full-Text Search
- **Monitoring**: Vercel Analytics, Sentry

## Database Design

### Core Entities

```prisma
// User Management
model User {
  id              String    @id @default(cuid())
  username        String    @unique @db.VarChar(30)
  email           String    @unique
  emailVerified   DateTime?
  passwordHash    String?
  role            UserRole  @default(USER)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  profile         Profile?
  posts           Post[]
  comments        Comment[]
  likes           Like[]
  bookmarks       Bookmark[]
  following       Follow[]  @relation("following")
  followers       Follow[]  @relation("followers")
  notifications   Notification[]
  reports         Report[]
  
  @@index([username])
  @@index([email])
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
}

model Profile {
  id              String    @id @default(cuid())
  userId          String    @unique
  displayName     String?
  bio             String?   @db.Text
  avatar          String?
  coverImage      String?
  location        String?
  website         String?
  interests       String[]
  mysteryScore    Int       @default(0)
  verified        Boolean   @default(false)
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// Content Management
model Post {
  id              String    @id @default(cuid())
  title           String    @db.VarChar(200)
  content         String    @db.Text
  contentType     ContentType
  category        Category
  authorId        String
  published       Boolean   @default(true)
  featured        Boolean   @default(false)
  views           Int       @default(0)
  mysteryStatus   MysteryStatus @default(UNSOLVED)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  author          User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  media           Media[]
  tags            PostTag[]
  comments        Comment[]
  likes           Like[]
  bookmarks       Bookmark[]
  reports         Report[]
  
  @@index([authorId])
  @@index([category])
  @@index([createdAt])
  @@index([mysteryStatus])
}

enum ContentType {
  TEXT
  IMAGE
  VIDEO
  LINK
  MIXED
}

enum Category {
  UNKNOWN_FACTS
  INTERNET_MYSTERIES
  UNIDENTIFIED_OBJECTS
  UNEXPLAINED_EVENTS
  HISTORICAL_MYSTERIES
  SCIENTIFIC_ANOMALIES
  CRYPTIDS
  CONSPIRACIES
  OTHER
}

enum MysteryStatus {
  UNSOLVED
  PARTIALLY_SOLVED
  SOLVED
  DEBUNKED
}

model Tag {
  id              String    @id @default(cuid())
  name            String    @unique @db.VarChar(50)
  slug            String    @unique @db.VarChar(50)
  description     String?
  usageCount      Int       @default(0)
  
  posts           PostTag[]
  
  @@index([slug])
  @@index([usageCount])
}

model PostTag {
  postId          String
  tagId           String
  
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag             Tag       @relation(fields: [tagId], references: [id])
  
  @@id([postId, tagId])
}

// Interactions
model Comment {
  id              String    @id @default(cuid())
  content         String    @db.Text
  authorId        String
  postId          String
  parentId        String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  author          User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parent          Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies         Comment[] @relation("CommentReplies")
  likes           CommentLike[]
  
  @@index([postId])
  @@index([authorId])
  @@index([parentId])
}

model Like {
  id              String    @id @default(cuid())
  userId          String
  postId          String
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
  @@index([postId])
  @@index([userId])
}

model CommentLike {
  id              String    @id @default(cuid())
  userId          String
  commentId       String
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comment         Comment   @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, commentId])
}

model Bookmark {
  id              String    @id @default(cuid())
  userId          String
  postId          String
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post            Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
  @@index([userId])
}

model Follow {
  id              String    @id @default(cuid())
  followerId      String
  followingId     String
  createdAt       DateTime  @default(now())
  
  follower        User      @relation("following", fields: [followerId], references: [id], onDelete: Cascade)
  following       User      @relation("followers", fields: [followingId], references: [id], onDelete: Cascade)
  
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

// Media & Files
model Media {
  id              String    @id @default(cuid())
  url             String
  thumbnailUrl    String?
  type            MediaType
  size            Int
  width           Int?
  height          Int?
  duration        Int?      // For videos
  postId          String?
  uploaderId      String
  createdAt       DateTime  @default(now())
  
  post            Post?     @relation(fields: [postId], references: [id], onDelete: Cascade)
  uploader        User      @relation(fields: [uploaderId], references: [id])
  
  @@index([postId])
  @@index([uploaderId])
}

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
  DOCUMENT
}

// Notifications
model Notification {
  id              String    @id @default(cuid())
  userId          String
  type            NotificationType
  title           String
  message         String
  entityId        String?   // ID of related entity (post, comment, etc.)
  read            Boolean   @default(false)
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, read])
  @@index([createdAt])
}

enum NotificationType {
  NEW_FOLLOWER
  POST_LIKE
  POST_COMMENT
  COMMENT_REPLY
  MENTION
  MYSTERY_SOLVED
  TRENDING_POST
}

// Moderation
model Report {
  id              String    @id @default(cuid())
  reporterId      String
  targetType      ReportTargetType
  targetId        String
  reason          ReportReason
  description     String?   @db.Text
  status          ReportStatus @default(PENDING)
  resolvedAt      DateTime?
  resolvedBy      String?
  createdAt       DateTime  @default(now())
  
  reporter        User      @relation(fields: [reporterId], references: [id])
  post            Post?     @relation(fields: [targetId], references: [id], onDelete: Cascade)
  
  @@index([status])
  @@index([targetType, targetId])
}

enum ReportTargetType {
  POST
  COMMENT
  USER
}

enum ReportReason {
  SPAM
  HARASSMENT
  MISINFORMATION
  INAPPROPRIATE_CONTENT
  COPYRIGHT
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWING
  RESOLVED
  DISMISSED
}
```

## API Architecture

### API Design Principles
- RESTful endpoints for public APIs
- tRPC for type-safe internal APIs
- GraphQL consideration for mobile apps
- Consistent error handling
- Rate limiting and throttling
- API versioning strategy

### Core API Endpoints

```typescript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

// Users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/posts
GET    /api/users/:id/followers
GET    /api/users/:id/following
POST   /api/users/:id/follow
DELETE /api/users/:id/follow

// Posts
GET    /api/posts              // List with pagination
POST   /api/posts              // Create new post
GET    /api/posts/:id          // Get single post
PUT    /api/posts/:id          // Update post
DELETE /api/posts/:id          // Delete post
GET    /api/posts/:id/comments // Get comments
POST   /api/posts/:id/like     // Like post
DELETE /api/posts/:id/like     // Unlike post
POST   /api/posts/:id/bookmark // Bookmark post

// Feed
GET    /api/feed               // Personalized feed
GET    /api/feed/trending      // Trending posts
GET    /api/feed/category/:category
GET    /api/feed/tag/:tag

// Search
GET    /api/search/posts
GET    /api/search/users
GET    /api/search/tags

// Notifications
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all

// Media
POST   /api/media/upload
DELETE /api/media/:id
```

## Authentication & Security

### Authentication Flow
1. **Registration**: Email/password with verification
2. **Login**: JWT-based authentication with refresh tokens
3. **OAuth**: Social login options (Google, GitHub)
4. **2FA**: Optional two-factor authentication

### Security Measures
- Password hashing with bcrypt/argon2
- Rate limiting on auth endpoints
- CSRF protection
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS protection
- Content Security Policy (CSP)
- HTTPS enforcement

### Authorization Levels
```typescript
enum Permission {
  // Post permissions
  CREATE_POST = 'create:post',
  EDIT_OWN_POST = 'edit:own_post',
  EDIT_ANY_POST = 'edit:any_post',
  DELETE_OWN_POST = 'delete:own_post',
  DELETE_ANY_POST = 'delete:any_post',
  
  // User permissions
  VIEW_PROFILE = 'view:profile',
  EDIT_OWN_PROFILE = 'edit:own_profile',
  EDIT_ANY_PROFILE = 'edit:any_profile',
  
  // Moderation permissions
  VIEW_REPORTS = 'view:reports',
  RESOLVE_REPORTS = 'resolve:reports',
  BAN_USERS = 'ban:users',
  
  // Admin permissions
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SYSTEM = 'manage:system',
}
```

## Frontend Architecture

### Component Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   ├── (main)/            # Main app routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── features/          # Feature-specific components
│   │   ├── posts/
│   │   ├── users/
│   │   ├── feed/
│   │   └── search/
│   ├── layout/            # Layout components
│   └── shared/            # Shared components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configs
├── services/              # API service layers
├── stores/                # State management
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

### Key Frontend Features
1. **Infinite Scroll Feed**: Virtual scrolling for performance
2. **Real-time Updates**: WebSocket integration
3. **Offline Support**: PWA with service workers
4. **Responsive Design**: Mobile-first approach
5. **Dark Mode**: System preference detection
6. **Internationalization**: Multi-language support ready

## Real-time Features

### WebSocket Architecture
```typescript
// Real-time events
interface RealtimeEvents {
  // Post events
  'post:new': (post: Post) => void
  'post:update': (post: Post) => void
  'post:delete': (postId: string) => void
  
  // Interaction events
  'post:like': (data: { postId: string; userId: string }) => void
  'post:comment': (comment: Comment) => void
  
  // Notification events
  'notification:new': (notification: Notification) => void
  
  // User events
  'user:online': (userId: string) => void
  'user:offline': (userId: string) => void
}
```

### Real-time Features
- Live post updates
- Real-time comments
- Instant notifications
- Online user status
- Typing indicators
- Live vote counts

## Content Management

### Feed Algorithm
```typescript
interface FeedAlgorithm {
  // Scoring factors
  recency: number         // 0.3 weight
  engagement: number      // 0.25 weight
  relevance: number       // 0.2 weight
  authorScore: number     // 0.15 weight
  mysteryFactor: number   // 0.1 weight
  
  // Personalization
  userInterests: string[]
  followedTopics: string[]
  interactionHistory: InteractionHistory
}
```

### Content Moderation
1. **Automated Detection**: Spam and inappropriate content
2. **Community Reporting**: User-driven moderation
3. **Moderator Queue**: Review system for reports
4. **Shadow Banning**: Soft moderation approach
5. **Appeal System**: Fair review process

## Performance Strategy

### Optimization Techniques
1. **Server-Side Rendering**: Initial page loads
2. **Static Generation**: Marketing pages
3. **Incremental Static Regeneration**: Popular content
4. **Edge Caching**: CDN integration
5. **Database Optimization**: 
   - Proper indexing
   - Query optimization
   - Connection pooling
6. **Asset Optimization**:
   - Image lazy loading
   - Next.js Image optimization
   - Code splitting
   - Bundle optimization

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

## Deployment Architecture

### Infrastructure Setup
```yaml
Production Environment:
  - Frontend: Vercel
  - Database: Supabase/Railway PostgreSQL
  - Media Storage: Cloudinary
  - Cache: Upstash Redis
  - Search: Algolia
  - Monitoring: Vercel Analytics + Sentry

Staging Environment:
  - Mirror of production with reduced resources
  
Development:
  - Local PostgreSQL
  - Local Redis
  - Mock services for external APIs
```

### CI/CD Pipeline
1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Unit, integration, and E2E tests
3. **Build**: Next.js production build
4. **Deploy**: Automated deployment to Vercel
5. **Post-Deploy**: Smoke tests and monitoring

### Monitoring & Analytics
- Performance monitoring (Core Web Vitals)
- Error tracking (Sentry)
- User analytics (Vercel Analytics)
- Custom event tracking
- Database query performance
- API endpoint monitoring

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Database read replicas
- Caching at multiple levels
- CDN for static assets
- Queue system for background jobs

### Future Enhancements
1. **Mobile Apps**: React Native implementation
2. **AI Features**: Content recommendations
3. **Advanced Search**: ElasticSearch integration
4. **Video Processing**: Transcoding pipeline
5. **Blockchain**: Mystery verification system
6. **AR Features**: Object identification

## Security Best Practices

1. **Data Protection**:
   - Encryption at rest and in transit
   - PII data minimization
   - GDPR compliance
   - Regular security audits

2. **Application Security**:
   - Dependency scanning
   - Security headers
   - Rate limiting
   - Input validation
   - Output encoding

3. **Infrastructure Security**:
   - Environment variable management
   - Principle of least privilege
   - Regular updates
   - Backup strategy

## Development Workflow

### Git Strategy
- Main branch: Production-ready code
- Develop branch: Integration branch
- Feature branches: Individual features
- Hotfix branches: Emergency fixes

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Code review process

### Testing Strategy
- Unit tests: 80% coverage target
- Integration tests: API endpoints
- E2E tests: Critical user flows
- Performance tests: Load testing
- Security tests: Vulnerability scanning

This architecture provides a robust foundation for building a scalable, secure, and performant social media platform focused on mysterious content.