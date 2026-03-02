"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";

/**
 * Generic sortable data table with search.
 *
 * Props:
 *  - columns: [{ id, label, align?, render?, sortable? }]
 *  - rows: array of objects
 *  - searchKeys: array of string keys to search across
 *  - emptyComponent: React node shown when no rows
 *  - onRowClick: optional (row) => void
 */
export default function DataTable({
  columns,
  rows,
  searchKeys = [],
  emptyComponent,
  onRowClick,
}) {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!orderBy) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, orderBy, order]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Search bar */}
      {searchKeys.length > 0 && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", sm: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
              },
            }}
          />
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    bgcolor: "#f8fafc",
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ border: 0 }}>
                  {emptyComponent || (
                    <Box sx={{ py: 6, textAlign: "center", color: "#94a3b8" }}>
                      No records found.
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row, idx) => (
                <TableRow
                  key={row.id ?? idx}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:last-child td": { border: 0 },
                    transition: "background 0.15s",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || "left"}>
                      {col.render ? col.render(row) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
