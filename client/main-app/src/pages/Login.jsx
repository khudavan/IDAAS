import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setError("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        animation: "gradientShift 10s ease infinite",
        backgroundSize: "400% 400%",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
    
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          mb={4}
          fontWeight={700}
          align="center"
          sx={{
            color: "white",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          👤 User Login
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: 380,
            maxWidth: "92vw",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            mb={3}
            fontWeight={700}
            align="center"
            sx={{ color: "#333" }}
          >
            Welcome Back 👋
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderRadius: "12px" },
                "&:hover fieldset": { borderColor: "#667eea" },
                "&.Mui-focused fieldset": { borderColor: "#667eea" },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderRadius: "12px" },
                "&:hover fieldset": { borderColor: "#764ba2" },
                "&.Mui-focused fieldset": { borderColor: "#764ba2" },
              },
            }}
          />

          {error && (
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            </motion.div>
          )}

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: "12px",
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(90deg, #764ba2, #667eea)",
                transform: "scale(1.05)",
              },
            }}
            disabled={submitting}
            onClick={handleLogin}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const { data } = await API.post("/auth/google", {
                  credential: credentialResponse.credential,
                });
                login(data.token, data.user);
                navigate("/dashboard");
              // eslint-disable-next-line no-unused-vars
              } catch (err) {
                setError("Google login failed");
              }
            }}
            onError={() => {
              setError("Google login failed");
            }}
          />

            <Button
              fullWidth
              size="large"
              variant="outlined"
              sx={{
                mt: 2,
                borderRadius: "12px",
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": {
                  borderColor: "#764ba2",
                  color: "#764ba2",
                },
              }}
              onClick={() => navigate("/")}
            >
              ⬅ Back
            </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}