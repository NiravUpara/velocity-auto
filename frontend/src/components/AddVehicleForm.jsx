import { useState } from 'react';

function AddVehicleForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!formData.make || !formData.model || !formData.category || !formData.price || !formData.quantity) {
      setError('All fields are required');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      // Reset form
      setFormData({ make: '', model: '', category: '', price: '', quantity: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle');
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Add New Vehicle</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make (e.g. Toyota)"
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model (e.g. Camry)"
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category (e.g. Sedan)"
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          min="0"
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer"
          >
            Add Vehicle
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddVehicleForm;
