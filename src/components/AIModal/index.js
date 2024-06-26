import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
//import images and vector
import CloseIcon from "@mui/icons-material/Close";
//relative path import
import LoadingButton from "../LoadingButton";

const AIModal = ({ open, onClose, handleRun, isLoading = false, isReRun }) => {
  console.log(isReRun);
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "primary.main" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle2"
            fontWeight={"700"}
            color={"primary.contrastText"}
          >
            Confirmation
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: 32, color: "primary.contrastText" }} />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Typography variant="subtitle2">
          Are you sure you want to {isReRun ? "Re-run AI" : "Run AI"}?
        </Typography>
        <Box mt={2}>
          <Typography variant="caption" color={"#797D7F"}>
            This action is permanent and cannot be undo
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mr: 4 }}>
        <LoadingButton onClick={onClose} variant="outlined">
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleRun}
          isLoading={isLoading}
          variant="contained"
        >
          {isReRun ? "Re-run" : "Run"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AIModal;
