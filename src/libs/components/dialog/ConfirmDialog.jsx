import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from "@mui/material";
import { HelpCircle } from "lucide-react";
import PropTypes from "prop-types";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Xác nhận",
  cancelButtonText = "Hủy",
  confirmButtonColor = "primary",
  icon = <HelpCircle size={20} color="#3b82f6" />,
  extraContent = null,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": { borderRadius: 2, p: 2, textAlign: "center" },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon && <Box>{icon}</Box>}
        {title && (
          <Typography variant="h6" fontWeight="600" color="#1e293b">
            {title}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {message && (
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        )}
        {extraContent && (
          <Box sx={{ mt: 2 }}>
            {extraContent}
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          p: 2,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#cbd5e0",
            color: "#4a5568",
            "&:hover": { backgroundColor: "#f7fafc", borderColor: "#a0aec0" },
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmButtonColor}
          sx={{
            "&:hover": { backgroundColor: confirmButtonColor === "primary" ? "#1d4ed8" : undefined },
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonColor: PropTypes.string,
  icon: PropTypes.node,
  extraContent: PropTypes.node,
};

export default ConfirmDialog;