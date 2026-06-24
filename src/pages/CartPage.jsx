import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import useCartStore from '@/store/useCartStore';
import { pageShell, themeCard } from '@/styles/theme';

const EASE = [0.16, 1, 0.3, 1];

function formatPrice(amount) {
  return `Rs.${amount.toLocaleString('en-IN')}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total());

  const savings = items.reduce(
    (sum, item) => sum + (item.originalPrice - item.price),
    0
  );

  return (
    <div className={pageShell}>
      <main id="main" className="relative pt-[88px] pb-20 md:pt-[112px] md:pb-28">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft size={13} aria-hidden />
              Continue shopping
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
            className="mt-8 flex items-center justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-[34px] font-bold tracking-tight text-text sm:text-[42px]">
                Your cart
              </h1>
              <p className="mt-1 text-[15px] text-muted">
                {items.length === 0
                  ? 'No courses added yet'
                  : `${items.length} course${items.length === 1 ? '' : 's'} ready for checkout`}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="hidden items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-danger sm:inline-flex"
              >
                <Trash2 size={14} />
                Clear cart
              </button>
            )}
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ShoppingBag size={28} strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 font-display text-[22px] font-bold text-text">
                Your cart is empty
              </h2>
              <p className="mt-2 max-w-sm text-[14px] text-muted">
                Browse our catalog and add courses you want to learn.
              </p>
              <Button to="/courses" size="lg" className="mt-8" rightIcon={<ArrowRight size={16} />}>
                Browse courses
              </Button>
            </motion.div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: index * 0.05 }}
                    className={`flex gap-4 p-4 sm:gap-5 sm:p-5 ${themeCard}`}
                  >
                    <div className="h-[88px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-elevated sm:h-[100px] sm:w-[140px]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-[17px] font-bold leading-snug text-text sm:text-[18px]">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-[12px] font-medium uppercase tracking-wide text-muted">
                            By {item.professor}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-[20px] font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[12px] text-subtle line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                className={`h-fit p-6 lg:sticky lg:top-[100px] ${themeCard}`}
              >
                <h2 className="font-display text-[20px] font-bold text-text">
                  Order summary
                </h2>

                <dl className="mt-5 space-y-3 text-[14px]">
                  <div className="flex justify-between text-muted">
                    <dt>Subtotal ({items.length} items)</dt>
                    <dd className="font-semibold text-text">{formatPrice(total)}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-success">
                      <dt>You save</dt>
                      <dd className="font-semibold">{formatPrice(savings)}</dd>
                    </div>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <dt className="font-bold text-text">Total</dt>
                      <dd className="font-display text-[24px] font-bold text-primary">
                        {formatPrice(total)}
                      </dd>
                    </div>
                    <p className="mt-1 text-[11px] text-subtle">+GST applicable at checkout</p>
                  </div>
                </dl>

                <Button
                  size="lg"
                  fullWidth
                  className="mt-6"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={() => navigate('/signup')}
                >
                  Proceed to checkout
                </Button>

                <Button
                  to="/courses"
                  variant="secondary"
                  size="md"
                  fullWidth
                  className="mt-3"
                >
                  Add more courses
                </Button>
              </motion.aside>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
