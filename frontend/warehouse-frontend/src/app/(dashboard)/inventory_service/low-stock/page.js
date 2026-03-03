"use client";

import { useCallback, useEffect, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Chip } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import { EmptyState, LoadingState, Toast } from "@/components/workforce/shared";
import { getLowStockAlerts } from "@/services/inventory";

export default function InventoryLowStockPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getLowStockAlerts();
      setRows(res.data?.lowStockItems || []);
    } catch {
      setToast({
        open: true,
        message: "Failed to load low stock alerts",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingState message="Loading low stock alerts..." />;

  const columns = [
    { id: "inventoryId", label: "Inventory ID", sortable: true },
    { id: "batchNo", label: "Batch", sortable: true },
    { id: "productName", label: "Product", sortable: true },
    {
      id: "location",
      label: "Location",
      sortable: false,
      render: (row) => `${row.zone || "—"} / ${row.rackNo || "—"} / ${row.binNo || "—"}`,
    },
    { id: "totalAvailable", label: "Available", sortable: true },
    { id: "lowStockThreshold", label: "Threshold", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: false,
      render: () => (
        <Chip
          label="Low Stock"
          size="small"
          sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 600 }}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Low Stock Alerts"
        subtitle="Items that have reached or fallen below threshold levels."
        icon={<WarningAmberIcon sx={{ fontSize: 28 }} />}
        count={rows.length}
      />

      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["batchNo", "productName", "zone", "rackNo", "binNo"]}
        emptyComponent={
          <EmptyState icon={<WarningAmberIcon />} message="No low stock alerts found." />
        }
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
