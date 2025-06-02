import React, { useState } from 'react';

const Notification = () => {
    // Sample notification data (20 items)
    const notifications = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        title: `Thông báo ${index + 1}`,
        message: `Đây là nội dung thông báo số ${index + 1}. Vui lòng kiểm tra chi tiết.`,
        timestamp: new Date(Date.now() - index * 3600000).toLocaleString('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
        }),
    }));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;
    const totalPages = Math.ceil(notifications.length / notificationsPerPage);

    // Get current page notifications
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle previous/next page
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Thông báo</h2>
            <div className="space-y-4">
                {currentNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200"
                    >
                        <h3 className="text-lg font-medium text-gray-800">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-secondary text-white hover:bg-secondary/80'
                    } transition duration-200`}
                >
                    Trước
                </button>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === index + 1
                                    ? 'bg-secondary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition duration-200`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-secondary text-white hover:bg-secondary/80'
                    } transition duration-200`}
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default Notification;