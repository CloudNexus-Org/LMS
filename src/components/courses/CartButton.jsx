import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/store/useCartStore';

export default function CartButton({ className = '', size = 20, to = '/cart' }) {
  const items = useCartStore((s) => s.items);
  const count = items.length;

  return (
    <Link
      to={to}
      aria-label={`Shopping cart${count ? `, ${count} items` : ''}`}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center
        rounded-lg border border-border
        text-text transition-all duration-200
        hover:border-primary/30 hover:bg-primary/5 hover:text-primary
        ${className}
      `}
    >
      <ShoppingCart size={size} strokeWidth={2} />
      {count > 0 && (
        <span
          className="
            absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px]
            items-center justify-center rounded-full
            bg-primary px-1 text-[10px] font-bold text-white
            shadow-[0_2px_8px_-2px_var(--primary)]
          "
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
