import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        alert("No token found, please login again.");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/admin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("data :", data);

        if (data.success && data.data) {
          setStats({
            users: Number(data.data.totalUsers) || 0,
            stores: Number(data.data.totalStores) || 0,
            ratings: Number(data.data.totalRatings) || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-2xl font-bold">{stats.users}</p>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-semibold">Total Stores</h2>
        <p className="text-2xl font-bold">{stats.stores}</p>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-semibold">Total Ratings</h2>
        <p className="text-2xl font-bold">{stats.ratings}</p>
      </div>
    </main>
  );
};

export default AdminDashboard;
