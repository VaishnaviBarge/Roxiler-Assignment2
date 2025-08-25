import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminLayout from "./pages/Admin/AdminLayout";  
import AdminDashboard from "./pages/Admin/AdminDashboard"; 
import UserRecord from "./pages/Admin/UserRecord";   
import UpdatePassword from './pages/User/UpdatePassword';
import StoreRecord from "./pages/Admin/StoreRecord";
import StoreOwnerDashboard from "./pages/Store/StoreOwnerDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import PrivateRoute from "./pages/PrivateRoute";   
import Unauthorized from "./pages/Unauthorized"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Protected Routes with Nested Layout */}
        <Route path="/admin" 
          element={
            <PrivateRoute allowedRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* Home */}
          <Route path="stores" element={<StoreRecord />} />
          <Route path="users" element={<UserRecord />} />
        </Route>

        {/* store owner */}
        <Route
          path="/store-owner"
          element={
            <PrivateRoute allowedRole="store_owner">
              <StoreOwnerDashboard />
            </PrivateRoute>
          }
        />

        {/* user */}
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRole="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* update-password */}
        {/* Update Password - available for any logged-in user */}
        <Route
          path="/update-password"
          element={
            <PrivateRoute allowedRole={["user", "store_owner", "admin"]}>
              <UpdatePassword />
            </PrivateRoute>
          }
        />


        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
