"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { get } from "@/services/api.service";
import ViewerLayout from "@/layouts/ViewerLayout";

export default function Post() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await get("/posts/all");
      setPosts(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <ViewerLayout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Editor Posts
        </h1>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-white text-sm uppercase bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">title</th>
                <th className="px-4 py-3 text-left">content</th>
                <th className="px-4 py-3 text-left">createdBy</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {posts.length > 0 ? (
                posts.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.title}</td>
                    <td className="px-4 py-2">{user.content}</td>
                    <td className="px-4 py-2">{user?.createdBy?.name || 'N/A'}</td>
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
    </ViewerLayout>
  );
}
