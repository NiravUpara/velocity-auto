import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength validation
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one digit';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Username validation
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Password strength check
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Confirm password check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await registerUser(username, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicators
  const getStrengthChecks = () => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One digit', met: /[0-9]/.test(password) },
      { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  };

  return (
    <div className="min-h-screen bg-velocity-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-velocity-surface/50 via-velocity-bg to-velocity-bg z-0"></div>
      
      <div className="w-full max-w-md relative z-10 my-12">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-6">
            <span className="font-orbitron font-bold text-3xl tracking-wider text-white">
              VELOCITY<span className="text-velocity-red">AUTO</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2 font-orbitron">Join The Club</h1>
          <p className="text-gray-400">Create your premium account</p>
        </div>

        {/* Register Form */}
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
              placeholder="Choose a username (min 3 chars)"
              required
            />
          </div>

          <div className="mb-5">
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
                placeholder="Create a strong password"
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
            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="mt-3 space-y-1">
                {getStrengthChecks().map((check) => (
                  <div key={check.label} className="flex items-center gap-2 text-xs">
                    <span className={check.met ? 'text-green-400' : 'text-gray-500'}>
                      {check.met ? '✓' : '○'}
                    </span>
                    <span className={check.met ? 'text-green-400' : 'text-gray-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2 font-orbitron tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-velocity-card/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-velocity-red text-xs mt-2">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-velocity-blue hover:text-blue-300 transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
