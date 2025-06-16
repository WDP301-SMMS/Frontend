import React from "react";
import {
  CalendarCheck,
  ClipboardList,
  FilePlus,
  Users,
  AlertTriangle,
  Stethoscope,
  FileText,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simple Card component
const Card = ({ children }) => (
  <div className="rounded-lg border shadow-sm bg-white">{children}</div>
);

// CardContent wrapper
const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Simple Button component
const Button = ({ children, variant = "default", onClick }) => {
  const base = "px-4 py-2 text-sm rounded font-medium";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

const HealthCheck = () => {
  const navigate = useNavigate();

  const navigateToStudentHealthProfiles = () => {
    navigate("/management/health-profiles");
  };

  const navigateToCreateHealthProfile = () => {
    navigate("/management/health-profile/new");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Stethoscope className="w-6 h-6 text-green-600" /> Quản lý Kiểm tra Y tế
        Định kỳ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Hồ sơ sức khỏe học
              sinh
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Khai báo và quản lý thông tin sức khỏe, dị ứng, bệnh mãn tính và
              tiêm chủng của học sinh
            </p>
            <Button variant="outline" onClick={navigateToStudentHealthProfiles}>
              Xem hồ sơ sức khỏe
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Khai báo thông
              tin sức khỏe
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Phụ huynh khai báo thông tin sức khỏe, dị ứng, bệnh mãn tính và
              các vấn đề sức khỏe của con
            </p>
            <Button variant="outline" onClick={navigateToCreateHealthProfile}>
              Khai báo mới
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-blue-600" /> Tạo chiến dịch kiểm
              tra sức khỏe
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Lên kế hoạch và tổ chức chiến dịch kiểm tra sức khỏe định kỳ cho
              học sinh
            </p>
            <Button variant="outline">Tạo chiến dịch</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" /> Danh sách học sinh
              đi kiểm tra
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Quản lý danh sách học sinh tham gia kiểm tra sức khỏe định kỳ theo
              lớp
            </p>
            <Button variant="outline">Quản lý danh sách</Button>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-yellow-600" /> Gửi phiếu
              thông báo kiểm tra
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Thông báo cho phụ huynh về lịch kiểm tra sức khỏe và chuẩn bị cần
              thiết
            </p>
            <Button variant="outline">Gửi phiếu</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-600" /> Ghi nhận
              kết quả kiểm tra
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Nhập và lưu trữ kết quả kiểm tra sức khỏe của học sinh sau khi
              kiểm tra
            </p>
            <Button variant="outline">Ghi nhận kết quả</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Trường hợp bất
              thường
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Quản lý và theo dõi các trường hợp bất thường phát hiện trong quá
              trình kiểm tra
            </p>
            <Button variant="outline">Tạo thông báo cuộc họp</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-orange-600" /> Phản hồi từ
              phụ huynh
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Xem và quản lý các phản hồi từ phụ huynh về kết quả kiểm tra sức
              khỏe
            </p>
            <Button variant="outline">Xem phản hồi</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheck;
