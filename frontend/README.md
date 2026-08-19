# Frontend

This is the frontend application for the MERN authentication and notes project. It is built with React, Vite, Redux Toolkit, React Router, React Hook Form, Zod, and Axios.

## Requirements

- Node.js 18+
- npm
- Backend API running locally

## Installation

From the `frontend` directory, install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `frontend` directory:


## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Features

- User authentication (signup, login, logout)
- Protected and guest-only routes
- Notes dashboard with create, edit, and delete
- Rich text note editor (Tiptap)

## Tech Stack

- React + Vite
- Tailwind CSS
- Redux Toolkit (auth state)
- React Router
- React Hook Form + Zod (form validation)
- Axios
- Tiptap (rich text editor)