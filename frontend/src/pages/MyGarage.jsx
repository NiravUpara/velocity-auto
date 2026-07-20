import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyPurchases } from '../services/api';

function MyGarage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPurchases = async () => {
      try {
        const res = await getMyPurchases();
        setPurchases(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        console.error('Failed to fetch purchases', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-velocity-bg pt-20">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-white">My Garage</h1>
            <p className="text-gray-400 mt-1">Your premium collection of acquired machines</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-velocity-surface border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all shrink-0"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-velocity-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-6 font-orbitron tracking-widest uppercase">Loading Garage...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-24 bg-velocity-surface/30 border border-white/5 rounded-2xl">
            <p className="text-gray-400 text-xl font-orbitron">Your garage is currently empty.</p>
            <p className="text-gray-500 text-sm mt-3 mb-6">Explore our premium collection and acquire your first machine.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-velocity-red hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)]"
            >
              View Inventory
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {purchases.map((purchase) => (
              <motion.div 
                key={purchase.purchase_id}
                variants={itemVariants}
                className="bg-velocity-card border border-white/5 rounded-2xl overflow-hidden flex flex-col group shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                  <img 
                    src={`https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop`} 
                    alt={`${purchase.make} ${purchase.model}`} 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-velocity-card to-transparent"></div>
                  
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs font-orbitron tracking-wider uppercase rounded-full">
                    {purchase.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold font-orbitron text-white mb-1">
                    {purchase.make} <span className="text-velocity-red">{purchase.model}</span>
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 uppercase tracking-wider font-orbitron text-xs">Acquired On</span>
                      <span className="text-gray-200">{new Date(purchase.purchase_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 uppercase tracking-wider font-orbitron text-xs">Quantity</span>
                      <span className="text-white font-bold">{purchase.purchased_quantity} Units</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-end">
                    <span className="text-gray-400 tracking-wide font-medium text-sm">Total Investment</span>
                    <span className="text-2xl font-bold text-velocity-blue font-inter tracking-tight">
                      {formatCurrency(purchase.purchase_price * purchase.purchased_quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default MyGarage;
