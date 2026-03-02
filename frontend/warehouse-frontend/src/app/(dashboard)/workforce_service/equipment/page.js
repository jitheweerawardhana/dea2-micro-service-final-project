"use client";

import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import EquipmentFormDialog from "@/components/workforce/EquipmentFormDialog";
import {
  LoadingState,
  EmptyState,
  ConfirmDialog,
  Toast,
} from "@/components/workforce/shared";
import {
  getAllEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getAllEquipmentTypes,
} from "@/services/workforce";

const statusStyles = {
  AVAILABLE: { bgcolor: "#dcfce7", color: "#166534" },
  IN_USE: { bgcolor: "#dbeafe", color: "#1e40af" },
  UNDER_MAINTENANCE: { bgcolor: "#fef9c3", color: "#854d0e" },
  DECOMMISSIONED: { bgcolor: "#fee2e2", color: "#991b1b" },
};

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eqRes, typesRes] = await Promise.all([
        getAllEquipments(),
        getAllEquipmentTypes(),
      ]);
      setEquipments(eqRes.data);
      setEquipmentTypes(typesRes.data);
    } catch {
      setToast({
        open: true,
        message: "Failed to load equipment",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (eq) => {
    setEditing(eq);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      if (editing) {
        await updateEquipment(editing.id, data);
        setToast({
          open: true,
          message: "Equipment updated",
          severity: "success",
        });
      } else {
        await createEquipment(data);
        setToast({
          open: true,
          message: "Equipment created",
          severity: "success",
        });
      }
      setFormOpen(false);
      fetchData();
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
      await deleteEquipment(deleteTarget.id);
      setToast({
        open: true,
        message: "Equipment deleted",
        severity: "success",
      });
      setDeleteTarget(null);
      fetchData();
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
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const style = statusStyles[row.status] || {
          bgcolor: "#f1f5f9",
          color: "#475569",
        };
        return (
          <Chip
            label={row.status.replace(/_/g, " ")}
            size="small"
            sx={{ fontWeight: 600, ...style }}
          />
        );
      },
    },
    { id: "equipmentTypeName", label: "Type", sortable: true },
    {
      id: "description",
      label: "Description",
      sortable: false,
      render: (row) => (
        <Box
          sx={{
            maxWidth: 200,
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

  if (loading) return <LoadingState message="Loading equipment..." />;

  return (
    <Box>
      <PageHeader
        title="Equipment"
        subtitle="Track all warehouse equipment, their status, and assigned types."
        icon={<BuildIcon sx={{ fontSize: 32 }} />}
        backHref="/workforce_service"
        count={equipments.length}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Add Equipment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={equipments}
        searchKeys={["name", "status", "equipmentTypeName"]}
        emptyComponent={
          <EmptyState icon={<BuildIcon />} message="No equipment found." />
        }
      />

      <EquipmentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        equipment={editing}
        equipmentTypes={equipmentTypes}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Equipment"
        message={`Delete "${deleteTarget?.name}"? All assignments and maintenance logs will also be removed.`}
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
