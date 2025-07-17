import React, { createContext, useState, useContext, useEffect } from "react";
import { getMyChildren } from "../api/parentService";
;

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
    const fetchData = async () => {
      try {
        // Kiểm tra localStorage trước
        const savedProfiles = localStorage.getItem("healthProfiles");
        const savedParents = localStorage.getItem("parents");

        if (savedProfiles) {
          setHealthProfiles(JSON.parse(savedProfiles));
        }

        if (savedParents) {
          setParents(JSON.parse(savedParents));
        }
        const savedCurrentParent = localStorage.getItem("currentParent");
        if (savedCurrentParent) {
          setCurrentParent(JSON.parse(savedCurrentParent));
        }

        // Fetch real student data from API
        try {
          const response = await getMyChildren();
          if (
            response.success &&
            response.students &&
            response.students.length > 0
          ) {
            // Transform API data to match the expected format in the app
            const formattedProfiles = response.students.map((student) => ({
              id: student._id,
              studentInfo: {
                studentId: student._id,
                studentName: student.fullName,
                class: student.classId ? student.classId.className : "N/A",
                dateOfBirth: new Date(student.dateOfBirth).toLocaleDateString(
                  "vi-VN"
                ),
                parentId: student.parentId,
                relationship: "parent",
              },
              // Default empty health info since it might be filled in later
              healthInfo: {
                allergies: [],
                chronicConditions: [],
                medicalHistory: [],
                height: "",
                weight: "",
                bloodType: "",
                emergencyContact: {
                  name: "",
                  relationship: "",
                  phone: "",
                },
              },
              hasAllergies: false,
              hasChronicConditions: false,
              status: student.status,
            }));

            // Update the health profiles with the actual student data
            setHealthProfiles(formattedProfiles);

            // Update current parent's children list
            if (currentParent) {
              const updatedParent = {
                ...currentParent,
                children: formattedProfiles.map((profile) => profile.id),
              };
              setCurrentParent(updatedParent);
              localStorage.setItem(
                "currentParent",
                JSON.stringify(updatedParent)
              );
            }
          }
        } catch (error) {
          console.error("Error fetching students from API:", error);
          // Keep using the local data if API fails
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setLoading(false);
      }
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
  }; // Lấy danh sách hồ sơ của con của phụ huynh hiện tại
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
