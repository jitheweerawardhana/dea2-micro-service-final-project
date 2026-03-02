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

const SHIFTS = ["DAY", "NIGHT"];
const ROLES = [
  "FORKLIFT_OPERATOR",
  "PICKER",
  "PACKER",
  "LOADER",
  "INVENTORY_CLERK",
  "WAREHOUSE_SUPERVISOR",
  "SHIPPING_RECEIVER",
  "QUALITY_INSPECTOR",
  "MAINTENANCE_TECHNICIAN",
  "GENERAL_LABORER",
];

const roleLabelMap = {
  FORKLIFT_OPERATOR: "Forklift Operator",
  PICKER: "Picker",
  PACKER: "Packer",
  LOADER: "Loader",
  INVENTORY_CLERK: "Inventory Clerk",
  WAREHOUSE_SUPERVISOR: "Warehouse Supervisor",
  SHIPPING_RECEIVER: "Shipping Receiver",
  QUALITY_INSPECTOR: "Quality Inspector",
  MAINTENANCE_TECHNICIAN: "Maintenance Technician",
  GENERAL_LABORER: "General Laborer",
};

const initialForm = { name: "", shift: "", role: "" };

export default function WorkerFormDialog({
  open,
  onClose,
  onSubmit,
  worker,
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(worker);

  useEffect(() => {
    if (worker) {
      setForm({ name: worker.name, shift: worker.shift, role: worker.role });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [worker, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.shift) e.shift = "Shift is required";
    if (!form.role) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Edit Worker" : "Add Worker"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Shift"
                select
                fullWidth
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                error={!!errors.shift}
                helperText={errors.shift}
              >
                {SHIFTS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Role"
                select
                fullWidth
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                error={!!errors.role}
                helperText={errors.role}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {roleLabelMap[r]}
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
          sx={{
            bgcolor: "#6366f1",
            "&:hover": { bgcolor: "#4f46e5" },
          }}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { roleLabelMap };
