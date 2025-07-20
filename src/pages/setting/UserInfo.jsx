import React, { useState, useEffect } from "react";
import { api, userService } from "~/libs/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";

// --- Component con ---
function FormField({ label, children }) {
  return (
    <div className="relative pb-5">
      <label className="block text-sm font-medium text-gray-500 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function CustomInput({ field, form, ...props }) {
  return (
    <input
      {...field}
      {...props}
      className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:bg-gray-200 disabled:cursor-not-allowed"
    />
  );
}

function CustomSelect({ field, ...props }) {
  return (
    <select
      {...field}
      {...props}
      className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:bg-gray-200 disabled:cursor-not-allowed"
    />
  );
}

// --- Schema Validation với Yup ---
const ProfileValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .required("Tên người dùng là bắt buộc"),
  phone: Yup.string()
    .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  dob: Yup.date()
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh không thể ở tương lai"),
  gender: Yup.string()
    .oneOf(["MALE", "FEMALE"], "Giới tính không hợp lệ")
    .required("Giới tính là bắt buộc"),
});

export default function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [isIdVisible, setIsIdVisible] = useState(false);
  const [copyText, setCopyText] = useState("Sao chép");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getProfile();
        if (response.data && response.data.success) {
          setUserData(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Lấy dữ liệu người dùng thất bại."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    const [year, month, day] = values.dob.split("-");
    const formattedDob = `${day}/${month}/${year}`;

    const apiPayload = {
      username: values.username,
      phone: values.phone,
      gender: values.gender === "MALE" ? "Male" : "Female",
      dob: formattedDob,
    };

    const result = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn lưu các thay đổi này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    });

    if (result.isConfirmed) {
      try {
        const response = await api.put("/user/me", apiPayload);
        if (response.data && response.data.success) {
          setUserData(response.data.data);
          setIsEditing(false);
          Swal.fire(
            "Thành công!",
            "Thông tin của bạn đã được cập nhật.",
            "success"
          );
        } else {
          throw new Error(response.data.message || "Cập nhật thất bại.");
        }
      } catch (err) {
        Swal.fire(
          "Lỗi!",
          err.response?.data?.message || "Đã có lỗi xảy ra.",
          "error"
        );
      }
    }
    setSubmitting(false);
  };

  const handleCopyId = () => {
    if (!userData?._id) return;
    navigator.clipboard.writeText(userData._id).then(() => {
      setCopyText("Đã sao chép!");
      setTimeout(() => setCopyText("Sao chép"), 2000);
    });
  };

  if (isLoading)
    return (
      <div className="p-8 text-center">Đang tải thông tin người dùng...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
  if (!userData) return null;

  return (
    <Formik
      initialValues={{
        username: userData.username || "",
        phone: userData.phone || "",
        email: userData.email || "",
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        gender: userData.gender || "MALE",
      }}
      validationSchema={ProfileValidationSchema}
      onSubmit={handleUpdateProfile}
      enableReinitialize
    >
      {({ isSubmitting, resetForm, values }) => (
        <Form>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* --- BANNER ĐÃ ĐƯỢC CẬP NHẬT MÀU --- */}
            <div className="h-40 bg-gradient-to-r from-blue-100 to-blue-200"></div>
            {/* --- KẾT THÚC CẬP NHẬT --- */}
            <div className="p-8">
              <div className="flex items-end -mt-44">
                <img
                  src={`https://i.pravatar.cc/150?u=${userData._id}`}
                  alt={userData.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="ml-6 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {userData.username}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {userData.email}{" "}
                    <span className="font-semibold text-gray-600">
                      ({userData.role})
                    </span>
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setIsEditing(false);
                        }}
                        className="px-7 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-7 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
                <FormField label="Tên người dùng">
                  <Field
                    name="username"
                    as={CustomInput}
                    disabled={!isEditing}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="absolute text-red-500 text-xs"
                  />
                </FormField>
                <FormField label="Số điện thoại">
                  <Field name="phone" as={CustomInput} disabled={!isEditing} />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="absolute text-red-500 text-xs"
                  />
                </FormField>
                <FormField label="Địa chỉ Email">
                  <Field
                    name="email"
                    type="email"
                    as={CustomInput}
                    disabled={true}
                  />
                </FormField>
                <FormField label="Ngày sinh">
                  <Field
                    name="dob"
                    type="date"
                    as={CustomInput}
                    disabled={!isEditing}
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="absolute text-red-500 text-xs"
                  />
                </FormField>
                <FormField label="Giới tính">
                  {isEditing ? (
                    <>
                      <Field
                        name="gender"
                        as={CustomSelect}
                        disabled={!isEditing}
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </Field>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="absolute text-red-500 text-xs"
                      />
                    </>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 border border-transparent rounded-lg cursor-not-allowed">
                      {values.gender === "MALE" ? "Nam" : "Nữ"}
                    </div>
                  )}
                </FormField>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-700">
                  ID Người Dùng
                </h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border flex items-center justify-between">
                  <p className="font-mono text-gray-700 tracking-wider">
                    {isIdVisible ? userData._id : "••••••••••••••••••••••••"}
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsIdVisible(!isIdVisible)}
                      className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      {isIdVisible ? <VisibilityOff /> : <Visibility />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <ContentCopy style={{ fontSize: "16px" }} />
                      <span>{copyText}</span>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-yellow-700">
                  Không tiết lộ thông tin này với bất kì ai.
                </p>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
