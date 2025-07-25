"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import { get} from "@/services/api.service";

export default function User() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await get("/logs");
      setLogs(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          All Logs
        </h1>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-white text-sm uppercase bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {logs.length > 0 ? (
                logs.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.action}</td>
                    <td className="px-4 py-2">{user.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-4 text-gray-500"
                  >
                    No logs found.
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
