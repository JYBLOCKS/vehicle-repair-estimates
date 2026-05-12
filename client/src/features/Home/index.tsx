import { useState, useMemo, useEffect, ChangeEvent } from "react";
import type { EstimateOut } from "./models/Estimate";
import type { Row, VehicleOut } from "./models/Vehicle";
import { deleteEstimate, listEstimates } from "./api/estimate.api";
import { deleteVehicle, getVehicle } from "./api/vehicle.api";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import NavBar from "../../components/ui/NavBar";
import { Add, Delete, Edit, MoreVert, Visibility } from "@mui/icons-material";
import AddEstimateDialog from "./components/dialogs/AddEstimateDialog";
import ViewInfoDialog from "./components/dialogs/ViewInfoDialog";
import DeleteEstimateDialog from "./components/dialogs/DeleteEstimateDialog";

const Home = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [status, setStatus] = useState<
    "pending" | "approved" | "in_progress" | "completed" | "canceled" | ""
  >("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewInfoOpen, setViewInfoOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [vehicle, setVehicle] = useState<Row | null>(null);

  const loadData = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth?.access_token) {
        setRows([]);
        return;
      }
      const estimates: EstimateOut[] = await listEstimates(
        auth.access_token,
        status,
      );
      // Fetch all related vehicles in parallel
      const vehicleMap = new Map<string, VehicleOut>();
      await Promise.all(
        estimates.map(async (e) => {
          if (!vehicleMap.has(e.vehicle_id)) {
            const v = await getVehicle(e.vehicle_id, auth.access_token);
            vehicleMap.set(e.vehicle_id, v);
          }
        }),
      );
      const tableRows: Row[] = estimates.map((e) => {
        const v = vehicleMap.get(e.vehicle_id)!;
        return {
          id: v.id,
          owner_name: v.owner_name,
          owner_phone: v.owner_phone,
          owner_email: v.owner_email,
          brand: v.brand,
          model: v.model,
          year: v.year ?? null,
          mileage: v.mileage ?? null,
          plate: v.plate ?? null,
          customer_notes: e.customer_notes ?? null,
          internal_notes: e.internal_notes ?? null,
          estimate_id: e.id,
          vin: v.vin ?? null,
          subtotal: Number(e.subtotal),
          tax_amount: Number(e.tax_amount),
          discount_amount: Number(e.discount_amount),
          tax_percent: Number(e.tax_percent),
          validity_days: Number(e.validity_days),
          total: Number(e.total),
          status: e?.status,
          items: e.items,
        };
      });
      setRows(tableRows);
    } catch (err) {
      console.error(err);
      setRows([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [status]);

  const handleStatusFilter = (
    filterStatus:
      | "pending"
      | "approved"
      | "in_progress"
      | "completed"
      | "canceled"
      | "",
  ) => {
    setStatus(filterStatus);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewInfo = (vehicle: Row) => {
    setVehicle(vehicle);
    setViewInfoOpen(true);
  };

  const handleEdit = (vehicle: Row) => {
    setVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleDelete = (vehicle: Row) => {
    setVehicle(vehicle);
    setDeleteOpen(true);
  };

  const handleOnDelete = async () => {
    if (!vehicle) return;
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (!auth?.access_token) return;
    try {
      await deleteVehicle(vehicle.id!, auth.access_token);
      await deleteEstimate(vehicle.estimate_id!, auth.access_token);
      setDeleteOpen(false);
      setVehicle(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnEdit = () => {
    if (!vehicle) return;
    setDialogOpen(true);
    setDeleteOpen(false);
  };

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <NavBar />
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        m={5}
        p={3}
      >
        <Paper sx={{ width: "100%", maxWidth: 800, overflow: "hidden", p: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={1}
          >
            <Typography variant="h6">Estimates</Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              New
            </Button>
          </Stack>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Owner</TableCell>
                  <TableCell align="center">Plate</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell align="center">Tax</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      spacing={1}
                      ml={2}
                    >
                      <Typography>Status</Typography>
                      <IconButton
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        sx={{ width: 24, height: 24 }}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          list: {
                            "aria-labelledby": "basic-button",
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleStatusFilter("")}>
                          None
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("completed")}
                        >
                          Completed
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusFilter("pending")}>
                          Pending
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("in_progress")}
                        >
                          In Progress
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("approved")}
                        >
                          Approved
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("canceled")}
                        >
                          Canceled
                        </MenuItem>
                      </Menu>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={`${row.owner_name}-${row.brand}-${row.model}-${row.total}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.owner_name}
                      </TableCell>
                      <TableCell align="center">{row.plate}</TableCell>
                      <TableCell align="center">{row.subtotal}</TableCell>
                      <TableCell align="center">{row.tax_amount}</TableCell>
                      <TableCell align="center">{row.total}</TableCell>
                      <TableCell align="center">
                        {row.status &&
                          (
                            row.status[0]?.toUpperCase() + row.status?.slice(1)
                          ).replaceAll("_", " ")}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            id="edit-button"
                            onClick={() => handleEdit(row)}
                            color="warning"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            id="view-button"
                            onClick={() => handleViewInfo(row)}
                            color="success"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            id="delete-button"
                            onClick={() => handleDelete(row)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <AddEstimateDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onCreated={() => {
              setDialogOpen(false);
              loadData();
            }}
            vehicle={vehicle!}
            edit={!!vehicle?.id}
          />
          <ViewInfoDialog
            open={viewInfoOpen}
            onClose={() => setViewInfoOpen(false)}
            vehicle={vehicle!}
          />
          <DeleteEstimateDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onDeleted={() => {
              handleOnDelete();
            }}
            vehicle={vehicle!}
          />
        </Paper>
      </Stack>
    </Box>
  );
};
export default Home;
