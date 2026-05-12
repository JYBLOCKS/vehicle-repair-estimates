import { Box, Typography } from "@mui/material";

export const SummaryRow = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="body1" fontWeight={bold ? 700 : 500}>
      {label}
    </Typography>

    <Typography variant="body1" fontWeight={bold ? 700 : 500}>
      {value}
    </Typography>
  </Box>
);
