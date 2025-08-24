import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await API.get("/main/profile");
        setProfile(data);
      } catch {
        setErr("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom fontWeight={700}>
          👤 Profile
        </Typography>
      </motion.div>

      {err && <Alert severity="error">{err}</Alert>}

      {loading && <Skeleton variant="rectangular" height={180} />}

      {!loading && profile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "white",
                    color: "#764ba2",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  {profile.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {profile.email}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Role: {profile.role}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />

              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                User ID: {profile.id}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AppLayout>
  );
}
