import React, { useState, useEffect, Fragment } from "react";
import {
  getAllPartners,
  createPartner,
  getPartnerById,
  updatePartner,
  updatePartnerStatus,
  addPartnerStaff,
  deletePartnerStaff,
  replacePartnerManager,
} from "../../../libs/api/adminService";
import { Dialog, Transition } from "@headlessui/react";
import { PlusCircle, CheckCircle, AlertCircle, X } from "lucide-react";

// Custom Dialog Component
const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  disablePrimaryButton,
  icon,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {icon && <div className="my-4">{icon}</div>}

                <div className="mt-2">{children}</div>

                <div className="mt-6 flex justify-end space-x-3">
                  {secondaryButtonText && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      onClick={onSecondaryButtonClick}
                    >
                      {secondaryButtonText}
                    </button>
                  )}
                  {primaryButtonText && (
                    <button
                      type="button"
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        disablePrimaryButton
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={onPrimaryButtonClick}
                      disabled={disablePrimaryButton}
                    >
                      {primaryButtonText}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Partner List Component
const PartnerList = ({
  partners,
  pagination,
  handlePageChange,
  onViewDetail,
  onEdit,
  onToggleStatus,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Danh sách đối tác</h2>
      <button
        onClick={() => onEdit(null)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <PlusCircle size={20} />
        Thêm đối tác
      </button>
    </div>
    {partners.length === 0 ? (
      <p>Không tìm thấy đối tác nào.</p>
    ) : (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Tên đối tác</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Điện thoại</th>
                <th className="py-2 px-4 text-left">Loại</th>
                <th className="py-2 px-4 text-left">Trạng thái</th>
                <th className="py-2 px-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {" "}
              {partners.map((partner) => (
                <tr key={partner._id} className="border-b">
                  <td className="py-2 px-4">{partner.name}</td>
                  <td className="py-2 px-4">{partner.email}</td>
                  <td className="py-2 px-4">{partner.phone}</td>
                  <td className="py-2 px-4">{partner.type}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        partner.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {partner.isActive ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {" "}
                    <button
                      onClick={() => {
                        onViewDetail(partner._id);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => onEdit(partner)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() =>
                        onToggleStatus(partner._id, partner.isActive)
                      }
                      className={
                        partner.isActive
                          ? "text-red-600 hover:text-red-800"
                          : "text-green-600 hover:text-green-800"
                      }
                    >
                      {partner.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div>
            Hiển thị {partners.length} / {pagination.totalPartners} đối tác
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);

// Partner Detail Component
const PartnerDetail = ({
  partner,
  onAddStaff,
  onReplaceManager,
  onDeleteStaff,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Thông tin đối tác</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div>
        <p className="text-gray-500">Tên đối tác</p>
        <p className="font-medium">{partner.name}</p>
      </div>
      <div>
        <p className="text-gray-500">Email</p>
        <p className="font-medium">{partner.email}</p>
      </div>
      <div>
        <p className="text-gray-500">Điện thoại</p>
        <p className="font-medium">{partner.phone}</p>
      </div>
      <div>
        <p className="text-gray-500">Loại đối tác</p>
        <p className="font-medium">{partner.type}</p>
      </div>
      <div>
        <p className="text-gray-500">Website</p>
        <p className="font-medium">
          {partner.website ? (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {partner.website}
            </a>
          ) : (
            "-"
          )}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Trạng thái</p>
        <p className="font-medium">
          <span
            className={`px-2 py-1 rounded text-xs ${
              partner.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {partner.isActive ? "Hoạt động" : "Tạm ngưng"}
          </span>
        </p>
      </div>
      <div className="md:col-span-2">
        <p className="text-gray-500">Địa chỉ</p>
        <p className="font-medium">{partner.address}</p>
      </div>
      <div className="md:col-span-2">
        <p className="text-gray-500">Mô tả</p>
        <p className="font-medium">{partner.description || "-"}</p>
      </div>
    </div>

    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quản lý</h3>
        <button
          onClick={onReplaceManager}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Thay đổi quản lý
        </button>
      </div>
      {partner.managerInfo ? (
        <div className="p-4 border rounded-lg">
          <p>
            <span className="font-medium">Họ và tên:</span>{" "}
            {partner.managerInfo.fullName}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {partner.managerInfo.email}
          </p>
          <p>
            <span className="font-medium">Điện thoại:</span>{" "}
            {partner.managerInfo.phone || "-"}
          </p>
        </div>
      ) : (
        <p>Chưa có quản lý được phân công.</p>
      )}
    </div>

    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Nhân viên</h3>
        <button
          onClick={onAddStaff}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Thêm nhân viên
        </button>
      </div>
      {partner.staffMembers?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Họ và tên</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Điện thoại</th>
                <th className="py-2 px-4 text-left">Vị trí</th>
                <th className="py-2 px-4 text-left">Trạng thái</th>
                <th className="py-2 px-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {partner.staffMembers.map((staff) => (
                <tr key={staff._id} className="border-b">
                  <td className="py-2 px-4">{staff.fullName}</td>
                  <td className="py-2 px-4">{staff.email || "-"}</td>
                  <td className="py-2 px-4">{staff.phone || "-"}</td>
                  <td className="py-2 px-4">{staff.position || "-"}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        staff.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {staff.isActive ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => onDeleteStaff(staff._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Chưa có nhân viên.</p>
      )}
    </div>
  </div>
);

// Partner Form Dialog
const PartnerFormDialog = ({ isOpen, onClose, partner, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    organization: {
      name: partner?.name || "",
      email: partner?.email || "",
      phone: partner?.phone || "",
      address: partner?.address || "",
      description: partner?.description || "",
      website: partner?.website || "",
      type: partner?.type || "CLINIC",
      isActive: partner?.isActive !== undefined ? partner.isActive : true,
    },
    managerInfo: {
      fullName: partner?.managerInfo?.fullName || "",
      email: partner?.managerInfo?.email || "",
      phone: partner?.managerInfo?.phone || "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Check if the field belongs to organization or managerInfo
    if (name.startsWith("manager.")) {
      const managerField = name.replace("manager.", "");
      setFormData({
        ...formData,
        managerInfo: {
          ...formData.managerInfo,
          [managerField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        organization: {
          ...formData.organization,
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={partner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
      disablePrimaryButton={loading}
      primaryButtonText={partner ? "Cập nhật" : "Thêm mới"}
      onPrimaryButtonClick={handleSubmit}
      secondaryButtonText="Hủy"
      onSecondaryButtonClick={onClose}
    >
      {" "}
      <form onSubmit={handleSubmit} className="text-left space-y-4">
        <h4 className="font-medium text-gray-800 mb-1">Thông tin đối tác</h4>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Tên đối tác
          </label>
          <input
            type="text"
            name="name"
            value={formData.organization.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.organization.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.organization.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.organization.website}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Loại đối tác
          </label>
          <select
            name="type"
            value={formData.organization.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="CLINIC">Phòng khám</option>
            <option value="HEALTH_CENTER">Trung tâm y tế</option>
            <option value="HOSPITAL">Bệnh viện</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.organization.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.organization.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <h4 className="font-medium text-gray-800 mb-1 mt-4">
          Thông tin quản lý
        </h4>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Họ và tên
          </label>
          <input
            type="text"
            name="manager.fullName"
            value={formData.managerInfo.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="manager.email"
            value={formData.managerInfo.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Điện thoại
          </label>
          <input
            type="text"
            name="manager.phone"
            value={formData.managerInfo.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
    </CustomDialog>
  );
};

// Staff Form Dialog
const StaffFormDialog = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm nhân viên"
      disablePrimaryButton={loading}
      primaryButtonText="Thêm mới"
      onPrimaryButtonClick={handleSubmit}
      secondaryButtonText="Hủy"
      onSecondaryButtonClick={onClose}
    >
      <form onSubmit={handleSubmit} className="text-left space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Vị trí
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
    </CustomDialog>
  );
};

// Manager Form Dialog
const ManagerFormDialog = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Thay đổi quản lý"
      disablePrimaryButton={loading}
      primaryButtonText="Cập nhật"
      onPrimaryButtonClick={handleSubmit}
      secondaryButtonText="Hủy"
      onSecondaryButtonClick={onClose}
    >
      <form onSubmit={handleSubmit} className="text-left space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
      </form>
    </CustomDialog>
  );
};

// Confirmation Dialog
const ConfirmationDialog = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  loading,
  primaryButtonText,
}) => (
  <CustomDialog
    isOpen={isOpen}
    onClose={onClose}
    title="Xác nhận"
    primaryButtonText={
      loading ? "Đang xử lý..." : primaryButtonText || "Xác nhận"
    }
    onPrimaryButtonClick={onConfirm}
    secondaryButtonText="Hủy"
    onSecondaryButtonClick={onClose}
    disablePrimaryButton={loading}
    icon={<AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />}
  >
    <div className="text-center py-2">
      <p className="text-gray-700">{message}</p>
    </div>
  </CustomDialog>
);

// Main Partner Management Component
const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPartners: 0,
  });
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({
    show: false,
    message: "",
    onConfirm: null,
    primaryButtonText: "",
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPartners();
  }, [pagination.currentPage]);
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getAllPartners({
        page: pagination.currentPage,
        limit: 10,
      });
      setPartners(data.partners || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.pages || 1,
        totalPartners: data.total || 0,
      });
      setError("");
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError("Không thể tải danh sách đối tác.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerDetail = async (partnerId) => {
    try {
      setLoading(true);
      const data = await getPartnerById(partnerId);
      setSelectedPartner(data);
      setError("");
    } catch (err) {
      console.error("Error fetching partner details:", err);
      setError("Không thể tải thông tin chi tiết đối tác.");
    } finally {
      setLoading(false);
    }
  };
  const handlePartnerSubmit = async (formData) => {
    try {
      setLoading(true);
      if (selectedPartner) {
        // For updating, we need to keep the structure as expected by the API
        const updateData = {
          name: formData.organization.name,
          email: formData.organization.email,
          phone: formData.organization.phone,
          address: formData.organization.address,
          description: formData.organization.description,
          website: formData.organization.website,
          type: formData.organization.type,
          isActive: formData.organization.isActive,
        };
        await updatePartner(selectedPartner._id, updateData);
        setSuccessMessage("Cập nhật đối tác thành công!");
      } else {
        // For creating a new partner, use the nested structure
        await createPartner(formData);
        setSuccessMessage("Thêm đối tác mới thành công!");
      }
      setShowPartnerForm(false);
      setSelectedPartner(null);
      fetchPartners();
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error saving partner:", err);
      setError("Không thể lưu thông tin đối tác.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddStaff = async (formData) => {
    try {
      setLoading(true);
      // The staffData is already in the correct format: {fullName, position, etc}
      await addPartnerStaff(selectedPartner._id, formData);
      fetchPartnerDetail(selectedPartner._id);
      setShowStaffForm(false);
      setSuccessMessage("Thêm nhân viên thành công!");
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error adding staff:", err);
      setError("Không thể thêm nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceManager = async (formData) => {
    try {
      setLoading(true);
      await replacePartnerManager(selectedPartner._id, formData);
      fetchPartnerDetail(selectedPartner._id);
      setShowManagerForm(false);
      setSuccessMessage("Thay đổi quản lý thành công!");
      setSuccessDialogOpen(true);
    } catch (err) {
      setError("Không thể thay đổi quản lý.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      setLoading(true);
      await deletePartnerStaff(selectedPartner._id, staffId);
      fetchPartnerDetail(selectedPartner._id);
      setSuccessMessage("Xóa nhân viên thành công!");
      setSuccessDialogOpen(true);
    } catch (err) {
      setError("Không thể xóa nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (partnerId, isActive) => {
    try {
      setLoading(true);
      await updatePartnerStatus(partnerId, { isActive: !isActive });
      fetchPartners();
      if (selectedPartner && selectedPartner._id === partnerId) {
        fetchPartnerDetail(partnerId);
      }
      setSuccessMessage(
        `Đã ${isActive ? "vô hiệu hóa" : "kích hoạt"} đối tác thành công!`
      );
      setSuccessDialogOpen(true);
    } catch (err) {
      setError("Không thể cập nhật trạng thái đối tác.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const openConfirmationDialog = (message, onConfirm, primaryButtonText) => {
    setConfirmationDialog({
      show: true,
      message,
      onConfirm,
      primaryButtonText,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý đối tác</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {loading && !partners.length && !selectedPartner && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!selectedPartner ? (
        <PartnerList
          partners={partners}
          pagination={pagination}
          handlePageChange={handlePageChange}
          onViewDetail={(id) => {
            fetchPartnerDetail(id);
          }}
          onEdit={(partner) => {
            setSelectedPartner(partner);
            setShowPartnerForm(true);
          }}
          onToggleStatus={(id, isActive) =>
            openConfirmationDialog(
              `Bạn có chắc chắn muốn ${
                isActive ? "vô hiệu hóa" : "kích hoạt"
              } đối tác này không?`,
              () => handleToggleStatus(id, isActive),
              isActive ? "Vô hiệu hóa" : "Kích hoạt"
            )
          }
        />
      ) : (
        <div>
          <button
            onClick={() => setSelectedPartner(null)}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Quay lại danh sách
          </button>
          <PartnerDetail
            partner={selectedPartner}
            onAddStaff={() => setShowStaffForm(true)}
            onReplaceManager={() => setShowManagerForm(true)}
            onDeleteStaff={(staffId) =>
              openConfirmationDialog(
                "Bạn có chắc chắn muốn xóa nhân viên này không?",
                () => handleDeleteStaff(staffId),
                "Xóa"
              )
            }
          />
        </div>
      )}
      <PartnerFormDialog
        isOpen={showPartnerForm}
        onClose={() => {
          setShowPartnerForm(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onSubmit={handlePartnerSubmit}
        loading={loading}
      />
      <StaffFormDialog
        isOpen={showStaffForm}
        onClose={() => setShowStaffForm(false)}
        onSubmit={handleAddStaff}
        loading={loading}
      />
      <ManagerFormDialog
        isOpen={showManagerForm}
        onClose={() => setShowManagerForm(false)}
        onSubmit={handleReplaceManager}
        loading={loading}
      />{" "}
      <ConfirmationDialog
        isOpen={confirmationDialog.show}
        onClose={() =>
          setConfirmationDialog({ show: false, message: "", onConfirm: null })
        }
        message={confirmationDialog.message}
        onConfirm={confirmationDialog.onConfirm}
        loading={loading}
        primaryButtonText={confirmationDialog.primaryButtonText}
      />{" "}
      <CustomDialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="Thành công"
        icon={<CheckCircle className="w-16 h-16 text-green-500 mx-auto" />}
        primaryButtonText="Đóng"
        onPrimaryButtonClick={() => setSuccessDialogOpen(false)}
      >
        <div className="text-center py-2">
          <p className="text-gray-700">{successMessage}</p>
        </div>
      </CustomDialog>
    </div>
  );
};

export default PartnerManagement;
