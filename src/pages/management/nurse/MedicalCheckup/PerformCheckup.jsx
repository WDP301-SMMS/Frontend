import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  Container,
  Avatar,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { CheckCircle, Download, Search, Eye } from "lucide-react";
import { utils, writeFile } from "xlsx";
import healthCheckCampaignService from "~/libs/api/services/healthCheckCampainService";
import healthCheckConsentService from "~/libs/api/services/healthCheckConsentService";
import healthCheckRecordService from "~/libs/api/services/healthCheckRecordService";
import healthCheckTemplateService from "~/libs/api/services/healthCheckTemplateService";
import { userService } from "~/libs/api";
import { Warning } from "@mui/icons-material";

const CheckupItemDataType = {
  NUMBER: "NUMBER",
  TEXT: "TEXT",
  BOOLEAN: "BOOLEAN",
  SELECT: "SELECT",
};

const PerformCheckup = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [checkupData, setCheckupData] = useState({});
  const [template, setTemplate] = useState(null);
  const [nurseId, setNurseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [latestRecord, setLatestRecord] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const itemsPerPage = 10;

  // Fetch nurse profile and campaigns on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch nurse profile
        const profileResponse = await userService.getProfile();
        if (profileResponse.success) {
          console.log("Nurse profile response:", profileResponse.data.data._id);
          setNurseId(profileResponse.data.data._id);
        } else {
          throw new Error(
            profileResponse.message || "Không thể lấy thông tin y tá."
          );
        }

        // Fetch campaigns
        const campaignResponse =
          await healthCheckCampaignService.getCampaignsByStatus("IN_PROGRESS");
        if (campaignResponse.success) {
          setCampaigns(campaignResponse.data.campaigns || []);
        } else {
          throw new Error(
            campaignResponse.message || "Không thể tải danh sách chiến dịch."
          );
        }
      } catch (error) {
        console.error("Initial data fetch error:", error);
        setAlert({ open: true, message: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchTemplate = async (templateId) => {
    try {
      console.log("Fetching template with ID:", templateId);
      const response =
        await healthCheckTemplateService.getHealthCheckTemplateById(templateId);
      if (response.success) {
        setTemplate(response.data);
        const initialData = response.data.checkupItems.reduce(
          (acc, item) => ({
            ...acc,
            [item.itemId]: {
              value: item.dataType === CheckupItemDataType.BOOLEAN ? false : "",
              isAbnormal: false,
              notes: "",
            },
          }),
          {
            notes: "",
            recommendations: "",
            overallConclusion: "",
            isAbnormal: false,
          }
        );
        setCheckupData(initialData);
      } else {
        throw new Error(
          response.message || "Không thể tải thông tin mẫu kiểm tra."
        );
      }
    } catch (error) {
      console.error(`Failed to fetch template with ID ${templateId}:`, error);
      setAlert({
        open: true,
        message: "Không thể tải thông tin mẫu kiểm tra.",
        type: "error",
      });
    }
  };

  const fetchStudents = async (campaignId) => {
    if (!campaignId) {
      setStudents([]);
      setTemplate(null);
      setCheckupData({});
      return;
    }
    try {
      setLoading(true);
      const response = await healthCheckConsentService.getConsentsByCampaignId(
        campaignId
      );
      if (response.success) {
        const campaign = campaigns.find((c) => c._id === campaignId);
        if (campaign?.templateId) {
          await fetchTemplate(campaign.templateId._id);
        }
        const approvedStudents = response.data.filter(
          (student) => student.status !== "PENDING"
        );
        console.log("Approved students:", approvedStudents);
        const mappedStudents = await Promise.all(
          approvedStudents.map(async (student) => {
            return {
              _id: student.studentId._id,
              name: student.studentId.fullName,
              className: student.classId.className,
              dateOfBirth:
                student.studentId.dateOfBirth || new Date().toISOString(),
              healthStatus: student.status, // Default status, updated on selection
            };
          })
        );
        setStudents(
          mappedStudents.sort((a, b) => {
            const classCompare = a.className.localeCompare(b.className, "vi");
            if (classCompare !== 0) return classCompare;
            return a.name.localeCompare(b.name, "vi");
          })
        );
      } else {
        throw new Error(
          response.message || "Không thể tải danh sách học sinh."
        );
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setAlert({
        open: true,
        message: "Không thể tải danh sách học sinh.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = async (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setClassFilter("");
    setStatusFilter("");
    setSearchQuery("");
    setCurrentPage(1);
    setCheckupData({});
    await fetchStudents(campaignId);
  };

  const handleClassChange = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStudentSelect = async (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setOpenDialog(true);
    try {
      setLoading(true);
      const record =
        await healthCheckRecordService.getLatestStudentHealthRecord(studentId);
      if (record?.data) {
        setLatestRecord(record.data);
        // Update student's health status
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s._id === studentId ? { ...s, healthStatus: record.data.status } : s
          )
        );
        const initialData = template?.checkupItems.reduce(
          (acc, item) => {
            const result =
              record.data.resultsData.find(
                (r) => r.itemName === item.itemName
              ) || {};
            return {
              ...acc,
              [item.itemId]: {
                value:
                  item.dataType === CheckupItemDataType.BOOLEAN
                    ? Boolean(result.value)
                    : String(result.value || ""),
                isAbnormal: Boolean(result.isAbnormal),
                notes: String(result.notes || ""),
              },
            };
          },
          {
            notes: String(record.data.notes || ""),
            recommendations: String(record.data.recommendations || ""),
            overallConclusion: String(record.data.overallConclusion || ""),
            isAbnormal: Boolean(record.data.isAbnormal),
          }
        ) || {
          notes: "",
          recommendations: "",
          overallConclusion: "",
          isAbnormal: false,
        };
        setCheckupData(initialData);
      } else {
        setLatestRecord(null);
        const initialData = template?.checkupItems.reduce(
          (acc, item) => ({
            ...acc,
            [item.itemId]: {
              value: item.dataType === CheckupItemDataType.BOOLEAN ? false : "",
              isAbnormal: false,
              notes: "",
            },
          }),
          {
            notes: "",
            recommendations: "",
            overallConclusion: "",
            isAbnormal: false,
          }
        ) || {
          notes: "",
          recommendations: "",
          overallConclusion: "",
          isAbnormal: false,
        };
        setCheckupData(initialData);
      }
    } catch (error) {
      setLatestRecord(null);
      const initialData = template?.checkupItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.itemId]: {
            value: item.dataType === CheckupItemDataType.BOOLEAN ? false : "",
            isAbnormal: false,
            notes: "",
          },
        }),
        {
          notes: "",
          recommendations: "",
          overallConclusion: "",
          isAbnormal: false,
        }
      ) || {
        notes: "",
        recommendations: "",
        overallConclusion: "",
        isAbnormal: false,
      };
      setCheckupData(initialData);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = async (studentId) => {
    try {
      setLoading(true);
      const record =
        await healthCheckRecordService.getLatestStudentHealthRecord(studentId);
      console.log("Fetched record:", record);
      const student = students.find((s) => s._id === studentId);
      setSelectedStudent(student);
      if (record?.data) {
        setLatestRecord(record.data);
        setOpenViewDialog(true);
      } else {
        setAlert({
          open: true,
          message: "Không tìm thấy kết quả kiểm tra sức khỏe.",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Failed to fetch latest record:", error);
      setAlert({
        open: true,
        message: "Không thể tải kết quả kiểm tra sức khỏe.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, itemId, dataType, field) => {
    const { name, value, checked } = e.target;
    setCheckupData((prev) => {
      if (itemId) {
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            [field]:
              field === "isAbnormal"
                ? checked
                : dataType === CheckupItemDataType.BOOLEAN
                ? value === "true"
                : String(value),
          },
        };
      }
      return {
        ...prev,
        [name]: name === "isAbnormal" ? checked : String(value),
      };
    });
  };

  const handleSubmitCheckup = async () => {
    // Validate required fields
    const requiredFields =
      template?.checkupItems.filter(
        (item) =>
          item.dataType === CheckupItemDataType.NUMBER ||
          item.dataType === CheckupItemDataType.SELECT
      ) || [];
    const missingFields = requiredFields.filter(
      (item) =>
        !checkupData[item.itemId]?.value &&
        checkupData[item.itemId]?.value !== 0
    );
    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields
          .map((item) => item.itemName)
          .join(", ")}.`,
        type: "error",
      });
      return;
    }
    console.log("nurseId: ", nurseId);
    console.log("Submitting checkup data:", checkupData);

    if (!nurseId) {
      setAlert({
        open: true,
        message: "Không thể xác định thông tin y tá. Vui lòng đăng nhập lại.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const resultData = {
        campaignId: selectedCampaign,
        nurseId: nurseId,
        studentId: selectedStudent._id,
        resultsData:
          template?.checkupItems.map((item) => ({
            itemName: item.itemName,
            value:
              item.dataType === CheckupItemDataType.BOOLEAN
                ? checkupData[item.itemId].value
                : String(checkupData[item.itemId].value || ""),
            unit: item.unit || "",
            isAbnormal: checkupData[item.itemId].isAbnormal || false,
            notes: checkupData[item.itemId].notes || "",
            guideline: item.guideline || "",
          })) || [],
        checkupDate: new Date().toISOString(),
        isAbnormal: checkupData.isAbnormal || false,
        recommendations: checkupData.recommendations || "",
        overallConclusion: checkupData.overallConclusion || "",
      };

      const response = await healthCheckRecordService.createHealthCheckResult(
        resultData
      );
      if (response.success) {
        setAlert({
          open: true,
          message: `Đã ghi nhận kiểm tra sức khỏe cho ${selectedStudent.name}.`,
          type: "success",
        });
        setOpenDialog(false);
        setOpenSuccessDialog(true);
        await fetchStudents(selectedCampaign);
      } else {
        throw new Error(response.message || "Không thể ghi nhận kết quả.");
      }
    } catch (error) {
      console.error("Failed to submit checkup:", error);
      setAlert({
        open: true,
        message: "Không thể ghi nhận kết quả. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCheckup = async () => {
    // Validate required fields
    const requiredFields =
      template?.checkupItems.filter(
        (item) =>
          item.dataType === CheckupItemDataType.NUMBER ||
          item.dataType === CheckupItemDataType.SELECT
      ) || [];
    const missingFields = requiredFields.filter(
      (item) =>
        !checkupData[item.itemId]?.value &&
        checkupData[item.itemId]?.value !== 0
    );
    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields
          .map((item) => item.itemName)
          .join(", ")}.`,
        type: "error",
      });
      return;
    }
    console.log("nurseId: ", nurseId);
    console.log("Updating checkup data:", checkupData);

    if (!nurseId) {
      setAlert({
        open: true,
        message: "Không thể xác định thông tin y tá. Vui lòng đăng nhập lại.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        resultsData:
          template?.checkupItems.map((item) => ({
            itemName: item.itemName,
            value:
              item.dataType === CheckupItemDataType.BOOLEAN
                ? checkupData[item.itemId].value
                : String(checkupData[item.itemId].value || ""),
            unit: item.unit || "",
            isAbnormal: checkupData[item.itemId].isAbnormal || false,
            notes: checkupData[item.itemId].notes || "",
            guideline: item.guideline || "",
          })) || [],
        checkupDate: new Date().toISOString(),
        isAbnormal: checkupData.isAbnormal || false,
        recommendations: checkupData.recommendations || "",
        overallConclusion: checkupData.overallConclusion || "",
      };

      const response = await healthCheckRecordService.updateHealthCheckRecord(
        latestRecord._id,
        updateData
      );
      if (response.success) {
        setAlert({
          open: true,
          message: `Đã cập nhật kiểm tra sức khỏe cho ${selectedStudent.name}.`,
          type: "success",
        });
        setOpenDialog(false);
        setOpenSuccessDialog(true);
        await fetchStudents(selectedCampaign);
      } else {
        throw new Error(response.message || "Không thể cập nhật kết quả.");
      }
    } catch (error) {
      console.error("Failed to update checkup:", error);
      setAlert({
        open: true,
        message: "Không thể cập nhật kết quả. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const exportData = await Promise.all(
        filteredStudents.map(async (student, index) => {
          let record = null;
          try {
            record =
              await healthCheckRecordService.getLatestStudentHealthRecord(
                student._id
              );
            console.log(`Fetched record for student ${student._id}:`, record);
          } catch (error) {
            console.error(
              `Failed to fetch record for student ${student._id}:`,
              error
            );
          }
          const baseData = {
            STT: index + 1,
            "Họ và Tên": student.name,
            Lớp: student.className,
            "Ngày Sinh": new Date(student.dateOfBirth).toLocaleDateString(
              "vi-VN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),
            "Trạng Thái":
              student.healthStatus === "COMPLETED"
                ? "Đã kiểm tra"
                : "Chưa kiểm tra",
          };
          if (record?.data?.status !== "COMPLETED" && template?.checkupItems) {
            const checkupData = template.checkupItems.reduce((acc, item) => {
              const result =
                record.data.resultsData.find(
                  (r) => r.itemName === item.itemName
                ) || {};
              return {
                ...acc,
                [`${item.itemName} (${item.unit})`]:
                  item.dataType === CheckupItemDataType.BOOLEAN
                    ? result.value
                      ? "Có"
                      : "Không"
                    : result.value || "-",
                [`${item.itemName} (Bất thường)`]: result.isAbnormal
                  ? "Có"
                  : "Không",
                [`${item.itemName} (Ghi chú)`]: result.notes || "-",
              };
            }, {});
            return {
              ...baseData,
              ...checkupData,
              "Ghi Chú Tổng Quát": record.data.notes || "-",
              "Khuyến Nghị": record.data.recommendations || "-",
              "Kết Luận Tổng Quát": record.data.overallConclusion || "-",
            };
          }
          return baseData; // Return base data if no completed record
        })
      );

      if (exportData.length === 0) {
        setAlert({
          open: true,
          message: "Không có dữ liệu để xuất Excel.",
          type: "warning",
        });
        return;
      }

      const headers = [
        "STT",
        "Họ và Tên",
        "Lớp",
        "Ngày Sinh",
        ...(template?.checkupItems.flatMap((item) => [
          `${item.itemName} (${item.unit})`,
          `${item.itemName} (Bất thường)`,
          `${item.itemName} (Ghi chú)`,
        ]) || []),
        "Ghi Chú Tổng Quát",
        "Khuyến Nghị",
        "Kết Luận Tổng Quát",
        "Trạng Thái",
      ];
      const worksheet = utils.json_to_sheet(exportData, {
        header: headers,
        skipHeader: false,
      });
      worksheet["!cols"] = headers.map((_, i) => ({ wch: i < 4 ? 15 : 20 }));
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Kiem_tra_suc_khoe");
      writeFile(workbook, `Kiem_tra_suc_khoe_${selectedCampaign}.xlsx`);
      setAlert({
        open: true,
        message: "Xuất file Excel thành công!",
        type: "success",
      });
      setOpenSuccessDialog(true);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      setAlert({
        open: true,
        message: "Lỗi khi xuất file Excel. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAllCompleted = () => {
    const allCompleted = filteredStudents.every(
      (student) => student.healthStatus === "COMPLETED"
    );
    setAlert({
      open: true,
      message: allCompleted
        ? "Tất cả học sinh đã được kiểm tra xong."
        : "Còn học sinh chưa được kiểm tra.",
      type: allCompleted ? "success" : "warning",
    });
  };

  const handleCompleteCampaign = async () => {
    try {
      setLoading(true);
      const response = await healthCheckCampaignService.updateCampaignStatus(
        selectedCampaign,
        { status: "COMPLETED" }
      );
      if (response.data.success) {
        setAlert({
          open: true,
          message: "Chiến dịch đã hoàn thành!",
          type: "success",
        });
        setSelectedCampaign("");
        setStudents([]);
        setTemplate(null);
        setCheckupData({});
      } else {
        throw new Error(
          response.data.message || "Không thể hoàn thành chiến dịch."
        );
      }
    } catch (error) {
      console.error("Failed to complete campaign:", error);
      setAlert({
        open: true,
        message: "Không thể hoàn thành chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((student) =>
      classFilter ? student.className === classFilter : true
    )
    .filter((student) =>
      statusFilter
        ? student.healthStatus ===
          (statusFilter === "Đã kiểm tra" ? "COMPLETED" : "PENDING")
        : true
    );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedList = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("Paginated list:", paginatedList);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setCheckupData({});
    setLatestRecord(null);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setLatestRecord(null);
  };

  const getSelectOptions = (guideline) => {
    return guideline ? guideline.split(",").map((option) => option.trim()) : [];
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Kiểm Tra Sức Khỏe
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Tiến hành ghi nhận kết quả kiểm tra sức khỏe cho học sinh theo chiến
        dịch đã chọn. Vui lòng đảm bảo thông tin đầy đủ và chính xác trước khi
        lưu.
      </Alert>

      <Box display="flex" gap={2} mb={4}>
        <FormControl fullWidth>
          <InputLabel>Chọn chiến dịch</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Chọn chiến dịch"
            disabled={loading}
          >
            <MenuItem value="">Chọn chiến dịch</MenuItem>
            {campaigns.map((campaign) => (
              <MenuItem key={campaign._id} value={campaign._id}>
                {campaign.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedCampaign || loading}>
          <InputLabel>Chọn lớp</InputLabel>
          <Select
            value={classFilter}
            onChange={handleClassChange}
            label="Chọn lớp"
          >
            <MenuItem value="">Tất cả các lớp</MenuItem>
            {[...new Set(students.map((s) => s.className))]
              .sort()
              .map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Trạng thái kiểm tra</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Trạng thái kiểm tra"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Chưa kiểm tra">Chưa kiểm tra</MenuItem>
            <MenuItem value="Đã kiểm tra">Đã kiểm tra</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Tìm kiếm học sinh"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          fullWidth
          disabled={loading}
        />
      </Box>

      <Typography mb={2}>
        Tổng số học sinh: {filteredStudents.length}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Họ và Tên
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Lớp
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Ngày Sinh
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Trạng Thái
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Hành Động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((student, index) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>
                        {new Date(student.dateOfBirth).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            student.healthStatus === "COMPLETED"
                              ? "Đã kiểm tra"
                              : "Chưa kiểm tra"
                          }
                          color={
                            student.healthStatus === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CheckCircle size={16} />}
                            onClick={() => handleStudentSelect(student._id)}
                            sx={{ textTransform: "none" }}
                            disabled={loading}
                          >
                            Kiểm tra
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewRecord(student._id)}
                            sx={{ textTransform: "none" }}
                            disabled={
                              loading || student.healthStatus !== "COMPLETED"
                            }
                          >
                            Xem
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary" py={4}>
                        Chưa có danh sách học sinh hoặc chưa chọn chiến dịch.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredStudents.length > 0 && (
            <>
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircle size={20} />}
                  onClick={checkAllCompleted}
                  disabled={loading || !selectedCampaign}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  Kiểm tra hoàn thành
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download size={20} />}
                  onClick={handleExportExcel}
                  disabled={loading || !selectedCampaign}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  Xuất Excel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CheckCircle size={20} />}
                  onClick={handleCompleteCampaign}
                  disabled={loading || !selectedCampaign}
                  sx={{ textTransform: "none" }}
                >
                  Hoàn thành chiến dịch
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "#e3f2fd", py: 2, borderBottom: "1px solid #e0e0e0" }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#1976d2" }}>
            Ghi Nhận Kiểm Tra Sức Khỏe
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "70vh", overflow: "auto" }}>
          {selectedStudent && template ? (
            <Box display="flex" flexDirection="column" gap={3} pt={2}>
              {/* Student Info Header */}
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
              >
                <Avatar sx={{ width: 60, height: 60, bgcolor: "#1976d2" }}>
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedStudent.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Mã HS: {selectedStudent._id}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Lớp: {selectedStudent.className}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Campaign Info */}
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Tên chiến dịch"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)?.name ||
                    ""
                  }
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Mô tả mẫu kiểm tra"
                  value={template.description || ""}
                  disabled
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  size="small"
                />
              </Box>

              {/* Checkup Items */}
              <Box display="flex" flexDirection="column" gap={3}>
                {template.checkupItems.map((item, index) => (
                  <Box
                    key={item.itemId}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      {index + 1}. {item.itemName}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <FormControl
                        fullWidth
                        required={
                          item.dataType === CheckupItemDataType.NUMBER ||
                          item.dataType === CheckupItemDataType.SELECT
                        }
                        error={
                          (item.dataType === CheckupItemDataType.NUMBER ||
                            item.dataType === CheckupItemDataType.SELECT) &&
                          !checkupData[item.itemId]?.value &&
                          checkupData[item.itemId]?.value !== 0
                        }
                      >
                        {item.dataType === CheckupItemDataType.BOOLEAN ? (
                          <>
                            <InputLabel>{`${item.itemName} (${item.unit})`}</InputLabel>
                            <Select
                              name={item.itemId}
                              value={
                                checkupData[item.itemId]?.value === true
                                  ? "true"
                                  : "false"
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  item.itemId,
                                  CheckupItemDataType.BOOLEAN,
                                  "value"
                                )
                              }
                              label={`${item.itemName} (${item.unit})`}
                              size="small"
                            >
                              <MenuItem value="true">Có</MenuItem>
                              <MenuItem value="false">Không</MenuItem>
                            </Select>
                          </>
                        ) : item.dataType === CheckupItemDataType.SELECT ? (
                          <>
                            <InputLabel>{`${item.itemName} (${item.unit})`}</InputLabel>
                            <Select
                              name={item.itemId}
                              value={checkupData[item.itemId]?.value || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  item.itemId,
                                  CheckupItemDataType.SELECT,
                                  "value"
                                )
                              }
                              label={`${item.itemName} (${item.unit})`}
                              size="small"
                            >
                              <MenuItem value="">Chọn</MenuItem>
                              {getSelectOptions(item.guideline).map(
                                (option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </>
                        ) : (
                          <TextField
                            label={`${item.itemName} (${item.unit})`}
                            name={item.itemId}
                            value={checkupData[item.itemId]?.value || ""}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                item.itemId,
                                item.dataType,
                                "value"
                              )
                            }
                            type={
                              item.dataType === CheckupItemDataType.NUMBER
                                ? "number"
                                : "text"
                            }
                            helperText={
                              item.dataType === CheckupItemDataType.NUMBER &&
                              !checkupData[item.itemId]?.value &&
                              checkupData[item.itemId]?.value !== 0
                                ? "Trường này là bắt buộc"
                                : item.guideline
                            }
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              checkupData[item.itemId]?.isAbnormal || false
                            }
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                item.itemId,
                                null,
                                "isAbnormal"
                              )
                            }
                            name={item.itemId}
                            color="primary"
                          />
                        }
                        label="Bất thường"
                      />
                      <TextField
                        label={`Ghi chú cho ${item.itemName}`}
                        name={item.itemId}
                        value={checkupData[item.itemId]?.notes || ""}
                        onChange={(e) =>
                          handleInputChange(e, item.itemId, null, "notes")
                        }
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Summary Section */}
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  p: 2,
                  bgcolor: "#f0f8ff",
                  borderRadius: 2,
                  border: "1px solid #1976d2",
                }}
              >
                <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                  Kết Luận Tổng Quát
                </Typography>
                <TextField
                  label="Khuyến nghị"
                  name="recommendations"
                  value={checkupData.recommendations || ""}
                  onChange={(e) =>
                    handleInputChange(e, null, null, "recommendations")
                  }
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Kết luận tổng quát"
                  name="overallConclusion"
                  value={checkupData.overallConclusion || ""}
                  onChange={(e) =>
                    handleInputChange(e, null, null, "overallConclusion")
                  }
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkupData.isAbnormal || false}
                      onChange={(e) =>
                        handleInputChange(e, null, null, "isAbnormal")
                      }
                      name="isAbnormal"
                      color="primary"
                    />
                  }
                  label="Kết quả bất thường"
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Typography color="textSecondary" variant="h6">
                Không có thông tin mẫu kiểm tra hoặc học sinh để hiển thị.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            bgcolor: "#fafafa",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            disabled={loading}
            variant="outlined"
            size="large"
          >
            Hủy
          </Button>
          {latestRecord && (
            <Button
              onClick={handleUpdateCheckup}
              color="primary"
              variant="contained"
              size="large"
              disabled={loading || !nurseId}
              startIcon={
                loading ? <CircularProgress size={20} /> : <CheckCircle />
              }
              sx={{ minWidth: "200px" }}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          )}
          <Button
            onClick={handleSubmitCheckup}
            color="primary"
            variant="contained"
            size="large"
            disabled={loading || !nurseId || !!latestRecord}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CheckCircle />
            }
            sx={{ minWidth: "200px" }}
          >
            {loading ? "Đang lưu..." : "Lưu và Hoàn thành"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#e3f2fd" }}>Thành Công</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircle size={24} className="text-green-500" />
            <Typography>
              {selectedStudent
                ? `Đã ${
                    latestRecord ? "cập nhật" : "ghi nhận"
                  } kiểm tra sức khỏe cho ${selectedStudent.name}.`
                : "File kết quả đã được tải xuống."}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSuccessDialog}
            color="primary"
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "#e3f2fd", py: 2, borderBottom: "1px solid #e0e0e0" }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#1976d2" }}>
            Kết Quả Kiểm Tra Sức Khỏe Gần Nhất
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "70vh", overflow: "auto" }}>
          {latestRecord && selectedStudent ? (
            <Box display="flex" flexDirection="column" gap={3} pt={2}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
              >
                <Avatar sx={{ width: 60, height: 60, bgcolor: "#1976d2" }}>
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedStudent.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Mã HS: {selectedStudent._id}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Lớp: {selectedStudent.className}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Ngày kiểm tra"
                  value={new Date(latestRecord.checkupDate).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={3}>
                {latestRecord.resultsData.map((item, index) => (
                  <Box
                    key={item._id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      {index + 1}. {item.itemName}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        label={`${item.itemName} (${item.unit || ""})`}
                        value={item.value || "-"}
                        disabled
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.isAbnormal || false}
                            disabled
                          />
                        }
                        label="Bất thường"
                      />
                      <TextField
                        label={`Ghi chú cho ${item.itemName}`}
                        value={item.notes || "-"}
                        disabled
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  p: 2,
                  bgcolor: "#f0f8ff",
                  borderRadius: 2,
                  border: "1px solid #1976d2",
                }}
              >
                <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                  Kết Luận Tổng Quát
                </Typography>
                <TextField
                  label="Khuyến nghị"
                  value={latestRecord.recommendations || "-"}
                  disabled
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Kết luận tổng quát"
                  value={latestRecord.overallConclusion || "-"}
                  disabled
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={latestRecord.isAbnormal || false}
                      disabled
                    />
                  }
                  label="Kết quả bất thường"
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Typography color="textSecondary" variant="h6">
                Không có kết quả kiểm tra sức khỏe để hiển thị.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 3, bgcolor: "#fafafa", borderTop: "1px solid #e0e0e0" }}
        >
          <Button
            onClick={handleCloseViewDialog}
            color="primary"
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {alert.open && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}
    </Container>
  );
};

export default PerformCheckup;
