import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel overflow-hidden">
          <div className="h-full bg-[linear-gradient(135deg,#111827_0%,#1f2937_50%,#f97316_100%)] p-8 text-white sm:p-12">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Gift Registry</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight text-white">
              Welcome back to your celebration planning hub.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Organize wishlists, share them with friends, and keep every thoughtful gift beautifully coordinated.
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 sm:p-10">
          <h2 className="text-3xl font-bold">Sign in</h2>
          <p className="mt-3 text-slate-600">
            Access your wishlists and manage gift reservations in one place.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="field-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="field-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-ember-600">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

