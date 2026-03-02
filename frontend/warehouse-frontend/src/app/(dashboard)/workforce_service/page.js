"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BadgeIcon from "@mui/icons-material/Badge";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HandymanIcon from "@mui/icons-material/Handyman";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

import {
  getAllWorkers,
  getAllEquipments,
  getAllEquipmentTypes,
  getAllAssignments,
  getAllMaintenanceLogs,
} from "@/services/workforce";

const sections = [
  {
    label: "Workers",
    description: "Manage staff, shifts & roles",
    path: "/workforce_service/workers",
    icon: <PeopleIcon />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    countKey: "workers",
  },
  {
    label: "Equipment",
    description: "Track all equipment items",
    path: "/workforce_service/equipment",
    icon: <BuildIcon />,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    countKey: "equipment",
  },
  {
    label: "Equipment Types",
    description: "Manage equipment categories",
    path: "/workforce_service/equipment-types",
    icon: <CategoryIcon />,
    gradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    countKey: "types",
  },
  {
    label: "Assignments",
    description: "Equipment-worker assignments",
    path: "/workforce_service/assignments",
    icon: <AssignmentIndIcon />,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    countKey: "assignments",
  },
  {
    label: "Maintenance Logs",
    description: "Schedule & track maintenance",
    path: "/workforce_service/maintenance",
    icon: <HandymanIcon />,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    countKey: "maintenance",
  },
];

export default function WorkforceServicePage() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    workers: null,
    equipment: null,
    types: null,
    assignments: null,
    maintenance: null,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [wRes, eqRes, tRes, aRes, mRes] = await Promise.allSettled([
          getAllWorkers(),
          getAllEquipments(),
          getAllEquipmentTypes(),
          getAllAssignments(),
          getAllMaintenanceLogs(),
        ]);
        setCounts({
          workers: wRes.status === "fulfilled" ? wRes.value.data.length : null,
          equipment:
            eqRes.status === "fulfilled" ? eqRes.value.data.length : null,
          types: tRes.status === "fulfilled" ? tRes.value.data.length : null,
          assignments:
            aRes.status === "fulfilled" ? aRes.value.data.length : null,
          maintenance:
            mRes.status === "fulfilled" ? mRes.value.data.length : null,
        });
      } catch {
        // silently fail — counts just won't show
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchCounts();
  }, []);

  const totalItems = Object.values(counts).reduce(
    (sum, v) => sum + (v ?? 0),
    0,
  );

  const statsCards = [
    { label: "Total Workers", value: counts.workers, color: "#6366f1" },
    { label: "Equipment Items", value: counts.equipment, color: "#22c55e" },
    {
      label: "Active Assignments",
      value: counts.assignments,
      color: "#f59e0b",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <BadgeIcon sx={{ fontSize: 34, color: "#6366f1" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Workforce & Equipment
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 600 }}>
          Manage warehouse staff, equipment inventory, assignments, and
          maintenance schedules from a single hub.
        </Typography>
      </Box>

      {/* Quick stats */}
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
              <Avatar
                sx={{ bgcolor: `${stat.color}15`, width: 48, height: 48 }}
              >
                <TrendingUpIcon sx={{ color: stat.color }} />
              </Avatar>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Section heading */}
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

      {/* Section cards */}
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
