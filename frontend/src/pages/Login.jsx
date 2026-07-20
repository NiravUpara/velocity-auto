import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(username, password);

      // Store token and user info in sessionStorage
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-velocity-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-velocity-surface/50 via-velocity-bg to-velocity-bg z-0"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-6">
            <span className="font-orbitron font-bold text-3xl tracking-wider text-white">
              VELOCITY<span className="text-velocity-red">AUTO</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2 font-orbitron">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-velocity-surface/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl"
        >
          {error && (
            <div className="bg-velocity-red/10 border border-velocity-red/30 text-velocity-red px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-velocity-card/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-velocity-card/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-velocity-blue hover:text-blue-300 transition-colors font-medium">
              Become a Member
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
