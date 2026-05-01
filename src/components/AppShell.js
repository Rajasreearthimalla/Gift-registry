import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [{ label: 'Dashboard', href: '/dashboard' }];

const AppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <div className="app-shell">
        <div className="glass-panel overflow-hidden">
          <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#0f766e_100%)] px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                  Gift Registry Platform
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  Plan thoughtful gifts without the duplicate chaos.
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      location.pathname === item.href
                        ? 'bg-white text-slate-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  {user?.name}
                </div>
                <button type="button" className="btn-secondary" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

