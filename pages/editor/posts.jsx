"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import { get, post, del } from "@/services/api.service";
import { useRouter } from "next/router";
import EditorLayout from "@/layouts/EditorLayout";

export default function Post() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/posts", form);
      toast.success("Post created successfully");
      setForm({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating post");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      await del(`/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <EditorLayout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Editor Posts
        </h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-10 gap-6"
        >
          {["title", "content"].map((field) => (
            <div key={field} className="flex flex-col mt-3">
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

          <div className="md:col-span-2 mt-5 flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Create Post
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-white text-sm uppercase bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">title</th>
                <th className="px-4 py-3 text-left">content</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {posts.length > 0 ? (
                posts.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.title}</td>
                    <td className="px-4 py-2">{user.content}</td>
                     <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => router.push(`/editor/updatePost?id=${user._id}`)}
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
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EditorLayout>
  );
}
