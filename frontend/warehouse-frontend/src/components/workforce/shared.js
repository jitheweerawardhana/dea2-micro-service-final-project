"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

/**
 * Reusable loading spinner centered in a container.
 */
export function LoadingState({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        gap: 2,
        color: "#94a3b8",
      }}
    >
      <CircularProgress size={40} sx={{ color: "#6366f1" }} />
      {message}
    </Box>
  );
}

/**
 * Reusable empty-state placeholder.
 */
export function EmptyState({ icon, message = "No data found." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        gap: 1.5,
        color: "#94a3b8",
      }}
    >
      {icon && <Box sx={{ fontSize: 48, opacity: 0.4 }}>{icon}</Box>}
      {message}
    </Box>
  );
}

/**
 * Confirm-delete dialog.
 */
export function ConfirmDialog({
  open,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading} sx={{ color: "#64748b" }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Toast / snackbar notification.
 */
export function Toast({ open, message, severity = "success", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
