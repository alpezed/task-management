# Task Management Application

A modern task management application built with React, TypeScript, and Vite. This application allows users to create, view, filter, and manage tasks with different priorities and statuses.

## Features

- Create new tasks with title, description, and priority
- Mark tasks as active or completed
- Filter tasks by status (all, active, completed)
- Sort tasks by priority
- Responsive design with Tailwind CSS
- Data fetching with React Query

## Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn
```

Using pnpm:
```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Then edit the `.env` file to set your API base URL:

```
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at http://localhost:5173

## Available Scripts

- `dev`: Start the development server
- `build`: Build the application for production
- `lint`: Run ESLint to check for code issues
- `preview`: Preview the production build locally

## Technologies Used

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Query
- Lucide React (for icons)

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # React components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── services/      # API services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## License

MIT