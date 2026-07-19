import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function EditVehicleModal({ vehicle, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [error, setError] = useState('');

  // Pre-fill form with vehicle data when modal opens
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
        description: vehicle.description || ''
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.make || !formData.model || !formData.category) {
      setError('Make, Model, and Category are required');
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    try {
      await onSubmit(vehicle.id, {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update machine');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-velocity-surface border border-white/10 rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative overflow-y-auto overflow-x-hidden max-h-[90vh]"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-2xl font-bold font-orbitron text-white mb-6 relative z-10 tracking-wide">Edit Vehicle</h2>

        {error && (
          <div className="bg-velocity-red/10 border border-velocity-red/30 text-velocity-red px-4 py-3 rounded-lg mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Make</label>
            <input
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Make"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Model"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              min="0"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Stock Quantity</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              min="0"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Leave empty for auto-generated description..."
              rows="2"
              className="w-full px-4 py-3 bg-velocity-input border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div className="md:col-span-2 flex gap-4 mt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] text-sm"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 border border-transparent text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(51,65,85,0.3)] hover:shadow-[0_0_25px_rgba(51,65,85,0.5)] text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default EditVehicleModal;
