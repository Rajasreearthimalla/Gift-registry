import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import itemService from '../services/itemService';
import wishlistService from '../services/wishlistService';

const initialFormState = {
  name: '',
  price: '',
  image: '',
  description: '',
  link: '',
  priority: 'medium'
};

const ItemFormPage = () => {
  const navigate = useNavigate();
  const { wishlistId, itemId } = useParams();
  const [wishlistTitle, setWishlistTitle] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(Boolean(itemId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContext = async () => {
      setLoading(true);

      try {
        const response = await wishlistService.getById(wishlistId);
        setWishlistTitle(response.wishlist.title);

        if (itemId) {
          const item = response.items.find((entry) => entry._id === itemId);

          if (!item) {
            throw new Error('Item not found');
          }

          setForm({
            name: item.name || '',
            price: item.price || '',
            image: item.image || '',
            description: item.description || '',
            link: item.link || '',
            priority: item.priority || 'medium'
          });
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || 'Unable to load item');
      } finally {
        setLoading(false);
      }
    };

    loadContext();
  }, [wishlistId, itemId]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : 0
      };

      if (itemId) {
        await itemService.update(itemId, payload);
      } else {
        await itemService.create({
          ...payload,
          wishlistId
        });
      }

      navigate(`/wishlists/${wishlistId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading item details..." />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel p-8">
        <Link to={`/wishlists/${wishlistId}`} className="text-sm font-semibold text-slate-500">
          Back to wishlist
        </Link>
        <h2 className="mt-3 text-4xl font-bold">
          {itemId ? 'Edit item' : 'Add a new gift'} for {wishlistTitle}
        </h2>
        <p className="mt-3 text-slate-600">
          Include enough detail so shoppers can choose the right item without extra back-and-forth.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="item-name">
                Item name
              </label>
              <input
                id="item-name"
                name="name"
                className="field-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="item-price">
                Price
              </label>
              <input
                id="item-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="field-input"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="item-image">
                Image URL
              </label>
              <input
                id="item-image"
                name="image"
                className="field-input"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/gift.jpg"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="item-link">
                Product link
              </label>
              <input
                id="item-link"
                name="link"
                className="field-input"
                value={form.link}
                onChange={handleChange}
                placeholder="https://shop.example.com/product"
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="item-description">
              Description
            </label>
            <textarea
              id="item-description"
              name="description"
              className="field-textarea"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="item-priority">
              Priority
            </label>
            <select
              id="item-priority"
              name="priority"
              className="field-input"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving item...' : itemId ? 'Update item' : 'Create item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemFormPage;

