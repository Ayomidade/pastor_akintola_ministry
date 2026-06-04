import {StrictMode} from "react";
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
          background: "#0D1B2A",
          color: "#F8F5EF",
          border: "1px solid #C9A84C",
        },
        success: { iconTheme: { primary: "#C9A84C", secondary: "#0D1B2A" } },
        error: { iconTheme: { primary: "#e53e3e", secondary: "#F8F5EF" } },
      }}
    />
  </StrictMode>,
);
