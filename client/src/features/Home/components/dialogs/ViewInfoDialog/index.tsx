import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { EstimateStatus } from "../../../models/Estimate";
import type { Row } from "../../../models/Vehicle";
import { InfoItem } from "./components/InfoItem";
import { SummaryRow } from "./components/SummaryRow";

interface ViewInfoDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Row;
}

const ViewInfoDialog = ({ open, onClose, vehicle }: ViewInfoDialogProps) => {
  const getColorByStatus = (status: EstimateStatus) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "approved":
        return "#4caf50";
      case "canceled":
        return "#f44336";
      case "in_progress":
        return "#0055ffff";
      case "completed":
        return "#006c0dff";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
      >
        <Typography fontWeight={700} fontSize={24}>
          Vehicle Information
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign={"center"}
          >
            Complete vehicle and customer details
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <InfoItem label="Owner Name" value={vehicle?.owner_name} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} justifyItems={"end"}>
                <InfoItem label="Owner Phone" value={vehicle?.owner_phone} />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <InfoItem label="Brand" value={vehicle?.brand} />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <InfoItem label="Model" value={vehicle?.model} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <InfoItem label="Year" value={vehicle?.year} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem
                  label="Mileage"
                  value={`${vehicle?.mileage ?? 0} km`}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} justifyItems={"end"}>
                <InfoItem label="Plate" value={vehicle?.plate} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InfoItem label="VIN" value={vehicle?.vin} />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
              textAlign={"center"}
            >
              Notes
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Customer Notes
                </Typography>

                <Typography variant="body1">
                  {vehicle?.customer_notes || "-"}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Internal Notes
                </Typography>

                <Typography variant="body1">
                  {vehicle?.internal_notes || "-"}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
              textAlign={"center"}
            >
              Items
            </Typography>

            <Stack spacing={2}>
              {vehicle &&
                vehicle?.items?.map((item, index) => (
                  <>
                    <Box
                      key={index}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography variant="h6">{item?.description}</Typography>

                      <Typography variant="body1">
                        {Math.round(item?.quantity)} x $ {item?.unit_price} = ${" "}
                        {(item?.quantity ?? 0) * (item?.unit_price ?? 0)}
                      </Typography>
                    </Box>
                    {vehicle?.items &&
                      vehicle?.items?.length > 1 &&
                      index !== vehicle?.items?.length - 1 && <Divider />}
                  </>
                ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
              textAlign={"center"}
            >
              Estimate Summary
            </Typography>

            <Stack spacing={1.5}>
              <SummaryRow
                label="Discount"
                value={`$${vehicle?.discount_amount ?? 0}`}
              />

              <SummaryRow
                label="Tax Percent"
                value={`${vehicle?.tax_percent ?? 0}%`}
              />

              <SummaryRow
                label="Validity Days"
                value={`${vehicle?.validity_days ?? 0} days`}
              />

              <Divider sx={{ my: 1 }} />

              <SummaryRow
                label="Subtotal"
                value={`$${vehicle?.subtotal ?? 0}`}
              />

              <SummaryRow label="Tax" value={`$${vehicle?.tax_amount ?? 0}`} />

              <SummaryRow
                label="Total"
                value={`$${vehicle?.total ?? 0}`}
                bold
              />

              <Divider sx={{ my: 1 }} />

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={600}>Status</Typography>

                <Chip
                  label={vehicle?.status?.toUpperCase()}
                  sx={{
                    fontWeight: 700,
                    color: "#fff",
                    bgcolor: getColorByStatus(vehicle?.status!),
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInfoDialog;
