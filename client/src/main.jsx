import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Lato', sans-serif",
          fontSize: "14px",
          background: "#212121",
          color: "#FAFAFA",
          border: "1px solid #16A34A",
        },
        success: {
          iconTheme: { primary: "#16A34A", secondary: "#FFFFFF" },
        },
        error: {
          iconTheme: { primary: "#DC2626", secondary: "#FFFFFF" },
        },
      }}
    />
  </StrictMode>,
);
