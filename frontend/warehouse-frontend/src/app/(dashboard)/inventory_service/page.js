"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TuneIcon from "@mui/icons-material/Tune";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  getAllInventories,
  getAllAdjustments,
  getExpiringSoon,
  getLowStockItems,
} from "@/services/inventory";

const sections = [
  {
    label: "Inventories",
    description: "Track stock by batch and status",
    path: "/inventory_service/inventories",
    icon: <Inventory2Icon />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    countKey: "inventories",
  },
  {
    label: "Inventory Adjustments",
    description: "Record stock corrections with full audit trail",
    path: "/inventory_service/adjustments",
    icon: <TuneIcon />,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    countKey: "adjustments",
  },
  {
    label: "Inventory Receiving",
    description: "Receive inbound stock into existing inventory batches",
    path: "/inventory_service/adjustments",
    icon: <MoveToInboxIcon />,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    countKey: "inventories",
  },
  {
    label: "Low Stock Alerts",
    description: "Monitor items below threshold and prioritize replenishment",
    path: "/inventory_service/low-stock",
    icon: <WarningAmberIcon />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    countKey: "lowStock",
  },
  {
    label: "Expiring Items",
    description: "Track inventory nearing expiry to reduce product waste",
    path: "/inventory_service/expiring",
    icon: <EventBusyIcon />,
    gradient: "linear-gradient(135deg, #fb7185 0%, #ec4899 100%)",
    countKey: "expiring",
  },
  {
    label: "Stock Operations",
    description: "Run receiving, picking, reserve, release and damage operations",
    path: "/inventory_service/stock-operations",
    icon: <SettingsBackupRestoreIcon />,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    countKey: "adjustments",
  },
];

export default function InventoryServicePage() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    inventories: null,
    adjustments: null,
    lowStock: null,
    expiring: null,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [invRes, adjRes, lowRes, expRes] = await Promise.allSettled([
          getAllInventories(),
          getAllAdjustments(),
          getLowStockItems(),
          getExpiringSoon(30),
        ]);

        setCounts({
          inventories: invRes.status === "fulfilled" ? invRes.value.data.length : null,
          adjustments: adjRes.status === "fulfilled" ? adjRes.value.data.length : null,
          lowStock: lowRes.status === "fulfilled" ? lowRes.value.data.length : null,
          expiring: expRes.status === "fulfilled" ? expRes.value.data.length : null,
        });
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCounts();
  }, []);

  const statsCards = [
    {
      label: "Inventory Batches",
      value: counts.inventories,
      color: "#6366f1",
      icon: <Inventory2Icon sx={{ color: "#6366f1" }} />,
    },
    {
      label: "Inventory Adjustments",
      value: counts.adjustments,
      color: "#22c55e",
      icon: <TuneIcon sx={{ color: "#22c55e" }} />,
    },
    {
      label: "Low Stock Alerts",
      value: counts.lowStock,
      color: "#f59e0b",
      icon: <WarningAmberIcon sx={{ color: "#f59e0b" }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <InventoryIcon sx={{ fontSize: 32, color: "#6366f1" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Inventory Service
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 600 }}>
          Manage warehouse stock, receiving, low-stock alerts, expiries, and
          stock adjustments through one inventory operations hub.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statsCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#94a3b8", fontWeight: 500, mb: 0.5 }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: stat.color }}
                >
                  {loadingCounts ? "—" : (stat.value ?? "—")}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${stat.color}15`, width: 48, height: 48 }}>
                {stat.icon || <TrendingUpIcon sx={{ color: stat.color }} />}
              </Avatar>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
          Manage
        </Typography>
        <Chip
          label={`${sections.length} modules`}
          size="small"
          sx={{ bgcolor: "#ede9fe", color: "#6366f1", fontWeight: 600 }}
        />
      </Stack>

      <Grid container spacing={3}>
        {sections.map((section) => {
          const count = counts[section.countKey];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.label}>
              <Paper
                elevation={0}
                onClick={() => router.push(section.path)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
                    borderColor: "transparent",
                    "& .arrow-icon": { opacity: 1, transform: "translateX(0)" },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar
                    sx={{
                      background: section.gradient,
                      width: 48,
                      height: 48,
                      mb: 2,
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <ArrowForwardIcon
                    className="arrow-icon"
                    sx={{
                      color: "#94a3b8",
                      opacity: 0,
                      transform: "translateX(-8px)",
                      transition: "all 0.25s ease",
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
                >
                  {section.label}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 1.5 }}>
                  {section.description}
                </Typography>

                {!loadingCounts && count !== null && (
                  <Chip
                    label={`${count} records`}
                    size="small"
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#475569",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
