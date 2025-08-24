import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import API from "../api/api";
import AppLayout from "../components/AppLayout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/main/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const globalAlerts = alerts.filter((a) => !a.userId);
  const userAlerts = alerts.filter((a) => a.userId);

  const renderAlertCard = (alert, isGlobal = false) => (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "0.3s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {alert.type} — {alert.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(alert.createdAt).toLocaleString()}
          </Typography>
          <Box mt={1}>
            <Chip
              size="small"
              color={isGlobal ? "primary" : "secondary"}
              icon={isGlobal ? <PublicIcon /> : <PersonIcon />}
              label={isGlobal ? "Global" : alert.user?.name || "You"}
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AppLayout>
      <Box className="max-w-3xl mx-auto mt-8">
        <Typography variant="h4" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
          <NotificationsActiveIcon color="primary" /> My Alerts
        </Typography>

        {/* Loading Spinner */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mb: 3,
                "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
              }}
            >
              <Tab label={`🌍 Global (${globalAlerts.length})`} />
              <Tab label={`👤 Personal (${userAlerts.length})`} />
            </Tabs>

            
            <motion.div layout>
              {tab === 0 && (
                <Box>
                  {globalAlerts.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                      No global alerts 🎉
                    </Typography>
                  ) : (
                    globalAlerts.map((a) => renderAlertCard(a, true))
                  )}
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  {userAlerts.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                      No personal alerts 🚀
                    </Typography>
                  ) : (
                    userAlerts.map((a) => renderAlertCard(a, false))
                  )}
                </Box>
              )}
            </motion.div>
          </>
        )}
      </Box>
    </AppLayout>
  );
}
