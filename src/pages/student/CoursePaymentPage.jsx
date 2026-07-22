import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import TrackCatalogCard from "@/components/tracks/TrackCatalogCard";
import { getResumeUrlForTrack } from "@/features/learn/learningSession";
import { tracks, formatTrackPrice, getTrackById } from "@/data/tracks";
import useAuthStore from "@/store/useAuthStore";
import { initiatePayment, confirmPayment } from "@/lib/api/paymentApi";
import { enrollInTrack } from "@/lib/api/enrollmentApi";
import { parseApiError } from "@/lib/api/apiHelpers";

const GST_RATE = 0.18;

/**
 * Loads the Razorpay checkout.js script once and resolves when ready.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CoursePaymentPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [searchParams] = useSearchParams();
  const initialTrack = searchParams.get("track");
  const isSuccessView = searchParams.get("status") === "success";
  const validInitial =
    initialTrack && getTrackById(initialTrack) ? initialTrack : tracks[0]?.id;

  const [selectedId, setSelectedId] = useState(validInitial);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const selected = useMemo(
    () => getTrackById(selectedId) || tracks[0],
    [selectedId]
  );

  const subtotal = selected?.price || 0;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  const savings =
    selected?.originalPrice > selected?.price
      ? selected.originalPrice - selected.price
      : 0;

  const handlePay = useCallback(async () => {
    if (!selected || paying) return;
    if (!user?.id || !token) {
      setPayError("Please sign in to complete payment.");
      return;
    }

    setPaying(true);
    setPayError("");

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Check your internet connection.");
      }

      // 2. Create order on backend
      const courseId = selected.courseIds?.[0] ?? null;
      const orderData = await initiatePayment(user, token, {
        courseIds: courseId ? [courseId] : [],
        trackId: selected.id,
        currency: 'INR',
        // Pass subtotal as direct amount so backend doesn't fall back to ₹0
        // when the track has no catalog courseId yet
        amount: subtotal,
        title: selected.name,
      });

      // 3. Open Razorpay modal
      await new Promise((resolve, reject) => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round((orderData.total ?? total) * 100), // paise
          currency: orderData.currency ?? "INR",
          name: "Cloud Nexus LMS",
          description: selected.name,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: user.fullName ?? user.username ?? "",
            email: user.email ?? "",
          },
          theme: { color: "#7c3aed" },
          handler: async (response) => {
            try {
              // 4. Verify payment on backend → triggers Kafka payment.success → enrollment
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
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          reject(new Error(response.error?.description || "Payment failed"));
        });
        rzp.open();
      });

      // 5. Fallback: also directly enroll in case Kafka is slow
      try {
        await enrollInTrack(user, token, { trackId: selected.id, courseId });
      } catch (enrollErr) {
        // 409 = already enrolled via Kafka — that's fine
        if (enrollErr?.status !== 409) {
          console.warn("Direct enroll fallback failed:", enrollErr);
        }
      }

      navigate(`/student/payment?track=${selected.id}&status=success`, { replace: true });
    } catch (err) {
      if (err?.message === "Payment cancelled") {
        setPayError("Payment was cancelled. Try again when ready.");
      } else {
        setPayError(parseApiError(err) || "Payment failed. Please try again.");
      }
    } finally {
      setPaying(false);
    }
  }, [selected, paying, user, token, total, navigate]);

  if (isSuccessView) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-text">
            Payment successful
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            You&apos;re enrolled in{" "}
            <span className="font-semibold text-text">{selected.name}</span>.
            Start learning right away.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={getResumeUrlForTrack(selected.id)}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Start learning
          </Link>
          <Link
            to="/student/courses"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-elevated px-5 py-2.5 text-[14px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
          >
            My courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <Link
          to="/courses"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} aria-hidden />
          Back to all courses
        </Link>

        <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={11} aria-hidden />
          Course checkout
        </div>

        <h1 className="mt-4 text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
          Choose a track &amp; pay
        </h1>
        <p className="mt-1 max-w-[640px] text-[15px] text-muted">
          All career tracks and prices are listed below. Select the course you
          want, then complete payment via Razorpay.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <section>
          <p className="mb-4 text-[13px] text-muted">
            Showing{" "}
            <span className="font-semibold text-text">{tracks.length}</span>{" "}
            career tracks
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {tracks.map((track, i) => (
              <TrackCatalogCard
                key={track.id}
                track={track}
                index={i}
                variant="payment"
                selected={selected?.id === track.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="dashboard-card space-y-5 p-5 sm:p-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-subtle">
                Order summary
              </p>
              <h3 className="mt-2 font-display text-[20px] font-bold text-text">
                {selected.name}
              </h3>
              <p className="mt-1 text-[13px] text-muted">{selected.tagline}</p>
            </div>

            <ul className="space-y-2 border-y border-border py-4 text-[13px] text-muted">
              <li className="flex justify-between">
                <span>Track fee</span>
                <span className="font-medium text-text">
                  {formatTrackPrice(subtotal)}
                </span>
              </li>
              {savings > 0 && (
                <li className="flex justify-between text-success">
                  <span>Launch discount</span>
                  <span className="font-medium">−{formatTrackPrice(savings)}</span>
                </li>
              )}
              <li className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-medium text-text">
                  {formatTrackPrice(gst)}
                </span>
              </li>
            </ul>

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-text">Total</span>
              <span className="font-display text-[24px] font-bold text-text">
                {formatTrackPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CreditCard size={16} aria-hidden />
              {paying ? "Opening Razorpay…" : "Pay with Razorpay"}
            </button>

            {payError && (
              <p className="text-center text-[13px] font-medium text-danger">
                {payError}
              </p>
            )}

            <p className="flex items-center justify-center gap-1.5 text-[12px] text-muted">
              <ShieldCheck size={13} className="text-success" aria-hidden />
              Secure checkout · Powered by Razorpay
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
