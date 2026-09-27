import { StrictMode } from "react";
import UserProvider from "./firebase/components/UserProvider";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Pages/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
);