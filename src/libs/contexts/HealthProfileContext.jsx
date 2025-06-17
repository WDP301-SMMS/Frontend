import React, { createContext, useState, useContext, useEffect } from "react";

// Dữ liệu mẫu
const SAMPLE_HEALTH_PROFILES = [
  {
    id: "HS001",
    studentInfo: {
      studentId: "HS001",
      studentName: "Nguyễn Văn An",
      class: "1A1",
      dateOfBirth: "2010-05-15",
      parentName: "Nguyễn Văn Bình",
      parentId: "PH001", // Thêm parentId để liên kết với phụ huynh
      contactNumber: "0912345678",
      relationship: "father",
    },
    healthInfo: {
      allergies: [
        {
          type: "Thực phẩm",
          reaction: "Phát ban, ngứa",
          severity: "medium",
          notes: "Dị ứng với tôm, cua và các loại hải sản có vỏ",
        },
        {
          type: "Thuốc",
          reaction: "Sốt, phát ban",
          severity: "severe",
          notes: "Dị ứng với penicillin",
        },
      ],
      chronicConditions: [
        {
          condition: "Hen suyễn",
          diagnosis: "Tháng 3/2022",
          medication: "Ventolin (khi cần)",
          notes: "Cần mang theo thuốc xịt khi tham gia hoạt động thể thao",
        },
      ],
      medicalHistory: [
        {
          condition: "Phẫu thuật ruột thừa",
          hospital: "Bệnh viện Đa khoa Hà Nội",
          date: "2023-08-10",
          treatment: "Phẫu thuật nội soi",
          notes: "Đã hồi phục hoàn toàn",
        },
      ],
      vision: {
        rightEye: "6/10",
        leftEye: "6/9",
        wearGlasses: true,
        colorBlindness: false,
        notes: "Cận thị nhẹ, đã đeo kính điều chỉnh",
      },
      hearing: {
        rightEar: "Bình thường",
        leftEar: "Bình thường",
        hearingAid: false,
        notes: "",
      },
      vaccinations: [
        {
          name: "MMR (Sởi, Quai bị, Rubella)",
          date: "2011-05-20",
          location: "Trung tâm y tế dự phòng",
          notes: "Mũi 1",
        },
        {
          name: "MMR (Sởi, Quai bị, Rubella)",
          date: "2015-06-15",
          location: "Trung tâm y tế dự phòng",
          notes: "Mũi 2",
        },
        {
          name: "COVID-19 (Pfizer)",
          date: "2023-02-10",
          location: "Bệnh viện Bạch Mai",
          notes: "Không có phản ứng phụ",
        },
      ],
    },
    status: "complete",
    lastUpdated: "2025-05-10",
    createdBy: "Nguyễn Văn Bình",
    hasAllergies: true,
    hasChronicConditions: true,
  },
  {
    id: "HS002",
    studentInfo: {
      studentId: "HS002",
      studentName: "Nguyễn Thị Mai",
      class: "2A1",
      dateOfBirth: "2012-08-20",
      parentName: "Nguyễn Văn Bình",
      parentId: "PH001",
      contactNumber: "0912345678",
      relationship: "father",
    },
    healthInfo: {
      allergies: [
        {
          type: "Thực phẩm",
          reaction: "Nổi mề đay",
          severity: "mild",
          notes: "Dị ứng với sữa bò",
        },
      ],
      chronicConditions: [],
      medicalHistory: [],
      vision: {
        rightEye: "9/10",
        leftEye: "9/10",
        wearGlasses: false,
        colorBlindness: false,
        notes: "",
      },
      hearing: {
        rightEar: "Bình thường",
        leftEar: "Bình thường",
        hearingAid: false,
        notes: "",
      },
      vaccinations: [
        {
          name: "MMR (Sởi, Quai bị, Rubella)",
          date: "2013-05-10",
          location: "Trung tâm y tế dự phòng",
          notes: "Mũi 1",
        },
        {
          name: "MMR (Sởi, Quai bị, Rubella)",
          date: "2017-06-15",
          location: "Trung tâm y tế dự phòng",
          notes: "Mũi 2",
        },
      ],
    },
    status: "complete",
    lastUpdated: "2025-05-14",
    createdBy: "Nguyễn Văn Bình",
    hasAllergies: true,
    hasChronicConditions: false,
  },
];

const SAMPLE_PARENTS = [
  {
    id: "PH001",
    name: "Nguyễn Văn Bình",
    contactNumber: "0912345678",
    email: "binh.nguyen@example.com",
    children: ["HS001", "HS002"], 
  },
];

// Tạo Health Profile Context
const HealthProfileContext = createContext();

export const HealthProfileProvider = ({ children }) => {
  const [healthProfiles, setHealthProfiles] = useState([]);
  const [parents, setParents] = useState([]);
  const [currentParent, setCurrentParent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giả lập việc lấy dữ liệu từ API
  useEffect(() => {
    // Trong một ứng dụng thực tế, đây sẽ là một API call
    const fetchData = () => {
      setTimeout(() => {
        // Kiểm tra localStorage trước
        const savedProfiles = localStorage.getItem("healthProfiles");
        const savedParents = localStorage.getItem("parents");

        if (savedProfiles) {
          setHealthProfiles(JSON.parse(savedProfiles));
        } else {
          // Nếu không có dữ liệu trong localStorage, sử dụng dữ liệu mẫu
          setHealthProfiles(SAMPLE_HEALTH_PROFILES);
          // Lưu dữ liệu mẫu vào localStorage
          localStorage.setItem(
            "healthProfiles",
            JSON.stringify(SAMPLE_HEALTH_PROFILES)
          );
        }

        if (savedParents) {
          setParents(JSON.parse(savedParents));
        } else {
          setParents(SAMPLE_PARENTS);
          localStorage.setItem("parents", JSON.stringify(SAMPLE_PARENTS));
        }

        // Giả lập người dùng đăng nhập (phụ huynh)
        const savedCurrentParent = localStorage.getItem("currentParent");
        if (savedCurrentParent) {
          setCurrentParent(JSON.parse(savedCurrentParent));
        } else {
          // Mặc định đăng nhập là phụ huynh đầu tiên
          setCurrentParent(SAMPLE_PARENTS[0]);
          localStorage.setItem(
            "currentParent",
            JSON.stringify(SAMPLE_PARENTS[0])
          );
        }

        setLoading(false);
      }, 500); // Giả lập độ trễ 500ms
    };

    fetchData();
  }, []);

  // Lấy hồ sơ sức khỏe theo ID
  const getProfileById = (profileId) => {
    return healthProfiles.find((profile) => profile.id === profileId) || null;
  };

  // Thêm hồ sơ sức khỏe mới
  const addHealthProfile = (newProfile) => {
    const updatedProfiles = [...healthProfiles, newProfile];
    setHealthProfiles(updatedProfiles);
    localStorage.setItem("healthProfiles", JSON.stringify(updatedProfiles));
    return newProfile;
  };

  // Cập nhật hồ sơ sức khỏe
  const updateHealthProfile = (profileId, updatedProfile) => {
    const profileIndex = healthProfiles.findIndex(
      (profile) => profile.id === profileId
    );

    if (profileIndex !== -1) {
      const updatedProfiles = [...healthProfiles];
      updatedProfiles[profileIndex] = {
        ...updatedProfiles[profileIndex],
        ...updatedProfile,
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      setHealthProfiles(updatedProfiles);
      localStorage.setItem("healthProfiles", JSON.stringify(updatedProfiles));
      return updatedProfiles[profileIndex];
    }

    return null;
  };

  // Xóa hồ sơ sức khỏe
  const deleteHealthProfile = (profileId) => {
    const updatedProfiles = healthProfiles.filter(
      (profile) => profile.id !== profileId
    );
    setHealthProfiles(updatedProfiles);
    localStorage.setItem("healthProfiles", JSON.stringify(updatedProfiles));
  };

  // Lấy thông tin phụ huynh theo ID
  const getParentById = (parentId) => {
    return parents.find((parent) => parent.id === parentId) || null;
  };

  // Lấy danh sách hồ sơ của con của phụ huynh hiện tại
  const getCurrentParentProfiles = () => {
    if (!currentParent) return [];
    return healthProfiles.filter((profile) =>
      currentParent.children.includes(profile.id)
    );
  };

  // Lấy danh sách hồ sơ của con của một phụ huynh cụ thể
  const getProfilesByParentId = (parentId) => {
    const parent = getParentById(parentId);
    if (!parent) return [];
    return healthProfiles.filter((profile) =>
      parent.children.includes(profile.id)
    );
  };

  // Thêm con mới cho phụ huynh
  const addChildToParent = (parentId, childId) => {
    const parentIndex = parents.findIndex((parent) => parent.id === parentId);
    if (parentIndex === -1) return null;

    const updatedParents = [...parents];
    if (!updatedParents[parentIndex].children.includes(childId)) {
      updatedParents[parentIndex].children.push(childId);
      setParents(updatedParents);
      localStorage.setItem("parents", JSON.stringify(updatedParents));
    }

    return updatedParents[parentIndex];
  };

  // Xóa con khỏi phụ huynh
  const removeChildFromParent = (parentId, childId) => {
    const parentIndex = parents.findIndex((parent) => parent.id === parentId);
    if (parentIndex === -1) return null;

    const updatedParents = [...parents];
    updatedParents[parentIndex].children = updatedParents[
      parentIndex
    ].children.filter((id) => id !== childId);

    setParents(updatedParents);
    localStorage.setItem("parents", JSON.stringify(updatedParents));
    return updatedParents[parentIndex];
  };

  // Đăng nhập phụ huynh (giả lập)
  const loginParent = (parentId) => {
    const parent = getParentById(parentId);
    if (parent) {
      setCurrentParent(parent);
      localStorage.setItem("currentParent", JSON.stringify(parent));
      return parent;
    }
    return null;
  };

  // Đăng xuất
  const logoutParent = () => {
    setCurrentParent(null);
    localStorage.removeItem("currentParent");
  };

  // Giá trị context được cung cấp
  const value = {
    healthProfiles,
    loading,
    getProfileById,
    addHealthProfile,
    updateHealthProfile,
    deleteHealthProfile,
    getParentById,
    getCurrentParentProfiles,
    getProfilesByParentId,
    addChildToParent,
    removeChildFromParent,
    loginParent,
    logoutParent,
  };

  return (
    <HealthProfileContext.Provider value={value}>
      {children}
    </HealthProfileContext.Provider>
  );
};

// Hook để sử dụng Health Profile Context
export const useHealthProfiles = () => {
  const context = useContext(HealthProfileContext);
  if (!context) {
    throw new Error(
      "useHealthProfiles must be used within a HealthProfileProvider"
    );
  }
  return context;
};
