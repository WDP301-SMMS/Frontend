import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Container, Paper, Alert, Snackbar } from "@mui/material";
import ChatSideBar from "./components/ChatSideBar";
import ChatSection from "./components/ChatSection";
import NewChatModal from "./components/NewChatModal";
import chatService from "~/libs/api/services/chatService";
import { useAuth } from "~/libs/contexts/AuthContext";
import { io } from "socket.io-client";
import { userService } from "~/libs/api";

const socket = io("http://localhost:3000");

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sort rooms by latest message time
  const sortRoomsByLatestMessage = (rooms) => {
    return [...rooms].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt)
        : new Date(0);
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt)
        : new Date(0);
      return bTime - aTime; // Most recent first
    });
  };

  const loadRooms = useCallback(async (selectFirstRoom = false) => {
    if (!user?._id) return [];

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

        const sortedRooms = sortRoomsByLatestMessage(enhancedRooms);
        setRooms(sortedRooms);

        // Only auto-select first room during initial load
        if (selectFirstRoom && sortedRooms.length > 0) {
          setSelectedRoom(sortedRooms[0]);
        }

        return sortedRooms;
      } else {
        setError(response.error || "Không thể tải danh sách cuộc trò chuyện");
        return [];
      }
    } catch (err) {
      console.error("Get rooms error:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  // Remove the separate function since we combined the logic

  // Update room's last message when a new message is received
  const updateRoomLastMessage = useCallback((message) => {
    setRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) => {
        if (room?.roomId === message?.roomId) {
          return {
            ...room,
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt || new Date().toISOString(),
              senderId: message.senderId._id || message.senderId,
              senderUsername:
                message.senderId.username || message.senderUsername,
            },
          };
        }
        return room;
      });

      // Sort rooms after updating
      return sortRoomsByLatestMessage(updatedRooms);
    });
  }, []); // No dependencies to keep it stable

  const getUsersToChatWith = useCallback(async (role) => {
    try {
      const users = await userService.getAllUsers(role);
      const userData = users.data?.users;
      console.log("Fetched users:", userData);

      if (userData && Array.isArray(userData)) {
        const filteredUsers = userData.filter((u) => u._id !== user?._id);
        setChatUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [user?._id]);

  // Separate ref to track if we've initially loaded rooms
  const hasInitiallyLoadedRooms = useRef(false);

  useEffect(() => {
    if (user && user._id && !hasInitiallyLoadedRooms.current) {
      hasInitiallyLoadedRooms.current = true;
      
      // Load rooms and select first one during initial load
      loadRooms(true);
      
      switch (user?.role) {
        case "Nurse":
          getUsersToChatWith("Parent");
          break;
        case "Parent":
          getUsersToChatWith("Nurse");
          break;
        default:
          console.warn("Unsupported user role:", user?.role);
          setError("Unsupported user role for chat");
          return;
      }
    }

    return () => {
      if (!user?._id) {
        hasInitiallyLoadedRooms.current = false;
        setRooms([]);
        setSelectedRoom(null);
      }
    };
  }, [user, loadRooms, getUsersToChatWith]);

  useEffect(() => {
    console.log("Selected room changed:", selectedRoom);
    
    if (selectedRoom?.roomId && selectedRoom?.senderId && selectedRoom?.receiverId) {
      const roomId = selectedRoom.roomId;
      const senderId = selectedRoom.senderId._id || selectedRoom.senderId;
      const receiverId = selectedRoom.receiverId._id || selectedRoom.receiverId;
      
      socket.emit("joinRoom", senderId, receiverId);
      
      const handleReceiveMessage = (message) => {
        if (message.roomId === roomId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }

        updateRoomLastMessage(message);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.emit("leaveRoom", roomId);
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [selectedRoom, updateRoomLastMessage]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);

    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r
      )
    );
  };

  const handleNewChatClick = () => {
    setIsNewChatModalOpen(true);
  };

  const handleNewChatClose = () => {
    setIsNewChatModalOpen(false);
  };

  const handleRoomCreated = async ({ roomId, isNew, room, participant }) => {
    try {
      // Refresh rooms to get the latest data (don't auto-select first room)
      const updatedRooms = await loadRooms(false);

      // Show success message
      setSuccessMessage(
        isNew
          ? `Đã tạo cuộc trò chuyện mới với ${participant.username}`
          : `Đã mở cuộc trò chuyện với ${participant.username}`
      );

      // Find and select the new/existing room
      const targetRoom = updatedRooms.find(r => r.roomId === roomId) || {
        roomId,
        senderId: room.senderId,
        receiverId: room.receiverId,
        lastMessage: room,
        currentUserId: user._id,
        unreadCount: 0,
        isOnline: true,
        type: "direct"
      };

      setSelectedRoom(targetRoom);

      // Join the socket room
      if (room.senderId && room.receiverId) {
        socket.emit("joinRoom", room.senderId._id || room.senderId, room.receiverId._id || room.receiverId);
      }

    } catch (error) {
      console.error("Error handling room creation:", error);
      setError("Có lỗi xảy ra khi tạo cuộc trò chuyện");
    }
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
          activeRoomId={selectedRoom?.roomId}
          onRoomSelect={handleRoomSelect}
          currentUser={user}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          chatUsers={chatUsers}
          setChatUsers={setChatUsers}
          onNewChatClick={handleNewChatClick}
        />

        {/* Chat Section */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatSection
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            selectedRoom={selectedRoom}
            onMessageSent={updateRoomLastMessage}
          />
        </Box>
      </Paper>

      {/* New Chat Modal */}
      <NewChatModal
        open={isNewChatModalOpen}
        onClose={handleNewChatClose}
        onRoomCreated={handleRoomCreated}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
