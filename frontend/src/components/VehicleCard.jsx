import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

function VehicleCard({ vehicle, isAdmin, onViewDetails, onDelete, onEdit, onRestock }) {
  const isOutOfStock = vehicle.quantity === 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-velocity-card border border-white/10 rounded-2xl overflow-hidden hover:border-velocity-red/50 transition-colors duration-300 flex flex-col group shadow-lg"
    >
      {/* Car Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        <img 
          src={`https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop`} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velocity-card to-transparent"></div>
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs font-orbitron tracking-wider uppercase rounded-full">
          {vehicle.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-10">
        {/* Vehicle Info */}
        <h3 className="text-2xl font-bold font-orbitron text-white mb-1">
          {vehicle.make} <span className="text-velocity-red">{vehicle.model}</span>
        </h3>

        <p className="text-2xl font-bold text-gray-400 mb-6 font-inter">
          {formatCurrency(vehicle.price)}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex h-2 w-2">
            {!isOutOfStock && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOutOfStock ? 'bg-gray-600' : 'bg-blue-500'}`}></span>
          </div>
          <span className={`text-sm font-medium tracking-wide uppercase ${isOutOfStock ? 'text-gray-500' : 'text-gray-400'}`}>
            {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          {/* View Details button (for customers) */}
          {!isAdmin && (
            <button
              onClick={() => onViewDetails(vehicle)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
            >
              View Details
            </button>
          )}

          {/* Admin-only buttons */}
          {isAdmin && (
            <div className="flex gap-2 mt-2 pt-4 border-t border-white/10">
              <button
                onClick={() => onEdit(vehicle)}
                className="flex-1 py-2 bg-transparent text-gray-400 hover:text-white border border-white/10 hover:border-velocity-text-muted rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 py-2 bg-transparent text-gray-400 hover:text-white border border-white/10 hover:border-velocity-text-muted rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Restock
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="flex-1 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30 hover:border-red-500/50 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default VehicleCard;
