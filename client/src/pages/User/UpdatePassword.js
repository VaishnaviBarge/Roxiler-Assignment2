import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateNewPassword = () => {
    const newErrors = {};

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = "Password must be 8-16 characters with at least 1 uppercase letter and 1 special character";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCurrentPasswordChange = (value) => {
    setCurrentPassword(value);
    if (message) setMessage("");
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    
    if (errors.newPassword) {
      setErrors({ ...errors, newPassword: "" });
    }
    
    if (message) setMessage("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!validateNewPassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setMessage("You must be logged in to update your password");
        setIsLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setErrors({});
      } else {
        setMessage(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageStyle = () => {
    if (message.includes("successfully")) {
      return "text-green-700 bg-green-50 border-green-200";
    }
    return "text-red-700 bg-red-50 border-red-200";
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <div>
    <div className="flex-1 flex flex-col justify-center">
      
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="ml-auto flex gap-4">
            
            <button onClick={handleLogout}
              className="border border-red-400 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white">
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
        
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Update Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Change your account password securely
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input id="current-password" type="password" value={currentPassword} onChange={(e) => handleCurrentPasswordChange(e.target.value)} required
                placeholder="Enter your current password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input id="new-password" type="password" value={newPassword} onChange={(e) => handleNewPasswordChange(e.target.value)} required placeholder="Enter your new password"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.newPassword && (<p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>)}
            </div>

            <button
              type="submit"
              disabled={isLoading || !currentPassword || !newPassword}
              className={`w-full py-2 px-4 rounded-md font-medium transition duration-200 ${isLoading || !currentPassword || !newPassword
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"}`}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-3 rounded-md border ${getMessageStyle()}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={newPassword.length >= 8 && newPassword.length <= 16 ? "text-green-600" : ""}>
                • 8-16 characters {newPassword.length >= 8 && newPassword.length <= 16 ? "✓" : ""}
              </li>
              <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                • At least 1 uppercase letter {/[A-Z]/.test(newPassword) ? "✓" : ""}
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : ""}>
                • At least 1 special character {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : ""}
              </li>
              <li>• Different from current password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdatePassword;