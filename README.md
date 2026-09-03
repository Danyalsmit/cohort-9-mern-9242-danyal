# cohort-9-mern-9242-danyal
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Danyal khan

A full-stack MERN (MongoDB/MySQL, Express, React, Node.js) application for creating, editing, and managing notes with rich text formatting. Built as part of the 10Pearls Cohort 9 internship program.

## Features

- User authentication (signup, login, logout) with JWT
- Create, edit, delete notes with rich text editing (Tiptap)
- Notes dashboard with search
- User profile management
- Protected and guest-only routing

## Tech Stack

**Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS, Tiptap, React Hook Form + Zod

**Backend:** Node.js, Express, Prisma, MySQL, JWT authentication

**Testing & Quality:** Jest, React Testing Library, Mocha/Chai (backend), SonarQube

## Project Structure

cohort-9-mern-9242-danyal/
├── backend/ # Express API, Prisma schema, controllers, tests
├── frontend/ # React app (Vite + Tailwind)
└── sonarqube-report/ # SonarQube scan screenshots


## Getting Started

### Backend
See [backend/README.md](./backend/README.md) for setup instructions.

### Frontend
See [frontend/README.md](./frontend/README.md) for setup instructions.

## Quality Assurance

- Unit and integration tests covering authentication, notes CRUD, and form validation
- SonarQube code quality scan — reports available in [`sonarqube-report/`](./sonarqube-report)

## Author

Danyal Khan