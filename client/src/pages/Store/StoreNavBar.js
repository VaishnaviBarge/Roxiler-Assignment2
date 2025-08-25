import React from "react";
import { useNavigate } from "react-router-dom";

const StoreNavbar = () => {
  const navigate = useNavigate();

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <nav className="flex justify-between items-center text-black p-4">
      <div className="text-xl font-bold">Store Dashboard</div>
      <div className="space-x-4">
        <button
          onClick={handleUpdatePassword}
          className="border border-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          Update Password
        </button>
        <button
          onClick={handleLogout}
          className="border border-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default StoreNavbar;
