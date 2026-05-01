const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-ember-100 border-t-ember-500" />
      <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>
    </div>
  </div>
);

export default LoadingSpinner;

