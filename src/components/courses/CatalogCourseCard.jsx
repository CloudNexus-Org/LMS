import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock3,
  Globe,
  Heart,
  Infinity,
  Layers3,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/protectedroutes/routePaths';
import useCartStore from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';

const DIFFICULTY_STYLES = {
  Beginner: 'bg-success/15 text-success border-success/25',
  Intermediate: 'bg-primary-soft text-primary border-primary/25',
  Advanced: 'bg-accent-soft text-accent border-accent/25',
};

export function formatPrice(amount) {
  return `Rs.${amount.toLocaleString('en-IN')}`;
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

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate(cartPath);
      return;
    }
    addToCart(course);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(course);
    navigate(cartPath);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(course);
  };

  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden rounded-xl
        border border-border/70 bg-surface/95
        shadow-[var(--shadow-card-value)]
        transition-all duration-300
        hover:border-primary/25 hover:shadow-[0_16px_40px_-18px_var(--primary)]
      "
    >
      {/* Image */}
      <div className="relative p-3 pb-0">
        <div className="relative h-[140px] overflow-hidden rounded-lg bg-elevated">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {discount > 0 && (
            <div className="absolute left-3 bottom-3 rounded-md border border-success/30 bg-success/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {discount}% off
            </div>
          )}

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`
              absolute left-3 top-3 flex h-8 w-8 items-center justify-center
              rounded-lg border backdrop-blur-md transition-all duration-200
              ${isWishlisted
                ? 'border-danger/30 bg-danger/90 text-white'
                : 'border-white/15 bg-black/40 text-white hover:bg-danger hover:text-white'
              }
            `}
          >
            <Heart
              size={14}
              className={isWishlisted ? 'fill-current' : ''}
              strokeWidth={2.5}
            />
          </button>

          <div
            className={`
              absolute right-3 top-3 inline-flex items-center gap-1
              rounded-md border px-2 py-0.5
              text-[9px] font-bold uppercase tracking-[0.12em] backdrop-blur-md
              ${difficultyStyle}
            `}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            {course.difficulty}
          </div>

          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/40 px-2 py-0.5 backdrop-blur-md">
            <Star size={10} className="fill-warning text-warning" />
            <span className="text-[11px] font-bold text-white">{course.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5">
        <h3 className="font-display text-[15px] font-bold leading-snug tracking-tight text-text transition-colors line-clamp-2 group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted line-clamp-1">
          By {course.professor}
        </p>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            { icon: Clock3, label: course.duration },
            { icon: Layers3, label: `${course.modules} Mod` },
            { icon: BookOpen, label: `${course.lessons} Lsn` },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="
                flex flex-col items-center gap-0.5 rounded-md
                border border-border/50 bg-elevated/70 px-1.5 py-1.5
                transition-colors group-hover:border-primary/20 group-hover:bg-primary-soft/30
              "
            >
              <Icon size={11} className="text-primary" strokeWidth={2.5} />
              <span className="text-center text-[9px] font-semibold leading-tight text-text">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Rating, reviews & enrollment — Udemy / Coursera style */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium">
          <span className="inline-flex items-center gap-1 text-text">
            <span className="font-bold text-warning">{course.rating}</span>
            <Star size={10} className="fill-warning text-warning" />
            <span className="text-muted">
              ({course.reviews?.toLocaleString('en-IN') ?? '0'})
            </span>
          </span>
          <span className="text-subtle" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Users size={10} className="text-primary" />
            {course.enrolled} students
          </span>
        </div>

        {/* Course highlights */}
        <div className="mt-2 flex flex-wrap gap-1">
          {[
            { icon: Award, label: 'Certificate' },
            { icon: Infinity, label: 'Lifetime access' },
            { icon: Globe, label: course.language || 'English' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="
                inline-flex items-center gap-1 rounded-md
                border border-border/60 bg-elevated/60
                px-1.5 py-0.5 text-[9px] font-semibold text-muted
              "
            >
              <Icon size={9} className="shrink-0 text-primary" strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>

        <p className="mt-2 flex-1 text-[11px] leading-relaxed text-muted line-clamp-2">
          {course.description}
        </p>

        <div className="mt-3 border-t border-border/50 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-display text-[17px] font-bold leading-none text-primary">
              {formatPrice(course.price)}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-[11px] font-medium text-muted line-through">
                {formatPrice(course.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
                {discount}% off
              </span>
            )}
          </div>

          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={handleCartAction}
              className={`
                inline-flex flex-1 items-center justify-center gap-1.5
                rounded-lg border px-2 py-2
                text-[11px] font-semibold transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${isInCart
                  ? 'border-primary/30 bg-primary-soft text-primary hover:border-primary hover:bg-primary/15'
                  : 'border-border bg-elevated text-text hover:border-primary hover:text-primary'
                }
              `}
            >
              <ShoppingCart size={13} />
              {isInCart ? 'View cart' : 'Add to cart'}
            </button>

            <Button
              type="button"
              size="sm"
              className="flex-1 !h-[34px] !px-2 !text-[11px]"
              rightIcon={<ArrowRight size={12} />}
              onClick={handleBuyNow}
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
