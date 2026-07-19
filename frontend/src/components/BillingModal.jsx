import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

function BillingModal({ vehicle, user, onSubmit, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  
  // Reset quantity if vehicle changes
  useEffect(() => {
    setQuantity(1);
    setError('');
  }, [vehicle]);

  const handleIncrement = () => {
    if (quantity < vehicle.quantity) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (quantity > vehicle.quantity) {
      setError('Cannot acquire more than available stock.');
      return;
    }

    try {
      await onSubmit(vehicle.id, quantity);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete acquisition');
    }
  };

  const totalPrice = vehicle.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md grid place-items-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-velocity-surface border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden my-auto"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

        <h2 className="text-2xl font-bold font-orbitron text-white mb-4 tracking-wide">Purchase Details</h2>
        
        {/* User Info Section */}
        <div className="mb-4 bg-velocity-card p-4 rounded-xl border border-white/10 relative z-10">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest font-orbitron">Client Profile</h3>
          <p className="text-white font-medium mb-1">ID: <span className="text-gray-400 font-normal ml-2">{user?.username}</span></p>
          <p className="text-white font-medium">Access: <span className="text-gray-400 font-normal capitalize ml-2">{user?.role}</span></p>
        </div>

        {/* Vehicle Info Section */}
        <div className="mb-4 bg-velocity-card p-4 rounded-xl border border-white/10 relative z-10">
          <h3 className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest font-orbitron">Vehicle Details</h3>
          <p className="text-xl font-bold text-white mb-1 font-orbitron">{vehicle.make} <span className="text-gray-400">{vehicle.model}</span></p>
          <p className="text-gray-500 text-sm mb-3 uppercase tracking-wider">{vehicle.category}</p>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-gray-400 text-sm font-medium tracking-wide">Unit Value:</span>
            <span className="font-bold text-white font-inter">{formatCurrency(vehicle.price)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-velocity-red/10 border border-velocity-red/30 text-velocity-red px-4 py-3 rounded-lg mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Quantity Selector */}
          <div className="mb-4 flex items-center justify-between bg-velocity-bg p-4 rounded-xl border border-white/10">
            <label className="text-gray-400 font-medium tracking-wide text-sm">Units:</label>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-velocity-surface border border-white/10 text-white hover:bg-velocity-text/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-white text-lg font-orbitron">{quantity}</span>
              <button 
                type="button" 
                onClick={handleIncrement}
                disabled={quantity >= vehicle.quantity}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-velocity-surface border border-white/10 text-white hover:bg-velocity-text/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-400 tracking-wide font-medium">Total Investment</span>
            <span className="text-3xl font-bold text-white font-inter tracking-tight">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] text-sm"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 border border-transparent text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(51,65,85,0.3)] hover:shadow-[0_0_25px_rgba(51,65,85,0.5)] text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default BillingModal;
