import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
   
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  return (
    <div className="admin-layout flex h-screen">
     
      <aside className="w-64 border border-gray-200 text-black flex flex-col shadow">
        <div className="p-5 text-2xl font-bold border-b border-gray-200 flex items-center">
          <i className="fas fa-user-shield text-gray-600 mr-3"></i>
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <Link to="/admin" className="block border hover:bg-gray-200 rounded-md p-2 transition duration-200 flex items-center">
            <i className="fas fa-home text-gray-500 mr-3 w-4"></i>
            Home
          </Link>
          <Link to="/admin/stores" className="block border hover:bg-gray-200 rounded-md p-2 transition duration-200 flex items-center">
            <i className="fas fa-store text-gray-500 mr-3 w-4"></i>
            Stores
          </Link>
          <Link to="/admin/users" className="block border hover:bg-gray-200 rounded-md p-2 transition duration-200 flex items-center">
            <i className="fas fa-users text-gray-500 mr-3 w-4"></i>
            All Users
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col justify-center">
       
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="ml-auto flex gap-4">
            <button
              onClick={handleUpdatePassword}
              className="border border-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white transition duration-200 flex items-center"
            >
              <i className="fas fa-key mr-2"></i>
              Update Password
            </button>
            <button 
              onClick={handleLogout}
              className="border border-red-400 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-200 flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;