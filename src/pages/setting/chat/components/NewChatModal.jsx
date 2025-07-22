import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import chatService from "~/libs/api/services/chatService";

const NewChatModal = ({ open, onClose, onRoomCreated }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Load available users when modal opens
  useEffect(() => {
    if (open) {
      loadAvailableUsers();
      setSearchTerm("");
      setError(null);
    }
  }, [open]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(availableUsers);
    } else {
      const filtered = availableUsers.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, availableUsers]);

  const loadAvailableUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getAvailableUsers();

      if (response.success) {
        setAvailableUsers(response.data || []);
      } else {
        setError(response.error || "Không thể tải danh sách người dùng");
      }
    } catch (err) {
      console.error("Error loading available users:", err);
      setError("Có lỗi xảy ra khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (selectedUser) => {
    if (!selectedUser?._id) return;

    setIsCreatingRoom(true);
    setError(null);

    try {
      const response = await chatService.createOrFindRoom(selectedUser._id);

      if (response.success) {
        // Notify parent component about the new/existing room
        if (onRoomCreated) {
          onRoomCreated({
            roomId: response.data.roomId,
            isNew: response.data.isNew,
            room: response.data.room,
            participant: selectedUser,
          });
        }

        // Close modal
        onClose();
      } else {
        setError(response.error || "Không thể tạo phòng chat");
      }
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Có lỗi xảy ra khi tạo phòng chat");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: "Quản trị viên",
      nurse: "Y tế",
      parent: "Phụ huynh",
      teacher: "Giáo viên",
      student: "Học sinh",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      admin: "error",
      nurse: "success",
      parent: "info",
      teacher: "warning",
      student: "primary",
    };
    return colorMap[role] || "default";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Tạo cuộc trò chuyện mới
        </Typography>
        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: "auto", p: 1 }}
          disabled={isCreatingRoom}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Search Box */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
          disabled={isLoading || isCreatingRoom}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Đang tải danh sách người dùng...
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              {searchTerm.trim()
                ? "Không tìm thấy người dùng nào"
                : "Không có người dùng khả dụng để chat"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {searchTerm.trim()
                ? "Thử thay đổi từ khóa tìm kiếm"
                : "Tất cả người dùng đã có phòng chat với bạn"}
            </Typography>
          </Box>
        )}

        {/* Users List */}
        {!isLoading && filteredUsers.length > 0 && (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {filteredUsers.map((availableUser) => (
              <ListItem key={availableUser._id} disablePadding>
                <ListItemButton
                  onClick={() => handleCreateRoom(availableUser)}
                  disabled={isCreatingRoom}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {availableUser.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {availableUser.username || "Unknown User"}
                        </Typography>
                        <Chip
                          label={getRoleDisplayName(availableUser.role)}
                          size="small"
                          color={getRoleColor(availableUser.role)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {availableUser.email}
                      </Typography>
                    }
                  />
                  {isCreatingRoom && (
                    <CircularProgress size={20} sx={{ ml: 2 }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isCreatingRoom}
          sx={{ borderRadius: 2 }}
        >
          Hủy
        </Button>
        {!isLoading && filteredUsers.length === 0 && !error && (
          <Button
            onClick={loadAvailableUsers}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Tải lại
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewChatModal;
