import { useState } from 'react';
import { motion } from 'framer-motion';

function RestockModal({ vehicle, onSubmit, onClose }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    try {
      await onSubmit(vehicle.id, Number(quantity));
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restock');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-velocity-surface border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-velocity-red/10 blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-2xl font-bold font-orbitron text-white mb-2 relative z-10 tracking-wide">Restock Fleet</h2>
        <p className="text-gray-400 text-sm mb-6 relative z-10 font-medium">
          {vehicle.make} <span className="text-velocity-red">{vehicle.model}</span> — Current stock: <span className="text-white font-bold">{vehicle.quantity}</span>
        </p>

        {error && (
          <div className="bg-velocity-red/10 border border-velocity-red/30 text-velocity-red px-4 py-3 rounded-lg mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Units to Add</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5"
              min="1"
              className="w-full px-4 py-3 bg-velocity-card/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-velocity-red hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] text-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-transparent border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default RestockModal;
