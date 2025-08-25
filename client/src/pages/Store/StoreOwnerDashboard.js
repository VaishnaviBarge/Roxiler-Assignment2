import React, { useEffect, useState } from "react";
import StoreNavbar from "./StoreNavBar";

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/store/my-stores", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch ratings");

        const result = await res.json();
        console.log("data:", result);

        const storeData = result.data[0]; 
        setRatings(storeData?.ratings || []); 
        setAverageRating(storeData?.average_rating || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ratings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StoreNavbar />
        <hr className="bg-gray-900 border-1 border-gray-900 mx-2" />
        <div className="flex items-center justify-center h-64">
          <i className="fas fa-spinner fa-spin text-2xl text-gray-600"></i>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StoreNavbar />
        <hr className="bg-gray-900 border-1 border-gray-900 mx-2" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreNavbar />
      <hr className="bg-gray-900 border-1 border-gray-900 mx-2" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Average Rating Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-gray-500 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(averageRating || 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">out of 5.0</p>
              </div>
            </div>
          </div>

          {/* Total Reviews Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-gray-500 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{ratings.length}</p>
                <p className="text-sm text-gray-500">customer reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-gray-500 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ratings.length > 0 ? ratings[0].rating : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">most recent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-comments text-gray-600 mr-2"></i>
              Customer Reviews
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              See what your customers are saying about your store
            </p>
          </div>
          
          <div className="p-6">
            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((r, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-gray-600"></i>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{r.user_name}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            {r.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {getRatingStars(r.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{r.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">
                  Your store hasn't received any customer reviews yet. 
                  Keep providing great service to earn your first review!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;