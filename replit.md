# Peso Tracker

## Overview

Peso Tracker is a personal health companion app for tracking daily weight and visualizing progression over time. Users can register an account with a goal weight, log in, and track their weight measurements with date and time. The app displays a line chart visualization and a sortable history table. Summary statistics include current weight, weight change, lowest, highest, and goal weights. When users reach their goal weight, a congratulations modal is displayed.

The application is built as a cross-platform mobile/web app using Expo (React Native) with an Express.js backend API and PostgreSQL database for persistence.

## Key Features

- **User Authentication**: Registration with goal weight, login, logout with session management
- **Goal Weight Tracking**: Users set a target weight during registration, displayed in summary cards
- **Goal Achievement**: Congratulations modal when user's weight reaches or goes below their goal
- **Multi-language Support**: Portuguese (default) and English with persistent preferences
- **Multiple Entries Per Day**: Weight entries track both date and time for flexibility

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)

**Framework**: Expo SDK 54 with React Native 0.81, supporting iOS, Android, and web platforms from a single codebase.

**State Management**: TanStack React Query handles server state, caching, and synchronization. Local component state uses React hooks.

**Navigation**: React Navigation with native stack navigators. The app uses a single-screen approach (dashboard) with optional tab structure for future expansion.

**Styling**: Custom theme system with light/dark mode support via `useColorScheme`. Theme constants defined in `client/constants/theme.ts` with consistent spacing, colors, and typography.

**Internationalization**: Custom i18n system supporting Portuguese and English, with language preferences persisted via AsyncStorage.

**Path Aliases**: `@/` maps to `./client/` and `@shared/` maps to `./shared/` for clean imports.

### Backend (Express.js)

**API Design**: RESTful JSON API at `/api/weights` supporting CRUD operations. Routes defined in `server/routes.ts` with validation using Zod schemas from the shared folder.

**Storage Layer**: Abstracted through `IStorage` interface in `server/storage.ts`, currently implemented with PostgreSQL via Drizzle ORM.

**CORS**: Dynamic CORS configuration supporting Replit dev/deployment domains and localhost for Expo web development.

### Data Layer

**ORM**: Drizzle ORM with PostgreSQL dialect. Schema defined in `shared/schema.ts` and shared between frontend (for types) and backend (for database operations).

**Schema**: 
- `users` table: id (uuid), username (text, unique), password (text, hashed with scrypt), goalWeight (real, optional), createdAt (timestamp)
- `weights` table: id (serial), userId (uuid, foreign key to users), date (text), time (text), weight (real), createdAt (timestamp) - unique constraint on (userId, date, time)

**Validation**: Zod schemas generated from Drizzle schema using `drizzle-zod`, ensuring consistent validation across client and server.

### Build System

**Development**: Expo CLI for mobile, Express dev server with tsx for hot reloading.

**Production**: Custom build script (`scripts/build.js`) handles static web builds. Server bundled with esbuild.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database client and query builder
- **drizzle-kit**: Migration and schema push tooling

### Third-Party Services
- **Expo Services**: Splash screen, haptic feedback, blur effects, and system UI integration
- **AsyncStorage**: Local persistence for user preferences (language setting)

### Key Runtime Libraries
- **TanStack React Query**: Server state management and caching
- **React Navigation**: Navigation framework for mobile/web
- **React Native Reanimated**: Animation library for smooth UI transitions
- **react-native-svg**: SVG rendering for the weight chart visualization
- **Zod**: Runtime validation for API inputs

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Server bundling for production
- **ESLint + Prettier**: Code formatting and linting