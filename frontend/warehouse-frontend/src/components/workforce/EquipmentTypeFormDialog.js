"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";

const initialForm = { name: "", description: "", manufacturer: "", model: "" };

export default function EquipmentTypeFormDialog({
  open,
  onClose,
  onSubmit,
  equipmentType,
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(equipmentType);

  useEffect(() => {
    if (equipmentType) {
      setForm({
        name: equipmentType.name,
        description: equipmentType.description || "",
        manufacturer: equipmentType.manufacturer,
        model: equipmentType.model,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [equipmentType, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.manufacturer.trim()) e.manufacturer = "Manufacturer is required";
    if (!form.model.trim()) e.model = "Model is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Edit Equipment Type" : "Add Equipment Type"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Type Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Manufacturer"
                fullWidth
                value={form.manufacturer}
                onChange={(e) =>
                  setForm({ ...form, manufacturer: e.target.value })
                }
                error={!!errors.manufacturer}
                helperText={errors.manufacturer}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Model"
                fullWidth
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                error={!!errors.model}
                helperText={errors.model}
              />
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
