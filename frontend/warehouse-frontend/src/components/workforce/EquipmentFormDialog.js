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

const STATUSES = ["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DECOMMISSIONED"];

const initialForm = {
  name: "",
  status: "",
  description: "",
  equipmentTypeId: "",
};

export default function EquipmentFormDialog({
  open,
  onClose,
  onSubmit,
  equipment,
  equipmentTypes = [],
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(equipment);

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name,
        status: equipment.status,
        description: equipment.description || "",
        equipmentTypeId: equipment.equipmentTypeId,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [equipment, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.status) e.status = "Status is required";
    if (!form.equipmentTypeId) e.equipmentTypeId = "Equipment type is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Edit Equipment" : "Add Equipment"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Equipment Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Equipment Type"
                select
                fullWidth
                value={form.equipmentTypeId}
                onChange={(e) =>
                  setForm({ ...form, equipmentTypeId: e.target.value })
                }
                error={!!errors.equipmentTypeId}
                helperText={errors.equipmentTypeId}
              >
                {equipmentTypes.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
