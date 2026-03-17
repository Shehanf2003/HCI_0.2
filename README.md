# Interactive 3D Furniture Design App

This is a robust, modular full-stack starter kit for building an interactive 3D furniture configurator. It features a React-based frontend for 3D visualization and a Node.js/MongoDB backend, designed to be easily extensible for university assignments or production prototypes.

## Tech Stack

**Frontend (Client)**
* **Framework:** React + Vite
* **3D Engine:** React Three Fiber (@react-three/fiber)
* **3D Helpers:** Drei (@react-three/drei)
* **State Management:** Zustand
* **Styling:** Tailwind CSS

**Backend (Server)**
* **Runtime:** Node.js
* **Database:** MongoDB
* **Environment Management:** Dotenv

## Getting Started

Follow these steps to run the project on your local machine.

### Prerequisites

* Node.js (v16 or higher recommended)
* npm (comes with Node.js) or yarn/pnpm
* MongoDB (local installation or MongoDB Atlas cluster)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Furniture-design-app
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

In the `server` directory, create a `.env` file to store your environment variables:
```ini
MONGO_URI=mongodb+srv://shehanf2003_db_user:PndjJ8OoSWFzj7D6@cluster0.phcpuk6.mongodb.net/HCI_db?appName=Cluster0
NODE_ENV=5001
JWT_SECRET=supersecretkey123
```

### Running Development Servers

You will need to run the client and server concurrently.

**Start the Backend Server:**
```bash
cd server
npm run dev
```

**Start the Frontend Client:**
Open a new terminal window/tab:
```bash
cd client
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173/`).

## Project Structure

The project follows a strict separation of concerns across the full stack:

* `client/src/components/canvas/`: Contains all 3D logic and components (e.g., `Furniture.jsx`, `Experience.jsx`).
  * `Furniture.jsx`: Currently renders a placeholder mesh. See comments in the file for instructions on replacing it with a `.gltf` model.
* `client/src/components/dom/`: Contains all 2D UI logic (e.g., `Interface.jsx`).
* `client/src/store/`: Contains the global Zustand store (`store.js`) managing state like `furnitureColor` or `materialType`.
* `client/src/App.jsx`: The entry point that layers the 3D Canvas and the 2D Interface.
* `server/`: Contains the backend API to handle database connections, saving user configurations, and fetching available models or materials.

## Customization

### Changing the 3D Model
1. Place your `.gltf` or `.glb` file in the `client/public/` folder (or `client/src/assets/`).
2. Open `client/src/components/canvas/Furniture.jsx`.
3. Use the `useGLTF` hook to load your model.
4. Update the material properties based on the `furnitureColor` from the store.

### Adding More Colors or Materials
1. Open `client/src/components/dom/Interface.jsx`.
2. Add new color or material objects to the configuration arrays.
