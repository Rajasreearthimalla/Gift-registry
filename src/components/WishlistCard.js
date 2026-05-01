import { formatDate } from '../utils/formatters';

const WishlistCard = ({ wishlist, onOpen, onEdit, onDelete, onCopyShare }) => (
  <div className="glass-panel overflow-hidden">
    {wishlist.coverImage ? (
      <img
        src={wishlist.coverImage}
        alt={wishlist.title}
        className="h-44 w-full object-cover"
      />
    ) : (
      <div className="h-44 bg-[linear-gradient(135deg,#fed7aa_0%,#99f6e4_100%)]" />
    )}

    <div className="space-y-5 p-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold">{wishlist.title}</h3>
          <span
            className={`badge ${
              wishlist.isPublic
                ? 'bg-spruce-100 text-spruce-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {wishlist.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {wishlist.description || 'No description added yet.'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-ember-50 p-3">
          <p className="text-slate-500">Items</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{wishlist.totalItems}</p>
        </div>
        <div className="rounded-2xl bg-spruce-100 p-3">
          <p className="text-slate-500">Reserved</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{wishlist.reservedItems}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-slate-500">Purchased</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {wishlist.purchasedItems}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-500">Event date: {formatDate(wishlist.eventDate)}</p>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={() => onOpen(wishlist)}>
          Open wishlist
        </button>
        <button type="button" className="btn-secondary" onClick={() => onEdit(wishlist)}>
          Edit
        </button>
        <button type="button" className="btn-secondary" onClick={() => onCopyShare(wishlist)}>
          Copy share link
        </button>
        <button type="button" className="btn-danger" onClick={() => onDelete(wishlist)}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default WishlistCard;

