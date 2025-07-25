import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
