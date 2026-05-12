import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createEstimate, updateEstimate } from "../../../api/estimate.api";
import { createVehicle, updateVehicle } from "../../../api/vehicle.api";
import type {
  EstimateItemCreate,
  EstimateStatus,
} from "../../../models/Estimate";
import type { Row, VehicleCreate } from "../../../models/Vehicle";

export default function AddEstimateDialog({
  open,
  onClose,
  onCreated,
  vehicle: propVehicle,
  edit,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  vehicle?: Row;
  edit?: boolean;
}) {
  const emptyItem: EstimateItemCreate = {
    kind: "part",
    description: "",
    quantity: 1,
    unit_price: 0,
    unit_cost: undefined,
  };
  const [saving, setSaving] = useState(false);

  const [vehicle, setVehicle] = useState<VehicleCreate>({
    owner_name: "",
    brand: "",
    model: "",
    year: undefined,
    plate: "",
    mileage: undefined,
    owner_email: "",
    owner_phone: "",
    vin: "",
  });

  const [estimate, setEstimate] = useState({
    customer_notes: "",
    internal_notes: "",
    tax_percent: 13,
    discount_amount: 0,
    validity_days: 7,
    status: "pending" as EstimateStatus,
  });

  const [items, setItems] = useState<EstimateItemCreate[]>([emptyItem]);

  const handleAddItem = () => {
    setItems((current) => [...current, { ...emptyItem }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof EstimateItemCreate,
    value: EstimateItemCreate[keyof EstimateItemCreate],
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth?.access_token) throw new Error("Not authenticated");

      if (edit && propVehicle) {
        await updateVehicle(
          propVehicle.id!,
          {
            ...vehicle,
            year: vehicle.year ? Number(vehicle.year) : undefined,
            mileage: vehicle.mileage ? Number(vehicle.mileage) : undefined,
          },
          auth.access_token,
        );
        await updateEstimate(
          propVehicle.estimate_id!,
          {
            ...estimate,
            vehicle_id: propVehicle.id!,
            customer_notes: estimate.customer_notes || undefined,
            internal_notes: estimate.internal_notes || undefined,
            tax_percent: Number(estimate.tax_percent) || 0,
            discount_amount: Number(estimate.discount_amount) || 0,
            validity_days: Number(estimate.validity_days) || 7,
            items: items.map((item) => ({
              ...item,
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              unit_cost: item.unit_cost ? Number(item.unit_cost) : undefined,
            })),
            status: estimate.status || "pending",
          },
          auth.access_token,
        );
      } else {
        const createdVehicle = await createVehicle(
          {
            ...vehicle,
            year: vehicle.year ? Number(vehicle.year) : undefined,
            mileage: vehicle.mileage ? Number(vehicle.mileage) : undefined,
          },
          auth.access_token,
        );
        await createEstimate(
          {
            vehicle_id: createdVehicle.id,
            customer_notes: estimate.customer_notes || undefined,
            internal_notes: estimate.internal_notes || undefined,
            tax_percent: Number(estimate.tax_percent) || 0,
            discount_amount: Number(estimate.discount_amount) || 0,
            validity_days: Number(estimate.validity_days) || 7,
            items: items.map((item) => ({
              ...item,
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              unit_cost: item.unit_cost ? Number(item.unit_cost) : undefined,
            })),
            status: estimate.status || "pending",
          },
          auth.access_token,
        );
      }

      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      alert(`Error creating estimate: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (propVehicle && edit) {
      setVehicle({
        owner_name: propVehicle.owner_name || "",
        brand: propVehicle.brand || "",
        model: propVehicle.model || "",
        year: propVehicle.year || undefined,
        plate: propVehicle.plate || "",
        mileage: propVehicle.mileage || undefined,
        owner_email: propVehicle.owner_email || "",
        owner_phone: propVehicle.owner_phone || "",
        vin: propVehicle.vin || "",
      });
      setEstimate({
        customer_notes: propVehicle.customer_notes || "",
        internal_notes: propVehicle.internal_notes || "",
        tax_percent: propVehicle.tax_percent || 13,
        discount_amount: propVehicle.discount_amount || 0,
        validity_days: propVehicle.validity_days || 7,
        status: propVehicle.status || "pending",
      });
      setItems(
        propVehicle.items?.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          unit_cost: item.unit_cost ? Number(item.unit_cost) : undefined,
        })) || [emptyItem],
      );
    }
  }, [propVehicle, edit]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {edit ? "Edit Vehicle + Estimate" : "New Vehicle + Estimate"}
      </DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: "column", md: "row" }} gap={3} mt={1}>
          <Box sx={{ flex: 1 }}>
            <Stack gap={2}>
              <TextField
                label="Owner Name"
                value={vehicle.owner_name}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_name: e.target.value }))
                }
                required
              />
              <TextField
                label="Owner Email"
                value={vehicle.owner_email || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_email: e.target.value }))
                }
              />
              <TextField
                label="Owner Phone"
                value={vehicle.owner_phone || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_phone: e.target.value }))
                }
              />
              <TextField
                label="Brand"
                value={vehicle.brand}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, brand: e.target.value }))
                }
                required
              />
              <TextField
                label="Model"
                value={vehicle.model}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, model: e.target.value }))
                }
                required
              />
              <TextField
                label="Year"
                type="number"
                value={vehicle.year ?? ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, year: Number(e.target.value) }))
                }
                inputProps={{ min: 1900, max: 2100 }}
              />
              <TextField
                label="Mileage"
                type="number"
                value={vehicle.mileage ?? ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, mileage: Number(e.target.value) }))
                }
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Plate"
                value={vehicle.plate || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, plate: e.target.value }))
                }
              />
              <TextField
                label="VIN"
                value={vehicle.vin || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, vin: e.target.value }))
                }
              />
              <TextField
                label="Customer Notes"
                value={estimate.customer_notes}
                onChange={(e) =>
                  setEstimate((s) => ({ ...s, customer_notes: e.target.value }))
                }
                multiline
                minRows={2}
              />
              <TextField
                label="Internal Notes"
                value={estimate.internal_notes}
                onChange={(e) =>
                  setEstimate((s) => ({ ...s, internal_notes: e.target.value }))
                }
                multiline
                minRows={2}
              />
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack gap={2}>
              <TextField
                label="Status"
                value={estimate.status}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    status: e.target.value as EstimateStatus,
                  }))
                }
                select
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </TextField>
              <TextField
                label="Tax %"
                type="number"
                value={estimate.tax_percent}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    tax_percent: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
              <TextField
                label="Discount Amount"
                type="number"
                value={estimate.discount_amount}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    discount_amount: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                label="Validity Days"
                type="number"
                value={estimate.validity_days}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    validity_days: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 1, max: 60 }}
              />

              <Stack gap={2}>
                {items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Stack gap={2}>
                      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                        <TextField
                          select
                          label="Item Kind"
                          value={item.kind}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "kind",
                              e.target.value as EstimateItemCreate["kind"],
                            )
                          }
                          sx={{ minWidth: 140 }}
                        >
                          <MenuItem value="part">Part</MenuItem>
                          <MenuItem value="labor">Labor</MenuItem>
                        </TextField>

                        <TextField
                          label="Description"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          fullWidth
                        />
                      </Stack>

                      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                        <TextField
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          inputProps={{ min: 0.01, step: 0.01 }}
                        />

                        <TextField
                          label="Unit Price"
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unit_price",
                              Number(e.target.value),
                            )
                          }
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                          label="Unit Cost"
                          type="number"
                          value={item.unit_cost ?? ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unit_cost",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Stack>

                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                      >
                        Remove Item
                      </Button>
                    </Stack>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  sx={{ maxWidth: 160, alignSelf: "flex-end" }}
                  onClick={handleAddItem}
                >
                  Add Extra Item
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} variant="contained">
          {edit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
