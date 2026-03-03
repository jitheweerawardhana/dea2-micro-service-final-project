"use client";

import { useCallback, useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import { EmptyState, LoadingState, Toast } from "@/components/workforce/shared";
import {
  getAllInventories,
  markAsDamaged,
  releaseReservedStock,
  reserveStock,
  updateStockOnPicking,
  updateStockOnReceiving,
} from "@/services/inventory";

const initialForm = {
  operation: "receiving",
  inventoryId: "",
  quantity: "",
  reason: "",
};

const operations = [
  { value: "receiving", label: "Receiving" },
  { value: "picking", label: "Picking" },
  { value: "reserve", label: "Reserve" },
  { value: "release", label: "Release Reserved" },
  { value: "damaged", label: "Mark Damaged" },
];

function StockOperationDialog({ open, loading, inventories, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.inventoryId) nextErrors.inventoryId = "Inventory is required";
    if (!form.quantity || Number(form.quantity) <= 0) {
      nextErrors.quantity = "Quantity must be greater than 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      operation: form.operation,
      inventoryId: Number(form.inventoryId),
      quantity: Number(form.quantity),
      reason: form.reason.trim() || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Run Stock Operation</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Operation"
                value={form.operation}
                onChange={(e) => setForm({ ...form, operation: e.target.value })}
              >
                {operations.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Inventory"
                value={form.inventoryId}
                onChange={(e) => setForm({ ...form, inventoryId: e.target.value })}
                error={!!errors.inventoryId}
                helperText={errors.inventoryId}
              >
                {inventories.map((row) => (
                  <MenuItem key={row.inventoryId} value={row.inventoryId}>
                    {`#${row.inventoryId} - ${row.batchNo} (${row.productName})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
          startIcon={loading ? <CircularProgress size={16} /> : <PlayArrowIcon />}
          sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
        >
          Execute
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function StockOperationsPage() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllInventories();
      setInventories(res.data || []);
    } catch {
      setToast({ open: true, message: "Failed to load inventories", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const executeOperation = async ({ operation, ...payload }) => {
    try {
      setSaving(true);

      const actions = {
        receiving: updateStockOnReceiving,
        picking: updateStockOnPicking,
        reserve: reserveStock,
        release: releaseReservedStock,
        damaged: markAsDamaged,
      };

      await actions[operation](payload);
      setDialogOpen(false);
      setToast({ open: true, message: "Stock operation completed", severity: "success" });
      fetchData();
    } catch (err) {
      const message = err.response?.data?.message || "Stock operation failed";
      setToast({ open: true, message, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading stock operations..." />;

  const columns = [
    { id: "inventoryId", label: "Inventory ID", sortable: true },
    { id: "batchNo", label: "Batch", sortable: true },
    { id: "productName", label: "Product", sortable: true },
    { id: "quantityAvailable", label: "Available", sortable: true },
    { id: "quantityReserved", label: "Reserved", sortable: true },
    { id: "quantityDamaged", label: "Damaged", sortable: true },
    {
      id: "location",
      label: "Location",
      sortable: false,
      render: (row) => `${row.zone || "—"} / ${row.rackNo || "—"} / ${row.binNo || "—"}`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Stock Operations"
        subtitle="Execute receiving, picking, reserve, release and damage workflows."
        icon={<SettingsBackupRestoreIcon sx={{ fontSize: 28 }} />}
        count={inventories.length}
        action={
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Run Operation
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={inventories}
        searchKeys={["batchNo", "productName", "zone", "rackNo", "binNo"]}
        emptyComponent={
          <EmptyState
            icon={<SettingsBackupRestoreIcon />}
            message="No inventories found to run stock operations."
          />
        }
      />

      <StockOperationDialog
        open={dialogOpen}
        loading={saving}
        inventories={inventories}
        onClose={() => setDialogOpen(false)}
        onSubmit={executeOperation}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
    </>
  );
}
