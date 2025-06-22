import React, { useState, useEffect } from "react";
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

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // 'list', 'create', 'detail'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    website: "",
  });
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [managerFormData, setManagerFormData] = useState({
    managerId: "",
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getAllPartners();
      setPartners(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError("Failed to load partners data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerDetail = async (partnerId) => {
    try {
      setLoading(true);
      const data = await getPartnerById(partnerId);
      setSelectedPartner(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching partner details:", err);
      setError("Failed to load partner details. Please try again later.");
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

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData({
      ...staffFormData,
      [name]: value,
    });
  };

  const handleManagerInputChange = (e) => {
    const { name, value } = e.target;
    setManagerFormData({
      ...managerFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedPartner) {
        await updatePartner(selectedPartner.id, formData);
      } else {
        await createPartner(formData);
      }
      resetForm();
      fetchPartners();
      setActiveTab("list");
    } catch (err) {
      console.error("Error saving partner:", err);
      setError("Failed to save partner data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addPartnerStaff(selectedPartner.id, staffFormData);
      resetStaffForm();
      fetchPartnerDetail(selectedPartner.id);
    } catch (err) {
      console.error("Error adding staff:", err);
      setError("Failed to add staff member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceManager = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await replacePartnerManager(selectedPartner.id, managerFormData);
      resetManagerForm();
      fetchPartnerDetail(selectedPartner.id);
    } catch (err) {
      console.error("Error replacing manager:", err);
      setError("Failed to replace manager. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!confirm("Are you sure you want to remove this staff member?")) {
      return;
    }

    try {
      setLoading(true);
      await deletePartnerStaff(selectedPartner.id, staffId);
      fetchPartnerDetail(selectedPartner.id);
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError("Failed to delete staff member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (partnerId, newStatus) => {
    try {
      setLoading(true);
      await updatePartnerStatus(partnerId, { status: newStatus });
      fetchPartners();
      if (selectedPartner && selectedPartner.id === partnerId) {
        fetchPartnerDetail(partnerId);
      }
    } catch (err) {
      console.error("Error updating partner status:", err);
      setError("Failed to update partner status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    setFormData({
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      address: partner.address,
      description: partner.description,
      website: partner.website || "",
    });
    setActiveTab("create");
  };

  const handleViewDetail = (partnerId) => {
    fetchPartnerDetail(partnerId);
    setActiveTab("detail");
  };

  const resetForm = () => {
    setSelectedPartner(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      website: "",
    });
  };

  const resetStaffForm = () => {
    setStaffFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
    });
  };

  const resetManagerForm = () => {
    setManagerFormData({
      managerId: "",
    });
  };

  if (loading && partners.length === 0 && !selectedPartner) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Partner Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 mr-2 ${
              activeTab === "list"
                ? "border-b-2 border-blue-500 font-medium"
                : ""
            }`}
            onClick={() => setActiveTab("list")}
          >
            Partner List
          </button>
          <button
            className={`py-2 px-4 mr-2 ${
              activeTab === "create"
                ? "border-b-2 border-blue-500 font-medium"
                : ""
            }`}
            onClick={() => {
              resetForm();
              setActiveTab("create");
            }}
          >
            {selectedPartner ? "Edit Partner" : "Create Partner"}
          </button>
          {selectedPartner && (
            <button
              className={`py-2 px-4 ${
                activeTab === "detail"
                  ? "border-b-2 border-blue-500 font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab("detail")}
            >
              Partner Details
            </button>
          )}
        </div>
      </div>

      {activeTab === "list" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Partner List</h2>
          {partners.length === 0 ? (
            <p>No partners found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b">
                      <td className="py-2 px-4">{partner.name}</td>
                      <td className="py-2 px-4">{partner.email}</td>
                      <td className="py-2 px-4">{partner.phone}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            partner.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {partner.status || "inactive"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleViewDetail(partner.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(partner)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              partner.id,
                              partner.status === "active"
                                ? "inactive"
                                : "active"
                            )
                          }
                          className={`${
                            partner.status === "active"
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {partner.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPartner ? "Edit Partner" : "Create New Partner"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Partner Name</label>
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
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com"
                />
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : selectedPartner
                  ? "Update Partner"
                  : "Create Partner"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "detail" && selectedPartner && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Partner Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{selectedPartner.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{selectedPartner.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{selectedPartner.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Website</p>
                <p className="font-medium">
                  {selectedPartner.website ? (
                    <a
                      href={selectedPartner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedPartner.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{selectedPartner.address}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Description</p>
                <p className="font-medium">
                  {selectedPartner.description || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Manager</h3>
            {selectedPartner.manager ? (
              <div className="mb-4">
                <div className="p-4 border rounded-lg">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedPartner.manager.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedPartner.manager.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedPartner.manager.phone || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4">No manager assigned yet.</p>
            )}

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Replace Manager</h4>
              <form onSubmit={handleReplaceManager}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Manager ID</label>
                  <input
                    type="text"
                    name="managerId"
                    value={managerFormData.managerId}
                    onChange={handleManagerInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Replace Manager"}
                </button>
              </form>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Staff Members</h3>
            {selectedPartner.staff && selectedPartner.staff.length > 0 ? (
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Phone</th>
                      <th className="py-2 px-4 text-left">Role</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPartner.staff.map((staff) => (
                      <tr key={staff.id} className="border-b">
                        <td className="py-2 px-4">{staff.name}</td>
                        <td className="py-2 px-4">{staff.email}</td>
                        <td className="py-2 px-4">{staff.phone || "-"}</td>
                        <td className="py-2 px-4">{staff.role || "-"}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mb-4">No staff members found.</p>
            )}

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Add Staff Member</h4>
              <form onSubmit={handleAddStaff}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={staffFormData.name}
                      onChange={handleStaffInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={staffFormData.email}
                      onChange={handleStaffInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={staffFormData.phone}
                      onChange={handleStaffInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={staffFormData.role}
                      onChange={handleStaffInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Staff Member"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagement;
