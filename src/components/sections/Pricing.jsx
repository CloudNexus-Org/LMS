import { Check, Sparkles, ArrowRight } from "lucide-react";
import { pricingTiers } from '@/data/pricing';
import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

function Plan({ tier }) {
  const isHighlight = tier.highlighted;
  return (
    <div
      className={`pricing-card relative flex h-full flex-col rounded-2xl border p-6 transition md:p-8 ${isHighlight ? 'featured border-primary bg-elevated shadow-[var(--shadow-elevated)]' : 'border-border bg-elevated shadow-[var(--shadow-card)]'}`}
    >
      {isHighlight ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-md">
            <Sparkles size={12} />
            {tier.badge || "Most popular"}
          </span>
        </div>
      ) : null}

      <div>
        <h3 className="text-[18px] font-bold text-text">{tier.name}</h3>
        <p className="mt-1 text-[13px] leading-6 text-muted">
          {tier.description}
        </p>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        {tier.price === 0 ? (
          <span className="font-display text-[40px] font-bold text-text md:text-[48px]">
            Free
          </span>
        ) : (
          <>
            <span className="text-[18px] font-semibold text-text">$</span>
            <span className="font-display text-[40px] font-bold text-text md:text-[48px]">
              {tier.price}
            </span>
            <span className="text-[13px] text-muted">/ {tier.period}</span>
          </>
        )}
      </div>

      <Button
        to={tier.ctaTo}
        size="md"
        fullWidth
        variant={isHighlight ? "primary" : "outline"}
                         className="
    relative
    inline-flex
    h-[40px]
    min-w-[90px]
    items-center
    justify-center

    overflow-hidden
rounded-none
    border border-[#d9e2ff]
    dark:border-white/10

    bg-white
    dark:bg-[#2563ff]

    px-6

    text-[14px]
    font-semibold

    text-black
    dark:text-white

    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

    transition-all
    duration-300

    hover:-translate-y-[2px]
    hover:border-[#2563ff]/40

    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
  "
        rightIcon={<ArrowRight size={14} />}
      >
        {tier.cta}
      </Button>

      <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
        {tier.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-[13px] text-text"
            >
              <span
                className={`feature-icon mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isHighlight ? "bg-primary text-white" : "bg-success/15 text-success"}`}
              >
                <Check size={11} strokeWidth={3} />
              </span>
              {feature}
            </li>
        ))}
      </ul>
    </div>
  );
}

export default function Pricing() {
  return (
    <SectionShell id="pricing" pattern>
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans,"
          highlight="real outcomes"
          description="Start free. Upgrade when you're ready to certify and ship."
        />

        <div className="pricing-grid grid grid-cols-1 gap-5 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Plan key={tier.name} tier={tier} />
          ))}
        </div>

        <p className="mt-8 text-center text-[12px] text-muted">
          All paid plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </Container>
    </SectionShell>
  );
}
