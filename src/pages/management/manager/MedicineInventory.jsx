import React, { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";

const mockInventory = [
    {
        id: 1,
        item_name: "Paracetamol",
        quantity_total: 200,
        low_stock_threshold: 50,
        status: "Còn hàng",
        detail: [
            {
                id: 1,
                quantity: 100,
                expiration_date: "2025-01-01",
                created_at: "2024-01-01",
                updated_at: "2024-05-01",
            },
            {
                id: 2,
                quantity: 100,
                expiration_date: "2024-10-01",
                created_at: "2023-12-01",
                updated_at: "2024-01-01",
            },
        ],
    },
    {
        id: 2,
        item_name: "Amoxicillin",
        quantity_total: 40,
        low_stock_threshold: 30,
        status: "Sắp hết",
        detail: [
            {
                id: 1,
                quantity: 40,
                expiration_date: "2024-12-01",
                created_at: "2024-02-01",
                updated_at: "2024-03-01",
            },
        ],
    },
];

const MedicineInventory = () => {
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#4157ff] mb-6">Danh sách thuốc</h1>

            {/* Bảng cho desktop */}
            <div className="hidden md:block overflow-x-auto border border-gray-300 rounded-lg bg-white shadow">
                <table className="w-full table-auto min-w-[700px]">
                    <thead className="bg-[#4157ff] text-white">
                        <tr>
                            <th className="p-3 text-left whitespace-nowrap">Tên thuốc</th>
                            <th className="p-3 text-left whitespace-nowrap">Tổng số lượng</th>
                            <th className="p-3 text-left whitespace-nowrap">Ngưỡng cảnh báo</th>
                            <th className="p-3 text-left whitespace-nowrap">Trạng thái</th>
                            <th className="p-3 text-center whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInventory.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 border-b border-gray-200"
                            >
                                <td className="p-3">{item.item_name}</td>
                                <td className="p-3">{item.quantity_total}</td>
                                <td className="p-3">{item.low_stock_threshold}</td>
                                <td className="p-3">{item.status}</td>
                                <td className="p-3 text-center flex justify-center gap-3">
                                    <button
                                        className="text-[#4157ff] hover:text-blue-700"
                                        onClick={() => setSelectedMedicine(item)}
                                        aria-label={`Xem chi tiết ${item.item_name}`}
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="text-green-500 hover:text-green-700"
                                        aria-label={`Sửa ${item.item_name}`}
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        aria-label={`Xóa ${item.item_name}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card layout cho mobile */}
            <div className="md:hidden space-y-4">
                {mockInventory.map((item) => (
                    <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow">
                        <h2 className="text-lg font-semibold text-[#4157ff] mb-2">{item.item_name}</h2>
                        <div className="text-sm space-y-1">
                            <div><strong>Tổng số lượng:</strong> {item.quantity_total}</div>
                            <div><strong>Ngưỡng cảnh báo:</strong> {item.low_stock_threshold}</div>
                            <div><strong>Trạng thái:</strong> {item.status}</div>
                        </div>
                        <div className="flex justify-end gap-3 mt-3">
                            <button
                                className="text-[#4157ff] hover:text-blue-700"
                                onClick={() => setSelectedMedicine(item)}
                                aria-label={`Xem chi tiết ${item.item_name}`}
                            >
                                <Eye size={18} />
                            </button>
                            <button className="text-green-500 hover:text-green-700">
                                <Pencil size={18} />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedMedicine && (
                <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg relative overflow-auto max-h-[80vh]">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedMedicine(null)}
                            aria-label="Đóng chi tiết thuốc"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-[#4157ff] mb-4">
                            Chi tiết lô thuốc: {selectedMedicine.item_name}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto min-w-[500px]">
                                <thead className="bg-[#4157ff] text-white">
                                    <tr>
                                        <th className="p-3 text-left whitespace-nowrap">Hạn sử dụng</th>
                                        <th className="p-3 text-left whitespace-nowrap">Số lượng</th>
                                        <th className="p-3 text-left whitespace-nowrap">Ngày tạo</th>
                                        <th className="p-3 text-left whitespace-nowrap">Cập nhật</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedMedicine.detail.map((d) => (
                                        <tr
                                            key={d.id}
                                            className="hover:bg-gray-50 border-b border-gray-200"
                                        >
                                            <td className="p-3">{d.expiration_date}</td>
                                            <td className="p-3">{d.quantity}</td>
                                            <td className="p-3">{d.created_at}</td>
                                            <td className="p-3">{d.updated_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineInventory;
