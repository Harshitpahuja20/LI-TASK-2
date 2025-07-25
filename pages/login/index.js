// pages/login.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { post } from "@/services/api.service";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");

      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { role } = jwtDecode(token);
        if (role === "admin") router.replace("/admin/user");
        else if (role === "editor") router.replace("/editor/posts");
        else if (role === "viewer") router.replace("/viewer/posts");
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <div className="min-h-screen p-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
