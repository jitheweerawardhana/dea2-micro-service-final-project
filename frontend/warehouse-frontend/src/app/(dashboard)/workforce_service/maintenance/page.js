"use client";

import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HandymanIcon from "@mui/icons-material/Handyman";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import MaintenanceFormDialog from "@/components/workforce/MaintenanceFormDialog";
import {
  LoadingState,
  EmptyState,
  ConfirmDialog,
  Toast,
} from "@/components/workforce/shared";
import {
  getAllMaintenanceLogs,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  getAllEquipments,
} from "@/services/workforce";

const statusStyles = {
  SCHEDULED: { bgcolor: "#dbeafe", color: "#1e40af" },
  IN_PROGRESS: { bgcolor: "#fef9c3", color: "#854d0e" },
  COMPLETED: { bgcolor: "#dcfce7", color: "#166534" },
  CANCELLED: { bgcolor: "#fee2e2", color: "#991b1b" },
};

const formatDate = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MaintenanceLogsPage() {
  const [logs, setLogs] = useState([]);
  const [equipments, setEquipments] = useState([]);
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
      const [logRes, eqRes] = await Promise.all([
        getAllMaintenanceLogs(),
        getAllEquipments(),
      ]);
      setLogs(logRes.data);
      setEquipments(eqRes.data);
    } catch {
      setToast({
        open: true,
        message: "Failed to load maintenance logs",
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

  const handleEdit = (log) => {
    setEditing(log);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      if (editing) {
        await updateMaintenanceLog(editing.id, data);
        setToast({
          open: true,
          message: "Maintenance log updated",
          severity: "success",
        });
      } else {
        await createMaintenanceLog(data);
        setToast({
          open: true,
          message: "Maintenance log created",
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
      await deleteMaintenanceLog(deleteTarget.id);
      setToast({
        open: true,
        message: "Maintenance log deleted",
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
    { id: "equipmentName", label: "Equipment", sortable: true },
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
          }}
        >
          {row.description}
        </Box>
      ),
    },
    {
      id: "maintenanceDate",
      label: "Date",
      sortable: true,
      render: (row) => formatDate(row.maintenanceDate),
    },
    { id: "performedBy", label: "Performed By", sortable: true },
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

  if (loading) return <LoadingState message="Loading maintenance logs..." />;

  return (
    <Box>
      <PageHeader
        title="Maintenance Logs"
        subtitle="Schedule and track maintenance activities for all equipment."
        icon={<HandymanIcon sx={{ fontSize: 32 }} />}
        backHref="/workforce_service"
        count={logs.length}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            New Log
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={logs}
        searchKeys={["equipmentName", "performedBy", "status", "description"]}
        emptyComponent={
          <EmptyState
            icon={<HandymanIcon />}
            message="No maintenance logs found."
          />
        }
      />

      <MaintenanceFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        log={editing}
        equipments={equipments}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Maintenance Log"
        message="Are you sure you want to delete this maintenance log?"
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
