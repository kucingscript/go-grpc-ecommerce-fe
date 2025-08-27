import { Link, useNavigate } from "react-router-dom";
import { getAuthClient } from "../../api/grpc/client";
import { useAuthStore } from "../../store/auth";
import useGrpcApi from "../../hooks/useGrpcApi";

function AdminNavbar() {
  const logoutApi = useGrpcApi();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logoutApi.callApi(getAuthClient().logout({}));

    logout();
    localStorage.removeItem("access_token");
    navigate("/");
  };
  return (
    <nav
      className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark"
      aria-label="Admin navigation bar"
    >
      <div className="container">
        <Link className="navbar-brand" to="/admin">
          Furni<span>.</span> Admin
        </Link>

        <div className="d-flex align-items-center">
          <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0">
            <li className="nav-item margin-right">
              <Link className="nav-link" to="/admin/profile/change-password">
                <img src="/images/user.svg" alt="Admin Profile" />
              </Link>
            </li>
            <li onClick={handleLogout} className="nav-item">
              <button className="nav-link border-0 bg-transparent">
                <img src="/images/sign-out.svg" alt="Logout" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
