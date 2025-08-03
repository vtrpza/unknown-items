# UNKNOWN ITEMS - UI/UX Design Document

## Design Philosophy

The UNKNOWN ITEMS platform embraces a design that balances mystery and discovery with clarity and usability. Our interface should evoke curiosity while maintaining intuitive navigation and engagement patterns familiar to social media users.

## Design Principles

1. **Mystery-First**: Visual elements that evoke curiosity and discovery
2. **Clarity**: Clear information hierarchy and readable content
3. **Engagement**: Interactive elements that encourage participation
4. **Accessibility**: WCAG 2.1 AA compliant design
5. **Responsive**: Mobile-first design approach
6. **Performance**: Lightweight, fast-loading interfaces

## Visual Design System

### Color Palette

```css
/* Primary Colors */
--primary-dark: #0F172A      /* Deep mystery blue */
--primary: #1E293B           /* Slate blue */
--primary-light: #334155     /* Light slate */

/* Accent Colors */
--accent-mystery: #8B5CF6    /* Purple - mystery/unknown */
--accent-fact: #10B981       /* Green - verified facts */
--accent-object: #F59E0B     /* Orange - objects */
--accent-event: #EF4444      /* Red - events */

/* Neutral Colors */
--gray-900: #111827
--gray-700: #374151
--gray-500: #6B7280
--gray-300: #D1D5DB
--gray-100: #F3F4F6
--white: #FFFFFF

/* Semantic Colors */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6
```

### Typography

```css
/* Font Stack */
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Type Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Spacing System

```css
/* Spacing Scale (Tailwind Compatible) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Component Library

### Core Components

#### 1. Navigation Header
```tsx
<Header>
  - Logo (mystery icon + text)
  - Search bar (global search)
  - Navigation items (Home, Trending, Categories)
  - User actions (Notifications, Profile, Create Post)
  - Theme toggle (light/dark mode)
</Header>
```

#### 2. Post Card
```tsx
<PostCard>
  - Category badge (color-coded)
  - Mystery status indicator
  - Title (prominent)
  - Content preview (truncated)
  - Media preview (if applicable)
  - Author info (avatar, username, timestamp)
  - Engagement metrics (likes, comments, shares)
  - Action buttons (like, comment, share, bookmark)
  - Tags (clickable)
</PostCard>
```

#### 3. Feed Layout
```tsx
<FeedLayout>
  - Sidebar (left): Navigation, categories, trending tags
  - Main content: Post feed with infinite scroll
  - Sidebar (right): Trending mysteries, suggested users
  - Mobile: Bottom navigation, collapsible sidebars
</FeedLayout>
```

#### 4. Create Post Modal
```tsx
<CreatePostModal>
  - Category selector (required)
  - Title input
  - Rich text editor
  - Media upload (drag & drop)
  - Tag input (autocomplete)
  - Mystery status selector
  - Privacy settings
  - Post/Schedule buttons
</CreatePostModal>
```

#### 5. User Profile
```tsx
<UserProfile>
  - Cover image
  - Avatar
  - User info (name, username, bio)
  - Mystery score/badges
  - Stats (posts, followers, following)
  - Action buttons (follow, message)
  - Tab navigation (Posts, Solved, Likes, Media)
  - Post grid/list view toggle
</UserProfile>
```

## Page Layouts

### 1. Home Page (/)
```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├───────────┬─────────────────────────┬──────────────┤
│           │                         │              │
│  Left     │      Main Feed         │   Right      │
│  Sidebar  │                        │   Sidebar    │
│           │  - Trending Posts      │              │
│  - Nav    │  - Recent Posts        │  - Trending  │
│  - Cats   │  - Personalized Feed   │  - Suggested │
│  - Tags   │                        │  - Stats     │
│           │                        │              │
└───────────┴─────────────────────────┴──────────────┘
```

### 2. Post Detail Page (/post/[id])
```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│              Post Detail Container                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Category Badge    Mystery Status    Share  │  │
│  │                                             │  │
│  │              Post Title                     │  │
│  │                                             │  │
│  │            Author Info Bar                  │  │
│  │                                             │  │
│  │            Post Content                     │  │
│  │            Media Gallery                    │  │
│  │                                             │  │
│  │            Tags Section                     │  │
│  │                                             │  │
│  │         Engagement Actions                  │  │
│  │                                             │  │
│  │          Comments Section                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│              Related Posts                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Category Page (/category/[slug])
```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│           Category Header Section                   │
│   - Icon, Name, Description, Post Count            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Filter Bar: Sort, Time Range, Mystery Status     │
│                                                     │
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│  Filters  │         Post Grid/List                 │
│  Sidebar  │                                         │
│           │                                         │
└───────────┴─────────────────────────────────────────┘
```

### 4. Search Results (/search)
```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Search Bar (with query)                          │
│   Result count and filters                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Tab Navigation:                                  │
│   All | Posts | Users | Tags | Categories          │
│                                                     │
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│  Refine   │       Search Results                   │
│  Filters  │                                         │
│           │                                         │
└───────────┴─────────────────────────────────────────┘
```

## Mobile Design

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile-Specific Features
1. **Bottom Navigation**: Home, Search, Create, Notifications, Profile
2. **Swipe Gestures**: Navigate between posts, refresh feed
3. **Collapsible Headers**: Maximize content area on scroll
4. **Touch-Optimized**: Larger tap targets (min 44x44px)
5. **Offline Mode**: Cached content for poor connectivity

### Mobile Component Adaptations
```
Mobile Post Card:
┌─────────────────────────┐
│ Category    Status  ••• │
├─────────────────────────┤
│ Post Title              │
│                         │
│ Content Preview...      │
│                         │
│ [Media Thumbnail]       │
│                         │
│ @username • 2h ago      │
│                         │
│ ❤️ 234  💬 45  🔄 12     │
└─────────────────────────┘
```

## Interaction Patterns

### 1. Post Interactions
- **Like**: Double-tap or heart button (animated)
- **Comment**: Tap comment button or post to view
- **Share**: Native share sheet integration
- **Bookmark**: Save for later (synced across devices)

### 2. Feed Interactions
- **Pull to Refresh**: Update feed content
- **Infinite Scroll**: Load more posts automatically
- **Quick Actions**: Long press for quick menu
- **Filtering**: Easy access to category/time filters

### 3. Creation Flow
```
Create Button → Category Selection → Post Composer → Preview → Publish
                     ↓
              Template Suggestions
```

### 4. Discovery Features
- **Mystery of the Day**: Featured mystery
- **Trending Topics**: Real-time trending
- **Related Content**: AI-powered suggestions
- **User Recommendations**: Based on interests

## Accessibility Features

### WCAG 2.1 AA Compliance
1. **Color Contrast**: Minimum 4.5:1 for normal text
2. **Keyboard Navigation**: Full keyboard support
3. **Screen Reader**: Proper ARIA labels and roles
4. **Focus Indicators**: Visible focus states
5. **Skip Links**: Navigate to main content
6. **Alt Text**: Required for all images

### Accessibility Components
```tsx
// Example accessible button
<Button
  aria-label="Like this post"
  aria-pressed={isLiked}
  onClick={handleLike}
>
  <HeartIcon aria-hidden="true" />
  <span className="sr-only">
    {isLiked ? 'Unlike' : 'Like'} this post
  </span>
</Button>
```

## Animation & Micro-interactions

### Animation Principles
- **Purposeful**: Enhance UX, not distract
- **Consistent**: Standard timing functions
- **Performance**: GPU-accelerated when possible
- **Accessible**: Respect prefers-reduced-motion

### Key Animations
```css
/* Standard transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Spring animations for interactions */
--spring-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--spring-smooth: cubic-bezier(0.23, 1, 0.32, 1);
```

### Micro-interactions
1. **Like Animation**: Heart burst effect
2. **Follow Button**: Smooth state transition
3. **Loading States**: Skeleton screens
4. **Hover Effects**: Subtle elevation/glow
5. **Form Feedback**: Real-time validation

## Dark Mode Design

### Dark Mode Palette
```css
/* Dark mode specific */
--dark-bg-primary: #0F172A
--dark-bg-secondary: #1E293B
--dark-bg-tertiary: #334155
--dark-text-primary: #F1F5F9
--dark-text-secondary: #CBD5E1
--dark-border: #334155
```

### Dark Mode Considerations
- Reduced contrast for eye comfort
- Colored accents remain vibrant
- Shadows become glows
- Maintain visual hierarchy
- Test all color combinations

## Loading & Empty States

### Loading States
1. **Initial Load**: Full-page skeleton
2. **Content Load**: Individual skeleton cards
3. **Lazy Load**: Progressive image loading
4. **Action Feedback**: Button loading states

### Empty States
```
No Posts Yet:
┌─────────────────────────┐
│                         │
│    [Mystery Icon]       │
│                         │
│  No mysteries here yet  │
│                         │
│  Be the first to share │
│  something unknown!     │
│                         │
│  [Create Post Button]   │
│                         │
└─────────────────────────┘
```

## Error States

### Error Handling UI
1. **Form Errors**: Inline validation messages
2. **Network Errors**: Toast notifications
3. **404 Pages**: Custom mystery-themed design
4. **Offline Mode**: Clear offline indicators

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Images and components
2. **Virtual Scrolling**: For long lists
3. **Code Splitting**: Route-based chunks
4. **Asset Optimization**: WebP images, SVG icons
5. **CSS-in-JS**: Styled-components or CSS modules

### Performance Budgets
- First Paint: < 1s
- Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 200KB initial

This UI/UX design document provides a comprehensive foundation for building an engaging, accessible, and performant interface for the UNKNOWN ITEMS platform.