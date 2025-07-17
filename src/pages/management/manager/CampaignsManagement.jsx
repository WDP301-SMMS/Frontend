import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocalHospital as VaccineIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  Calendar,
  FileText,
  MapPin,
  Plus,
  Save,
  School,
  Search,
  Shield,
  Syringe,
  User,
  X,
} from "lucide-react";

import campaignService from "~/libs/api/services/campaignService";
import partnerService from "~/libs/api/services/partnerService";
import { userService } from "~/libs/api";

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [partners, setPartners] = useState([]);
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    vaccineName: "",
    doseNumber: 1,
    partnerId: "",
    targetGradeLevels: [],
    startDate: "",
    endDate: "",
    description: "",
    schoolYear: "2024-2025",
    actualStartDate: "",
    destination: "",
    createdBy: "",
  });

  const [errors, setErrors] = useState({});

  // Get current date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split("T")[0];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const campaignResponse = await campaignService.getListCampaign({
          page: 1,
          limit: 50,
          status: "",
          schoolYear: "2024-2025",
        });
        if (campaignResponse.success) {
          setCampaigns(campaignResponse.data);
        }

        const partnerResponse = await partnerService.getListPartner({ page: 1, limit: 10 });
        if (partnerResponse.data) {
          setPartners(partnerResponse.data.partners);
        }

        const profileResponse = await userService.getProfile();
        if (profileResponse.success && profileResponse.data.success) {
          const profileData = profileResponse.data.data;
          setProfile(profileData);
          setFormData((prev) => ({
            ...prev,
            createdBy: profileData._id,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setSnackbar({
          open: true,
          message: "Lỗi khi tải dữ liệu ban đầu.",
          severity: "error",
        });
      }
    };
    fetchInitialData();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [campaigns, searchTerm]);

  const paginatedCampaigns = useMemo(() => {
    return filteredCampaigns.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredCampaigns, page, rowsPerPage]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên chiến dịch là bắt buộc";
    }

    if (!formData.vaccineName.trim()) {
      newErrors.vaccineName = "Tên vắc xin là bắt buộc";
    }

    if (formData.targetGradeLevels.length === 0) {
      newErrors.targetGradeLevels = "Phải chọn ít nhất một khối học sinh";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    } else if (formData.startDate < today) {
      newErrors.startDate = "Ngày bắt đầu không được ở quá khứ";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    } else if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Địa điểm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      // Set actualStartDate to startDate by default when startDate changes
      if (name === "startDate" && !newFormData.actualStartDate) {
        newFormData.actualStartDate = value;
      }
      return newFormData;
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGradeLevelChange = (level) => {
    setFormData((prev) => ({
      ...prev,
      targetGradeLevels: prev.targetGradeLevels.includes(level)
        ? prev.targetGradeLevels.filter((l) => l !== level)
        : [...prev.targetGradeLevels, level],
    }));

    if (errors.targetGradeLevels) {
      setErrors((prev) => ({
        ...prev,
        targetGradeLevels: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const campaignData = {
        ...formData,
        startDate: `${formData.startDate}T00:00:00.000Z`,
        endDate: `${formData.endDate}T23:59:59.000Z`,
        actualStartDate: formData.actualStartDate
          ? `${formData.actualStartDate}T00:00:00.000Z`
          : undefined,
      };

      if (editingCampaign) {
        const response = await campaignService.updateCampaign(
          editingCampaign._id,
          campaignData
        );
        if (response.success) {
          setCampaigns((prev) =>
            prev.map((c) =>
              c.id === editingCampaign.id ? { ...c, ...campaignData } : c
            )
          );
          setSnackbar({
            open: true,
            message: "Cập nhật chiến dịch thành công!",
            severity: "success",
          });
        }
      } else {
        const response = await campaignService.createVaccinationCampaigns(campaignData);
        if (response.success) {
          setCampaigns((prev) => [
            { id: Date.now(), ...campaignData, createdAt: new Date().toISOString(), status: "DRAFT" },
            ...prev,
          ]);
          setSnackbar({
            open: true,
            message: "Tạo chiến dịch thành công!",
            severity: "success",
          });
        }
      }
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tạo/cập nhật chiến dịch.",
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      vaccineName: "",
      doseNumber: 1,
      partnerId: "",
      targetGradeLevels: [],
      startDate: "",
      endDate: "",
      description: "",
      schoolYear: "2024-2025",
      actualStartDate: "",
      destination: "",
      createdBy: profile?._id || "",
    });
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCampaign(null);
    resetForm();
  };

  const handleEdit = async (campaign) => {
    try {
      const response = await campaignService.getCampaign(campaign._id);
      if (response.success) {
        const campaignData = response.data;
        setFormData({
          name: campaignData.name,
          vaccineName: campaignData.vaccineName,
          doseNumber: campaignData.doseNumber,
          partnerId: campaignData.partnerId?._id || "",
          targetGradeLevels: campaignData.targetGradeLevels,
          startDate: campaignData.startDate.split("T")[0],
          endDate: campaignData.endDate.split("T")[0],
          description: campaignData.description,
          schoolYear: campaignData.schoolYear,
          actualStartDate: campaignData.actualStartDate
            ? campaignData.actualStartDate.split("T")[0]
            : campaignData.startDate.split("T")[0],
          destination: campaignData.destination,
          createdBy: campaignData.createdBy?._id || "",
        });
        setEditingCampaign(campaign);
        setOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải thông tin chiến dịch.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (campaign) => {
    setSelectedCampaign(campaign);
    setCancellationReason("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCampaign(null);
    setCancellationReason("");
  };

  const handleDelete = async () => {
    if (!selectedCampaign || !cancellationReason.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập lý do hủy chiến dịch.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await campaignService.updateCampaignStatus(
        selectedCampaign._id,
        profile?._id,
        "CANCELED",
        cancellationReason
      );
      if (response.success) {
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === selectedCampaign.id
              ? { ...campaign, status: "CANCELED", cancellationReason }
              : campaign
          )
        );
        setSnackbar({
          open: true,
          message: "Hủy chiến dịch thành công!",
          severity: "success",
        });
        handleCloseDeleteDialog();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi hủy chiến dịch.",
        severity: "error",
      });
    }
  };

  const handleViewDetails = async (campaign) => {
    try {
      const response = await campaignService.getCampaign(campaign._id);
      if (response.success) {
        setSelectedCampaignDetails(response.data);
        setDetailsDialogOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải chi tiết chiến dịch.",
        severity: "error",
      });
    }
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedCampaignDetails(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      DRAFT: { label: "Đã lên kế hoạch", color: "primary" },
      COMPLETED: { label: "Hoàn thành", color: "default" },
      IN_PROGRESS: { label: "Đang tiến hành", color: "warning" },
      ANNOUNCED: { label: "Đã công bố", color: "info" },
      CANCELED: { label: "Đã hủy", color: "error" },
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="mx-auto">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full transform -translate-x-12 translate-y-12"></div>
          <div className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Syringe className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                  Quản Lý Chiến Dịch Tiêm Chủng
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Tạo và quản lý các chiến dịch tiêm chủng cho học sinh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm chiến dịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => setOpen(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo Chiến Dịch Mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>STT</strong>
                </TableCell>
                <TableCell>
                  <strong>Tên Chiến Dịch</strong>
                </TableCell>
                <TableCell>
                  <strong>Vắc xin</strong>
                </TableCell>
                <TableCell>
                  <strong>Khối</strong>
                </TableCell>
                <TableCell>
                  <strong>Thời gian</strong>
                </TableCell>
                <TableCell>
                  <strong>Địa điểm</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng thái</strong>
                </TableCell>
                <TableCell>
                  <strong>Thao tác</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCampaigns.map((campaign, index) => (
                <TableRow key={campaign.id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {campaign.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mũi {campaign.doseNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <VaccineIcon color="primary" fontSize="small" />
                      {campaign.vaccineName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon color="primary" fontSize="small" />
                      {campaign.targetGradeLevels.sort().join(", ")}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="body2">
                          {formatDate(campaign.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          đến {formatDate(campaign.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="primary" fontSize="small" />
                      {campaign.destination}
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(campaign.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewDetails(campaign)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {campaign.status !== "CANCELED" && (
                        <>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(campaign)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hủy">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(campaign)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredCampaigns.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {editingCampaign ? "Chỉnh Sửa Chiến Dịch" : "Tạo Chiến Dịch Mới"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="p-6 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className Applicants text-sm font-medium text-gray-700 mb-2>
                        Tên chiến dịch *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập tên chiến dịch"
                        required
                      />
                      {errors.name && (
                        <Typography color="error" variant="caption">
                          {errors.name}
                        </Typography>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên vắc xin *
                        </label>
                        <div className="relative">
                          <Syringe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="vaccineName"
                            value={formData.vaccineName}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Tên vắc xin"
                            required
                          />
                          {errors.vaccineName && (
                            <Typography color="error" variant="caption">
                              {errors.vaccineName}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số mũi
                        </label>
                        <select
                          name="doseNumber"
                          value={formData.doseNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>Mũi {num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin quản lý</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Partner ID
                      </label>
                      <select
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Chọn đối tác</option>
                        {partners.map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Created By
                      </label>
                      <input
                        type="text"
                        name="createdBy"
                        value={profile?.username || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled
                        placeholder="Manager"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <School className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Đối tượng mục tiêu</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Khối học sinh mục tiêu *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <label key={level} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.targetGradeLevels.includes(level)}
                            onChange={() => handleGradeLevelChange(level)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Khối {level}</span>
                        </label>
                      ))}
                    </div>
                    {errors.targetGradeLevels && (
                      <Typography color="error" variant="caption">
                        {errors.targetGradeLevels}
                      </Typography>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Thời gian và địa điểm</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày bắt đầu *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={today}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                      {errors.startDate && (
                        <Typography color="error" variant="caption">
                          {errors.startDate}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày kết thúc *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || today}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                      {errors.endDate && (
                        <Typography color="error" variant="caption">
                          {errors.endDate}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày bắt đầu thực tế
                      </label>
                      <input
                        type="date"
                        name="actualStartDate"
                        value={formData.actualStartDate}
                        onChange={handleInputChange}
                        min={formData.startDate || today}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Năm học
                      </label>
                      <input
                        type="text"
                        name="schoolYear"
                        value={formData.schoolYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="2024-2025"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa điểm *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập địa điểm thực hiện"
                        required
                      />
                      {errors.destination && (
                        <Typography color="error" variant="caption">
                          {errors.destination}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Mô tả chi tiết về chiến dịch..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingCampaign ? "Cập nhật" : "Tạo mới"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <div className="bg-white shadow-2xl w-full">
          <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Hủy Chiến Dịch</h2>
              </div>
              <button
                onClick={handleCloseDeleteDialog}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <Typography variant="body1" className="mb-4">
              Bạn có chắc chắn muốn hủy chiến dịch "{selectedCampaign?.name}"?
            </Typography>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy *
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Nhập lý do hủy chiến dịch..."
                required
              />
            </div>
          </div>
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <DeleteIcon className="w-5 h-5" />
                <span>Xác nhận hủy</span>
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <div className="bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Chi Tiết Chiến Dịch</h2>
              </div>
              <button
                onClick={handleCloseDetailsDialog}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="p-6 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên chiến dịch</label>
                    <Typography variant="body1">{selectedCampaignDetails?.name}</Typography>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên vắc xin</label>
                      <Typography variant="body1">{selectedCampaignDetails?.vaccineName}</Typography>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số mũi</label>
                      <Typography variant="body1">{selectedCampaignDetails?.doseNumber}</Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Thông tin quản lý</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đối tác</label>
                    <Typography variant="body1">{selectedCampaignDetails?.partnerId?.name || "Không có"}</Typography>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Người tạo</label>
                    <Typography variant="body1">{selectedCampaignDetails?.createdBy?.username || "Không có"}</Typography>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <School className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Đối tượng mục tiêu</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khối học sinh mục tiêu</label>
                  <Typography variant="body1">{selectedCampaignDetails?.targetGradeLevels.join(", ")}</Typography>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Thời gian và địa điểm</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <Typography variant="body1">{formatDate(selectedCampaignDetails?.startDate)}</Typography>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <Typography variant="body1">{formatDate(selectedCampaignDetails?.endDate)}</Typography>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu thực tế</label>
                    <Typography variant="body1">
                      {selectedCampaignDetails?.actualStartDate ? formatDate(selectedCampaignDetails.actualStartDate) : "Chưa có"}
                    </Typography>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <Typography variant="body1">{selectedCampaignDetails?.schoolYear}</Typography>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                  <Typography variant="body1">{selectedCampaignDetails?.destination}</Typography>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <Typography variant="body1">{selectedCampaignDetails?.description || "Không có mô tả"}</Typography>
                </div>
                {selectedCampaignDetails?.status === "CANCELED" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lý do hủy</label>
                    <Typography variant="body1">{selectedCampaignDetails?.cancellationReason || "Không có lý do"}</Typography>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseDetailsDialog}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignManager;