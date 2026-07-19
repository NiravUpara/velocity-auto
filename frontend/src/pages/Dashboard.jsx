import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import AddVehicleForm from '../components/AddVehicleForm';
import EditVehicleModal from '../components/EditVehicleModal';
import RestockModal from '../components/RestockModal';
import BillingModal from '../components/BillingModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import FilterSortControls from '../components/FilterSortControls';
import ConfirmModal from '../components/ConfirmModal';
import {
  getVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  getAdminStats
} from '../services/api';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filter & Sort State
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('none');
  
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [purchasingVehicle, setPurchasingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  
  // Admin stats
  const [stats, setStats] = useState(null);
  
  const navigate = useNavigate();

  // Get user from sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Redirect to login if no token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Polling for real-time updates
  useEffect(() => {
    const fetchCurrentState = async () => {
      try {
        if (searchQuery.trim()) {
          const res = await searchVehicles(searchQuery);
          setVehicles(res.data);
        } else {
          const res = await getVehicles();
          setVehicles(res.data);
        }
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentState();

    const interval = setInterval(() => {
      fetchCurrentState();
    }, 5000);

    return () => clearInterval(interval);
  }, [searchQuery, navigate]);

  // Fetch admin stats
  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const res = await getAdminStats();
          setStats(res.data);
        } catch (err) {
          console.error('Failed to fetch stats', err);
        }
      };
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePurchase = async (id, quantity) => {
    try {
      await purchaseVehicle(id, quantity);
      setMessage({ text: 'Purchase successful! 🎉', type: 'success' });
      setPurchasingVehicle(null);
      setViewingVehicle(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Purchase failed', type: 'error' });
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      setMessage({ text: 'Vehicle added successfully!', type: 'success' });
      setShowAddForm(false);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add vehicle', type: 'error' });
    }
  };

  const handleUpdateVehicle = async (id, vehicleData) => {
    try {
      await updateVehicle(id, vehicleData);
      setMessage({ text: 'Vehicle updated successfully!', type: 'success' });
      setEditingVehicle(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to update vehicle', type: 'error' });
    }
  };

  const handleDeleteVehicle = (id) => {
    setVehicleToDelete(id);
  };

  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle(vehicleToDelete);
      setMessage({ text: 'Vehicle deleted successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Delete failed', type: 'error' });
    }
    setVehicleToDelete(null);
  };

  const handleRestock = async (id, quantity) => {
    try {
      await restockVehicle(id, quantity);
      setMessage({ text: 'Vehicle restocked successfully!', type: 'success' });
      setRestockingVehicle(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to restock vehicle', type: 'error' });
    }
  };

  // When user clicks "Acquire Now" inside Vehicle Details modal
  const handleAcquireFromDetails = (vehicle) => {
    setViewingVehicle(null);
    setPurchasingVehicle(vehicle);
  };

  // Compute unique makes and categories from all fetched vehicles
  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const uniqueCategories = Array.from(new Set(vehicles.map((v) => v.category))).sort();

  // Apply filter and sort locally
  const getProcessedVehicles = () => {
    let result = [...vehicles];
    
    if (selectedMakes.length > 0) {
      result = result.filter(v => selectedMakes.includes(v.make));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(v => selectedCategories.includes(v.category));
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const processedVehicles = getProcessedVehicles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const statCards = stats ? [
    { label: 'Total Vehicles', value: stats.totalVehicles, color: 'text-white' },
    { label: 'Registered Users', value: stats.totalUsers, color: 'text-velocity-blue' },
    { label: 'Total Purchases', value: stats.totalPurchases, color: 'text-white' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-velocity-blue' },
    { label: 'Out of Stock', value: stats.outOfStock, color: stats.outOfStock > 0 ? 'text-velocity-red' : 'text-white' },
  ] : [];

  return (
    <div className="min-h-screen bg-velocity-bg transition-colors pt-20">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-white">
              {isAdmin ? 'Velocity Management' : 'Premium Collection'}
            </h1>
            <p className="text-gray-400 mt-2">
              {isAdmin ? 'Manage your high-performance machines' : 'Explore excellence in our curated inventory'}
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-3 self-start">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-6 py-3 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                  showAddForm 
                    ? 'bg-slate-700 hover:bg-slate-600 shadow-[0_0_15px_rgba(51,65,85,0.3)] hover:shadow-[0_0_25px_rgba(51,65,85,0.5)]' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]'
                }`}
              >
                {showAddForm ? '✕ Close Form' : '+ Add Vehicle'}
              </button>
            </div>
          )}
        </div>

        {/* Admin Stats Cards */}
        {isAdmin && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color === 'text-white' ? 'text-white' : stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Notification Message */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg mb-8 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-velocity-blue/10 border border-velocity-blue/30 text-velocity-blue'
                : 'bg-velocity-red/10 border border-velocity-red/30 text-velocity-red'
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
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search machines by make, model, or category..."
            className="w-full px-5 py-4 bg-velocity-card/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
          />
        </div>

        {/* Filter and Sort Controls */}
        <FilterSortControls 
          makes={uniqueMakes}
          selectedMakes={selectedMakes}
          onMakeChange={setSelectedMakes}
          categories={uniqueCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* Vehicle Grid */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-velocity-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-6 font-orbitron tracking-widest uppercase">Loading Fleet...</p>
          </div>
        ) : processedVehicles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl font-orbitron">No machines found</p>
            <p className="text-gray-400 opacity-80 text-sm mt-3">
              {searchQuery || selectedMakes.length > 0 || selectedCategories.length > 0 ? 'Adjust your search parameters' : 'The premium collection is currently empty'}
            </p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {processedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                onViewDetails={setViewingVehicle}
                onEdit={setEditingVehicle}
                onDelete={handleDeleteVehicle}
                onRestock={setRestockingVehicle}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Vehicle Details Modal (customers only) */}
      {viewingVehicle && (
        <VehicleDetailsModal
          vehicle={viewingVehicle}
          onPurchase={handleAcquireFromDetails}
          onClose={() => setViewingVehicle(null)}
        />
      )}

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

      {/* Billing Modal */}
      {purchasingVehicle && (
        <BillingModal
          vehicle={purchasingVehicle}
          user={user}
          onSubmit={handlePurchase}
          onClose={() => setPurchasingVehicle(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {vehicleToDelete && (
        <ConfirmModal
          title="Delete Vehicle?"
          description="This action cannot be undone."
          confirmText="Delete"
          onConfirm={confirmDeleteVehicle}
          onCancel={() => setVehicleToDelete(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
