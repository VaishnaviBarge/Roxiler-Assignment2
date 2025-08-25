import { useEffect, useState, useCallback } from "react";

const UserRecord = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});

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

  const fetchUsers = useCallback(async () => {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/admin/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateForm = () => {
    const newErrors = {};

    if (newUser.name.length < 20) {
      newErrors.name = "Name must be at least 20 characters";
    } else if (newUser.name.length > 60) {
      newErrors.name = "Name cannot exceed 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordRegex.test(newUser.password)) {
      newErrors.password = "Password must be 8-16 characters with at least 1 uppercase letter and 1 special character";
    }

    if (newUser.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        alert("User created successfully!");
        setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
        setErrors({});
        fetchUsers();
      } else {
        alert(data.error || "Failed to create user");
      }
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'store_owner':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return 'fas fa-user-shield';
      case 'store_owner':
        return 'fas fa-store';
      default:
        return 'fas fa-user';
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-users text-3xl text-gray-600 mr-3"></i>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Add new users and manage existing user accounts</p>
        </div>

        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6 flex items-center">
            <i className="fas fa-user-plus text-xl text-gray-600 mr-3"></i>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add New User</h2>
              <p className="text-sm text-gray-600">Create a new user account with the specified role</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user text-gray-500 mr-2"></i>Full Name *
                </label>
                <input type="text" placeholder="Enter full name" value={newUser.name} onChange={(e) => handleInputChange('name', e.target.value)} required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'}`}/>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {newUser.name.length}/60 characters (minimum 20 required)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-envelope text-gray-500 mr-2"></i>Email Address *
                </label>
                <input type="email" placeholder="Enter email address" value={newUser.email} onChange={(e) => handleInputChange('email', e.target.value)} required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}/>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      {errors.email}
                    </p>
                  )} 
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-lock text-gray-500 mr-2"></i>Password *
                </label>
                <input type="password" placeholder="Enter password" value={newUser.password} onChange={(e) => handleInputChange('password', e.target.value)} required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}/>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      {errors.password}
                    </p>
                  )}
                <p className="mt-1 text-xs text-gray-500">
                  8-16 characters with 1 uppercase & 1 special character
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>Address
                </label>
                <input type="text" placeholder="Enter address (optional)" value={newUser.address} onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 
                  ${ errors.address ? 'border-red-500' : 'border-gray-300'}`}/>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {errors.address}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {newUser.address.length}/400 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user-tag text-gray-500 mr-2"></i>Role *
                </label>
                <select value={newUser.role} onChange={(e) => handleInputChange('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white">
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-end mb-5">
                <button type="button" onClick={handleAddUser}
                  className="w-full border border-black text-black py-2 px-2 rounded-md hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium">
                  <i className="fas fa-plus-circle mr-2"></i>Add User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <i className="fas fa-filter text-xl text-gray-600 mr-3"></i>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Filter Users</h2>
                <p className="text-sm text-gray-600">Search and filter users by various criteria</p>
              </div>
            </div>
            <button onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 flex items-center">
              <i className="fas fa-times-circle mr-2"></i>Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-user text-gray-500 mr-2"></i>Name
              </label>
              <input type="text" placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope text-gray-500 mr-2"></i>Email
              </label>
              <input type="text" placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>Address
              </label>
              <input type="text" placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-user-tag text-gray-500 mr-2"></i>Role
              </label>
              <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white">
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-list text-xl text-gray-600 mr-3"></i>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Users List</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {users.length} {users.length === 1 ? 'user' : 'users'} found
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <i className="fas fa-hashtag mr-1"></i>Total: {users.length}
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-slash text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {Object.values(filters).some(f => f)  ? "Try adjusting your filters or add a new user." : "Add your first user using the form above."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-user mr-2"></i>Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-envelope mr-2"></i>Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-map-marker-alt mr-2"></i>Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-user-tag mr-2"></i>Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.address || <span className="text-gray-400 italic">No address</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}
                        >
                          <i className={`${getRoleIcon(user.role)} mr-2`}></i>
                          {user.role === "store_owner"
                            ? `Store Owner (${user.avg_rating ?? "N/A"} stars )`
                            : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRecord;