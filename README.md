# TaskCanvas App

**Welcome to TaskCanvas** — a modern full-stack application that combines a powerful **Kanban Task Management System** with an intuitive **Image Annotation Tool**. Organize your daily workflow, manage tasks by date, and create precise polygon annotations on images through a clean, responsive, and user-friendly interface.


## 🔗 Live Links
- **Live Frontend**: https://taskcanvas-app.vercel.app

## 🔑 Demo Login Credentials

| 👑 Demo User Credentials |
| :--- |
| **Email:** `admin@gmail.com`<br>**Pass:** `admin123456` |

## ✨ Features Implemented

### 1. Task Management (Kanban Board)
- **Interactive Drag-and-Drop**: Easily move tasks between different columns (TODO, IN_PROGRESS, DONE) using `@dnd-kit`.
- **Date-Based Filtering**: View and manage tasks specific to a selected date to keep your workflow focused.
- **Full CRUD Support**: Seamlessly create, edit, update statuses, and delete tasks.

### 2. Advanced Image Annotation
- **Interactive Workspace**: A clean, responsive interface featuring a "Recent Images" sidebar and easy navigation arrows to quickly switch between your uploaded files.
- **Multi-Tool Drawing Engine**: 
  - **Polygon Tool**: Click to add points and easily draw custom, closed shapes around specific objects in your images.
  - **Pen & Highlighter Tools**: Free-hand drawing support featuring multiple brush types (Highlighter, Marker, Pencil, Ballpen) and line styles (Solid, Dashed, Dotted) for detailed markups.
  - **Eraser Tool**: A precise eraser to clean up mistakes without affecting the underlying image.
- **Advanced Canvas Interactions**:
  - **Select & Edit**: Click on any previously drawn annotation to select it, then freely resize, move, or adjust individual points.
  - **Pan & Zoom**: Easily navigate large, high-resolution images using scroll-wheel zooming or the floating zoom controls. Hold middle-click to pan around the canvas.
- **Cloud Sync**: All annotations and images are instantly saved and synced with the database, ensuring you never lose your progress.
- **Export Capabilities**: Download your fully annotated images directly to your device as high-resolution PNG files with a single click.

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
