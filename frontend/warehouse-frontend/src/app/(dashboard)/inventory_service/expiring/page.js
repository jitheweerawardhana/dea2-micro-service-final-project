"use client";

import { useCallback, useEffect, useState } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Box, Button, TextField } from "@mui/material";

import PageHeader from "@/components/workforce/PageHeader";
import DataTable from "@/components/workforce/DataTable";
import { EmptyState, LoadingState, Toast } from "@/components/workforce/shared";
import { getExpiringSoon } from "@/services/inventory";

export default function InventoryExpiringPage() {
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = useCallback(async (windowDays) => {
    try {
      setLoading(true);
      const res = await getExpiringSoon(windowDays);
      setRows(res.data || []);
    } catch {
      setToast({
        open: true,
        message: "Failed to load expiring items",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  if (loading) return <LoadingState message="Loading expiring items..." />;

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
    { id: "expiryDate", label: "Expiry Date", sortable: true },
    { id: "totalAvailable", label: "Available", sortable: true },
  ];

  return (
    <>
      <PageHeader
        title="Expiring Items"
        subtitle="Inventory that will expire within the selected time window."
        icon={<EventBusyIcon sx={{ fontSize: 28 }} />}
        count={rows.length}
      />

      <Box sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}>
        <TextField
          type="number"
          label="Days"
          size="small"
          value={days}
          onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
          sx={{ width: 140 }}
        />
        <Button
          variant="outlined"
          onClick={() => fetchData(days)}
          sx={{ borderColor: "#cbd5e1", color: "#334155" }}
        >
          Refresh
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["batchNo", "productName", "zone", "rackNo", "binNo", "expiryDate"]}
        emptyComponent={
          <EmptyState icon={<EventBusyIcon />} message="No expiring items found." />
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
