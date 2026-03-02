"use client";

import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button, IconButton, Tooltip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import EquipmentTypeFormDialog from "@/components/workforce/EquipmentTypeFormDialog";
import {
  LoadingState,
  EmptyState,
  ConfirmDialog,
  Toast,
} from "@/components/workforce/shared";
import {
  getAllEquipmentTypes,
  createEquipmentType,
  updateEquipmentType,
  deleteEquipmentType,
} from "@/services/workforce";

export default function EquipmentTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEquipmentTypes();
      setTypes(res.data);
    } catch {
      setToast({
        open: true,
        message: "Failed to load equipment types",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (type) => {
    setEditing(type);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      if (editing) {
        await updateEquipmentType(editing.id, data);
        setToast({
          open: true,
          message: "Equipment type updated",
          severity: "success",
        });
      } else {
        await createEquipmentType(data);
        setToast({
          open: true,
          message: "Equipment type created",
          severity: "success",
        });
      }
      setFormOpen(false);
      fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      setToast({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteEquipmentType(deleteTarget.id);
      setToast({
        open: true,
        message: "Equipment type deleted",
        severity: "success",
      });
      setDeleteTarget(null);
      fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      setToast({ open: true, message: msg, severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { id: "id", label: "ID", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "manufacturer", label: "Manufacturer", sortable: true },
    { id: "model", label: "Model", sortable: true },
    {
      id: "description",
      label: "Description",
      sortable: false,
      render: (row) => (
        <Box
          sx={{
            maxWidth: 240,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#64748b",
          }}
        >
          {row.description || "—"}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      align: "right",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              sx={{ color: "#6366f1" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row);
              }}
              sx={{ color: "#ef4444" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) return <LoadingState message="Loading equipment types..." />;

  return (
    <Box>
      <PageHeader
        title="Equipment Types"
        subtitle="Manage equipment categories such as forklifts, pallet jacks, and scanners."
        icon={<CategoryIcon sx={{ fontSize: 32 }} />}
        backHref="/workforce_service"
        count={types.length}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Add Type
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={types}
        searchKeys={["name", "manufacturer", "model"]}
        emptyComponent={
          <EmptyState
            icon={<CategoryIcon />}
            message="No equipment types found."
          />
        }
      />

      <EquipmentTypeFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        equipmentType={editing}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Equipment Type"
        message={`Delete "${deleteTarget?.name}"? All equipment under this type will also be removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
