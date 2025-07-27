import React, { useState, useEffect, useMemo } from "react";
import { api } from "~/libs/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadService from "~/libs/api/services/uploadService";

import Swal from 'sweetalert2';
import { useDebounce } from "~/libs/hooks/useDebounce";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  TablePagination, IconButton, Tooltip, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// --- Validation Schema using Yup ---
const PostSchema = Yup.object().shape({
  title: Yup.string().min(5, "Tiêu đề quá ngắn!").required("Tiêu đề là bắt buộc"),
  coverImageUrl: Yup.string().url("URL ảnh không hợp lệ").required("Ảnh bìa là bắt buộc"),
  content: Yup.string().min(20, "Nội dung quá ngắn!").required("Nội dung là bắt buộc"),
});

// --- Reusable Modal Component for Add/Edit ---
const PostFormModal = ({ isOpen, onClose, onSubmit, postToEdit }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const isEditMode = Boolean(postToEdit);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleFileChange = async (e, setFieldValue) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response && response.url) {
                setFieldValue("coverImageUrl", response.url);
                toast.success("Tải ảnh lên thành công!");
            } else {
                throw new Error("API upload không trả về URL hợp lệ.");
            }
        } catch (error) {
            toast.error("Tải ảnh lên thất bại: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen && !isVisible) return null;

    const initialValues = {
        title: isEditMode ? postToEdit.title : "",
        coverImageUrl: isEditMode ? postToEdit.coverImageUrl : "",
        content: isEditMode ? postToEdit.content : "",
    };

    return (
        <div className={`fixed inset-0 bg-gray-900 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out ${isVisible ? "bg-opacity-60" : "bg-opacity-0"}`}>
            <div className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all duration-300 ease-in-out ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{isEditMode ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={PostSchema}
                    onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers, postToEdit?._id)}
                    enableReinitialize
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                <Field type="text" name="title" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4157ff] focus:border-[#4157ff]" />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="coverImageFile" className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
                                <input type="file" name="coverImageFile" onChange={(e) => handleFileChange(e, setFieldValue)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*" />
                                {isUploading && <p className="text-sm text-blue-600 mt-2">Đang tải ảnh lên...</p>}
                                <Field type="hidden" name="coverImageUrl" />
                                <ErrorMessage name="coverImageUrl" component="div" className="text-red-500 text-sm mt-1" />
                                {values.coverImageUrl && !isUploading && (<img src={values.coverImageUrl} alt="Preview" className="mt-2 rounded-md h-32 object-cover border" />)}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Nội dung (HTML)</label>
                                <Field as="textarea" name="content" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4157ff] focus:border-[#4157ff]" />
                                <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Hủy</button>
                                <button type="submit" disabled={isSubmitting || isUploading} className="px-4 py-2 bg-[#4157ff] text-white rounded-md hover:bg-[#3247d6] transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

// --- Main Component ---
const BlogManagement = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const fetchAllPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/blogs?limit=1000`);
                setAllPosts(response.data.data);
            } catch (err) {
                setError(err.message || "Không thể tải danh sách bài viết.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, [refetchTrigger]);

    const filteredPosts = useMemo(() => {
        if (!debouncedSearchTerm) {
            return allPosts;
        }
        return allPosts.filter(post =>
            post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [allPosts, debouncedSearchTerm]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredPosts.length / limit);
    }, [filteredPosts, limit]);
    
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * limit;
        return filteredPosts.slice(startIndex, startIndex + limit);
    }, [filteredPosts, currentPage, limit]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const handleOpenAddModal = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = async (postToEdit) => {
        try {
            const response = await api.get(`/blogs/${postToEdit._id}`);
            setEditingPost(response.data.data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error("Không thể tải dữ liệu chi tiết của bài viết.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleSubmitPost = async (values, { setSubmitting }, postId) => {
        const isEditMode = Boolean(postId);
        const payload = { ...values };
        try {
            if (isEditMode) {
                await api.patch(`/blogs/${postId}`, payload);
                toast.success("Cập nhật bài viết thành công!");
            } else {
                payload.publishedAt = new Date().toISOString();
                await api.post("/blogs", payload);
                toast.success("Thêm bài viết mới thành công!");
            }
            handleCloseModal();
            setRefetchTrigger(prev => prev + 1);
        } catch (err) {
            toast.error(`${isEditMode ? "Cập nhật" : "Thêm"} bài viết thất bại: ` + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (postId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4157ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vâng, xóa nó!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/blogs/${postId}`);
                    toast.success("Xóa bài viết thành công!");
                    setRefetchTrigger(prev => prev + 1);
                } catch (err) {
                    toast.error("Xóa bài viết thất bại: " + (err.response?.data?.message || err.message));
                }
            }
        });
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <PostFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitPost} postToEdit={editingPost} />
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 mb-6 flex items-center">
                    <div className="bg-white/30 p-3 rounded-lg mr-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                    <div><h1 className="text-2xl font-bold text-white">Quản Lý Blog</h1><p className="text-blue-100">Tạo và quản lý các bài viết cho trang của bạn</p></div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 mb-6"><div className="flex justify-between items-center">
                    <div className="relative w-full max-w-sm"><input type="text" placeholder="Tìm kiếm theo tên bài viết..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /><svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    <button type="button" onClick={handleOpenAddModal} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Thêm Mới</button>
                </div></div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: "bold", width: 80 }}>STT</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Tên Bài Viết</TableCell>
                        <TableCell sx={{ fontWeight: "bold", width: 180 }}>Tác giả</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", width: 140 }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ color: 'red' }}>{error}</TableCell>
                        </TableRow>
                      ) : paginatedPosts.length > 0 ? (
                        paginatedPosts.map((post, idx) => (
                          <TableRow key={post._id} hover>
                            <TableCell align="center">{(currentPage - 1) * limit + idx + 1}</TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.authorInfo.fullName}</TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Sửa">
                                  <IconButton color="primary" onClick={() => handleOpenEditModal(post)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton color="error" onClick={() => handleDelete(post._id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ color: 'gray' }}>Không có bài viết nào phù hợp.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={filteredPosts.length}
                    rowsPerPage={limit}
                    page={currentPage - 1}
                    onPageChange={(_, newPage) => setCurrentPage(newPage + 1)}
                    onRowsPerPageChange={e => { setCurrentPage(1); /* setLimit nếu muốn thay đổi limit */ }}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                    sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1 }}
                  />
                </TableContainer>
            </div>
            </div>
        </>
    );
};

export default BlogManagement;