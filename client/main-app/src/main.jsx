import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#fafafa" },
  },
  shape: { borderRadius: 16 },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <GoogleOAuthProvider clientId="606299531944-k8qefi95tba3htmqnueoijteo7qs816u.apps.googleusercontent.com">
        <AuthProvider>
          <App />
        </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
