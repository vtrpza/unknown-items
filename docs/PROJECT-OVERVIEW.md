# UNKNOWN ITEMS - Project Overview

## Executive Summary

UNKNOWN ITEMS is a social media platform designed for sharing and discovering mysterious content, unknown facts, and unexplained phenomena. Built with modern web technologies, it combines the engagement patterns of Twitter and Reddit with a focus on mystery and discovery.

## Project Structure

```
unknown-items/
├── docs/                      # Project documentation
│   ├── ARCHITECTURE.md       # System architecture details
│   ├── UI-UX-DESIGN.md      # Design system and components
│   ├── IMPLEMENTATION-ROADMAP.md  # Development phases
│   └── PROJECT-OVERVIEW.md   # This file
├── src/                      # Source code
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and configurations
│   └── types/               # TypeScript definitions
├── prisma/                   # Database schema
├── public/                   # Static assets
└── tests/                    # Test files
```

## Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Git

### Installation
```bash
# Clone repository
git clone [repository-url]
cd unknown-items

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Set up database
npx prisma db push

# Run development server
npm run dev
```

## Key Features

### Core Functionality
- **User Authentication**: Secure registration and login
- **Content Creation**: Rich text posts with media support
- **Social Interactions**: Likes, comments, shares, follows
- **Discovery**: Search, trending, categories, tags
- **Real-time Updates**: Live notifications and updates

### Mystery-Specific Features
- **Categories**: 9 mystery categories (facts, objects, events, etc.)
- **Mystery Status**: Track solved/unsolved mysteries
- **Community Verification**: Crowd-sourced fact checking
- **Mystery Score**: User reputation system

## Technology Decisions

### Frontend Stack
- **Next.js 15.4.5**: React framework with App Router
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **React Query**: Data fetching and caching

### Backend Stack
- **Next.js API Routes**: Backend endpoints
- **Prisma ORM**: Database abstraction
- **PostgreSQL**: Primary database
- **NextAuth.js**: Authentication
- **WebSockets**: Real-time features

### Infrastructure
- **Vercel**: Hosting platform
- **Cloudinary**: Media storage
- **Redis**: Caching layer
- **Sentry**: Error tracking

## Development Workflow

### Git Strategy
```
main          # Production branch
├── develop   # Integration branch
└── feature/* # Feature branches
```

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Test additions/changes
chore: Build/config changes
```

### Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks
- TypeScript strict mode
- Jest for unit testing

## Current Status

### Completed ✅
- System architecture design
- Database schema design
- API endpoint planning
- UI/UX design system
- Implementation roadmap
- Project documentation

### In Progress 🚧
- Project setup and configuration
- Basic infrastructure

### Upcoming 📅
- Authentication implementation
- Core models creation
- Basic UI components
- Post creation functionality

## Team Roles

### Development
- **Full-Stack Developer**: Primary development
- **UI/UX Designer**: Design maintenance
- **DevOps**: Infrastructure management

### Optional Roles
- **QA Engineer**: Testing strategy
- **Content Moderator**: Community management
- **Data Analyst**: User behavior analysis

## Communication Channels

- **Code Repository**: GitHub/GitLab
- **Project Board**: GitHub Projects/Trello
- **Documentation**: This docs folder
- **Issues**: GitHub Issues

## Important Links

### Documentation
- [Architecture Document](./ARCHITECTURE.md)
- [UI/UX Design Guide](./UI-UX-DESIGN.md)
- [Implementation Roadmap](./IMPLEMENTATION-ROADMAP.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## Getting Help

### Common Issues
1. **Database Connection**: Check `.env.local` settings
2. **Module Not Found**: Run `npm install`
3. **Type Errors**: Run `npm run type-check`

### Support
- Check documentation first
- Search existing issues
- Create new issue with details
- Tag appropriately

## Contributing

### Code Contributions
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Wait for review

### Guidelines
- Follow existing patterns
- Write tests for new features
- Update documentation
- Keep commits atomic
- Reference issues in PRs

## Security

### Reporting Issues
- Email: security@unknownitems.com
- Do not disclose publicly
- Include reproduction steps
- Wait for confirmation

### Best Practices
- Never commit secrets
- Use environment variables
- Validate all inputs
- Sanitize user content
- Keep dependencies updated

## License

[License details to be determined]

---

This project is actively under development. Check the [Implementation Roadmap](./IMPLEMENTATION-ROADMAP.md) for current progress and upcoming features.