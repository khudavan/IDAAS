import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BarChart, Assessment, Notifications } from "@mui/icons-material";
import API from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await API.get("/main/dashboard");
        setStats(data?.stats || null);
      } catch {
        setErr("Access denied or session expired.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    {
      label: "Reports",
      value: stats?.reports,
      icon: <Assessment fontSize="large" />,
      color: "linear-gradient(135deg, #667eea, #764ba2)",
      progress: 75,
    },
    {
      label: "Alerts",
      value: stats?.alerts,
      icon: <Notifications fontSize="large" />,
      color: "linear-gradient(135deg, #ff6a00, #ee0979)",
      progress: 40,
    },
    {
      label: "Last Login",
      value: stats?.lastLogin
        ? new Date(stats.lastLogin).toLocaleString()
        : "—",
      icon: <BarChart fontSize="large" />,
      color: "linear-gradient(135deg, #43e97b, #38f9d7)",
      progress: 100,
    },
  ];

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom fontWeight={700}>
          📊 Dashboard
        </Typography>
      </motion.div>

      {loading && <Skeleton variant="rectangular" height={160} />}
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {!loading && stats && (
        <Grid container spacing={3}>
          {cards.map((c, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <Card
                  sx={{
                    borderRadius: "20px",
                    background: c.color,
                    color: "white",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                          {c.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {c.value}
                        </Typography>
                      </Box>
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {c.icon}
                      </motion.div>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={c.progress}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </AppLayout>
  );
}
