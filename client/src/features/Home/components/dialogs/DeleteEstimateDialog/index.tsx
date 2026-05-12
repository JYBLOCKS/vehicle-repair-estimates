import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Row } from "../../../models/Vehicle";

const DeleteEstimateDialog = ({
  open,
  onClose,
  vehicle,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: Row;
  onDeleted: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Estimate</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this estimate?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDeleted} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEstimateDialog;
