# SaaS Application

A modern SaaS application built with React, Vite, Tailwind CSS, and Supabase.

## Features

- User authentication (sign up, sign in, sign out)
- Protected routes
- Responsive design with Tailwind CSS
- Backend integration with Supabase

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd saas
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
/src
  /assets        # Static assets
  /components    # Reusable components
  /contexts      # React contexts
  /hooks         # Custom hooks
  /pages         # Page components
  /utils         # Utility functions
  App.jsx        # Main application component
  main.jsx       # Entry point
  index.css      # Global styles
```

## Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

MIT
