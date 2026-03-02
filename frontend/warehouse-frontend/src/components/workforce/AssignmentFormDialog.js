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

const initialForm = {
  equipmentId: "",
  workerId: "",
  assignedDate: "",
  returnedDate: "",
  status: "",
};

const STATUSES = ["ACTIVE", "RETURNED", "OVERDUE"];

export default function AssignmentFormDialog({
  open,
  onClose,
  onSubmit,
  assignment,
  equipments = [],
  workers = [],
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(assignment);

  useEffect(() => {
    if (assignment) {
      setForm({
        equipmentId: assignment.equipmentId,
        workerId: assignment.workerId,
        assignedDate: assignment.assignedDate
          ? assignment.assignedDate.slice(0, 16)
          : "",
        returnedDate: assignment.returnedDate
          ? assignment.returnedDate.slice(0, 16)
          : "",
        status: assignment.status,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [assignment, open]);

  const validate = () => {
    const e = {};
    if (!form.equipmentId) e.equipmentId = "Equipment is required";
    if (!form.workerId) e.workerId = "Worker is required";
    if (!form.assignedDate) e.assignedDate = "Assigned date is required";
    if (!form.status) e.status = "Status is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      assignedDate: form.assignedDate ? form.assignedDate + ":00" : null,
      returnedDate: form.returnedDate ? form.returnedDate + ":00" : null,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Edit Assignment" : "New Assignment"}
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
                label="Worker"
                select
                fullWidth
                value={form.workerId}
                onChange={(e) => setForm({ ...form, workerId: e.target.value })}
                error={!!errors.workerId}
                helperText={errors.workerId}
              >
                {workers.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Assigned Date"
                type="datetime-local"
                fullWidth
                value={form.assignedDate}
                onChange={(e) =>
                  setForm({ ...form, assignedDate: e.target.value })
                }
                error={!!errors.assignedDate}
                helperText={errors.assignedDate}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Returned Date"
                type="datetime-local"
                fullWidth
                value={form.returnedDate}
                onChange={(e) =>
                  setForm({ ...form, returnedDate: e.target.value })
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={12}>
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
                    {s}
                  </MenuItem>
                ))}
              </TextField>
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
