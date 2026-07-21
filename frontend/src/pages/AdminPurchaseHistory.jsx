import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Navbar from '../components/Navbar';
import { getAdminPurchaseHistory } from '../services/api';

function AdminPurchaseHistory() {
  const [data, setData] = useState({ analytics: {}, purchases: [] });
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchHistory();

    const intervalId = setInterval(() => {
      fetchHistory();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await getAdminPurchaseHistory();
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Compute unique filter options
  const uniqueBrands = Array.from(new Set(data.purchases.map(p => p.vehicle_brand))).filter(Boolean).sort();
  const uniqueTypes = Array.from(new Set(data.purchases.map(p => p.vehicle_type))).filter(Boolean).sort();
  const uniqueDates = Array.from(new Set(data.purchases.map(p => p.purchase_date.split(' ')[0]))).filter(Boolean).sort();

  // Process data for UI
  const getProcessedPurchases = () => {
    let result = [...data.purchases];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.customer_name || '').toLowerCase().includes(q) ||
        (p.customer_username || '').toLowerCase().includes(q) ||
        (p.vehicle_name || '').toLowerCase().includes(q) ||
        (p.vehicle_brand || '').toLowerCase().includes(q)
      );
    }

    // Filter
    if (filterBrand) {
      result = result.filter(p => p.vehicle_brand === filterBrand);
    }
    if (filterType) {
      result = result.filter(p => p.vehicle_type === filterType);
    }
    if (filterDate) {
      result = result.filter(p => p.purchase_date.startsWith(filterDate));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.purchase_date) - new Date(a.purchase_date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.purchase_date) - new Date(b.purchase_date);
      } else if (sortBy === 'amount-desc') {
        return b.total_amount - a.total_amount;
      } else if (sortBy === 'amount-asc') {
        return a.total_amount - b.total_amount;
      }
      return 0;
    });

    return result;
  };

  const processedPurchases = getProcessedPurchases();

  return (
    <div className="min-h-screen bg-velocity-bg pt-20">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-white">Purchase History</h1>
            <p className="text-gray-400 mt-1">Track and monitor every purchases</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-velocity-surface border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all shrink-0"
          >
            ← Back
          </button>
        </div>

        {/* Analytics Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 animate-pulse h-24"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.analytics.totalRevenue)}</p>
            </div>
            <div className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">Total Transactions</p>
              <p className="text-2xl font-bold text-velocity-blue">{data.analytics.totalTransactions}</p>
            </div>
            <div className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">Today's Sales</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.analytics.todaysSales)}</p>
            </div>
            <div className="bg-velocity-surface/50 border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">Average Order Value</p>
              <p className="text-2xl font-bold text-velocity-blue">{formatCurrency(data.analytics.averageOrderValue)}</p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-velocity-surface/30 p-4 rounded-xl border border-white/10 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by customer, vehicle, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-velocity-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-velocity-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          >
            <option value="">All Brands</option>
            {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-velocity-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-velocity-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          >
            <option value="">All Dates</option>
            {uniqueDates.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-velocity-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 font-bold"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {/* Ledger Table */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-velocity-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-6 font-orbitron tracking-widest uppercase">Loading Ledger...</p>
          </div>
        ) : processedPurchases.length === 0 ? (
          <div className="text-center py-24 bg-velocity-surface/30 border border-white/5 rounded-2xl">
            <p className="text-white text-xl font-orbitron font-bold mb-2">No transactions found</p>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="bg-velocity-surface/50 border border-white/5 rounded-2xl overflow-x-auto">
            <table className="w-full whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Qty</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Unit Price</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {processedPurchases.map((p) => (
                  <tr key={p.purchase_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{p.purchase_id}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(p.purchase_date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{p.customer_name}</span>
                        <span className="text-gray-500 text-xs">@{p.customer_username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-black border border-white/10 shrink-0">
                          <img src={p.vehicle_image} alt={p.vehicle_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{p.vehicle_brand} {p.vehicle_name}</span>
                          <span className="text-gray-500 text-xs">{p.vehicle_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{p.quantity}</td>
                    <td className="px-6 py-4 text-gray-300">{formatCurrency(p.unit_price)}</td>
                    <td className="px-6 py-4 text-blue-500 font-bold">{formatCurrency(p.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPurchaseHistory;
