# TaskFusion — Frontend Application

**Welcome to TaskFusion** — a powerful 2-in-1 web application combining an intuitive Kanban task board with an advanced Image Annotation tool. Easily manage your daily tasks, organize your workflow by date, and annotate images with custom polygons all in one place.

## 🔗 Live Links
- **Live Frontend**: https://taskcanvas-app.vercel.app

## 🔑 Demo Login Credentials

| 👑 Admin Account |
| :--- |
| **Email:** `admin@gmail.com`<br>**Pass:** `admin123456` |

## ✨ Features Implemented

### 1. Task Management (Kanban Board)
- **Interactive Drag-and-Drop**: Easily move tasks between different columns (TODO, IN_PROGRESS, DONE) using `@dnd-kit`.
- **Date-Based Filtering**: View and manage tasks specific to a selected date to keep your workflow focused.
- **Full CRUD Support**: Seamlessly create, edit, update statuses, and delete tasks.

### 2. Advanced Image Annotation
- **Interactive Canvas**: Utilize a powerful `react-konva` canvas to draw, view, and interact with polygons directly on top of your images.
- **Image Uploads**: Upload images easily and manage them within the application.
- **Dynamic Polygon Drawing**: Click to add points and create custom shapes. The polygon automatically closes to form a complete annotation.

### 3. Authentication & Security
- **JWT-Based Login**: Secure user authentication and session management.
- **Protected Routes**: Ensuring only authenticated users can access the application's core features.

### 4. Modern UI & UX
- **Tailwind CSS Styling**: Beautiful, responsive, and modern user interface styled with Tailwind CSS v4.
- **Form Validation**: Robust client-side validation using `React Hook Form` and `Zod`.
- **Smooth State Management**: Leverages Redux Toolkit to handle complex application states effortlessly.

## 🛠️ Tech Stack
- **Next.js 16 (React 19)** (UI Framework & Routing)
- **TypeScript** (Type Safety)
- **Redux Toolkit** (State Management)
- **Tailwind CSS v4** (Styling)
- **@dnd-kit** (Drag & Drop functionality)
- **React-Konva** (Canvas & Polygon Rendering)
- **React Hook Form** (Form Handling)
- **Zod** (Schema Validation)
- **Lucide React** (Icons)

---

## 🚀 Project Setup & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Alok4D/task-annotation-frontend.git
cd task-annotation-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory of the frontend project:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
*(Note: If your backend is deployed, replace the URL with your live backend API link)*

### 4. Run the application
Start the development server:
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 5. Build for Production
To create a production build:
```bash
npm run build
```
