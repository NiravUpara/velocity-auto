import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import AddVehicleForm from '../components/AddVehicleForm';
import EditVehicleModal from '../components/EditVehicleModal';
import RestockModal from '../components/RestockModal';
import {
  getVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from '../services/api';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce timer ref — prevents firing API calls on every keystroke
  const searchTimer = useRef(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timer
    if (searchTimer.current) clearTimeout(searchTimer.current);

    // Set new timer — waits 300ms after user stops typing
    searchTimer.current = setTimeout(async () => {
      try {
        if (query.trim()) {
          const res = await searchVehicles(query);
          setVehicles(res.data);
        } else {
          fetchVehicles();
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 300);
  };

  const handlePurchase = async (id) => {
    try {
      await purchaseVehicle(id);
      setMessage({ text: 'Purchase successful! 🎉', type: 'success' });
      fetchVehicles();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Purchase failed', type: 'error' });
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      setMessage({ text: 'Vehicle added successfully!', type: 'success' });
      setShowAddForm(false);
      fetchVehicles();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add vehicle', type: 'error' });
    }
  };

  const handleUpdateVehicle = async (id, vehicleData) => {
    try {
      await updateVehicle(id, vehicleData);
      setMessage({ text: 'Vehicle updated successfully!', type: 'success' });
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to update vehicle', type: 'error' });
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await deleteVehicle(id);
      setMessage({ text: 'Vehicle deleted successfully!', type: 'success' });
      fetchVehicles();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Delete failed', type: 'error' });
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await restockVehicle(id, quantity);
      setMessage({ text: 'Vehicle restocked successfully!', type: 'success' });
      setRestockingVehicle(null);
      fetchVehicles();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to restock vehicle', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isAdmin ? 'Admin Dashboard' : 'Vehicle Inventory'}
            </h1>
            <p className="text-gray-400 mt-1">
              {isAdmin ? 'Manage your dealership inventory' : 'Browse and purchase vehicles'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer self-start"
            >
              {showAddForm ? '✕ Close Form' : '+ Add Vehicle'}
            </button>
          )}
        </div>

        {/* Notification Message */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg mb-6 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Vehicle Form (Admin only) */}
        {isAdmin && showAddForm && (
          <AddVehicleForm
            onSubmit={handleAddVehicle}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search vehicles by make, model, or category..."
            className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
          />
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No vehicles found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try a different search term' : 'The inventory is empty'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={setEditingVehicle}
                onDelete={handleDeleteVehicle}
                onRestock={setRestockingVehicle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onSubmit={handleUpdateVehicle}
          onClose={() => setEditingVehicle(null)}
        />
      )}

      {/* Restock Modal */}
      {restockingVehicle && (
        <RestockModal
          vehicle={restockingVehicle}
          onSubmit={handleRestock}
          onClose={() => setRestockingVehicle(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
