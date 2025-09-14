import { useState } from "react";
import { FiLogOut, FiLogIn, FiUser, FiCreditCard } from "react-icons/fi";
import { logout } from "../utils/util";
import { useNavigate } from "react-router-dom";

export default function TopBar({
  isLoggedIn,
  isActive,
}: {
  isLoggedIn: boolean;
  isActive: boolean;
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md sticky">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/src/assets/lyzooLogo.png"
              alt="logo"
              className="h-10 w-auto max-h-12 object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <div className="flex flex-row items-center gap-2">
                  <span>Session Status</span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: isActive ? "green" : "red" }}
                  ></div>
                </div>
                <button className="hover:text-gray-200 flex items-center gap-1">
                  <FiCreditCard />
                  Billing
                </button>
                <button className="hover:text-gray-200 flex items-center gap-1">
                  <FiUser />
                  Account
                </button>
                <button
                  onClick={() => logout(navigate)}
                  className="hover:text-gray-200 flex items-center gap-1"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="hover:text-gray-200 flex items-center gap-1">
                  <FiLogIn />
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {isLoggedIn ? (
            <>
              <button className="block w-full text-left hover:text-gray-200 flex items-center gap-2">
                <FiCreditCard />
                Billing
              </button>
              <button className="block w-full text-left hover:text-gray-200 flex items-center gap-2">
                <FiUser />
                Account
              </button>
              <button className="block w-full text-left hover:text-gray-200 flex items-center gap-2">
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <button className="block w-full text-left hover:text-gray-200 flex items-center gap-2">
              <FiLogIn />
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
