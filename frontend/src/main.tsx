import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle client-side routing restoration
function restoreOriginalPath() {
  const originalPath = sessionStorage.getItem('originalPath');
  console.log('Restoring path from sessionStorage:', originalPath);
  
  if (originalPath && originalPath !== '/') {
    sessionStorage.removeItem('originalPath');
    
    // Use replaceState to change the URL without reloading
    window.history.replaceState(null, '', originalPath);
    console.log('URL restored to:', originalPath);
    
    return true;
  }
  return false;
}

// Restore the path before React renders
restoreOriginalPath();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);