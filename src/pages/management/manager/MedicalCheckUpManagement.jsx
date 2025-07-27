import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import healthCheckTemplateService from "~/libs/api/services/healthCheckTemplateService";

// MUI Imports
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Grid,
  MenuItem,
  TableContainer,
  TablePagination,
  Stack,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Switch,
  Chip,
  Select,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Healing as HealingIcon,
  Folder as FolderIcon,
  Edit as EditNoteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AssignmentOutlined as AssignmentOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  Tag as TagIcon,
  TextSnippet as TextSnippetIcon,
  ToggleOff as ToggleOffIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Description,
  SecurityOutlined,
  Assignment,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FingerprintIcon,
  PersonStandingIcon,
  Plus,
  Search,
} from "lucide-react";

// Enum definitions
const CheckupItemDataType = {
  NUMBER: "NUMBER",
  TEXT: "TEXT",
  BOOLEAN: "BOOLEAN",
  SELECT: "SELECT",
};

const CheckupItemUnit = {
  KG: "KG",
  CM: "CM",
  MM: "MM",
  PERCENT: "PERCENT",
  BPM: "BPM",
  MG_DL: "MG/DL",
  MM_HG: "MM/HG",
  LITER: "LITER",
  DIOP: "DIOP",
};

// Styled Paper cho phần form và detail
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

// Styled TableContainer
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

// Component cho Form
const HealthCheckTemplateForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [checkupItems, setCheckupItems] = useState(
    initialData?.checkupItems && initialData.checkupItems.length > 0
      ? initialData.checkupItems.map((item, index) => ({
          ...item,
          itemId: item.itemId.toString() || (index + 1).toString()
        }))
      : [{ itemId: '1', itemName: '', unit: '', dataType: '', guideline: '' }]
  );
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setCheckupItems(
        initialData.checkupItems && initialData.checkupItems.length > 0
          ? initialData.checkupItems.map((item, index) => ({
              ...item,
              itemId: item.itemId.toString() || (index + 1).toString()
            }))
          : [{ itemId: '1', itemName: '', unit: '', dataType: '', guideline: '' }]
      );
      setIsDefault(initialData.isDefault || false);
    } else {
      setName("");
      setDescription("");
      setCheckupItems([
        { itemId: "1", itemName: "", unit: "", dataType: "", guideline: "" },
      ]);
      setIsDefault(false);
    }
  }, [initialData]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...checkupItems];
    newItems[index][field] = value;
    setCheckupItems(newItems);
  };

  const handleAddItem = () => {
    const newItemId = (checkupItems.length + 1).toString();
    setCheckupItems([
      ...checkupItems,
      {
        itemId: newItemId,
        itemName: "",
        unit: "",
        dataType: "",
        guideline: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = checkupItems.filter((_, i) => i !== index);
    // Cập nhật lại itemId theo số thứ tự
    const updatedItems = newItems.map((item, i) => ({
      ...item,
      itemId: (i + 1).toString(),
    }));
    setCheckupItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      name,
      description,
      checkupItems: checkupItems.map((item, index) => ({
        ...item,
        itemId: (index + 1).toString(),
        itemName: item.itemName,
        unit: item.unit || null,
        dataType: item.dataType,
        guideline: item.guideline || null,
      })),
      isDefault,
    };
    onSubmit(formattedData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 0, maxHeight: "70vh", overflow: "auto" }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 24,
              backgroundColor: "primary.main",
              borderRadius: 1,
            }}
          />
          Thông Tin Cơ Bản
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Tên Mẫu Khám"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nhập tên mẫu khám sức khỏe..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: "text.secondary" }}>
                    <FolderIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  name="isDefault"
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "primary.main",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Mẫu Mặc Định
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Sử dụng làm mẫu chính
                  </Typography>
                </Box>
              }
              sx={{
                backgroundColor: isDefault ? "primary.50" : "grey.50",
                borderRadius: 2,
                p: 2,
                border: `1px solid ${isDefault ? "primary.200" : "grey.200"}`,
                width: "100%",
                margin: 0,
                transition: "all 0.2s ease",
              }}
            />
          </Grid>
        </Grid>

        <TextField
          label="Mô tả"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết về mẫu khám này..."
          sx={{
            mt: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <Box
                sx={{
                  mr: 1,
                  color: "text.secondary",
                  alignSelf: "flex-start",
                  mt: 1,
                }}
              >
                <EditNoteIcon fontSize="small" />
              </Box>
            ),
          }}
        />
      </Box>

      {/* Checkup Items Section */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 24,
                backgroundColor: "primary.main",
                borderRadius: 1,
              }}
            />
            Các Mục Kiểm Tra
            <Chip
              label={checkupItems.length}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddItem}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Thêm Mục Kiểm Tra
          </Button>
        </Box>

        {checkupItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "grey.50",
              borderRadius: 2,
              border: "2px dashed #d1d5db",
            }}
          >
            <AssignmentOutlinedIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
              Chưa có mục kiểm tra nào
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Thêm các mục kiểm tra để tạo mẫu khám hoàn chỉnh
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {checkupItems.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  position: "relative",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.secondary" }}
                    >
                      Mục kiểm tra #{index + 1}
                    </Typography>
                  </Box>

                  <Tooltip title="Xóa mục kiểm tra">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(index)}
                      sx={{
                        color: "error.main",
                        backgroundColor: "error.50",
                        "&:hover": {
                          backgroundColor: "error.100",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Grid container spacing={2}>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      label="ID"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={item.itemId}
                      disabled
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tên Mục"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      required
                      placeholder="Nhập tên mục kiểm tra..."
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Đơn vị"
                      variant="outlined"
                      fullWidth
                      size="small"
                      select
                      value={item.unit || ''}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } ,width: '150px'}}
                    >
                      <MenuItem value="">
                        <em>Không có đơn vị</em>
                      </MenuItem>
                      {Object.values(CheckupItemUnit).map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit === CheckupItemUnit.KG && "KG - Kilogram"}
                          {unit === CheckupItemUnit.CM && "CM - Centimet"}
                          {unit === CheckupItemUnit.MM && "MM - Milimet"}
                          {unit === CheckupItemUnit.PERCENT && "% - Phần trăm"}
                          {unit === CheckupItemUnit.BPM && "BPM - Nhịp/phút"}
                          {unit === CheckupItemUnit.MG_DL &&
                            "MG/DL - Miligram/Decilit"}
                          {unit === CheckupItemUnit.MM_HG &&
                            "MM/HG - Milimet thủy ngân"}
                          {unit === CheckupItemUnit.LITER && "Lít"}
                          {unit === CheckupItemUnit.DIOP && "Diop - Độ cận thị"}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Kiểu Dữ Liệu"
                      variant="outlined"
                      fullWidth
                      size="small"
                      select
                      value={item.dataType || ""}
                      onChange={(e) =>
                        handleItemChange(index, "dataType", e.target.value)
                      }
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } ,width: '150px'}}
                    >
                      <MenuItem value="">
                        <em>Chọn kiểu dữ liệu</em>
                      </MenuItem>
                      {Object.values(CheckupItemDataType).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type === CheckupItemDataType.NUMBER && (
                            <>
                              <TagIcon fontSize="small" /> Số
                            </>
                          )}
                          {type === CheckupItemDataType.TEXT && (
                            <>
                              <TextSnippetIcon fontSize="small" /> Văn bản
                            </>
                          )}
                          {/* {type === CheckupItemDataType.BOOLEAN && (
                            <>
                              <ToggleOffIcon fontSize="small" /> Boolean
                            </>
                          )}
                          {type === CheckupItemDataType.SELECT && (
                            <>
                              <FormatListBulletedIcon fontSize="small" /> Lựa
                              chọn
                            </>
                          )} */}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sx={{width: "100%"}}>
                    <TextField
                      label="Hướng dẫn"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={item.guideline}
                      onChange={(e) =>
                        handleItemChange(index, "guideline", e.target.value)
                      }
                      placeholder="Nhập hướng dẫn thực hiện..."
                      multiline
                      rows={2}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 3,
          mt: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          size="large"
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "text.secondary",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          disabled={!name.trim() || checkupItems.length === 0}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              backgroundColor: "grey.300",
              color: "grey.500",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isEditing ? "Cập nhật Mẫu" : "Tạo Mẫu"}
        </Button>
      </Box>
    </Box>
  );
};

// Component để hiển thị chi tiết mẫu khám
const HealthCheckTemplateDetail = ({ template, onClose }) => {
  if (!template) return null;
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        Chi tiết Mẫu Khám: {template.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">
            Mô tả:
          </Typography>
          <Typography variant="body1">
            {template.description || "Không có mô tả"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">
            Mẫu Mặc Định:
          </Typography>
          <Typography variant="body1">
            {template.isDefault ? "Có" : "Không"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">
            Mã Mẫu Khám:
          </Typography>
          <Typography variant="body1">
            {template._id || "Không xác định"}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "text.secondary" }}>
        Các Mục Kiểm Tra:
      </Typography>
      {template.checkupItems && template.checkupItems.length > 0 ? (
        <StyledTableContainer component={Paper} elevation={1}>
          <Table size="medium">
            <TableHead sx={{ backgroundColor: "primary.light" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Mã Mục
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Tên Mục
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Đơn vị
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Kiểu Dữ Liệu
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Hướng dẫn
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {template.checkupItems.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>
                    {item.unit
                      ? item.unit === CheckupItemUnit.KG ? 'KG - Kilogram'
                        : item.unit === CheckupItemUnit.CM ? 'CM - Centimet'
                        : item.unit === CheckupItemUnit.MM ? 'MM - Milimet'
                        : item.unit === CheckupItemUnit.PERCENT ? '% - Phần trăm'
                        : item.unit === CheckupItemUnit.BPM ? 'BPM - Nhịp/phút'
                        : item.unit === CheckupItemUnit.MG_DL ? 'MG/DL - Miligram/Decilit'
                        : item.unit === CheckupItemUnit.MM_HG ? 'MM/HG - Milimet thủy ngân'
                        : item.unit === CheckupItemUnit.LITER ? 'Lít - Lít'
                        : 'N/A'
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {item.dataType
                      ? item.dataType === CheckupItemDataType.NUMBER ? 'Số'
                        : item.dataType === CheckupItemDataType.TEXT ? 'Văn bản'
                        : item.dataType === CheckupItemDataType.BOOLEAN ? 'Boolean'
                        : item.dataType === CheckupItemDataType.SELECT ? 'Lựa chọn'
                        : 'N/A'
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {item.guideline || "Không có hướng dẫn"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic", textAlign: "center", mt: 3 }}
        >
          Không có mục kiểm tra nào được định nghĩa.
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          size="large"
        >
          Đóng
        </Button>
      </Box>
    </Box>
  );
};

// Component chính
const MedicalCheckupManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State cho Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Helper function to show Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await healthCheckTemplateService.getListHealthCheckTemplates({
          page: page + 1,
          limit,
          search,
        });
      setTemplates(response.data || []);
      setTotalTemplates(response.data.length > 0 ? response.data.length : 0);
    } catch (err) {
      setError("Không thể tải danh sách mẫu khám. Vui lòng thử lại.");
      console.error(err);
      showSnackbar(
        "Không thể tải danh sách mẫu khám. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingTemplate(null);
    setShowFormModal(true);
  };

  const handleEditClick = async (templateId) => {
    try {
      const response =
        await healthCheckTemplateService.getHealthCheckTemplateById(templateId);
      setEditingTemplate(response.data);
      setShowFormModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết mẫu khám để chỉnh sửa:", err);
      showSnackbar("Không thể tải chi tiết mẫu khám để chỉnh sửa.", "error");
    }
  };

  const handleViewDetailClick = async (templateId) => {
    try {
      const response =
        await healthCheckTemplateService.getHealthCheckTemplateById(templateId);
      setViewingTemplate(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết mẫu khám:", err);
      showSnackbar("Không thể tải chi tiết mẫu khám.", "error");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTemplate) {
        await healthCheckTemplateService.updateHealthCheckTemplate(
          editingTemplate._id,
          formData
        );
        showSnackbar("Cập nhật mẫu khám thành công.", "success");
      } else {
        await healthCheckTemplateService.createHealthCheckTemplate(formData);
        showSnackbar("Thêm mẫu khám mới thành công.", "success");
      }
      setShowFormModal(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error("Lưu mẫu khám thất bại:", err);
      showSnackbar(
        "Lưu mẫu khám thất bại. Vui lòng kiểm tra dữ liệu.",
        "error"
      );
    }
  };

  const handleDeleteClick = async (templateId, templateName) => {
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa mẫu khám "${templateName}" không?`,
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await healthCheckTemplateService.deleteHealthCheckTemplate(
            templateId
          );
          showSnackbar("Mẫu khám đã được xóa.", "success");
          fetchTemplates();
        } catch (err) {
          console.error("Xóa mẫu khám thất bại:", err);
          showSnackbar(
            "Xóa mẫu khám thất bại. Mẫu khám có thể đang được sử dụng.",
            "error"
          );
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDefaultSwitchChange = async (templateId, currentStatus) => {
    const newStatus = !currentStatus;
    Swal.fire({
      title: `Bạn có chắc chắn muốn ${
        newStatus ? "đặt" : "bỏ"
      } mẫu khám này làm mặc định không?`,
      text: "Hành động này sẽ thay đổi trạng thái mặc định của mẫu khám!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, thực hiện!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await healthCheckTemplateService.setDefaultHealthCheckTemplate(
            templateId
          );
          showSnackbar(`Cập nhật trạng thái mặc định thành công.`, "success");
          fetchTemplates();
        } catch (err) {
          console.error("Cập nhật trạng thái mặc định thất bại:", err);
          showSnackbar(
            "Cập nhật trạng thái mặc định thất bại. Vui lòng thử lại.",
            "error"
          );
        }
      }
    });
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
                <HealingIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                  Quản Lý Mẫu Khám Sức Khỏe
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Tạo và quản lý các mẫu khám sức khỏe cho học sinh
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
                  placeholder="Tìm kiếm theo tên mẫu..."
                  value={search}
                  onChange={(e) => handleSearchChange(e)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => handleAddClick()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm Mẫu Khám Mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Đang tải danh sách mẫu khám...
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" align="center" variant="h6" sx={{ mt: 5 }}>
          {error}
        </Typography>
      ) : (
        <StyledPaper elevation={8}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  STT
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Tên Mẫu
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Mô tả
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Mặc Định
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Hành Động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.length > 0 ? (
                templates.map((template, index) => (
                  <TableRow key={template._id}>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {page * limit + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {template.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {template.description}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={template.isDefault}
                        onChange={() =>
                          handleDefaultSwitchChange(
                            template._id,
                            template.isDefault
                          )
                        }
                        color="primary"
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            color="info"
                            onClick={() => handleViewDetailClick(template._id)}
                            aria-label="Xem chi tiết"
                            sx={{
                              "&:hover": {
                                color: "white",
                                backgroundColor: "info.main",
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(template._id)}
                            aria-label="Sửa"
                            sx={{
                              "&:hover": {
                                color: "white",
                                backgroundColor: "primary.main",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteClick(template._id, template.name)
                            }
                            aria-label="Xóa"
                            sx={{
                              "&:hover": {
                                color: "white",
                                backgroundColor: "error.main",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 3, fontStyle: "italic", color: "text.secondary" }}
                  >
                    Không có mẫu khám nào để hiển thị.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalTemplates}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1 }}
          />
        </StyledPaper>
      )}

      <Dialog
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            maxHeight: "90vh",
            transition: "all 0.3s ease-in-out"
          } 
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            py: 3,
            px: 3,
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {editingTemplate ? (
              <EditIcon sx={{ fontSize: 20, color: "white" }} />
            ) : (
              <AddIcon sx={{ fontSize: 20, color: "white" }} />
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {editingTemplate ? "Chỉnh sửa Mẫu Khám" : "Thêm Mới Mẫu Khám"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {editingTemplate 
                ? "Cập nhật thông tin mẫu khám sức khỏe" 
                : "Tạo mẫu khám sức khỏe mới cho hệ thống"
              }
            </Typography>
          </Box>

          <IconButton
            aria-label="Đóng"
            onClick={() => setShowFormModal(false)}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers={false}
          sx={{
            backgroundColor: "#f8fafc",
            p: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 3,
              background: "linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                height: "100%",
                width: editingTemplate ? "100%" : "50%",
                background: "linear-gradient(90deg, #2196f3 0%, #1976d2 100%)",
                transition: "width 0.5s ease",
              },
            }}
          />

          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e5e7eb",
              }}
            >
              <HealthCheckTemplateForm
                initialData={editingTemplate}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowFormModal(false)}
                isEditing={!!editingTemplate}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            overflow: 'hidden',
            maxHeight: '90vh'
          } 
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white', 
          pb: 2,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Description sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chi tiết Mẫu Khám Sức Khỏe
            </Typography>
          </Box>
          <IconButton
            aria-label="đóng"
            onClick={() => setShowDetailModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: "all 0.2s",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent 
          dividers 
          sx={{ 
            backgroundColor: 'background.paper',
            p: 3,
            maxHeight: "calc(90vh - 140px)",
            overflowY: "auto",
          }}
        >
          {/* Thông tin cơ bản */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <FolderIcon sx={{ fontSize: 20, color: "grey.600" }} />
                  <Typography variant="subtitle2" color="grey.700">
                    Tên mẫu
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {viewingTemplate?.name || "Không có tên"}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <PersonStandingIcon
                    sx={{ fontSize: 20, color: "grey.600" }}
                  />
                  <Typography variant="subtitle2" color="grey.700">
                    Mô tả
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {viewingTemplate?.description || "Không có mô tả"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Danh sách mục kiểm tra */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Assignment sx={{ fontSize: 24, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Các Mục Kiểm Tra
              </Typography>
              <Chip
                label={`${viewingTemplate?.checkupItems?.length || 0} mục`}
                size="small"
                sx={{
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(viewingTemplate?.checkupItems || []).map((item, index) => (
                <Paper
                  key={item.itemId}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                    "&:hover": {
                      boxShadow: 2,
                      borderColor: "primary.light",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={`#${item.itemId}`}
                        size="small"
                        sx={{ 
                          backgroundColor: 'secondary.light',
                          color: 'secondary.contrastText',
                          fontWeight: 'bold'
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.itemName || "Không xác định"}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="grey.600">
                        Đơn vị: <Chip 
                          label={
                            item.unit
                              ? item.unit === CheckupItemUnit.KG ? 'KG - Kilogram'
                                : item.unit === CheckupItemUnit.CM ? 'CM - Centimet'
                                : item.unit === CheckupItemUnit.MM ? 'MM - Milimet'
                                : item.unit === CheckupItemUnit.PERCENT ? '% - Phần trăm'
                                : item.unit === CheckupItemUnit.BPM ? 'BPM - Nhịp/phút'
                                : item.unit === CheckupItemUnit.MG_DL ? 'MG/DL - Miligram/Decilit'
                                : item.unit === CheckupItemUnit.MM_HG ? 'MM/HG - Milimet thủy ngân'
                                : item.unit === CheckupItemUnit.LITER ? 'Lít - Lít'
                                : 'Không có đơn vị'
                              : 'Không có đơn vị'
                          } 
                          size="small" 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="grey.600">
                        Kiểu dữ liệu: <Chip 
                          label={
                            item.dataType
                              ? item.dataType === CheckupItemDataType.NUMBER ? 'Số'
                                : item.dataType === CheckupItemDataType.TEXT ? 'Văn bản'
                                : item.dataType === CheckupItemDataType.BOOLEAN ? 'Boolean'
                                : item.dataType === CheckupItemDataType.SELECT ? 'Lựa chọn'
                                : 'Không xác định'
                              : 'Không xác định'
                          } 
                          size="small" 
                          color={item.dataType === CheckupItemDataType.TEXT ? 'info' : 'success'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="body2" color="grey.600" sx={{ mb: 1 }}>
                      Hướng dẫn:
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      backgroundColor: 'grey.50',
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main'
                    }}>
                      <Typography variant="body2">
                        {item.guideline || "Không có hướng dẫn"}
                      </Typography>
                    </Paper>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'grey.50',
          borderTop: '1px solid',
          borderTopColor: 'grey.200'
        }}>
          <Button 
            onClick={() => setShowDetailModal(false)}
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicalCheckupManagement;
