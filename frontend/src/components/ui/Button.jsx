import Spinner from './Spinner';

export default function Button({ children, variant = 'primary', loading, disabled, className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors',
  };
  return (
    <button
      className={`${variants[variant]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}