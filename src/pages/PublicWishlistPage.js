import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import itemService from '../services/itemService';
import wishlistService from '../services/wishlistService';

const PublicWishlistPage = () => {
  const { shareToken } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [guest, setGuest] = useState({
    reservedByName: '',
    reservedByEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await wishlistService.getPublic(shareToken);
        setWishlist(response.wishlist);
        setItems(response.items);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load shared wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [shareToken]);

  const handleReserve = async (item) => {
    if (!guest.reservedByName.trim()) {
      setError('Add your name before reserving a gift.');
      return;
    }

    setError('');
    setStatus('');

    try {
      const response = await itemService.reserve(item._id, guest);
      setItems((current) =>
        current.map((entry) => (entry._id === item._id ? response.item : entry))
      );
      setStatus(`You reserved "${item.name}".`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reserve this gift');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading shared wishlist..." />;
  }

  if (!wishlist) {
    return (
      <div className="app-shell">
        <div className="glass-panel p-10 text-center">
          <p className="text-sm font-semibold text-rose-600">
            {error || 'This shared wishlist is unavailable.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell space-y-8">
      <div className="glass-panel overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#f97316_100%)] p-8 text-white sm:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              Shared wishlist
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white">{wishlist.title}</h1>
            <p className="mt-3 max-w-2xl text-white/75">
              {wishlist.description || 'A curated gift list shared for easy planning.'}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/60">For</p>
                <p className="mt-2 text-lg font-bold text-white">{wishlist.ownerName}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/60">Event date</p>
                <p className="mt-2 text-lg font-bold text-white">
                  {formatDate(wishlist.eventDate)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/60">Gift ideas</p>
                <p className="mt-2 text-lg font-bold text-white">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold">Reserve a gift</h2>
            <p className="mt-3 text-slate-600">
              Add your name before choosing an item so other guests know it is already covered.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="field-label" htmlFor="reservedByName">
                  Your name
                </label>
                <input
                  id="reservedByName"
                  name="reservedByName"
                  className="field-input"
                  value={guest.reservedByName}
                  onChange={(event) =>
                    setGuest((current) => ({
                      ...current,
                      reservedByName: event.target.value
                    }))
                  }
                />
              </div>

              <div>
                <label className="field-label" htmlFor="reservedByEmail">
                  Email (optional)
                </label>
                <input
                  id="reservedByEmail"
                  name="reservedByEmail"
                  type="email"
                  className="field-input"
                  value={guest.reservedByEmail}
                  onChange={(event) =>
                    setGuest((current) => ({
                      ...current,
                      reservedByEmail: event.target.value
                    }))
                  }
                />
              </div>

              {status ? <p className="text-sm font-semibold text-spruce-700">{status}</p> : null}
              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            </div>
          </div>
        </div>
      </div>

      {items.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              publicView
              onReserve={handleReserve}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No gifts listed yet"
          description="This wishlist has been shared, but there are no gift ideas available at the moment."
        />
      )}
    </div>
  );
};

export default PublicWishlistPage;

