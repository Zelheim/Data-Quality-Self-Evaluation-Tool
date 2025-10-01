# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Data Quality Assessment Tool is a React-based web application designed to assess the fitness for purpose of non-official data according to Statistics Canada's data ethics principles and quality dimensions. The tool helps improve reporting on Sustainable Development Goals (SDGs) and addresses data gaps.

## Commands

### Development
```bash
# Install dependencies
yarn install

# Start development server (runs on http://localhost:5173 by default)
yarn dev

# Build for production (outputs to ./dist)
yarn build

# Lint the codebase
yarn lint

# Preview production build
yarn preview
```

### TypeScript
```bash
# Type-check without building
tsc -b
```

## Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6 with Tailwind CSS 4
- **Internationalization**: i18next with react-i18next (English/French support)
- **UI Components**: Mix of custom components and Radix UI primitives
- **Government UI**: @arcnovus/wet-boew-react and @cdssnc/gcds-components-react for Statistics Canada standards
- **Document Export**: jspdf (PDF) and docx (Word documents)

### State Management Pattern

The application uses **lifted state** architecture where assessment state is managed in `MainContent.tsx` and passed down as props to child components. This preserves state across navigation and allows for flexible state management without external libraries.

Key state managed at the top level:
- Assessment step tracking (`'ethics' | 'quality' | 'overall'`)
- Ethics principles answers and results
- Quality dimensions scores and results
- UI state for showing/hiding results

### Navigation Flow

1. **Front Page** (`FrontPage.tsx`) → Assessment introduction
2. **Assessment Tool** (`AssessmentTool.tsx`) → Three-step assessment process:
   - Ethics Principles evaluation
   - Quality Dimensions scoring
   - Overall Assessment with export functionality

The app uses a simple two-view navigation (front page and assessment) rather than traditional tabs. Tab navigation code exists but is commented out.

### Core Assessment Logic

**Assessment Data Structure** (`src/types/assessment.ts`):
- `ETHICS_PRINCIPLES`: 5 yes/no principles (Benefit to Canadians, Fairness, Transparency, Privacy, Confidentiality)
- `QUALITY_DIMENSIONS`: 5 dimensions with 2-3 criteria each (max 15 points total)
  - Accuracy and reliability (3 points)
  - Timeliness and punctuality (3 points)
  - Accessibility and clarity (3 points)
  - Interpretability (3 points)
  - Coherence and comparability (3 points)

**Passing Criteria**:
- Ethics: ALL principles must be answered "Yes"
- Quality: Total score ≥ 10 points (out of 15)
- Overall: Both ethics AND quality must pass

### Component Organization

```
src/
├── components/
│   ├── assessment/         # Core assessment components
│   │   ├── EthicsPrinciples.tsx     # Part 1: Yes/No questions
│   │   ├── QualityDimensions.tsx    # Part 2: Scoring (0-3 per dimension)
│   │   └── OverallAssessment.tsx    # Part 3: Results & export
│   ├── layout/            # Header/Footer with language switcher
│   ├── tabs/              # FrontPage, AssessmentTool, License
│   ├── ui/                # Reusable UI components
│   └── MainContent.tsx    # State management & navigation
├── locales/               # Translation files (en.json, fr.json)
├── types/                 # TypeScript type definitions
└── i18n.ts               # i18next configuration
```

### Internationalization

The app supports **English and French** with automatic language detection:
- Language preference stored in `localStorage` as `i18nextLng`
- Falls back to browser language detection
- All text content must be in translation files (`src/locales/en.json` and `src/locales/fr.json`)
- Use `useTranslation()` hook to access translations: `const { t } = useTranslation()`
- Document language attribute updates automatically on language change

When adding new text:
1. Add translation keys to both `en.json` and `fr.json`
2. Use nested keys for organization (e.g., `assessment.ethics.principle1.title`)
3. Use `t('key.path')` in components

### Export Functionality

The OverallAssessment component supports exporting results in multiple formats:
- **Text**: Plain text summary
- **CSV**: Structured data for spreadsheets
- **PDF**: Generated using jspdf
- **Word**: Generated using docx library

Export includes:
- Assessment date
- All ethics principles with answers
- All quality dimensions with scores
- Overall pass/fail result

### Styling

- **Tailwind CSS 4** with Vite plugin
- Statistics Canada WET-BOEW styling patterns
- Custom CSS in `src/index.css` and `src/App.css`
- Uses WET-BOEW classes for government standards (e.g., `wb-inv-result`)

### Build Configuration

**Vite Configuration** (`vite.config.ts`):
- Base path set to `'./'` for GitHub Pages deployment
- Manual chunk splitting for optimal bundle sizes:
  - `react-vendor`: React core libraries
  - `pdf-lib`: jspdf
  - `docx-lib`: docx
- Chunk size warning limit: 600KB

**TypeScript Configuration**:
- Strict mode enabled
- Target: ES2020
- Module resolution: bundler mode
- JSX: react-jsx

### Deployment

Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Builds using `yarn build`
- Deploys `./dist` folder to GitHub Pages
- Uses Node.js 20 and yarn cache

## Project-Specific Conventions

### Accessibility
- Components follow WET-BOEW accessibility patterns
- Use proper ARIA labels and roles
- Focus management in modals and dialogs
- Language attribute updates on language changes

### File Naming
- Components: PascalCase (e.g., `EthicsPrinciples.tsx`)
- Utilities/types: camelCase (e.g., `assessment.ts`)
- Consistent folder structure by feature

### Component Patterns
- Prefer functional components with hooks
- Use TypeScript interfaces for props
- Lift state to common parent when shared across components
- Use `forwardRef` and `useImperativeHandle` for parent-child method calls
