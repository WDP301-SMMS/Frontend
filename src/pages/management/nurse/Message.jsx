import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// Sample conversation data
const initialConversations = [
  {
    id: 1,
    name: 'John Smith',
    lastMessage: 'Mình đang làm việc với dự án mới.',
    timestamp: new Date(Date.now() - 3400000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    messages: [
      {
        id: 1,
        sender: 'John Smith',
        content: 'Xin chào, bạn khỏe không?',
        timestamp: new Date(Date.now() - 3600000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
        file: null,
      },
      {
        id: 2,
        sender: 'Other User',
        content: 'Khỏe, cảm ơn! Còn bạn?',
        timestamp: new Date(Date.now() - 3500000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
        file: { name: 'document.pdf', url: '#', type: 'application/pdf' },
      },
      {
        id: 3,
        sender: 'John Smith',
        content: 'Mình đang làm việc với dự án mới. Đây là file tài liệu.',
        timestamp: new Date(Date.now() - 3400000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
        file: { name: 'project.docx', url: '#', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Doe',
    lastMessage: 'Bạn có kế hoạch gì cuối tuần này không?',
    timestamp: new Date(Date.now() - 7200000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    messages: [
      {
        id: 1,
        sender: 'Jane Doe',
        content: 'Chào bạn, lâu rồi không gặp!',
        timestamp: new Date(Date.now() - 7200000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
        file: null,
      },
      {
        id: 2,
        sender: 'John Smith',
        content: 'Chào Jane, đúng là lâu rồi! Bạn khỏe không?',
        timestamp: new Date(Date.now() - 7100000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
        file: null,
      },
    ],
  },
];

const Message = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Get the selected conversation
  const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachedFile) return;

    const newMsg = {
      id: selectedConversation.messages.length + 1,
      sender: 'John Smith',
      content: newMessage,
      timestamp: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      file: attachedFile ? { name: attachedFile.name, url: '#', type: attachedFile.type } : null,
    };

    // Update conversations with the new message
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              lastMessage: newMessage || 'Đã gửi một tệp',
              timestamp: newMsg.timestamp,
            }
          : conv
      )
    );
    setNewMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachedFile(file || null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen p-6 mx-auto rounded-lg shadow-md">
      {/* Conversation List (Sidebar) */}
      <div className="w-1/3 border-r border-gray-200 pr-4 mr-4 overflow-y-auto sm:w-1/4 md:w-1/5">
        <h2 className="text-lg font-semibold mb-4">Cuộc trò chuyện</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversationId(conversation.id)}
            className={`p-3 mb-2 rounded-md cursor-pointer ${
              selectedConversationId === conversation.id
                ? 'bg-secondary/20 text-secondary'
                : 'hover:bg-gray-100'
            }`}
            aria-label={`Chọn cuộc trò chuyện với ${conversation.name}`}
          >
            <p className="font-medium">{conversation.name}</p>
            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
            <p className="text-xs text-gray-400">{conversation.timestamp}</p>
          </div>
        ))}
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-md">
          {selectedConversation ? (
            selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'John Smith' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
                    message.sender === 'John Smith' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm font-medium">{message.sender}</p>
                  <p className="text-sm">{message.content}</p>
                  {message.file && (
                    <a
                      href={message.file.url}
                      download
                      className="text-xs underline mt-1 block hover:text-secondary/80"
                      aria-label={`Tải xuống tệp ${message.file.name}`}
                    >
                      {message.file.name}
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chọn một cuộc trò chuyện để xem tin nhắn.</p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full p-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm text-gray-700 placeholder-gray-400 resize-none h-12"
              aria-label="Nhập tin nhắn"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-secondary transition"
              aria-label="Đính kèm tệp"
            >
              <FontAwesomeIcon icon={faPaperclip} className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-secondary text-white rounded-md hover:bg-secondary/80 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!newMessage.trim() && !attachedFile}
            aria-label="Gửi tin nhắn"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
          </button>
        </div>
        {attachedFile && (
          <p className="text-sm text-gray-600 mt-2">
            Tệp đính kèm: {attachedFile.name}
            <button
              onClick={() => {
                setAttachedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label="Xóa tệp đính kèm"
            >
              Xóa
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;