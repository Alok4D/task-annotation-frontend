# TaskFusion — Frontend Application

**Welcome to TaskFusion** — a powerful 2-in-1 web application combining an intuitive Kanban task board with an advanced Image Annotation tool. Easily manage your daily tasks, organize your workflow by date, and annotate images with custom polygons all in one place.

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
- **Interactive Workspace (`annotate/page.tsx`)**: A fully responsive annotation interface featuring a recent images sidebar, image pagination, and a dynamic mobile layout using `createPortal`.
- **Canvas Engine (`Canvas.tsx`)**: Powered by `react-konva` (`Stage`, `Layer`, `Image`, `Group`, `Line`, `Circle`) and `use-image` to provide a robust drawing and rendering engine.
- **Multi-Tool Support**:
  - **Polygon Drawing**: Click to add coordinate points, dynamically connecting lines that automatically close into a filled shape.
  - **Pen & Highlighter Tools**: Supports free-hand drawing with various styles (Solid, Dashed, Dotted) and types (Highlighter, Marker, Pencil, Ballpen) using advanced `globalCompositeOperation` blending.
  - **Eraser Tool**: Precisely erase parts of drawings using `destination-out` blending modes.
- **Advanced Interactions**:
  - **Select & Transform**: Utilize `react-konva`'s `Transformer` node to select, resize, and modify saved annotations.
  - **Pan & Zoom**: Navigate large images effortlessly. Supports middle-click panning, scroll-wheel zooming (calculated dynamically via `handleWheel`), and floating zoom control buttons.
- **State & API Integration**: 
  - **Redux Toolkit (`useSelector`, `useDispatch`)** efficiently manages the `selectedImageId` across the application.
  - **RTK Query Mutations & Queries**: Seamlessly handles backend communication using custom hooks (`useGetImagesQuery`, `useUploadImageMutation`, `useGetAnnotationsQuery`, `useSaveAnnotationMutation`, `useUpdateAnnotationMutation`, `useDeleteAnnotationMutation`).
- **Export Capabilities**: A dedicated `handleDownload` function allows users to export their annotated workspace directly to a high-resolution `.png` file using `toDataURL`.

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
