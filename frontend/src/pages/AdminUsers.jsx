import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import { getAdminUsers, getAdminUserDetails, deleteAdminUser } from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [navigate]);

  // Auto-clear messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const res = await getAdminUserDetails(userId);
      setSelectedUser(res.data);
    } catch (err) {
      setMessage({ text: 'Failed to load user details', type: 'error' });
    }
  };

  const handleDeleteUser = (userId, username) => {
    setUserToDelete({ id: userId, username });
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteAdminUser(userToDelete.id);
      setMessage({ text: `User "${userToDelete.username}" deleted successfully`, type: 'success' });
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to delete user', type: 'error' });
    }
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-velocity-bg pt-20">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back button */}
        {/* Header with Back button */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-white">User Management</h1>
            <p className="text-gray-400 mt-1">View and manage registered users</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-velocity-surface border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all shrink-0"
          >
            ← Back
          </button>
        </div>

        {/* Notification */}
        {message.text && (
          <div className={`px-4 py-3 rounded-lg mb-8 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-velocity-blue/10 border border-velocity-blue/30 text-velocity-blue'
              : 'bg-velocity-red/10 border border-velocity-red/30 text-velocity-red'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-velocity-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-6 font-orbitron tracking-widest uppercase">Loading Users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 bg-velocity-surface/30 border border-white/5 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-white text-xl font-orbitron font-bold mb-2">No registered users yet.</p>
            <p className="text-gray-400">Users will appear here after creating an account.</p>
          </div>
        ) : (
          <div className="bg-velocity-surface/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider hidden md:table-cell">Purchases</th>
                  <th className="text-left px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="text-right px-6 py-4 text-xs font-orbitron text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{u.username}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-velocity-red/20 text-velocity-red' : 'bg-blue-600/20 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{u.total_purchases}</td>
                    <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(u.id)}
                          className="px-3 py-1.5 bg-transparent border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="px-3 py-1.5 bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30 hover:border-red-500/50 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md grid place-items-center z-50 p-4 overflow-y-auto">
            <div className="bg-velocity-surface border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative my-auto">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold font-orbitron text-white">{selectedUser.username}</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-velocity-surface border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all shrink-0"
                >
                  ← Back
                </button>
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
                selectedUser.role === 'admin' ? 'bg-velocity-red/20 text-velocity-red' : 'bg-blue-600/20 text-blue-600'
              }`}>
                {selectedUser.role}
              </span>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-velocity-card p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-1">Total Purchases</p>
                  <p className="text-2xl font-bold text-white">{selectedUser.total_purchases}</p>
                </div>
                <div className="bg-velocity-card p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-1">Joined</p>
                  <p className="text-lg font-bold text-white">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>

              {/* Purchase History */}
              <h3 className="text-sm font-bold font-orbitron text-gray-400 uppercase tracking-widest mb-4">Purchase History</h3>
              {selectedUser.purchases && selectedUser.purchases.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedUser.purchases.map((p) => (
                    <div key={p.purchase_id} className="bg-velocity-card p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{p.make} {p.model}</p>
                        <p className="text-gray-500 text-xs">{new Date(p.purchase_date).toLocaleDateString()} · {p.purchased_quantity} unit(s)</p>
                      </div>
                      <p className="text-blue-600 font-bold">{formatCurrency(p.purchase_price * p.purchased_quantity)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No purchases yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {userToDelete && (
          <ConfirmModal
            title="Delete User?"
            description={`Are you sure you want to delete user "${userToDelete.username}"? This action cannot be undone.`}
            confirmText="Delete"
            onConfirm={confirmDeleteUser}
            onCancel={() => setUserToDelete(null)}
          />
        )}
      </main>
    </div>
  );
}

export default AdminUsers;
