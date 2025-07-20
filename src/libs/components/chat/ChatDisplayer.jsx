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
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert,
} from "@mui/icons-material";

const ChatDisplayer = ({
  socket,
  messages = [],
  // receiver,
  // setReceiver,
  // sender,
  // setSender,
  currentUser,
  room,
  isLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(room?.receiverId || null);
  const [sender, setSender] = useState(room?.senderId || null);
  const [isTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  console.log("ChatDisplayer rendered with room:", room);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      console.log("Empty message, not sending");
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

    const messageData = {
      roomId: room.roomId,
      senderId: currentUser,
      content: newMessage,
      receiverId: actualReceiver,
      type: "TEXT",
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
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
                {room?.name || "Chat Room"}
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
              const isCurrentUser = message.senderId._id === currentUser?._id;

              return (
                <Box
                  key={message.id}
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
                        {message.senderId?.username || "Unknown User"}
                      </Typography>
                    )}

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
                      <Typography variant="body2">{message.content}</Typography>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}

        {isTyping && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 24, height: 24 }}>
              <Typography variant="caption">•••</Typography>
            </Avatar>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Đang nhập...
            </Typography>
          </Box>
        )}

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
                    <IconButton size="small" edge="start">
                      <AttachFileIcon fontSize="small" />
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
              onClick={handleSendMessage}
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
