"use client";

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <div className="text-red-600 text-6xl font-bold mb-4">401</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
    </div>
  );
}
