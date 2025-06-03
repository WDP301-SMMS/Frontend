import React from 'react';
import { CalendarCheck, ClipboardList, FilePlus, Users, AlertTriangle, Stethoscope } from 'lucide-react';

// Simple Card component
const Card = ({ children }) => (
    <div className="rounded-lg border shadow-sm bg-white">{children}</div>
);

// CardContent wrapper
const CardContent = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>{children}</div>
);

// Simple Button component
const Button = ({ children, variant = 'default' }) => {
    const base = 'px-4 py-2 text-sm rounded font-medium';
    const styles = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    };
    return <button className={`${base} ${styles[variant]}`}>{children}</button>;
};

const HealthCheck = () => {
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-green-600" /> Quản lý Kiểm tra Y tế Định kỳ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FilePlus className="w-5 h-5 text-blue-600" /> Tạo chiến dịch kiểm tra sức khỏe
                        </h3>
                        <Button variant="outline">Tạo chiến dịch</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-violet-600" /> Danh sách học sinh đi kiểm tra
                        </h3>
                        <Button variant="outline">Quản lý danh sách</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-yellow-600" /> Gửi phiếu thông báo kiểm tra
                        </h3>
                        <Button variant="outline">Gửi phiếu</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-emerald-600" /> Ghi nhận kết quả kiểm tra
                        </h3>
                        <Button variant="outline">Ghi nhận kết quả</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" /> Trường hợp bất thường
                        </h3>
                        <Button variant="outline">Tạo thông báo cuộc họp</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-orange-600" /> Phản hồi từ phụ huynh
                        </h3>
                        <Button variant="outline">Xem phản hồi</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HealthCheck;
