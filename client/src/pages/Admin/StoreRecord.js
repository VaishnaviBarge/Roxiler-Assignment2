import React, { useState, useEffect } from "react";

function StoreRecord() {
  const [owners, setOwners] = useState([]);
  const [stores, setStores] = useState([]);
  
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [ownerErrors, setOwnerErrors] = useState({});
  const [storeErrors, setStoreErrors] = useState({});

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

  useEffect(() => {
    fetchOwners();
    fetchStores();
  }, []);

  const fetchOwners = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/owners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("data :",data);
      if (data.success) setOwners(data.owners);
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/stores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("stores :",data);
      
      if (data.success) setStores(data.stores);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesName = store.name?.toLowerCase().includes(filters.name.toLowerCase());
    const matchesEmail = store.email?.toLowerCase().includes(filters.email.toLowerCase());
    const matchesAddress = store.address?.toLowerCase().includes(filters.address.toLowerCase());
    
    return matchesName && matchesEmail && matchesAddress;
  });

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
    });
  };

  const validateOwnerForm = () => {
    const newErrors = {};

    if (ownerForm.name.length < 20) {
      newErrors.name = "Name must be at least 20 characters";
    } else if (ownerForm.name.length > 60) {
      newErrors.name = "Name cannot exceed 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordRegex.test(ownerForm.password)) {
      newErrors.password = "Password must be 8-16 characters with at least 1 uppercase letter and 1 special character";
    }

    if (ownerForm.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }

    setOwnerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStoreForm = () => {
    const newErrors = {};

    if (storeForm.name.length < 20) {
      newErrors.name = "Store name must be at least 20 characters";
    } else if (storeForm.name.length > 60) {
      newErrors.name = "Store name cannot exceed 60 characters";
    }

    if (storeForm.email && storeForm.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(storeForm.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (storeForm.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }

    if (!storeForm.owner_id) {
      newErrors.owner_id = "Please select an owner";
    }

    setStoreErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOwnerChange = (field, value) => {
    setOwnerForm({ ...ownerForm, [field]: value });
    
    if (ownerErrors[field]) {
      setOwnerErrors({ ...ownerErrors, [field]: "" });
    }
  };

  const handleStoreChange = (field, value) => {
    setStoreForm({ ...storeForm, [field]: value });
    
    if (storeErrors[field]) {
      setStoreErrors({ ...storeErrors, [field]: "" });
    }
  };

  const handleAddOwner = async (e) => {
    e.preventDefault();
    
    if (!validateOwnerForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/add-store-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ownerForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("Owner added successfully!");
        setOwnerForm({ name: "", email: "", password: "", address: "" });
        setOwnerErrors({});
        fetchOwners();
      }
    } catch (err) {
      console.error("Error adding owner:", err);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    
    if (!validateStoreForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/add-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(storeForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("Store added successfully!");
        setStoreForm({ name: "", email: "", address: "", owner_id: "" });
        setStoreErrors({});
        fetchStores();
      }
    } catch (err) {
      console.error("Error adding store:", err);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-store text-3xl text-gray-600 mr-3"></i>
            <h1 className="text-3xl font-bold text-gray-900">Store & Owner Management</h1>
          </div>
          <p className="text-gray-600">Manage store owners and their stores from this dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* add owner Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <i className="fas fa-user-plus text-xl text-gray-600 mr-3"></i>
              <h2 className="text-xl font-semibold text-gray-900">Add Store Owner</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user mr-2"></i>Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter owner's name"
                  value={ownerForm.name}
                  onChange={(e) => handleOwnerChange('name', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    ownerErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {ownerErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {ownerErrors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {ownerForm.name.length}/60 characters (minimum 20 required)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-envelope mr-2"></i>Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={ownerForm.email}
                  onChange={(e) => handleOwnerChange('email', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    ownerErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {ownerErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {ownerErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-lock mr-2"></i>Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={ownerForm.password}
                  onChange={(e) => handleOwnerChange('password', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    ownerErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {ownerErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {ownerErrors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  8-16 characters with 1 uppercase & 1 special character
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-map-marker-alt mr-2"></i>Address
                </label>
                <textarea
                  placeholder="Enter address (optional)"
                  value={ownerForm.address}
                  onChange={(e) => handleOwnerChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none ${
                    ownerErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {ownerErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {ownerErrors.address}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {ownerForm.address.length}/400 characters
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleAddOwner}
                className="w-full border border-black text-black py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none font-medium transition duration-200"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Add Owner
              </button>
            </div>
          </div>

          {/* add Store Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <i className="fas fa-store-alt text-xl text-gray-600 mr-3"></i>
              <h2 className="text-xl font-semibold text-gray-900">Add Store</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-tag mr-2"></i>Store Name
                </label>
                <input
                  type="text"
                  placeholder="Enter store name"
                  value={storeForm.name}
                  onChange={(e) => handleStoreChange('name', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                    storeErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {storeErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {storeErrors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {storeForm.name.length}/60 characters (minimum 20 required)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-envelope mr-2"></i>Store Email
                </label>
                <input
                  type="email"
                  placeholder="Enter store email (optional)"
                  value={storeForm.email}
                  onChange={(e) => handleStoreChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                    storeErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {storeErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {storeErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-map-marker-alt mr-2"></i>Store Address
                </label>
                <textarea
                  placeholder="Enter store address"
                  value={storeForm.address}
                  onChange={(e) => handleStoreChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 resize-none ${
                    storeErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {storeErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {storeErrors.address}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {storeForm.address.length}/400 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user-tie mr-2"></i>Select Owner
                </label>
                <select
                  value={storeForm.owner_id}
                  onChange={(e) => handleStoreChange('owner_id', e.target.value)}
                  required
                  className={`w-full px-3 py-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white ${
                    storeErrors.owner_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose an owner...</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                {storeErrors.owner_id && (
                  <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {storeErrors.owner_id}
                  </p>
                )}
              </div>
              
              <button type="button" onClick={handleAddStore}
                className="w-full border border-black text-black py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none font-medium transition duration-200">
                <i className="fas fa-plus-circle mr-2"></i>
                Add Store
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <i className="fas fa-filter text-xl text-gray-600 mr-3"></i>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Filter Stores</h2>
                <p className="text-sm text-gray-600">Search and filter stores by name, email, or address</p>
              </div>
            </div>
            <button 
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 flex items-center"
            >
              <i className="fas fa-times-circle mr-2"></i>Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-store mr-2"></i>Store Name
              </label>
              <input
                type="text"
                placeholder="Filter by store name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope mr-2"></i>Email
              </label>
              <input
                type="text"
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-map-marker-alt mr-2"></i>Address
              </label>
              <input
                type="text"
                placeholder="Filter by address"
                value={filters.address}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Store List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <i className="fas fa-list text-xl text-gray-600 mr-3"></i>
                  <h2 className="text-xl font-semibold text-gray-900">Store List</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Showing {filteredStores.length} of {stores.length} stores
                  {Object.values(filters).some(f => f) && " (filtered)"}
                </p>
              </div>
            </div>
          </div>
          
          {filteredStores.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${stores.length === 0 ? 'fa-store-slash' : 'fa-search-minus'} text-2xl text-gray-400`}></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {stores.length === 0 ? 'No stores yet' : 'No stores match your filters'}
              </h3>
              <p className="text-gray-500">
                {stores.length === 0 
                  ? 'Add your first store using the form above.' 
                  : 'Try adjusting your search criteria or clear the filters.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-store mr-2"></i>Store Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-envelope mr-2"></i>Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-map-marker-alt mr-2"></i>Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-star mr-2"></i>Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStores.map((store, index) => (
                    <tr key={store.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{store.email || <span className="text-gray-400 italic">No email</span>}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{store.address || <span className="text-gray-400 italic">No address</span>}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">
                            {store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'N/A'}
                          </span>
                          {store.overall_rating && (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star text-sm ${
                                    i < Math.floor(store.overall_rating) ? "text-yellow-400" : "text-gray-300"
                                  }`}></i>
                              ))}
                            </div>
                          )}
                        </div>
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
}

export default StoreRecord;