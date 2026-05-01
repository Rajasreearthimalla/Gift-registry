import { useEffect, useState } from 'react';
import userService from '../services/userService';

const ProfilePanel = ({ user, onProfileUpdated }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    password: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      password: ''
    });
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        bio: form.bio
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await userService.updateProfile(payload);
      onProfileUpdated(response.user);
      setForm((current) => ({ ...current, password: '' }));
      setStatus('Profile saved successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save your profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Profile</p>
        <h2 className="mt-2 text-2xl font-bold">Keep your registry details current</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="field-label" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            className="field-input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="profile-bio">
            Bio
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            className="field-textarea"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="profile-password">
            New password
          </label>
          <input
            id="profile-password"
            name="password"
            type="password"
            className="field-input"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep your current password"
          />
        </div>

        {status ? <p className="text-sm font-semibold text-spruce-700">{status}</p> : null}
        {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? 'Saving profile...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePanel;
