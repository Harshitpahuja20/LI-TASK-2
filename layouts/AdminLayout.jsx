// layouts/AdminLayout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import Navbar from "../components/navbars/navbar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded?.role !== "admin") {
        router.replace("/unauthorized");
      } else {
        setRole("admin");
      }
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/login");
    }
  }, []);

  if (!role) return null; // or a loading spinner

  return (
    <div>
      <Navbar role={role} />
      <main className="p-4">{children}</main>
    </div>
  );
}
