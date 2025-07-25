import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";

const withAuthProtection = (WrappedComponent, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const { role } = jwtDecode(token);

        if (!allowedRoles.includes(role)) {
          router.replace("/unauthorized"); // or redirect based on role
        } else {
          setLoading(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }, []);

    if (loading) return null; // or a loading spinner

    return <WrappedComponent {...props} />;
  };
};

export default withAuthProtection;
