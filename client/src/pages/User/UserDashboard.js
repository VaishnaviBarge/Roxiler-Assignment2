import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");    
  const [addressFilter, setAddressFilter] = useState(""); 
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/stores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      console.log("FetchStore :",data);
      
      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRate = async (storeId, rating) => {
    try {
      const res = await fetch("http://localhost:5000/user/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ storeId, rating }),
      });

      const data = await res.json();
      console.log("Rating :",data);
      
      if (data.success) {
        fetchStores();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center">
          <i className="fas fa-spinner fa-spin text-2xl text-black mr-3"></i>
          <span className="text-gray-600">Loading stores...</span>
        </div>
      </div>
    );
  }

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      store.address.toLowerCase().includes(addressFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black flex items-center">
            <i className="fas fa-user-circle text-black mr-3"></i>
            User Dashboard
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleUpdatePassword}
              className="inline-flex items-center border border-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
            >
              <i className="fas fa-key mr-2"></i>
              Update Password
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center border border-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="px-6 py-6">
        {/* Filter Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
            <i className="fas fa-filter text-black mr-2"></i>
            Filter Stores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <i className="fas fa-store absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Filter by Store Name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Filter by Address..."
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black flex items-center">
              <i className="fas fa-shopping-bag text-black mr-2"></i>
              Available Stores
              <span className="ml-2 bg-black text-white px-2 py-1 rounded-full text-sm">
                {filteredStores.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-black border-b">
                    <i className="fas fa-store mr-2"></i>Store Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-black border-b">
                    <i className="fas fa-map-marker-alt mr-2"></i>Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-black border-b">
                    <i className="fas fa-chart-bar mr-2"></i>Overall Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-black border-b">
                    <i className="fas fa-user-star mr-2"></i>Your Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-black border-b">
                    <i className="fas fa-star mr-2"></i>Rate Store
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <tr key={store.store_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        {store.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {store.address}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(store.overall_rating)}
                          </div>
                          <span className="text-black font-medium">
                            {store.overall_rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {store.user_rating ? (
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {renderStars(store.user_rating)}
                            </div>
                            <span className="text-black font-medium">
                              {store.user_rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not rated</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleRate(store.store_id, num)}
                              className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center ${
                                store.user_rating === num
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
                              }`}
                              title={`Rate ${num} star${num > 1 ? 's' : ''}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <i className="fas fa-store-slash text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500 text-lg">No stores found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;