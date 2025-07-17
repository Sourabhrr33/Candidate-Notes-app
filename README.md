# Collaborative Candidate Notes

An interactive full‑stack application enabling recruiters and hiring managers to collaborate in real time on candidate feedback. Built with React, Node.js, Socket.io, MongoDB, and ShadCN UI.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Running the Application](#running-the-application)
5. [Usage Guide](#usage-guide)
6. [Future Enhancements](#future-enhancements)

## Project Overview

This hackathon MVP allows:

* **User Authentication:** Sign up, log in, protected routes.
* **Candidate Management:** Create and list dummy candidates.
* **Real‑Time Notes:** Post and receive notes in candidate‑specific rooms via Socket.io.
* **@‑Tagging & Notifications:** Tag users in notes with autocomplete; global notifications card and toasts.

## Tech Stack

* **Frontend:** React, Vite, React Router, ShadCN UI (Tailwind CSS)
* **Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose)
* **Authentication:** JWT
* **Real‑Time:** Socket.io

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```
2. **Backend**

   ```bash
   cd Backend
   npm install
   cp .env.example .env        # configure MONGO_URI, JWT_SECRET, PORT
   npm run dev
   ```
3. **Frontend**

   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## Running the Application

* Backend runs on `http://localhost:5000`
* Frontend runs on `http://localhost:5173/` (or Vite default port)

## Usage Guide

1. **Sign up** a new user.
2. **Log in** to access the Dashboard.
3. **Create or select** a candidate from the sidebar.
4. **Post notes** and tag team members using `@username`.
5. View **notifications** for mentions in the sidebar; click to navigate to the tagged note.

## Future Enhancements

* Role‑based access (admin, reviewer).
* Rich‑text editing for notes.
* Search & filter candidates.
* Attach files or resumes to candidate profiles.
* Email or Slack integrations for notifications.
