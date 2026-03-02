"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";

const STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const initialForm = {
  equipmentId: "",
  description: "",
  maintenanceDate: "",
  performedBy: "",
  status: "",
  notes: "",
};

export default function MaintenanceFormDialog({
  open,
  onClose,
  onSubmit,
  log,
  equipments = [],
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(log);

  useEffect(() => {
    if (log) {
      setForm({
        equipmentId: log.equipmentId,
        description: log.description,
        maintenanceDate: log.maintenanceDate
          ? log.maintenanceDate.slice(0, 16)
          : "",
        performedBy: log.performedBy,
        status: log.status,
        notes: log.notes || "",
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [log, open]);

  const validate = () => {
    const e = {};
    if (!form.equipmentId) e.equipmentId = "Equipment is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.maintenanceDate) e.maintenanceDate = "Date is required";
    if (!form.performedBy.trim()) e.performedBy = "Performed by is required";
    if (!form.status) e.status = "Status is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      mainjenanceDate: undefined,
      maintenanceDate: form.maintenanceDate
        ? form.maintenanceDate + ":00"
        : null,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Edit Maintenance Log" : "New Maintenance Log"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Equipment"
                select
                fullWidth
                value={form.equipmentId}
                onChange={(e) =>
                  setForm({ ...form, equipmentId: e.target.value })
                }
                error={!!errors.equipmentId}
                helperText={errors.equipmentId}
              >
                {equipments.map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Status"
                select
                fullWidth
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                error={!!errors.status}
                helperText={errors.status}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Maintenance Date"
                type="datetime-local"
                fullWidth
                value={form.maintenanceDate}
                onChange={(e) =>
                  setForm({ ...form, maintenanceDate: e.target.value })
                }
                error={!!errors.maintenanceDate}
                helperText={errors.maintenanceDate}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Performed By"
                fullWidth
                value={form.performedBy}
                onChange={(e) =>
                  setForm({ ...form, performedBy: e.target.value })
                }
                error={!!errors.performedBy}
                helperText={errors.performedBy}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: "#64748b" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
