"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import { get, post, put } from "@/services/api.service";
import { useRouter } from "next/router";

export default function User() {
    const router = useRouter()
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "viewer",
  });

  const fetchUser = async () => {
    if (!userId) return;
    try {
      const res = await get(`/users/${userId}`);
      const user = res?.data.data;

      if (user) {
        setForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "viewer",
        });
      }
    } catch (err) {
      toast.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      if (!userId) {
        toast.error("User ID is missing from URL");
        return;
      }

      await put(`/users/${userId}/role`, form);
      toast.success("User updated successfully");
      router.push("/admin/user")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating user");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Edit User</h1>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-10">
          <div className="flex flex-col w-full md:w-[49%]">
            <label className="mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col w-full md:w-[49%]">
            <label className="mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded"
              required
              disabled
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
