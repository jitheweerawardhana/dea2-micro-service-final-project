"use client";

import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import AssignmentFormDialog from "@/components/workforce/AssignmentFormDialog";
import {
  LoadingState,
  EmptyState,
  ConfirmDialog,
  Toast,
} from "@/components/workforce/shared";
import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllEquipments,
  getAllWorkers,
} from "@/services/workforce";

const statusStyles = {
  ACTIVE: { bgcolor: "#dcfce7", color: "#166534" },
  RETURNED: { bgcolor: "#dbeafe", color: "#1e40af" },
  OVERDUE: { bgcolor: "#fee2e2", color: "#991b1b" },
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

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [equipments, setEquipments] = useState([]);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [aRes, eqRes, wRes] = await Promise.all([
        getAllAssignments(),
        getAllEquipments(),
        getAllWorkers(),
      ]);
      setAssignments(aRes.data);
      setEquipments(eqRes.data);
      setWorkers(wRes.data);
    } catch {
      setToast({
        open: true,
        message: "Failed to load assignments",
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

  const handleEdit = (a) => {
    setEditing(a);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      if (editing) {
        await updateAssignment(editing.id, data);
        setToast({
          open: true,
          message: "Assignment updated",
          severity: "success",
        });
      } else {
        await createAssignment(data);
        setToast({
          open: true,
          message: "Assignment created",
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
      await deleteAssignment(deleteTarget.id);
      setToast({
        open: true,
        message: "Assignment deleted",
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
    { id: "workerName", label: "Worker", sortable: true },
    {
      id: "assignedDate",
      label: "Assigned",
      sortable: true,
      render: (row) => formatDate(row.assignedDate),
    },
    {
      id: "returnedDate",
      label: "Returned",
      sortable: true,
      render: (row) => formatDate(row.returnedDate),
    },
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
            label={row.status}
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

  if (loading) return <LoadingState message="Loading assignments..." />;

  return (
    <Box>
      <PageHeader
        title="Equipment Assignments"
        subtitle="Track which equipment is assigned to which worker and when."
        icon={<AssignmentIndIcon sx={{ fontSize: 32 }} />}
        backHref="/workforce_service"
        count={assignments.length}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
          >
            New Assignment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={assignments}
        searchKeys={["equipmentName", "workerName", "status"]}
        emptyComponent={
          <EmptyState
            icon={<AssignmentIndIcon />}
            message="No assignments found."
          />
        }
      />

      <AssignmentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        assignment={editing}
        equipments={equipments}
        workers={workers}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Assignment"
        message="Are you sure you want to remove this equipment assignment?"
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
