"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import { get, post, del } from "@/services/api.service";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await get("/users");
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/users", form);
      toast.success("User created successfully");
      setForm({ name: "", email: "", password: "", role: "viewer" });
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating user");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      await del(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Admin Users
        </h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {["name", "email", "password"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Create User
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-white text-sm uppercase bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {users.length > 0 ? (
                users.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => router.push(`/admin/updateUser?id=${user._id}`)}
                        className="text-green-600 ml-5 hover:text-green-800 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-4 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
