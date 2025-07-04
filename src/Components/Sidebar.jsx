import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/authStore";
import { toast } from "react-toastify";
import { useNotificationStore } from "../Store/notificationStore";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const { userEmail, isLoggedIn, login, logout, isAdmin, isBlocked } =
    useAuthStore();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      login(email);
      setEmail("");
      setShowLoginForm(false);
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-gray-700 hover:text-purple-600 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-purple-700 mb-6">Menu</h2>

          {isLoggedIn ? (
            <div className="mb-4 p-2 bg-purple-50 rounded-md">
              <p className="text-sm text-purple-700">
                Logged in as: {userEmail}
              </p>
              <button
                onClick={handleLogout}
                className="w-full mt-2 !bg-[#AD46FF] !text-white text-sm py-2 rounded-md hover:!bg-[#9c3aeb] active:!bg-[#8a2fd9] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full !bg-[#AD46FF] !text-white text-sm py-2 rounded-md hover:!bg-[#9c3aeb] active:!bg-[#8a2fd9] transition-colors"
            >
              Login
            </button>
          )}

          {showLoginForm && (
            <div className="mb-4 p-3 bg-purple-50 rounded-md">
              <form onSubmit={handleLogin}>
                <label className="block text-sm text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 !bg-[#AD46FF] text-white py-1 px-3 rounded-md text-sm hover:!bg-[#9c3aeb] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1 !bg-gray-200 text-gray-700 py-1 px-3 rounded-md text-sm hover:!bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <nav>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                >
                  <i className="fas fa-home text-purple-500"></i>
                  <span>Home</span>
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                    >
                      <i className="fas fa-heart text-purple-500"></i>
                      <span>Favorites</span>
                    </Link>
                  </li>
                  {isLoggedIn && !isBlocked && (
                    <li>
                      <Link
                        to="/create"
                        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                      >
                        <i className="fas fa-plus-circle text-purple-500"></i>
                        <span>Create Post</span>
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                      >
                        <i className="fas fa-user text-purple-500"></i>
                        <span>Profile</span>
                      </Link>
                    </li>
                  )}
                  {isLoggedIn && (
                    <li>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                      >
                        <i className="fas fa-bell text-purple-500"></i>
                        <span>Notifications</span>
                        <NotificationBell />
                      </Link>
                    </li>
                  )}

                  {isLoggedIn && isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 rounded-md transition"
                      >
                        <i className="fas fa-shield-alt text-purple-500"></i>
                        <span>Admin Panel</span>
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function NotificationBell() {
  const { getUnreadCount } = useNotificationStore();
  const { isLoggedIn, userEmail } = useAuthStore();
  const unreadCount = getUnreadCount(userEmail);

  return (
    <div className="relative">
      <button className="p-2 rounded-full hover:bg-purple-100 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-purple-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {isLoggedIn && unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
