import { useContext } from "react";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";

export default function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";
  const { loading } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <ScrollToTop />
      {!hideNavbar && <Header />}
      {loading ? (
        <Loading />
      ) : (
        <main className="flex-1">
          <ToastContainer
            theme="dark"
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
          <Outlet />
        </main>
      )}
    </div>
  );
}
