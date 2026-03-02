"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

/**
 * Standard page header with title, description, breadcrumb back‐button, and optional action.
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  backHref,
  action,
  count,
}) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 4 }}>
      {backHref && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(backHref)}
          sx={{
            mb: 1.5,
            color: "#64748b",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          Back
        </Button>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {icon && (
            <Box
              sx={{ color: "#6366f1", display: "flex", alignItems: "center" }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                {title}
              </Typography>
              {count !== undefined && (
                <Chip
                  label={`${count} total`}
                  size="small"
                  sx={{
                    bgcolor: "#ede9fe",
                    color: "#6366f1",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{ color: "#64748b", mt: 0.5, maxWidth: 600 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}
