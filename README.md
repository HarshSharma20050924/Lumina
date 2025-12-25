
# Lumina | Next Gen E-Commerce

## Full-Stack E-Commerce Platform

This is a complete e-commerce solution with both frontend and backend components.

### Frontend
- Built with React and TypeScript
- Uses Vite for fast development
- Modern UI with Tailwind CSS and Framer Motion
- State management with Zustand

### Backend
- RESTful API built with Express and TypeScript
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Clean architecture with repositories, services, and controllers

## Run Locally

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Frontend Setup
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the frontend app:
   `npm run dev`

### Backend Setup
1. Install dependencies:
   `npm install`
2. Create a `.env` file in the root directory with the required environment variables (see BACKEND-SETUP.md for details)
3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Run the backend server:
   `npm run server`

### Full-Stack Development
To run both frontend and backend simultaneously:
`npm run dev:fullstack`

For complete setup instructions, see [BACKEND-SETUP.md](./BACKEND-SETUP.md).
