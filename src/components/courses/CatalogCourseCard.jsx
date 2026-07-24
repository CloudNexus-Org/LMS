import { Link, useNavigate } from 'react-router-dom';
import { Clock3, Heart, Layers3, ShoppingCart, Star } from 'lucide-react';
import { ROUTES } from '@/protectedroutes/routePaths';
import useCartStore from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';

const DIFFICULTY_STYLES = {
  Beginner: 'bg-success/90 text-white',
  Intermediate: 'bg-primary/90 text-white',
  Advanced: 'bg-accent/90 text-white',
};

export function formatPrice(amount) {
  if (!amount && amount !== 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function CatalogCourseCard({
  course,
  cartPath = ROUTES.cart,
}) {
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

  const durationText = course.duration || '294.5 Hours';
  const sectionsText = course.sectionsCount || course.modules ? `${course.sectionsCount || course.modules} Sections` : '41 Sections';
  const ratingVal = course.rating || 0;
  const reviewsCount = course.reviews || 0;

  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden rounded-2xl
        border border-border/80 bg-surface
        shadow-[var(--shadow-card-value)]
        transition-all duration-300
        hover:-translate-y-1 hover:border-primary/40
        hover:shadow-[0_16px_36px_-12px_color-mix(in_srgb,var(--primary)_35%,transparent)]
      "
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
        <Link
          to={detailPath}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
        >
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

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
            <span className="absolute bottom-2.5 left-2.5 rounded-md bg-success px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`
            absolute left-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center
            rounded-lg border backdrop-blur-md transition-all duration-200
            ${isWishlisted
              ? 'border-danger/40 bg-danger/90 text-white'
              : 'border-white/20 bg-black/40 text-white opacity-0 group-hover:opacity-100 sm:opacity-100'
            }
          `}
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-current' : ''}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            to={detailPath}
            className="line-clamp-2 font-display text-[15px] font-bold leading-snug tracking-tight text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {course.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
            {course.description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-muted">
          <div className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-muted shrink-0" />
            <span>{durationText}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers3 size={14} className="text-muted shrink-0" />
            <span>{sectionsText}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <div className="flex items-center gap-0.5 text-warning">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={13}
                className={star <= Math.round(ratingVal) ? 'fill-warning text-warning' : 'text-border fill-transparent'}
              />
            ))}
          </div>
          <span className="font-semibold text-text">{ratingVal}</span>
          <span>({reviewsCount})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-0.5">
          {course.originalPrice > course.price && (
            <span className="text-[13px] text-muted line-through">
              {formatPrice(course.originalPrice)}
            </span>
          )}
          <span className="font-display text-[19px] font-bold text-text">
            {formatPrice(course.price)}
          </span>
        </div>

        {/* Action Buttons: Preview & Add to Cart */}
        <div className="mt-auto flex items-center gap-2.5 pt-2">
          <Link
            to={detailPath}
            className="
              flex-1 rounded-xl border border-border/80 bg-elevated/90 px-3.5 py-2.5
              text-center text-[13px] font-semibold text-text
              transition-all duration-200 hover:border-primary/40 hover:bg-surface hover:text-primary
              active:scale-[0.98]
            "
          >
            Preview
          </Link>

          <button
            type="button"
            onClick={handleCartAction}
            className="
              flex-1 rounded-xl bg-gradient-to-r from-primary to-accent px-3.5 py-2.5
              text-center text-[13px] font-bold text-white shadow-md
              transition-all duration-200 hover:opacity-95 active:scale-[0.98]
              flex items-center justify-center gap-1.5
            "
          >
            <ShoppingCart size={14} />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

