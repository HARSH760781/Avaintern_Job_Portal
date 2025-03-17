import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a theme (you can customize this)
const theme = createTheme({
  spacing: 8, // Default spacing unit (8px)
  palette: {
    primary: {
      main: "#1976d2", // Change the primary color
    },
    secondary: {
      main: "#dc004e", // Change the secondary color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Change the default font
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
