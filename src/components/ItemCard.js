import { formatCurrency } from '../utils/formatters';

const priorityTone = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700'
};

const ItemCard = ({
  item,
  publicView = false,
  onEdit,
  onDelete,
  onTogglePurchased,
  onClearReservation,
  onReserve
}) => (
  <div className="glass-panel overflow-hidden">
    {item.image ? (
      <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
    ) : (
      <div className="h-48 bg-[linear-gradient(135deg,#e2e8f0_0%,#fde68a_100%)]" />
    )}

    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${priorityTone[item.priority] || priorityTone.medium}`}>
          {item.priority} priority
        </span>
        {item.isPurchased ? (
          <span className="badge bg-slate-900 text-white">Purchased</span>
        ) : item.isReserved ? (
          <span className="badge bg-spruce-100 text-spruce-700">
            Reserved by {item.reservedByName}
          </span>
        ) : (
          <span className="badge bg-ember-100 text-ember-600">Available</span>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold">{item.name}</h3>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          {formatCurrency(item.price)}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {item.description || 'No description added yet.'}
        </p>
      </div>

      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-semibold text-ember-600 underline-offset-4 hover:underline"
        >
          View product link
        </a>
      ) : null}

      {publicView ? (
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => onReserve(item)}
          disabled={item.isPurchased || item.isReserved}
        >
          {item.isPurchased ? 'Already purchased' : item.isReserved ? 'Already reserved' : 'Reserve this gift'}
        </button>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button type="button" className="btn-secondary" onClick={() => onTogglePurchased(item)}>
            {item.isPurchased ? 'Mark unpurchased' : 'Mark purchased'}
          </button>
          {item.isReserved ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onClearReservation(item)}
            >
              Clear reservation
            </button>
          ) : null}
          <button type="button" className="btn-danger" onClick={() => onDelete(item)}>
            Delete
          </button>
        </div>
      )}
    </div>
  </div>
);

export default ItemCard;

