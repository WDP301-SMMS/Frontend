import React, { useState, useEffect } from "react";
import {
  getAllClasses,
  createClass,
  addStudentsToClass,
  removeStudentsFromClass,
} from "../../../libs/api/adminService";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "",
    teacherId: "",
    academicYear: "",
    description: "",
  });
  const [studentModal, setStudentModal] = useState({
    isOpen: false,
    classId: null,
    className: "",
    operation: "add", // 'add' or 'remove'
    studentIds: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getAllClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStudentModalInputChange = (e) => {
    const { name, value } = e.target;
    setStudentModal({
      ...studentModal,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createClass(formData);
      resetForm();
      fetchClasses();
    } catch (err) {
      console.error("Error creating class:", err);
      setError("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentOperation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const studentIdsArray = studentModal.studentIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      if (studentIdsArray.length === 0) {
        setError("Please enter at least one student ID");
        return;
      }

      if (studentModal.operation === "add") {
        await addStudentsToClass(studentModal.classId, studentIdsArray);
      } else {
        await removeStudentsFromClass(studentModal.classId, studentIdsArray);
      }

      closeStudentModal();
      fetchClasses();
    } catch (err) {
      console.error("Error updating class students:", err);
      setError(
        `Failed to ${
          studentModal.operation === "add" ? "add" : "remove"
        } students. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddStudentsModal = (classObj) => {
    setStudentModal({
      isOpen: true,
      classId: classObj.id,
      className: classObj.name,
      operation: "add",
      studentIds: "",
    });
  };

  const openRemoveStudentsModal = (classObj) => {
    setStudentModal({
      isOpen: true,
      classId: classObj.id,
      className: classObj.name,
      operation: "remove",
      studentIds: "",
    });
  };

  const closeStudentModal = () => {
    setStudentModal({
      isOpen: false,
      classId: null,
      className: "",
      operation: "add",
      studentIds: "",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      gradeLevel: "",
      teacherId: "",
      academicYear: "",
      description: "",
    });
  };

  if (loading && classes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Class Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Class Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Grade Level</label>
                <input
                  type="text"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Teacher ID</label>
                <input
                  type="text"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Class"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Class List</h2>
            {classes.length === 0 ? (
              <p>No classes found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Grade</th>
                      <th className="py-2 px-4 text-left">Teacher</th>
                      <th className="py-2 px-4 text-left">Academic Year</th>
                      <th className="py-2 px-4 text-left">Students Count</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classObj) => (
                      <tr key={classObj.id} className="border-b">
                        <td className="py-2 px-4">{classObj.name}</td>
                        <td className="py-2 px-4">{classObj.gradeLevel}</td>
                        <td className="py-2 px-4">
                          {classObj.teacherName || "-"}
                        </td>
                        <td className="py-2 px-4">{classObj.academicYear}</td>
                        <td className="py-2 px-4">
                          {classObj.studentsCount || 0}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => openAddStudentsModal(classObj)}
                            className="text-green-600 hover:text-green-800 mr-2"
                          >
                            Add Students
                          </button>
                          <button
                            onClick={() => openRemoveStudentsModal(classObj)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove Students
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Modal */}
      {studentModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {studentModal.operation === "add"
                ? "Add Students to"
                : "Remove Students from"}{" "}
              {studentModal.className}
            </h2>
            <form onSubmit={handleStudentOperation}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Student IDs (comma separated)
                </label>
                <textarea
                  name="studentIds"
                  value={studentModal.studentIds}
                  onChange={handleStudentModalInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  placeholder="e.g. 1, 2, 3"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeStudentModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-md ${
                    studentModal.operation === "add"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : studentModal.operation === "add"
                    ? "Add Students"
                    : "Remove Students"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
