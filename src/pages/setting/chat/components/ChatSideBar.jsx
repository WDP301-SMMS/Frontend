import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  List,
  ListItem,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { UserTabs } from "~/libs/components/chat/UserTabs";

const ChatSideBar = ({
  rooms,
  activeRoomId,
  onRoomSelect,
  currentUser,
  onNewChatClick, // Add this prop
}) => {

  return (
    <Box
      sx={{
        width: 320,
        height: "100%",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Tin nhắn
          </Typography>

          <Tooltip title="Tạo cuộc trò chuyện mới">
            <IconButton 
              size="small" 
              sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
              onClick={onNewChatClick}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Rooms List */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {rooms.length > 0 ? (
          <List sx={{ height: "100%", overflowY: "auto" }}>
            {rooms.map((room) => (
              <ListItem key={room.id} sx={{ p: 0 }}>
                <UserTabs
                  room={room}
                  isActive={room.roomId === activeRoomId}
                  onClick={() => onRoomSelect?.(room)}
                  unreadCount={room.unreadCount || 0}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              padding: 3,
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "grey.100",
                mb: 2,
              }}
            >
              <SearchIcon sx={{ color: "grey.400", fontSize: 32 }} />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              Không có cuộc trò chuyện nào. Hãy tạo một cuộc trò chuyện mới.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Current User Info */}
      <Box sx={{ padding: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  border: "2px solid white",
                }}
              />
            }
          >
            <Avatar src={currentUser?.avatar} sx={{ width: 40, height: 40 }}>
              {currentUser?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.username || "Unknown User"}
            </Typography>
            <Typography variant="caption" color="success.main">
              Đang hoạt động
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatSideBar;
