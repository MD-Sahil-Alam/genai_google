# CareerPath - Personalized Career & Skills Advisor

A modern, production-ready React + Next.js application that provides personalized career recommendations and interactive learning paths. Built with TypeScript, Tailwind CSS, and Framer Motion for a premium user experience.

##  Features

- **AI-Powered Assessment**: Interactive chat-style questionnaire with multiple question types
- **Career Recommendations**: Personalized career matches based on skills and interests
- **Interactive Career Tree**: Beautiful tree visualization inspired by professional infographics
- **Video Learning Platform**: Support for YouTube and HTML5 video with progress tracking
- **Progress Validation**: Server-side heartbeat system for accurate learning progress
- **Responsive Design**: Mobile-first approach with accessibility features
- **State Management**: Zustand for efficient client-side state management

##  Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: Zustand
- **API Client**: Axios
- **Video Support**: YouTube IFrame API + HTML5 Video
- **Testing**: Jest + React Testing Library
- **Visualization**: React-D3-Tree (for career roadmap)

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-advisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── assessment/              # Skills assessment page
│   ├── recommendations/         # Career recommendations
│   ├── career-tree/            # Interactive career roadmap
│   ├── dashboard/              # User dashboard
│   ├── signin/                 # Authentication pages
│   └── signup/
├── components/                  # Reusable UI components
│   ├── assessment/             # Assessment-related components
│   ├── career/                 # Career tree and recommendations
│   ├── video/                  # Video player components
│   ├── layout/                 # Layout components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities and configuration
│   ├── api.ts                  # API client and mock data
│   ├── store.ts                # Zustand state management
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript type definitions
└── __tests__/                  # Test files
```

##  Key Components

### Assessment System
- **QuestionCard**: Interactive question component with animations
- **ChatAssessment**: Main assessment flow with progress tracking
- **SkillsRadar**: Visual skills representation

### Career Tree
- **CareerTree**: Interactive tree visualization with hover effects
- **CareerCard**: Recommendation cards with match scoring
- **RecommendationsGrid**: Grid layout for career options

### Video Learning
- **VideoPlayer**: Multi-provider video player with progress tracking
- **Progress Heartbeat**: Server validation system for learning progress

##  Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # API base URL
```

### API Endpoints (Mock Implementation)
```
GET  /api/assessment/questions     # Fetch assessment questions
POST /api/assessment/submit        # Submit assessment answers
GET  /api/recommendations          # Get career recommendations
GET  /api/careers/:id             # Fetch career tree data
GET  /api/resources/:id           # Get resource details
POST /api/progress/heartbeat      # Track learning progress
```

### Mock Data
The application includes comprehensive mock data for:
- Assessment questions (MCQ, slider, text input)
- Career recommendations with match scores
- Hierarchical career tree structure
- Video resources with metadata

##  Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to Vercel, Netlify, or your preferred platform**

## Replacing Mock APIs

### With Supabase
1. Set up Supabase project
2. Create database schema (see `types/index.ts` for structure)
3. Replace API calls in `lib/api.ts`
4. Update environment variables

### With Custom Backend
1. Implement REST API endpoints matching the mock structure
2. Update `NEXT_PUBLIC_API_URL` environment variable
3. Modify authentication logic in components

### Database Schema Example
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  max_xp INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT now()
);

-- Assessment responses
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  question_id TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Career trees
CREATE TABLE career_trees (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  timeline JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Learning progress
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  resource_id TEXT NOT NULL,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT now()
);
```

## Video Provider Configuration

### YouTube Integration
- Uses YouTube IFrame Player API
- Automatic progress tracking
- Player state change events

### HTML5/Cloudflare Stream
- Native video element with custom controls
- Time update events
- Responsive design

### Switching Video Providers
Update the `VideoPlayer` component to handle different providers:
```typescript
// In components/video/video-player.tsx
const getVideoProvider = (resource: Resource) => {
  if (resource.type === 'youtube') return 'youtube';
  if (resource.external_id?.includes('cloudflare')) return 'cloudflare';
  return 'html5';
};
```

##  Testing

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run with coverage report
```

### Test Structure
- **Core Flow Tests**: Assessment → Recommendations → Career Tree
- **Component Tests**: Individual component functionality
- **Integration Tests**: API integration and state management

### Adding New Tests
1. Create test files in `__tests__/` directory
2. Follow naming convention: `component-name.test.tsx`
3. Use React Testing Library best practices

##  Customization

### Design System
- **Colors**: Defined in `tailwind.config.ts`
- **Components**: shadcn/ui components in `components/ui/`
- **Animations**: Framer Motion configurations

### Career Tree Styling
The career tree visualization is inspired by professional infographics:
- Numbered nodes with color coding
- Smooth animations and transitions
- Hover effects and interactive elements

### Responsive Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

##  Performance Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: `npm run analyze`
- **Lazy Loading**: Components and routes

##  Security Considerations

- **Authentication**: Currently mock implementation (will be done with fire base)
- **API Security**: Add authentication middleware
- **Data Validation**: Zod schemas for type safety
- **XSS Protection**: Built-in Next.js protections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests and ensure they pass
6. Submit a pull request


##  Support

For questions or issues:
1. Check the documentation above
2. Search existing issues on GitHub
3. Create a new issue with detailed description

##  Future Enhancements

- [ ] Real-time collaboration features
- [ ] Mobile app with React Native
- [ ] Advanced analytics dashboard
- [ ] AI-powered career coaching
- [ ] Integration with job boards
- [ ] Certification tracking
- [ ] Community features
- [ ] Offline support

---

Built with ❤️ by the Bugb_Busters, team