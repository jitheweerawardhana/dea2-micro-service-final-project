"use client";

import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import WorkerFormDialog, {
  roleLabelMap,
} from "@/components/workforce/WorkerFormDialog";
import {
  LoadingState,
  EmptyState,
  ConfirmDialog,
  Toast,
} from "@/components/workforce/shared";
import {
  getAllWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
} from "@/services/workforce";

const shiftChip = (shift) => {
  const isDay = shift === "DAY";
  return (
    <Chip
      icon={isDay ? <WbSunnyIcon /> : <NightsStayIcon />}
      label={shift}
      size="small"
      sx={{
        bgcolor: isDay ? "#fef9c3" : "#1e1b4b",
        color: isDay ? "#854d0e" : "#c7d2fe",
        fontWeight: 600,
        "& .MuiChip-icon": {
          color: isDay ? "#ca8a04" : "#a5b4fc",
          fontSize: 16,
        },
      }}
    />
  );
};

const roleChip = (role) => (
  <Chip
    label={roleLabelMap[role] || role}
    size="small"
    variant="outlined"
    sx={{
      borderColor: "#e2e8f0",
      color: "#475569",
      fontWeight: 500,
    }}
  />
);

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
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

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllWorkers();
      setWorkers(res.data);
    } catch (err) {
      setToast({
        open: true,
        message: "Failed to load workers",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (worker) => {
    setEditing(worker);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      if (editing) {
        await updateWorker(editing.id, data);
        setToast({
          open: true,
          message: "Worker updated successfully",
          severity: "success",
        });
      } else {
        await createWorker(data);
        setToast({
          open: true,
          message: "Worker created successfully",
          severity: "success",
        });
      }
      setFormOpen(false);
      fetchWorkers();
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
      await deleteWorker(deleteTarget.id);
      setToast({ open: true, message: "Worker deleted", severity: "success" });
      setDeleteTarget(null);
      fetchWorkers();
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
      id: "shift",
      label: "Shift",
      sortable: true,
      render: (row) => shiftChip(row.shift),
    },
    {
      id: "role",
      label: "Role",
      sortable: true,
      render: (row) => roleChip(row.role),
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

  if (loading) return <LoadingState message="Loading workers..." />;

  return (
    <Box>
      <PageHeader
        title="Workers"
        subtitle="Manage warehouse staff, assign roles, and track shifts."
        icon={<PeopleIcon sx={{ fontSize: 32 }} />}
        backHref="/workforce_service"
        count={workers.length}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            Add Worker
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={workers}
        searchKeys={["name", "role", "shift"]}
        emptyComponent={
          <EmptyState
            icon={<PeopleIcon />}
            message="No workers found. Add one to get started!"
          />
        }
      />

      <WorkerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        worker={editing}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Worker"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove all their equipment assignments.`}
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
