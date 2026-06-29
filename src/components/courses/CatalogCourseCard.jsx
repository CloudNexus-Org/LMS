import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';

const DIFFICULTY_STYLES = {
  Beginner: 'bg-success/90 text-white',
  Intermediate: 'bg-primary/90 text-white',
  Advanced: 'bg-accent/90 text-white',
};

export function formatPrice(amount) {
  return `Rs.${amount.toLocaleString('en-IN')}`;
}

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function CatalogCourseCard({ course, cartPath = '/cart' }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart(course.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(course.id));

  const difficultyStyle =
    DIFFICULTY_STYLES[course.difficulty] || DIFFICULTY_STYLES.Intermediate;
  const discount = getDiscountPercent(course.price, course.originalPrice);
  const detailPath = `/courses/${course.slug}`;

  const handleCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      navigate(cartPath);
      return;
    }
    addToCart(course);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(course);
  };

  return (
    <Link
      to={detailPath}
      className="
        group relative flex h-full flex-col overflow-hidden rounded-xl
        border border-border/70 bg-surface
        shadow-[var(--shadow-card-value)]
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-primary/30
        hover:shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--primary)_35%,transparent)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
      "
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
        <img
          src={course.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`
            absolute left-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center
            rounded-lg border backdrop-blur-md transition-all duration-200
            ${isWishlisted
              ? 'border-danger/40 bg-danger/90 text-white'
              : 'border-white/20 bg-black/35 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 sm:opacity-100'
            }
          `}
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-current' : ''}
            strokeWidth={2.5}
          />
        </button>

        <span
          className={`
            absolute right-2.5 top-2.5 rounded-md px-2 py-0.5
            text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm
            ${difficultyStyle}
          `}
        >
          {course.difficulty}
        </span>

        {discount > 0 && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-success px-2 py-0.5 text-[10px] font-bold text-white">
            {discount}% OFF
          </span>
        )}

        {/* Quick add — desktop hover */}
        <button
          type="button"
          onClick={handleCartAction}
          aria-label={isInCart ? 'View cart' : 'Add to cart'}
          className="
            absolute bottom-2.5 right-2.5 z-10 hidden h-8 w-8 items-center justify-center
            rounded-lg border border-white/20 bg-black/50 text-white backdrop-blur-md
            opacity-0 transition-all duration-200
            hover:bg-primary group-hover:opacity-100
            sm:flex
          "
        >
          <ShoppingCart size={14} />
        </button>
      </div>

      {/* Body — minimal */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 font-display text-[14px] font-bold leading-snug tracking-tight text-text transition-colors group-hover:text-primary sm:text-[15px]">
          {course.title}
        </h3>

        <p className="truncate text-[12px] text-muted">{course.professor}</p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
          <span className="inline-flex items-center gap-1 font-bold text-warning">
            {course.rating}
            <Star size={11} className="fill-warning text-warning" />
          </span>
          <span className="text-subtle">
            ({course.reviews?.toLocaleString('en-IN') ?? '0'})
          </span>
          <span className="text-subtle" aria-hidden>·</span>
          <span className="text-muted">{course.duration}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">
            <span className="font-display text-[16px] font-bold text-primary">
              {formatPrice(course.price)}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-[11px] text-muted line-through">
                {formatPrice(course.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCartAction}
            className="
              inline-flex shrink-0 items-center gap-1 rounded-lg border border-border
              bg-elevated px-2.5 py-1.5 text-[11px] font-semibold text-text
              transition-colors hover:border-primary hover:text-primary
              sm:hidden
            "
          >
            <ShoppingCart size={12} />
            {isInCart ? 'Cart' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
