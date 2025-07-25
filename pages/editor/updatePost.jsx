"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import { get, post, put } from "@/services/api.service";
import { useRouter } from "next/router";
import EditorLayout from "@/layouts/EditorLayout";

export default function Post() {
    const router = useRouter()
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [form, setForm] = useState({
    title : "",
    content : ""
  });

  const fetchUser = async () => {
    if (!postId) return;
    try {
      const res = await get(`/posts/single/${postId}`);
      const user = res?.data.data;

      if (user) {
        setForm({
          title: user.title || "",
          content: user.content || ""
        });
      }
    } catch (err) {
      toast.error("Failed to fetch post");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast.error("Name and email are required");
      return;
    }

    try {
      if (!postId) {
        toast.error("Post ID is missing from URL");
        return;
      }

      await put(`/posts/${postId}`, form);
      toast.success("Post updated successfully");
      router.push("/editor/posts")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating post");
    }
  };

  return (
    <EditorLayout>
      <div className="p-6 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Edit User</h1>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-10">
          <div className="flex flex-col w-full">
            <label className="mb-1">Name</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col w-full ">
            <label className="mb-1">Email</label>
            <input
              type="text"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </EditorLayout>
  );
}