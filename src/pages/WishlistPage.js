import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import itemService from '../services/itemService';
import wishlistService from '../services/wishlistService';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadWishlist = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await wishlistService.getById(wishlistId);
      setWishlist(response.wishlist);
      setItems(response.items);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [wishlistId]);

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Delete "${item.name}" from this wishlist?`);
    if (!confirmed) {
      return;
    }

    try {
      await itemService.remove(item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setStatus('Item deleted successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete item');
    }
  };

  const handleTogglePurchased = async (item) => {
    try {
      const response = await itemService.update(item._id, {
        isPurchased: !item.isPurchased
      });

      setItems((current) =>
        current.map((entry) => (entry._id === item._id ? response.item : entry))
      );
      setStatus('Item status updated.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update item');
    }
  };

  const handleClearReservation = async (item) => {
    try {
      const response = await itemService.update(item._id, {
        isReserved: false
      });

      setItems((current) =>
        current.map((entry) => (entry._id === item._id ? response.item : entry))
      );
      setStatus('Reservation cleared.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to clear reservation');
    }
  };

  const handleCopyShare = async () => {
    const shareUrl = `${window.location.origin}/shared/${wishlist.shareToken}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Share link copied to your clipboard.');
    } catch (copyError) {
      setStatus(`Share link: ${shareUrl}`);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading wishlist details..." />;
  }

  if (!wishlist) {
    return (
      <div className="glass-panel p-10 text-center">
        <p className="text-sm font-semibold text-rose-600">{error || 'Wishlist not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-500">
            Back to dashboard
          </Link>
          <h2 className="mt-2 text-4xl font-bold">{wishlist.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            {wishlist.description || 'No description added for this wishlist yet.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={handleCopyShare}>
            Copy share link
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(`/wishlists/${wishlistId}/items/new`)}
          >
            Add gift item
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-ember-50 p-4">
              <p className="text-sm text-slate-500">Event date</p>
              <p className="mt-2 text-lg font-bold">{formatDate(wishlist.eventDate)}</p>
            </div>
            <div className="rounded-2xl bg-spruce-100 p-4">
              <p className="text-sm text-slate-500">Visibility</p>
              <p className="mt-2 text-lg font-bold">
                {wishlist.isPublic ? 'Public link active' : 'Private only'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Items</p>
              <p className="mt-2 text-lg font-bold">{items.length}</p>
            </div>
          </div>
        </div>

        {wishlist.coverImage ? (
          <div className="glass-panel overflow-hidden">
            <img
              src={wishlist.coverImage}
              alt={wishlist.title}
              className="h-full max-h-64 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      {status ? <p className="text-sm font-semibold text-spruce-700">{status}</p> : null}
      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {items.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={() => navigate(`/wishlists/${wishlistId}/items/${item._id}/edit`)}
              onDelete={handleDelete}
              onTogglePurchased={handleTogglePurchased}
              onClearReservation={handleClearReservation}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items added yet"
          description="Add your first gift idea so friends and family can start planning something meaningful."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate(`/wishlists/${wishlistId}/items/new`)}
            >
              Add the first item
            </button>
          }
        />
      )}
    </div>
  );
};

export default WishlistPage;

