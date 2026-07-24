import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { initiatePayment, confirmPayment } from '@/lib/api/paymentApi';
import { enrollInTrack } from '@/lib/api/enrollmentApi';
import { parseApiError } from '@/lib/api/apiHelpers';

/** Load Razorpay checkout script lazily */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const EASE = [0.16, 1, 0.3, 1];
const GST_RATE = 0.18;

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StudentCartPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.total());

  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const savings = items.reduce(
    (sum, item) => sum + Math.max(0, (item.originalPrice || 0) - (item.price || 0)),
    0
  );
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  const handleCheckout = async () => {
    if (!items.length || paying) return;
    if (!user?.id || !token) {
      setCheckoutError('Please sign in again to complete your purchase.');
      return;
    }

    setPaying(true);
    setCheckoutError('');

    try {
      // 1. Load Razorpay script (always preload; won't open if free)
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Check your internet connection.');
      }

      // 2. Create order on backend (handles free courses too)
      const courseIds = items
        .map((i) => i.id ?? i.courseId)
        .filter((id) => id != null);

      const orderData = await initiatePayment(user, token, {
        courseIds,
        currency: 'INR',
        amount: subtotal,   // direct amount fallback
        title: items.length === 1 ? items[0].title : `${items.length} Courses`,
      });

      // 3a. FREE course — backend already created PAID order and fired Kafka enrollment
      if (orderData.free || orderData.total === 0) {
        // Direct enroll fallback to cover any Kafka lag
        for (const item of items) {
          const courseId = item.id ?? item.courseId;
          const trackId = item.trackId;
          try {
            await enrollInTrack(user, token, { trackId, courseId });
          } catch (err) {
            if (err?.status !== 409) console.warn('Free enroll fallback failed:', err);
          }
        }
        clearCart();
        setSuccess(true);
        return;
      }

      // 3b. PAID course — open Razorpay modal
      await new Promise((resolve, reject) => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(orderData.total * 100), // paise
          currency: orderData.currency ?? 'INR',
          name: 'Cloud Nexus LMS',
          description:
            items.length === 1 ? items[0].title : `${items.length} courses`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: user.fullName ?? user.username ?? '',
            email: user.email ?? '',
          },
          theme: { color: '#7c3aed' },
          handler: async (response) => {
            try {
              // 4. Verify on backend → emits payment.success Kafka event → enrollment-service enrolls
              await confirmPayment(user, token, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          reject(new Error(response.error?.description || 'Payment failed'));
        });
        rzp.open();
      });

      // 5. Direct enroll fallback in case Kafka event is slow
      for (const item of items) {
        const courseId = item.id ?? item.courseId;
        const trackId = item.trackId;
        try {
          await enrollInTrack(user, token, { trackId, courseId });
        } catch (err) {
          if (err?.status !== 409) {
            console.warn('Enroll fallback failed for item:', item.title, err);
          }
        }
      }

      clearCart();
      setSuccess(true);
    } catch (err) {
      if (err?.message === 'Payment cancelled') {
        setCheckoutError('Payment was cancelled. Try again when ready.');
      } else {
        setCheckoutError(parseApiError(err) || 'Checkout failed. Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-tight text-text">
            Purchase successful
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Your courses are now in My Learning. Start studying right away.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/student/courses"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Go to My Learning
          </Link>
          <Link
            to="/student/catalog"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-elevated px-5 py-2.5 text-[14px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
          >
            Browse more courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          to="/student/catalog"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} aria-hidden />
          Continue shopping
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
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
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-danger"
            >
              <Trash2 size={14} />
              Clear cart
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="dashboard-card flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <ShoppingBag size={26} strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-text">
            Your cart is empty
          </h2>
          <p className="mt-2 max-w-sm text-[14px] text-muted">
            Explore the catalog and add courses you want to learn.
          </p>
          <Button to="/student/catalog" size="lg" className="mt-6">
            Browse courses
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ── Cart items ── */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: index * 0.04 }}
                className="dashboard-card flex gap-4 p-4 sm:gap-5 sm:p-5"
              >
                <div className="h-[80px] w-[110px] shrink-0 overflow-hidden rounded-xl bg-elevated sm:h-[92px] sm:w-[128px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[16px] font-bold leading-snug text-text">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
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
                      <span className="font-display text-[18px] font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[12px] text-subtle line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* ── Order summary sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
            className="dashboard-card h-fit p-5 lg:sticky lg:top-4"
          >
            <h2 className="font-display text-lg font-bold text-text">
              Order summary
            </h2>

            <dl className="mt-4 space-y-2.5 text-[14px]">
              <div className="flex justify-between text-muted">
                <dt>Subtotal ({items.length} items)</dt>
                <dd className="font-semibold text-text">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-success">
                  <dt>You save</dt>
                  <dd className="font-semibold">{formatPrice(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <dt>GST (18%)</dt>
                <dd className="font-semibold text-text">{formatPrice(gst)}</dd>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <dt className="font-bold text-text">Total</dt>
                  <dd className="font-display text-[22px] font-bold text-primary">
                    {formatPrice(total)}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] text-muted">
              <ShieldCheck size={14} className="shrink-0 text-success" />
              {total === 0 ? 'Free enrollment · No payment required' : 'Secure checkout · Powered by Razorpay'}
            </div>

            {checkoutError && (
              <p className="mt-3 text-[13px] font-medium text-danger">
                {checkoutError}
              </p>
            )}

            <Button
              size="lg"
              fullWidth
              className="mt-5"
              leftIcon={total === 0 ? null : <CreditCard size={16} />}
              onClick={handleCheckout}
              disabled={paying}
            >
              {paying
                ? (total === 0 ? 'Enrolling…' : 'Opening Razorpay…')
                : (total === 0 ? 'Enroll Free' : 'Pay with Razorpay')}
            </Button>

            <Button
              to="/student/catalog"
              variant="secondary"
              size="md"
              fullWidth
              className="mt-2.5"
            >
              Add more courses
            </Button>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
