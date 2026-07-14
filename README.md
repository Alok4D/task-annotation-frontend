# TaskFusion - Frontend (The Hero's Interface)

Welcome to the frontend of TaskFusion, an epic 2-in-1 web app combining a Kanban task board with an advanced image annotation tool! Built with React, Next.js, and Tailwind CSS.

## 🐉 The Villains Faced (And How They Were Defeated!)
Every great anime arc has formidable villains. Here are the ones I faced during this saga:
1. **The State Management Hydra (Drag-and-Drop):** Implementing drag-and-drop while syncing state efficiently across components threatened to create infinite render loops. Armed with Redux Toolkit and `dnd-kit`, I banished the Hydra by keeping the data flow unidirectional and separating UI logic from state logic.
2. **The Canvas Phantom (Polygon Annotations):** Drawing polygons on uploaded images, handling scaling, and closing shapes dynamically was a daunting phantom. By utilizing `react-konva` and diving deep into the Konva.js documentation (with a little help from AI sidekicks to calculate coordinates), the Phantom was sealed within the `<Canvas />` component!
3. **The Date-Syncing Trickster:** Making sure the Kanban board only displayed tasks for the selected date, and updating this filter seamlessly, was tricky. A robust context provider proved to be the ultimate weapon against this trickster.

## 🚀 Tech Stack
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript 
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit / React Context
- **Drag & Drop:** `@dnd-kit`
- **Canvas:** `react-konva`

## ⚙️ Requirements
- **Node.js:** v18.x or v20.x
- **Python:** 3.12+ (For Backend)

## 🏃‍♂️ How to Run Locally (The Training Arc)
1. **Clone the repository:**
   ```bash
   git clone <frontend-repo-url>
   cd task-annotation-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the magic.

## 🔗 Links & Credentials
- **Frontend Repo:** [Insert Github Link]
- **Backend Repo:** [Insert Github Link]
- **Live Hosted App:** [Insert Hosted Link]
- **Demo User Email:** demo@taskfusion.com
- **Demo User Password:** DemoPass123!

"Believe in the code that believes in you!" 🕶️🔥
