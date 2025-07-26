import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  Tooltip,
  styled,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert,
} from "@mui/icons-material";
import uploadService from "~/libs/api/services/uploadService";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ChatDisplayer = ({
  socket,
  messages = [],
  currentUser,
  room,
  isLoading = false,
  onMessageSent, // Add this prop to notify parent about sent messages
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(room?.receiverId || null);
  const [sender, setSender] = useState(room?.senderId || null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Update receiver and sender when room changes
  useEffect(() => {
    if (room) {
      setReceiver(room.receiverId || null);
      setSender(room.senderId || null);
    }
  }, [room?.roomId]); // Use roomId as dependency to detect room changes

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (file = null) => {
    let fileData = null;
    console.log("Sending message:", newMessage, "with file:", file);
    if (!newMessage.trim() && !file) {
      console.log("Empty message and no file, not sending");
      return;
    }

    // Determine the correct receiver
    let actualReceiver = receiver;

    if (currentUser._id === receiver?._id) {
      console.log("Cannot send message to self, switching to sender");
      actualReceiver = sender;
      setReceiver(sender);
      setSender(null);
    }

    // If we still don't have a valid receiver, prevent sending
    if (!actualReceiver || currentUser._id === actualReceiver?._id) {
      console.log(
        "No valid receiver found or still trying to send to self, ",
        receiver
      );
      return;
    }

    // Only try to upload if file exists and is a valid File object
    if (file && file instanceof File) {
      try {
        const response = await uploadService.uploadFile(file);
        fileData = response.url;
        console.log("File uploaded successfully:", fileData);
      } catch (error) {
        console.error("File upload failed:", error);
        return; // Don't send message if file upload fails
      }
    }

    const messageData = {
      roomId: room.roomId,
      senderId: currentUser,
      content: file && file instanceof File ? fileData : newMessage,
      receiverId: actualReceiver,
      type: file && file instanceof File ? "FILE" : "TEXT",
      createdAt: new Date().toISOString(),
    };

    console.log("Sending message data:", messageData);

    socket.emit("sendMessage", messageData);
    if (onMessageSent) {
      onMessageSent(messageData);
    }

    setNewMessage("");
  };

  // Separate function for sending text messages (from button click)
  const handleSendTextMessage = () => {
    handleSendMessage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message?.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const isToday = (date) => {
    const today = new Date().toDateString();
    return date === today;
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date === yesterday.toDateString();
  };

  const formatDateHeader = (dateString) => {
    if (isToday(dateString)) return "Hôm nay";
    if (isYesterday(dateString)) return "Hôm qua";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f9fa",
      }}
    >
      {/* Chat Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {room?.name || "Phòng Chat"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
        }}
      >
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <Box key={date}>
            {/* Date Header */}
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Chip
                label={formatDateHeader(date)}
                size="small"
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.05)",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            {/* Messages for this date */}
            {dayMessages.map((message) => {
              const isCurrentUser = message?.senderId._id === currentUser?._id;

              return (
                <Box
                  key={message?.id}
                  sx={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    mb: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isCurrentUser && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {message?.senderId?.username || "Unknown User"}
                      </Typography>
                    )}
                    {message?.type === "FILE" ? (
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          cursor: "pointer",
                          borderRadius: 1,
                          overflow: "hidden",
                          bgcolor: "white",

                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            zIndex: 1,
                            transition: "background-color 0.1s linear",
                          },

                          "&:hover::after": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        onClick={() => {
                          window.location.href = message.content;
                        }}
                      >
                        <img
                          src={message.content}
                          alt="Uploaded file"
                          style={{
                            width: "300px",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: 4,
                            display: "block",
                          }}
                        />
                      </Box>
                    ) : (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor: isCurrentUser ? "primary.main" : "white",
                          color: isCurrentUser ? "white" : "text.primary",
                          borderRadius: 2,
                          borderTopLeftRadius: !isCurrentUser ? 1 : 2,
                          borderTopRightRadius: isCurrentUser ? 1 : 2,
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">
                          {message?.content}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={3}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Đính kèm file">
                    <IconButton
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      size="small"
                      edge="start"
                    >
                      <AttachFileIcon fontSize="small" />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => handleSendMessage(e.target.files[0])}
                        accept="image/*"
                        multiple={false}
                      />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Emoji">
                    <IconButton size="small">
                      <EmojiIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <Tooltip title="Gửi tin nhắn">
            <IconButton
              onClick={handleSendTextMessage}
              disabled={!newMessage.trim() || isLoading}
              sx={{
                bgcolor: newMessage.trim() ? "primary.main" : "grey.300",
                color: "white",
                "&:hover": {
                  bgcolor: newMessage.trim() ? "primary.dark" : "grey.400",
                },
                mb: 0.5,
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatDisplayer;
