# Task Annotation Frontend

A modern, high-performance web application designed for task management and image annotation. Built with Next.js and React 19, it provides a seamless user experience for managing tasks and performing detailed image annotations using a canvas-based interface.

## 🚀 Key Features

### 🔐 Authentication System
- Secure user registration and login flows.
- State persistence and protected routing.
- Client-side form validation using **Zod** and **React Hook Form**.

### 📋 Task Management
- Intuitive drag-and-drop task organization using **@dnd-kit**.
- Centralized task state management powered by **Redux Toolkit**.
- Real-time UI updates for task status changes.

### 🖌️ Image Annotation Tool
- **Professional Figma-style Workspace:** A sleek, unified interface for all annotation tasks.
- **Advanced Polygon Drawing:** Draw custom shapes with adjustable stroke sizes (thickness) and a built-in color palette.
- **Interactive Canvas Controls:** Zoom in/out using the mouse wheel, and seamlessly navigate using the Hand Tool (Pan).
- **Floating Thumbnail Dock:** Easily switch between uploaded images using a responsive bottom dock.
- **Export & Delete:** Download annotated images directly to your local device. Delete specific drawn polygons or completely remove uploaded images as needed.
- **High-performance Drawing:** Powered by **Konva** and **React-Konva** for a smooth, lag-free experience.

### 🎨 Modern UI/UX
- Responsive, clean, and highly customizable design built with **Tailwind CSS v4**.
- Intuitive and beautiful iconography via **Lucide React**.
- Reusable UI components integrated with `clsx` and `tailwind-merge` for dynamic styling.

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (RTK)
- **Canvas/Drawing:** Konva & React-Konva
- **Drag & Drop:** dnd-kit
- **Form Handling:** React Hook Form & Zod
- **Icons:** Lucide React

## 📦 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/features`: Feature-based modular code (Authentication, Tasks, Annotations).
- `src/components`: Reusable UI components.
- `src/store`: Redux Toolkit store configuration.
- `src/types`: TypeScript type definitions.
- `src/utils`: Helper functions and utilities.
