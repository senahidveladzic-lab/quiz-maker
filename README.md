# Quiz Maker

A Next.js application for creating and managing quizzes with question recycling capabilities.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation
```bash
npm install
```

## Running the Application

### Option 1: Run everything with one command (recommended)
```bash
npm run dev:all
```
This starts both the JSON Server (API) and Next.js app.

### Option 2: Run separately (advanced)
If you prefer more control or are using a different backend:

**Terminal 1 - Start the JSON Server (API):**
```bash
npm run json-server
```
This starts the mock API server on `http://localhost:3001`

**Terminal 2 - Start the Next.js App:**
```bash
npm run dev
```
This starts the Next.js application on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Features

- Create and edit quizzes
- Add custom questions or recycle existing ones
- Drag-and-drop question reordering
- Play quizzes with swipe navigation
- Share quiz links

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS
- **API Calls:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **UI Components:** Shadcn
- **Mock API:** JSON Server

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/hooks` - Custom hooks and facades
- `/lib` - Utilities, API client, and types
- `db.json` - Mock database for development