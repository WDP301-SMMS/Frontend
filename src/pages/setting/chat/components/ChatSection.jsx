import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  IconButton,
  Skeleton,
  Alert,
  Fade,
} from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import ChatDisplayer from "~/libs/components/chat/ChatDisplayer";
import chatService from "~/libs/api/services/chatService";
import { useAuth } from "~/libs/contexts/AuthContext";

const ChatSection = ({
  socket,
  selectedRoom,
  messages,
  setMessages,
  onMessageSent, // Add this prop
}) => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom?.roomId) {
      loadMessages(selectedRoom.roomId);
    } else {
      setMessages([selectedRoom.roomId]);
    }
  }, [selectedRoom.roomId]);

  const loadMessages = async (roomId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getAllMessagesByRoomId(roomId);

      if (response.success !== false) {
        setMessages(response.data || response || []);
      } else {
        setError(response.error || "Không thể tải tin nhắn");
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Đã xảy ra lỗi khi tải tin nhắn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedRoom?.id) {
      loadMessages(selectedRoom.id);
    }
  };

  // No room selected state
  if (!selectedRoom) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8f9fa",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "transparent",
            maxWidth: 400,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.light",
              mx: "auto",
              mb: 3,
            }}
          >
            <ChatIcon sx={{ fontSize: 40, color: "primary.main" }} />
          </Avatar>

          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Chọn một cuộc trò chuyện
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin,
            hoặc tạo một cuộc trò chuyện mới.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              sx={{ borderRadius: 2 }}
            >
              Tạo cuộc trò chuyện mới
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Loading state
  if (isLoading && messages.length === 0) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header Skeleton */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </Paper>

        {/* Messages Skeleton */}
        <Box sx={{ flex: 1, p: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                mb: 2,
              }}
            >
              {index % 2 === 0 && (
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{ mr: 1 }}
                />
              )}
              <Box>
                <Skeleton
                  variant="rectangular"
                  width={Math.random() * 200 + 100}
                  height={40}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={16}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input Skeleton */}
        <Paper elevation={2} sx={{ p: 2, borderRadius: 0 }}>
          <Skeleton
            variant="rectangular"
            height={56}
            sx={{ borderRadius: 3 }}
          />
        </Paper>
      </Box>
    );
  }
return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert
            severity="error"
            sx={{ m: 2, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Thử lại
              </Button>
            }
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Chat Messages */}
      <ChatDisplayer
        socket={socket}
        messages={messages}
        setMessages={setMessages}
        currentUser={user}
        room={selectedRoom}
        isLoading={isLoading}
        onMessageSent={onMessageSent} // Pass the callback
      />
    </Box>
  );
};

export default ChatSection;
