import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Gauge, Medal, ChevronDown } from 'lucide-react';

function Landing() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-velocity-bg text-white min-h-screen">
      
      {/* Navbar (Minimal for Landing) */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-velocity-bg/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-orbitron font-bold text-2xl tracking-wider">
                VELOCITY<span className="text-velocity-red">AUTO</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-velocity-surface/50 via-velocity-bg to-velocity-bg z-0"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between pt-20">
          
          {/* Text Content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="font-orbitron text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Precision.<br/>
              <span className="text-blue-600">Performance.</span><br/>
              Velocity.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
              Engineered For Every Journey. Discover a curated collection of premium performance vehicles designed to exceed expectations.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/login" className="w-full sm:w-auto text-center bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                View Inventory
              </Link>
              <Link to="/register" className="w-full sm:w-auto text-center border border-white/20 hover:border-white/50 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm transition-all hover:-translate-y-1">
                Become a Member
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Car Image */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop" 
              alt="Premium Sports Car" 
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            {/* Subtle glow behind car */}
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-gray-500 text-sm font-orbitron tracking-widest mb-2 uppercase">Discover</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="text-blue-600 w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-velocity-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-6">The <span className="text-blue-600">Velocity</span> Standard</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We don't just sell cars; we curate performance machines. Every vehicle in our premium collection is rigorously inspected to ensure it meets our uncompromising standards for power, luxury, and reliability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-velocity-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold">Why Choose Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { icon: Medal, title: "Premium Brands", desc: "Access to the world's most coveted luxury and performance automotive brands." },
              { icon: ShieldCheck, title: "Verified Inventory", desc: "Every machine undergoes a rigorous 150-point inspection before joining our fleet." },
              { icon: Zap, title: "Fast Purchase", desc: "A streamlined, transparent buying process designed for the modern executive." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-velocity-card p-8 rounded-2xl border border-white/5 hover:border-blue-600/50 transition-colors group"
              >
                <div className="w-14 h-14 bg-velocity-bg rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/10 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold font-orbitron mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-velocity-surface py-12 border-t-2 border-velocity-red relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="font-orbitron font-bold text-xl tracking-wider block mb-2">
              VELOCITY<span className="text-velocity-red">AUTO</span>
            </span>
            <p className="text-gray-500 text-sm">Luxury automotive experience.</p>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Velocity Auto. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
