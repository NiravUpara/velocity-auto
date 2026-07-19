
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyGarage from './pages/MyGarage';
import AdminUsers from './pages/AdminUsers';
import AdminPurchaseHistory from './pages/AdminPurchaseHistory';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/garage" element={<MyGarage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/purchase-history" element={<AdminPurchaseHistory />} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
