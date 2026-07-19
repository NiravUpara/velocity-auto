import { useNavigate, Link } from 'react-router-dom';

function Navbar({ user }) {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  

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

          {/* User Info & Actions */}
          <div className="flex items-center gap-6">


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
                        📜 Purchase History
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
    </nav>
  );
}

export default Navbar;
