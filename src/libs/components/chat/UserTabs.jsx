import { Box, Typography } from "@mui/material";
import React from "react";

export const UserTabs = ({
  room,
  isActive,
  onClick,
  unreadCount = 0,
}) => {
  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "Không có tin nhắn";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        paddingY: 2,
        paddingX: 2,
        cursor: "pointer",
        mb: 1,
        transition: "all 0.2s ease-in-out",
        borderBottom: 0.5,
        borderColor: "#0000001b",
        "&:hover": {
          bgcolor: "#f9f9f9",
        },
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Chat Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "primary.main" : "text.primary",
              fontSize: "0.95rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "150px",
            }}
          >
            {room?.receiverId._id === room?.currentUserId
              ? room?.senderId.username
              : room?.receiverId.username || "Unknown User"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              fontWeight: unreadCount > 0 ? 500 : 400,
            }}
          >
            {room?.lastMessage?.senderId === room?.currentUserId ? "Bạn: " : ""}
            {truncateMessage(room?.lastMessage?.content)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
