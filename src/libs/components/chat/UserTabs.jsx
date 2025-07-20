import { Box, Typography } from "@mui/material";
import React from "react";

export const UserTabs = ({ room, isActive, onClick, unreadCount = 0 }) => {
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
        bgcolor: isActive ? "#f6f5f5" : "transparent",
        "&:hover": {
          bgcolor: isActive ? "#f6f5f5" : "transparent",
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

          {unreadCount > 0 && (
            <Box
              sx={{
                minWidth: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "red",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                ml: 1,
              }}
            ></Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
