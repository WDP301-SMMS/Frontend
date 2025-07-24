import React from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button, Box } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

const ErrorDialog = ({
  open,
  onClose,
  title,
  message,
  buttonText = "Đóng",
  buttonColor = "error",
  icon = <AlertTriangle size={60} color="#ef4444" />,
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
      <DialogContent>
        {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
        {title && (
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            {title}
          </Typography>
        )}
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
        {extraContent && (
          <Box sx={{ mt: 2 }}>
            {extraContent}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color={buttonColor}
          sx={{ "&:hover": { backgroundColor: buttonColor === "error" ? "#dc2626" : undefined } }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ErrorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.string,
  icon: PropTypes.node,
  extraContent: PropTypes.node,
};

export default ErrorDialog;