"use client";

import React, { useState, useEffect } from "react";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { 
  Box, Paper, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Chip, Button, CircularProgress 
} from "@mui/material";
// Assuming you have an axios instance in your lib folder
import api from "@/lib/axios"; 

export default function InboundServicePage() {
  const [inboundData, setInboundData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your Spring Boot Inbound Microservice
    const fetchInboundShipments = async () => {
      try {
        const response = await api.get("/inbound/shipments");
        setInboundData(response.data);
      } catch (error) {
        console.error("Error fetching inbound data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInboundShipments();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <MoveToInboxIcon sx={{ fontSize: 32, color: "#6366f1" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Inbound Service
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 600 }}>
          Manage incoming shipments, receive goods, and track inbound deliveries
          into the warehouse.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 0, // Removed padding to let the table reach the edges
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} sx={{ color: "#6366f1" }} />
          </Box>
        ) : inboundData.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Shipment ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Expected Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inboundData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>#{row.shipmentNumber}</TableCell>
                    <TableCell>{row.supplierName}</TableCell>
                    <TableCell>{row.expectedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small"
                        sx={{ 
                          bgcolor: row.status === 'PENDING' ? '#fef3c7' : '#dcfce7',
                          color: row.status === 'PENDING' ? '#92400e' : '#166534',
                          fontWeight: 500
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: "#6366f1", textTransform: 'none' }}>
                        Receive Items
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ color: "#94a3b8" }}>
              No inbound data found.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}