"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = ({ role }) => {
  const router = useRouter();

  const links = {
    admin: ["/admin/user" , "/admin/logs"],
    editor: ["/editor/posts"],
    viewer: ["/viewer/posts"],
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-semibold tracking-wide">{role?.slice(0,1).toUpperCase() + role?.slice(1)} Dashboard</div>
      <div className="flex items-center gap-4">
        {links[role]?.map((link) => (
          <Link
            key={link}
            href={link}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            {link.split("/")[2]?.toUpperCase()}
          </Link>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
