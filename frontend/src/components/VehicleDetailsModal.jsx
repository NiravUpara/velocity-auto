import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

function VehicleDetailsModal({ vehicle, onPurchase, onClose }) {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md grid place-items-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-velocity-surface border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Large Vehicle Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop"
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-velocity-surface to-transparent"></div>

          {/* Category Badge */}
          <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs font-orbitron tracking-wider uppercase rounded-full">
            {vehicle.category}
          </span>
        </div>

        {/* Vehicle Details */}
        <div className="p-8">
          <h2 className="text-3xl font-bold font-orbitron text-white mb-1">
            {vehicle.make} <span className="text-blue-600">{vehicle.model}</span>
          </h2>

          <p className="text-3xl font-bold text-gray-400 mb-6 font-inter">
            {formatCurrency(vehicle.price)}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-velocity-card p-4 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-1">Category</p>
              <p className="text-white font-medium">{vehicle.category}</p>
            </div>
            <div className="bg-velocity-card p-4 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-1">Available Stock</p>
              <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  {!isOutOfStock && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOutOfStock ? 'bg-gray-600' : 'bg-blue-500'}`}></span>
                </div>
                <span className={`font-medium ${isOutOfStock ? 'text-gray-500' : 'text-white'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units`}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-velocity-card p-4 rounded-xl border border-white/10 mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-orbitron mb-2">Description</p>
            <p className="text-white opacity-80 text-sm leading-relaxed">
              {vehicle.description ? vehicle.description : 
                `The ${vehicle.make} ${vehicle.model} is a premium ${vehicle.category.toLowerCase()} engineered for exceptional performance, modern styling and everyday reliability. Designed with precision and comfort in mind, it delivers an engaging driving experience.`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => onPurchase(vehicle)}
              disabled={isOutOfStock}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:shadow-none"
            >
              {isOutOfStock ? 'Unavailable' : 'Purchase Vehicle'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 border border-transparent text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(51,65,85,0.3)] hover:shadow-[0_0_25px_rgba(51,65,85,0.5)]"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default VehicleDetailsModal;
