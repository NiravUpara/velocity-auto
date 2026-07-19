import { motion } from 'framer-motion';

function ConfirmModal({ title, description, onConfirm, onCancel, confirmText = 'Delete' }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-velocity-surface border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold font-orbitron text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{description}</p>
          
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-velocity-red hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] text-sm"
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 border border-transparent text-white font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(51,65,85,0.3)] hover:shadow-[0_0_25px_rgba(51,65,85,0.5)] text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmModal;
