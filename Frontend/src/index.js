import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css" // Assuming you'll have a global CSS file for Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
