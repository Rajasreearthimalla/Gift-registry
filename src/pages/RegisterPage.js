import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
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
      await register(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="glass-panel p-8 sm:p-10">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-3 text-slate-600">
            Start building wishlists for birthdays, weddings, baby showers, and every milestone in between.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                className="field-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="field-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
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
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-ember-600">
              Sign in
            </Link>
          </p>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="h-full bg-[linear-gradient(135deg,#0f766e_0%,#1f2937_55%,#f59e0b_100%)] p-8 text-white sm:p-12">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              Shareable. Organized. Thoughtful.
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight text-white">
              Turn every wishlist into a polished guest experience.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Public links, reservation tracking, and purchase updates help everyone coordinate with less friction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

