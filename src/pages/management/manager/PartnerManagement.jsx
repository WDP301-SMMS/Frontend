import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { partnerService } from '~/libs/api/services/partnerService';

// MUI Imports
import {
  Box,
  Button,
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
  DialogActions,
  Slide,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Folder as FolderIcon,
  Edit as EditNoteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AssignmentOutlined as AssignmentOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  Tag as TagIcon,
  Description,
  Person as PersonIcon,
  EmailOutlined,
  LocationOff,
  ContactMail,
  Schedule
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GroupIcon, PhoneIcon, Plus, Search, UserPlus } from 'lucide-react';

// Styled Paper cho phần form và detail
const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  backgroundColor: 'white',
  border: '1px solid #e5e7eb'
}));

// Styled TableContainer
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

// Component cho Form thêm/sửa đối tác
const PartnerForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [organization, setOrganization] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'HOSPITAL'
  });
  const [managerInfo, setManagerInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      const partnerData = initialData.data || initialData; // Xử lý cấu trúc dữ liệu { data: {...} }
      setOrganization({
        name: partnerData.name || '',
        email: partnerData.email || '',
        phone: partnerData.phone || '',
        address: partnerData.address || '',
        type: partnerData.type || 'HOSPITAL'
      });
      setManagerInfo({
        fullName: partnerData.managerInfo?.fullName || '',
        email: partnerData.managerInfo?.email || '',
        phone: partnerData.managerInfo?.phone || ''
      });
      setIsActive(partnerData.isActive !== undefined ? partnerData.isActive : true);
    } else {
      setOrganization({
        name: '',
        email: '',
        phone: '',
        address: '',
        type: 'HOSPITAL'
      });
      setManagerInfo({ fullName: '', email: '', phone: '' });
      setIsActive(true);
    }
  }, [initialData]);

  const handleOrganizationChange = (field, value) => {
    setOrganization((prev) => ({ ...prev, [field]: value }));
  };

  const handleManagerInfoChange = (field, value) => {
    setManagerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      organization,
      managerInfo,
      isActive
    };
    onSubmit(formattedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 0, maxHeight: '70vh', overflow: 'auto' }}>
      

      {/* Organization Information */}
      <StyledPaper sx={{ 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        mb: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 2 }}>
          <Box sx={{ 
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <FolderIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
              Thông Tin Đối Tác
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Thông tin cơ bản về tổ chức đối tác
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tên Đối Tác"
              variant="outlined"
              fullWidth
              value={organization.name}
              onChange={(e) => handleOrganizationChange('name', e.target.value)}
              required
              placeholder="Nhập tên đối tác..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #3b82f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #3b82f6',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#3b82f6'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <FolderIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={organization.email}
              onChange={(e) => handleOrganizationChange('email', e.target.value)}
              required
              type="email"
              placeholder="Nhập email đối tác..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #3b82f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #3b82f6',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#3b82f6'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <EmailOutlined fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Số Điện Thoại"
              variant="outlined"
              fullWidth
              value={organization.phone}
              onChange={(e) => handleOrganizationChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #3b82f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #3b82f6',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#3b82f6'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <PhoneIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Loại Đối Tác"
              variant="outlined"
              fullWidth
              select
              value={organization.type}
              onChange={(e) => handleOrganizationChange('type', e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #3b82f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #3b82f6',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#3b82f6'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <BusinessIcon fontSize="small" />
                  </Box>
                ),
              }}
            >
              <MenuItem value="HOSPITAL">🏥 Bệnh viện</MenuItem>
              <MenuItem value="CLINIC">🏥 Phòng khám</MenuItem>
              <MenuItem value="HEALTH_CENTER">🏥 Trung tâm y tế</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Địa Chỉ"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={organization.address}
              onChange={(e) => handleOrganizationChange('address', e.target.value)}
              placeholder="Nhập địa chỉ chi tiết của đối tác..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #3b82f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #3b82f6',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#3b82f6'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b', alignSelf: 'flex-start', mt: 1 }}>
                    <LocationOff fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Manager Information */}
      <StyledPaper sx={{ 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        mb: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 2 }}>
          <Box sx={{ 
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
              Thông Tin Người Quản Lý
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Thông tin liên hệ của người phụ trách
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Họ và Tên"
              variant="outlined"
              fullWidth
              value={managerInfo.fullName}
              onChange={(e) => handleManagerInfoChange('fullName', e.target.value)}
              required
              placeholder="Nhập họ và tên người quản lý..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #10b981'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #10b981',
                    '& fieldset': {
                      borderColor: '#10b981',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#10b981'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <PersonIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={managerInfo.email}
              onChange={(e) => handleManagerInfoChange('email', e.target.value)}
              required
              type="email"
              placeholder="Nhập email người quản lý..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #10b981'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #10b981',
                    '& fieldset': {
                      borderColor: '#10b981',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#10b981'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <EmailOutlined fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Số Điện Thoại"
              variant="outlined"
              fullWidth
              value={managerInfo.phone}
              onChange={(e) => handleManagerInfoChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại người quản lý..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 1px #10b981'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px #10b981',
                    '& fieldset': {
                      borderColor: '#10b981',
                      borderWidth: 2
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#10b981'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <PhoneIcon fontSize="small" />
                  </Box>
                ),
              }}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Action Buttons */}
      <Box sx={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 3,
        p: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b', mr: 2 }}>
            * Các trường bắt buộc phải được điền
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            size="large"
            sx={{
              minWidth: 140,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              height: 48,
              borderColor: '#d1d5db',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Hủy bỏ
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={!organization.name.trim() || !organization.email.trim() || !managerInfo.fullName.trim() || !managerInfo.email.trim()}
            sx={{
              minWidth: 160,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              height: 48,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                color: '#9ca3af',
                boxShadow: 'none'
              }
            }}
          >
            {isEditing ? '✓ Cập nhật Đối Tác' : '✓ Tạo Đối Tác'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Component cho Form thêm nhân viên
const AddStaffForm = ({ partnerId, onSubmit, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      fullName,
      position,
      isActive
    };
    onSubmit(formattedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Họ và Tên"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Nhập họ và tên nhân viên..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Vị Trí"
            variant="outlined"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            placeholder="Nhập vị trí (VD: Nurse, Technician)..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="contained" color="primary" type="submit" disabled={!fullName.trim() || !position.trim()}>
          Thêm
        </Button>
      </Box>
    </Box>
  );
};

// Component để hiển thị chi tiết đối tác
const PartnerDetail = ({ partner, onClose, onAddStaff, onDeleteStaff }) => {
  if (!partner) return null;
  const partnerData = partner.data || partner; // Xử lý cấu trúc dữ liệu { data: {...} }
  return (
   <Box sx={{ p: 0, maxHeight: '80vh', overflow: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mb: 3
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 1
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            width: 60,
            height: 60,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 3,
            backdropFilter: 'blur(10px)'
          }}>
            <BusinessIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {partnerData.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={partnerData.isActive ? 'Kích hoạt' : 'Khóa'}
                size="small"
                sx={{
                  backgroundColor: partnerData.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: partnerData.isActive ? '#22c55e' : '#ef4444',
                  fontWeight: 600,
                  border: `1px solid ${partnerData.isActive ? '#22c55e' : '#ef4444'}`,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {partnerData.type === 'CLINIC' ? '🏥 Phòng khám' : partnerData.type === 'HOSPITAL' ? '🏥 Bệnh viện' : '🏥 Trung tâm y tế'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Partner Information Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Contact Information */}
        <Grid item xs={12} md={8}>
          <Box sx={{ 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            p: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: 4,
              height: '100%',
              background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
            }} />
            
            <Typography variant="h6" sx={{ 
              color: '#1e293b', 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 2
            }}>
              <ContactMail sx={{ color: '#3b82f6' }} />
              Thông Tin Liên Hệ
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <EmailOutlined sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {partnerData.email || 'Không có'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <PhoneIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Số Điện Thoại
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {partnerData.phone || 'Không có'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    mt: 0.5
                  }}>
                    <LocationOff sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Địa Chỉ
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {partnerData.address || 'Không có'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Timestamps */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 3,
              p: 3,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              flex: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
              }} />
              
              <Typography variant="h6" sx={{ 
                color: '#1e293b', 
                fontWeight: 600, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pl: 2
              }}>
                <Schedule sx={{ color: '#f59e0b' }} />
                Thời Gian
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                {/* Ngày tạo */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Box sx={{ 
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <AddCircleOutlineIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                Ngày Tạo
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {new Date(partnerData.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                {new Date(partnerData.createdAt).toLocaleTimeString('vi-VN')}
              </Typography>
            </Box>
                </Box>

                {/* Cập nhật cuối */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Box sx={{ 
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <EditIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                Cập Nhật Cuối
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {new Date(partnerData.updatedAt).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                {new Date(partnerData.updatedAt).toLocaleTimeString('vi-VN')}
              </Typography>
            </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
              </Grid>

              {/* Manager Information */}
      <Box sx={{ 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 3,
        p: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        mb: 3
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
        }} />
        
        <Typography variant="h6" sx={{ 
          color: '#1e293b', 
          fontWeight: 600, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 2
        }}>
          <PersonIcon sx={{ color: '#10b981' }} />
          Thông Tin Người Quản Lý
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <PersonIcon sx={{ color: '#10b981', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Họ và Tên
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {partnerData.managerInfo?.fullName || 'Không có'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <EmailOutlined x={{ color: '#10b981', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {partnerData.managerInfo?.email || 'Không có'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <PhoneIcon sx={{ color: '#10b981', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Số Điện Thoại
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {partnerData.managerInfo?.phone || 'Không có'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Staff Members Section */}
      <Box sx={{ 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 3,
        p: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        mb: 3
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pl: 2 }}>
          <Typography variant="h6" sx={{ 
            color: '#1e293b', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <GroupIcon sx={{ color: '#8b5cf6' }} />
            Danh Sách Nhân Viên
            <Chip
              label={partnerData.staffMembers?.length || 0}
              size="small"
              sx={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                fontWeight: 600,
                ml: 1
              }}
            />
          </Typography>
          <Button
            variant="contained"
            startIcon={<UserPlus />}
            onClick={onAddStaff}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Thêm Nhân Viên
          </Button>
        </Box>

        {partnerData.staffMembers && partnerData.staffMembers.length > 0 ? (
          <Box sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    Mã Nhân Viên
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    Họ và Tên
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    Vị Trí
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    Trạng Thái
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    Hành Động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partnerData.staffMembers.map((staff, index) => (
                  <TableRow 
                    key={staff._id} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafbfc' },
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {staff._id}
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#1e293b'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        
                        {staff.fullName}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{staff.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={staff.isActive ? 'Kích hoạt' : 'Khóa'}
                        size="small"
                        sx={{
                          backgroundColor: staff.isActive ? '#dcfce7' : '#fef2f2',
                          color: staff.isActive ? '#166534' : '#dc2626',
                          fontWeight: 600,
                          border: `1px solid ${staff.isActive ? '#22c55e' : '#ef4444'}`
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xóa nhân viên">
                        <IconButton
                          onClick={() => onDeleteStaff(partnerData._id, staff._id, staff.fullName)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: '#fef2f2',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
            border: '2px dashed #d1d5db'
          }}>
            <GroupIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              Chưa có nhân viên
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
              Hiện tại chưa có nhân viên nào được thêm vào đối tác này
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 2,
        mt: 4,
        p: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <Button 
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#d1d5db',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Đóng
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{
            minWidth: 120,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Xác Nhận
        </Button>
      </Box>
    </Box>
  );
};

// Component chính
const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalPartners, setTotalPartners] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showStaffFormModal, setShowStaffFormModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [viewingPartner, setViewingPartner] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [showDeleteStaffDialog, setShowDeleteStaffDialog] = useState(false); // State mới để quản lý Dialog xóa
  const [staffToDelete, setStaffToDelete] = useState({ partnerId: null, staffId: null, staffName: null }); // State để lưu thông tin nhân viên cần xóa

  // State cho Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Helper function to show Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await partnerService.getListPartner({
        page: page + 1,
        limit,
        status: statusFilter,
        search
      });
      setPartners(response.data.partners || []);
      setTotalPartners(response.data.total || 0);
    } catch (err) {
      setError('Không thể tải danh sách đối tác. Vui lòng thử lại.');
      console.error(err);
      showSnackbar('Không thể tải danh sách đối tác. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingPartner(null);
    setShowFormModal(true);
  };

  const handleEditClick = async (partnerId) => {
    try {
      const response = await partnerService.getPartnerById(partnerId);
      setEditingPartner(response.data);
      setShowFormModal(true);
    } catch (err) {
      console.error('Không thể tải chi tiết đối tác để chỉnh sửa:', err);
      showSnackbar('Không thể tải chi tiết đối tác để chỉnh sửa.', 'error');
    }
  };

  const handleViewDetailClick = async (partnerId) => {
    try {
      const response = await partnerService.getPartnerById(partnerId);
      setViewingPartner(response);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Không thể tải chi tiết đối tác:', err);
      showSnackbar('Không thể tải chi tiết đối tác.', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPartner) {
        await partnerService.updatePartnerInfo(editingPartner._id, formData.organization);
        await partnerService.updatePartnerManager(editingPartner._id, formData.managerInfo);
        showSnackbar('Cập nhật đối tác và người quản lý thành công.', 'success');
      } else {
        await partnerService.createPartner(formData);
        showSnackbar('Thêm đối tác mới thành công.', 'success');
      }
      setShowFormModal(false);
      setEditingPartner(null);
      fetchPartners();
    } catch (err) {
      console.error('Lưu đối tác thất bại:', err);
      showSnackbar('Lưu đối tác thất bại. Vui lòng kiểm tra dữ liệu.', 'error');
    }
  };

  const handleAddStaffClick = (partnerId) => {
    setSelectedPartnerId(partnerId);
    setShowStaffFormModal(true);
  };

  const handleStaffFormSubmit = async (formData) => {
    try {
      await partnerService.addPartnerStaff(selectedPartnerId, formData);
      showSnackbar('Thêm nhân viên thành công.', 'success');
      setShowStaffFormModal(false);
      setViewingPartner(null); // Reset để tải lại chi tiết
      handleViewDetailClick(selectedPartnerId); // Tải lại chi tiết đối tác
      fetchPartners();
    } catch (err) {
      console.error('Thêm nhân viên thất bại:', err);
      showSnackbar('Thêm nhân viên thất bại.', 'error');
    }
  };

  const handleDeleteStaffClick = (partnerId, staffId, staffName) => {
    setStaffToDelete({ partnerId, staffId, staffName });
    setShowDeleteStaffDialog(true);
  };

  const handleConfirmDeleteStaff = async () => {
    const { partnerId, staffId } = staffToDelete;
    try {
      await partnerService.deletePartnerStaff(partnerId, staffId);
      showSnackbar('Xóa nhân viên thành công.', 'success');
      setShowDeleteStaffDialog(false);
      setViewingPartner(null); // Reset để tải lại chi tiết
      handleViewDetailClick(partnerId); // Tải lại chi tiết đối tác
      fetchPartners();
    } catch (err) {
      console.error('Xóa nhân viên thất bại:', err);
      showSnackbar('Xóa nhân viên thất bại.', 'error');
    }
  };

  const handleCancelDeleteStaff = () => {
    setShowDeleteStaffDialog(false);
    setStaffToDelete({ partnerId: null, staffId: null, staffName: null });
  };

  const handleStatusChange = async (partnerId, isActive) => {
    const newStatus = !isActive;
    Swal.fire({
      title: `Bạn có chắc chắn muốn ${newStatus ? 'kích hoạt' : 'khóa'} đối tác này không?`,
      text: "Hành động này sẽ thay đổi trạng thái của đối tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, thực hiện!',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await partnerService.updatePartnerStatus(partnerId, { isActive: newStatus });
          showSnackbar(`Cập nhật trạng thái đối tác thành công.`, 'success');
          fetchPartners();
        } catch (err) {
          console.error('Cập nhật trạng thái đối tác thất bại:', err);
          showSnackbar('Cập nhật trạng thái đối tác thất bại. Vui lòng thử lại.', 'error');
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

  return (
    <Box sx={{
      padding: 3,
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      width: "100%",
    }}>
      <div className="mx-auto">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full transform -translate-x-12 translate-y-12"></div>
          <div className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BusinessIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                  Quản Lý Đối Tác
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Quản lý thông tin đối tác, người quản lý và nhân viên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên đối tác..."
                  value={search}
                  onChange={(e) => handleSearchChange(e)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-5">
              <TextField
                label="Lọc theo trạng thái"
                variant="outlined"
                fullWidth
                select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="active">Kích hoạt</MenuItem>
                <MenuItem value="inactive">Khóa</MenuItem>
              </TextField>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => handleAddClick()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm Đối Tác Mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">Đang tải danh sách đối tác...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error" align="center" variant="h6" sx={{ mt: 5 }}>{error}</Typography>
      ) : (
        <StyledPaper elevation={8}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.dark' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mã Đối Tác</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên Đối Tác</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số Nhân Viên</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng Thái</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <TableRow key={partner._id}>
                    <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {partner._id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{partner.name}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.staffMembers?.length || 0}</TableCell>
                    <TableCell>
                      <Switch
                        checked={partner.isActive}
                        onChange={() => handleStatusChange(partner._id, partner.isActive)}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            color="info"
                            onClick={() => handleViewDetailClick(partner._id)}
                            aria-label="Xem chi tiết"
                            sx={{ '&:hover': { color: 'white', backgroundColor: 'info.main' } }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(partner._id)}
                            aria-label="Sửa"
                            sx={{ '&:hover': { color: 'white', backgroundColor: 'primary.main' } }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                    Không có đối tác nào để hiển thị.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPartners}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1 }}
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
            backdropFilter: "blur(4px)"
          }
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
            borderBottom: "1px solid rgba(255,255,255,0.1)"
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
              backdropFilter: "blur(10px)"
            }}
          >
            {editingPartner ? (
              <EditIcon sx={{ fontSize: 20, color: "white" }} />
            ) : (
              <AddIcon sx={{ fontSize: 20, color: "white" }} />
            )}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {editingPartner ? "Chỉnh sửa Đối Tác" : "Thêm Mới Đối Tác"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {editingPartner
                ? "Cập nhật thông tin đối tác và người quản lý"
                : "Tạo đối tác mới cho hệ thống"
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
                transform: "scale(1.05)"
              },
              transition: "all 0.2s ease"
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
            overflow: "hidden"
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
                width: editingPartner ? "100%" : "50%",
                background: "linear-gradient(90deg, #2196f3 0%, #1976d2 100%)",
                transition: "width 0.5s ease"
              }
            }}
          />
          
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e5e7eb"
              }}
            >
              <PartnerForm
                initialData={editingPartner}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowFormModal(false)}
                isEditing={!!editingPartner}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showStaffFormModal}
        onClose={() => setShowStaffFormModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon />
          <Typography variant="h6">Thêm Nhân Viên</Typography>
          <IconButton
            aria-label="Đóng"
            onClick={() => setShowStaffFormModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddStaffForm
            partnerId={selectedPartnerId}
            onSubmit={handleStaffFormSubmit}
            onCancel={() => setShowStaffFormModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
  open={showDetailModal}
  onClose={() => setShowDetailModal(false)}
  maxWidth="lg"
  fullWidth
  TransitionComponent={Slide}
  TransitionProps={{ direction: "up" }}
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: 'hidden',
      maxHeight: '92vh',
      minHeight: '60vh',
      boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
    }
  }}
>
  <DialogTitle sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    p: 3,
    position: 'relative',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      pr: 6
    }}>
      <Box sx={{
        p: 1.5,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Description sx={{ fontSize: 28, color: 'white' }} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          mb: 0.5,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Chi tiết Đối Tác
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.9,
          fontSize: '0.9rem'
        }}>
          Thông tin chi tiết và quản lý nhân viên
        </Typography>
      </Box>
    </Box>
    
    <IconButton
      aria-label="đóng"
      onClick={() => setShowDetailModal(false)}
      sx={{
        position: 'absolute',
        right: 16,
        top: 16,
        color: 'white',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: 44,
        height: 44
      }}
    >
      <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>
  </DialogTitle>

  <DialogContent
    dividers={false}
    sx={{
      backgroundColor: '#f8fafc',
      p: 0,
      maxHeight: 'calc(92vh - 140px)',
      overflowY: 'auto',
      position: 'relative',
      '&::-webkit-scrollbar': {
        width: 6,
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.03)',
        borderRadius: 8,
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 8,
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        }
      }
    }}
  >
    {/* Main Content */}
    <Box sx={{ p: 3 }}>
      <PartnerDetail
        partner={viewingPartner}
        onClose={() => setShowDetailModal(false)}
        onAddStaff={() => handleAddStaffClick(viewingPartner.data._id)}
        onDeleteStaff={handleDeleteStaffClick}
      />
    </Box>

  </DialogContent>
</Dialog>

      {/* Dialog xác nhận xóa nhân viên */}
      <Dialog
        open={showDeleteStaffDialog}
        onClose={handleCancelDeleteStaff}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
          }
        }}
      >
        <DialogTitle sx={{ color: '#d33', textAlign: 'center' }}>
          Xác Nhận Xóa Nhân Viên
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mb: 2 }}>
            Bạn có chắc chắn muốn xóa nhân viên "{staffToDelete.staffName}" không? Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleCancelDeleteStaff}>
            Hủy
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteStaff}>
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnerManagement;