import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { userService } from "~/libs/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required").trim(),
  newPassword: yup.string().required("New password is required").trim(),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .trim(),
});

export const ChangePasswordLayout = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await userService.changePassword(data);
      console.log(response);
      if (response.success === true) {
        toast.success("Change password successfully");
        onClose(); // Close modal after successful password change
      } else {
        toast.error(
          "Failed to change password. Please check your current password."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("There is some error. Please check your current password!");
    }
  };

  const onError = () => {
    // Show error messages for missing fields
    Object.keys(errors).forEach((field) => {
      if (errors[field]?.message) {
        toast.error(errors[field].message);
      }
    });
  };

  return (
    <Modal onClose={onClose} open={isOpen}>
      <Box sx={style}>
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Đổi mật khẩu
          </Typography>
        </Box>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <TextField
            type="password"
            {...register("currentPassword")}
            placeholder="Mật khẩu cũ"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            type="password"
            {...register("newPassword")}
            placeholder="Mật khẩu mới"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            type="password"
            {...register("confirmNewPassword")}
            placeholder="Xác nhận mật khẩu mới"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button variant="outlined" color="error" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#155DFC", ":hover": {backgroundColor:"#1053e4"} }}
              type="submit"
            >
              Xác Nhận
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
