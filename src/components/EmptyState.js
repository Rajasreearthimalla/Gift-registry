const EmptyState = ({ title, description, action }) => (
  <div className="glass-panel border-dashed p-10 text-center">
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="mx-auto mt-3 max-w-lg text-slate-600">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;

