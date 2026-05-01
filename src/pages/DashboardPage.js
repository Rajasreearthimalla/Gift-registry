import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfilePanel from '../components/ProfilePanel';
import WishlistCard from '../components/WishlistCard';
import { useAuth } from '../context/AuthContext';
import wishlistService from '../services/wishlistService';

const initialFormState = {
  title: '',
  description: '',
  eventDate: '',
  coverImage: '',
  isPublic: true
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, updateCurrentUser } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadWishlists = async () => {
    setLoading(true);

    try {
      const response = await wishlistService.getAll();
      setWishlists(response.wishlists);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load wishlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlists();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingWishlist(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setStatus('');

    try {
      if (editingWishlist) {
        await wishlistService.update(editingWishlist._id, form);
        setStatus('Wishlist updated successfully.');
      } else {
        await wishlistService.create(form);
        setStatus('Wishlist created successfully.');
      }

      resetForm();
      await loadWishlists();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save wishlist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (wishlist) => {
    setEditingWishlist(wishlist);
    setForm({
      title: wishlist.title || '',
      description: wishlist.description || '',
      eventDate: wishlist.eventDate ? wishlist.eventDate.slice(0, 10) : '',
      coverImage: wishlist.coverImage || '',
      isPublic: wishlist.isPublic
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (wishlist) => {
    const confirmed = window.confirm(`Delete "${wishlist.title}"? This also removes its items.`);
    if (!confirmed) {
      return;
    }

    try {
      await wishlistService.remove(wishlist._id);
      setWishlists((current) => current.filter((entry) => entry._id !== wishlist._id));
      setStatus('Wishlist deleted successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete wishlist');
    }
  };

  const handleCopyShare = async (wishlist) => {
    const shareUrl = `${window.location.origin}/shared/${wishlist.shareToken}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(`Share link copied for "${wishlist.title}".`);
    } catch (copyError) {
      setStatus(`Share link: ${shareUrl}`);
    }
  };

  const totalItems = wishlists.reduce((sum, wishlist) => sum + wishlist.totalItems, 0);
  const totalReserved = wishlists.reduce((sum, wishlist) => sum + wishlist.reservedItems, 0);
  const totalPurchased = wishlists.reduce((sum, wishlist) => sum + wishlist.purchasedItems, 0);

  if (loading) {
    return <LoadingSpinner label="Loading your wishlists..." />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Dashboard</p>
              <h2 className="mt-2 text-3xl font-bold">
                Build a wishlist guests will actually enjoy using
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-ember-50 px-4 py-3">
                <p className="text-slate-500">Items</p>
                <p className="mt-1 text-2xl font-bold">{totalItems}</p>
              </div>
              <div className="rounded-2xl bg-spruce-100 px-4 py-3">
                <p className="text-slate-500">Reserved</p>
                <p className="mt-1 text-2xl font-bold">{totalReserved}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <p className="text-slate-500">Purchased</p>
                <p className="mt-1 text-2xl font-bold">{totalPurchased}</p>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="title">
                  Wishlist title
                </label>
                <input
                  id="title"
                  name="title"
                  className="field-input"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="eventDate">
                  Event date
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  className="field-input"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="field-textarea"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="coverImage">
                Cover image URL
              </label>
              <input
                id="coverImage"
                name="coverImage"
                className="field-input"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/celebration.jpg"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-ember-500 focus:ring-ember-400"
              />
              <span className="text-sm font-semibold text-slate-700">
                Enable a public share link for this wishlist
              </span>
            </label>

            {status ? <p className="text-sm font-semibold text-spruce-700">{status}</p> : null}
            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? 'Saving...'
                  : editingWishlist
                    ? 'Update wishlist'
                    : 'Create wishlist'}
              </button>

              {editingWishlist ? (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <ProfilePanel user={user} onProfileUpdated={updateCurrentUser} />
      </div>

      {wishlists.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {wishlists.map((wishlist) => (
            <WishlistCard
              key={wishlist._id}
              wishlist={wishlist}
              onOpen={() => navigate(`/wishlists/${wishlist._id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopyShare={handleCopyShare}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No wishlists yet for ${user?.name}`}
          description="Create your first registry above to start collecting gift ideas, sharing them publicly, and avoiding duplicate purchases."
        />
      )}
    </div>
  );
};

export default DashboardPage;

