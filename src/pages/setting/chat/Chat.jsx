import React, { useEffect, useState, useCallback } from "react";
import { Box, Container, Paper, Alert, Snackbar } from "@mui/material";
import ChatSideBar from "./components/ChatSideBar";
import ChatSection from "./components/ChatSection";
import chatService from "~/libs/api/services/chatService";
import { useAuth } from "~/libs/contexts/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  // const [receiver, setReceiver] = useState(null);
  // const [sender, setSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRooms = useCallback(async () => {
    if (!user?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getAllRoomsByUserId(user._id);

      if (response.success !== false) {
        const roomsData = response.data || response || [];

        const enhancedRooms = roomsData.map((room) => ({
          ...room,

          unreadCount: Math.floor(Math.random() * 5),
          isOnline: Math.random() > 0.5,
          type:
            room.type || (room.participants?.length > 2 ? "group" : "direct"),
          lastMessage: room.lastMessage || {
            content: "Tin nhắn mẫu để hiển thị",
            createdAt: new Date().toISOString(),
            senderId: room.participants?.[0]?.id || "other",
          },
          currentUserId: user._id,
        }));

        console.log("Enhanced rooms:", enhancedRooms);
        setRooms(enhancedRooms);

        if (enhancedRooms.length > 0 && !selectedRoom) {
          setSelectedRoom(enhancedRooms[0]);
        }
      } else {
        setError(response.error || "Không thể tải danh sách cuộc trò chuyện");
      }
    } catch (err) {
      console.error("Get rooms error:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedRoom]);

  useEffect(() => {
    if (user && user._id) {
      loadRooms();
    }

    return () => {
      setRooms([]);
      setSelectedRoom(null);
    };
  }, []);

  useEffect(() => {
    if (selectedRoom?.roomId) {
      socket.emit("joinRoom", selectedRoom.roomId);

      const handleReceiveMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      // Listen for incoming messages
      socket.on("receiveMessage", handleReceiveMessage);

      // get the latest messages for the selected room

      return () => {
        socket.emit("leaveRoom");
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [selectedRoom]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);

    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r
      )
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ height: "90vh", py: 2 }}>
        <Paper
          elevation={2}
          sx={{
            height: "100%",
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Box sx={{ width: 320, bgcolor: "grey.50", p: 2 }}>
            {/* Skeleton for sidebar */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ height: 24, bgcolor: "grey.200", borderRadius: 1, mb: 1 }}
              />
              <Box sx={{ height: 40, bgcolor: "grey.200", borderRadius: 2 }} />
            </Box>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "grey.200",
                    borderRadius: "50%",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      height: 16,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Box
                    sx={{
                      height: 14,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      width: "70%",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "grey.200",
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 2,
                }}
              />
              <Box
                sx={{
                  height: 20,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  width: 200,
                  mx: "auto",
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ height: "90vh", py: 2 }}>
        <Alert
          severity="error"
          action={<button onClick={loadRooms}>Thử lại</button>}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ height: "90vh", py: 2 }}>
      <Paper
        elevation={2}
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          bgcolor: "background.paper",
        }}
      >
        {/* Chat Sidebar */}
        <ChatSideBar
          rooms={rooms}
          activeRoomId={selectedRoom?.id}
          onRoomSelect={handleRoomSelect}
          currentUser={user}
          // receiver={receiver}
          // setReceiver={setReceiver}
          // sender={sender}
          // setSender={setSender}
        />

        {/* Chat Section */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatSection
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            selectedRoom={selectedRoom}
            // sender={sender}
            // setSender={setSender}
            // receiver={receiver}
            // setReceiver={setReceiver}
          />
        </Box>
      </Paper>
    </Container>
  );
}
