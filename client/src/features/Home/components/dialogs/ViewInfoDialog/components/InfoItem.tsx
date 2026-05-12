import { Box, Typography } from "@mui/material";

export const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography variant="body1" fontWeight={600}>
      {value || "-"}
    </Typography>
  </Box>
);
