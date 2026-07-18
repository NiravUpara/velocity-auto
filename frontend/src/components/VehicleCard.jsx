function VehicleCard({ vehicle, isAdmin, onPurchase, onDelete, onEdit, onRestock }) {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col">
      {/* Category Badge */}
      <span className="inline-block self-start px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full mb-4">
        {vehicle.category}
      </span>

      {/* Vehicle Info */}
      <h3 className="text-xl font-bold text-white mb-1">
        {vehicle.make} {vehicle.model}
      </h3>

      <p className="text-2xl font-bold text-green-400 mb-4">
        ${vehicle.price.toLocaleString()}
      </p>

      {/* Stock Status */}
      <div className="flex items-center gap-2 mb-5">
        <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
        <span className={`text-sm ${isOutOfStock ? 'text-red-400' : 'text-gray-400'}`}>
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Purchase button - available to all users */}
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={isOutOfStock}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>

        {/* Admin-only buttons */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onRestock(vehicle)}
              className="flex-1 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              Restock
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="flex-1 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleCard;
