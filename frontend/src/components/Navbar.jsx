import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ user }) {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-velocity-bg/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
            <span className="font-orbitron font-bold text-2xl tracking-wider text-white">
              VELOCITY<span className="text-velocity-red">AUTO</span>
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-velocity-red p-2 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Info & Actions */}
          <div className="hidden md:flex items-center gap-6">


            <Link to="/dashboard" className="text-gray-400 hover:text-white font-medium transition-colors hidden sm:block">
              {isAdmin ? 'Dashboard' : 'Premium Collection'}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                {/* Navigation links */}
                <div className="flex items-center gap-4 text-sm font-medium">
                  {!isAdmin && (
                    <Link to="/garage" className="text-gray-400 hover:text-white transition-colors duration-200">
                      My Garage
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <Link to="/admin/users" className="text-gray-400 hover:text-white transition-colors duration-200 hidden sm:block">
                        Users
                      </Link>
                      <Link to="/admin/purchase-history" className="text-gray-400 hover:text-white transition-colors duration-200 hidden sm:block">
                        Purchase History
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-right hidden sm:block ml-2 border-l border-white/10 pl-4">
                  <p className="text-white text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-velocity-red font-orbitron uppercase tracking-widest">{user?.role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-transparent border border-white/10 hover:border-velocity-red text-white hover:text-velocity-red rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_0_rgba(225,6,0,0)] hover:shadow-[0_0_15px_rgba(225,6,0,0.3)]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-white font-bold uppercase tracking-wider text-sm hover:text-velocity-red transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-velocity-bg/95 backdrop-blur-md border-b border-white/10 absolute top-20 left-0 w-full px-4 py-6 flex flex-col gap-4 shadow-2xl">
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white font-medium py-2">
            {isAdmin ? 'Dashboard' : 'Premium Collection'}
          </Link>
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/garage" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white font-medium py-2">
                  My Garage
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/users" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white font-medium py-2">
                    Users
                  </Link>
                  <Link to="/admin/purchase-history" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white font-medium py-2">
                    Purchase History
                  </Link>
                </>
              )}
              <div className="border-t border-white/10 pt-4 mt-2">
                <p className="text-white text-sm font-medium mb-1">{user?.username}</p>
                <p className="text-xs text-velocity-red font-orbitron uppercase tracking-widest mb-4">{user?.role}</p>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full px-5 py-3 bg-transparent border border-white/10 hover:border-velocity-red text-white hover:text-velocity-red rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white font-bold uppercase tracking-wider text-sm hover:text-velocity-red transition-colors block py-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
