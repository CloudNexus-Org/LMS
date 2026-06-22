import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock3,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import photo from "@/assets/Girlimage.png";

const EASE = [0.16, 1, 0.3, 1];

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    title: "Address",
    text: "Cloud Nexus, Katara Hills (Bhopal)",
    href: null,
  },
  {
    icon: Mail,
    title: "Email",
    text: "hello@cloudnexus.io",
    href: "mailto:hello@cloudnexus.io",
  },
  {
    icon: Phone,
    title: "Phone",
    text: "+1 (202) 555-0100",
    href: "tel:+12025550100",
  },
];

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-subtle">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-[14px] text-text outline-none transition-all duration-200 placeholder:text-subtle focus:border-primary/50 focus:bg-elevated focus:ring-2 focus:ring-primary/15";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionShell id="contact" glow pattern size="lg">
      <Container size="lg">
        <SectionHeading
          eyebrow="Contact Us"
          title="Get in"
          highlight="Touch"
          description="Fill up the form and our team will get back to you within 24 hours."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* Left — info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative overflow-hidden rounded-lg border border-border bg-elevated shadow-[var(--shadow-card-value)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
              aria-hidden
            />

            <div className="relative p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles size={12} />
                We&apos;re here to help
              </div>

              <h3 className="mt-5 font-display text-[26px] font-bold leading-tight text-text sm:text-[30px]">
                Let&apos;s work together!
              </h3>

              <p className="mt-3 max-w-[340px] text-[14px] leading-relaxed text-muted">
                Whether you&apos;re a learner, mentor, or team lead — our team is
                here to help you grow faster.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Clock3 size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-text">Response time</p>
                  <p className="text-[11px] text-muted">Usually within 24 hours</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {CONTACT_ITEMS.map(({ icon: Icon, title, text, href }) => (
                  <div
                    key={title}
                    className="group flex items-start gap-3 rounded-xl border border-border/50 bg-surface/50 p-3.5 transition-all duration-200 hover:border-primary/25 hover:bg-primary-soft/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">
                        {title}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 block text-[13px] font-medium text-text transition-colors hover:text-primary"
                        >
                          {text}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-[13px] font-medium leading-snug text-text">
                          {text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image strip */}
            <div className="relative mt-2 overflow-hidden border-t border-border/50 bg-gradient-to-br from-primary-soft/40 via-elevated to-accent-soft/30">
              <div className="absolute inset-0 blueprint-grid opacity-20" aria-hidden />
              <div className="relative flex items-end justify-between gap-4 px-6 pb-0 pt-4 sm:px-8">
                <div className="pb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageCircle size={16} />
                    <span className="text-[12px] font-semibold">
                      12,000+ learners supported
                    </span>
                  </div>
                  <p className="mt-1 max-w-[200px] text-[11px] text-muted">
                    Join thousands who trust Cloud Nexus for career growth.
                  </p>
                </div>
                <img
                  src={photo}
                  alt="Support team member"
                  className="h-[140px] w-auto object-contain object-bottom sm:h-[170px]"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
            className="rounded-lg border border-border bg-elevated p-6 shadow-[var(--shadow-card-value)] sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Send size={17} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-[15px] font-bold text-text">Send a message</p>
                <p className="text-[12px] text-muted">
                  We&apos;ll reply to your inbox shortly
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="First Name">
                <input id="firstName" placeholder="John" className={inputCls} />
              </Field>
              <Field id="lastName" label="Last Name">
                <input id="lastName" placeholder="Doe" className={inputCls} />
              </Field>
            </div>

            <div className="mt-4 space-y-4">
              <Field id="email" label="Email">
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={inputCls}
                />
              </Field>

              <Field id="subject" label="Subject">
                <input
                  id="subject"
                  placeholder="How can we help?"
                  className={inputCls}
                />
              </Field>

              <Field id="message" label="Message">
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Write your message..."
                  className={`${inputCls} h-auto resize-none py-3.5`}
                />
              </Field>

              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-relaxed text-subtle">
                  By submitting, you agree to our privacy policy.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  rightIcon={<Send size={15} />}
                  className="h-11 shrink-0 rounded-lg bg-primary px-7 text-[14px] font-semibold text-white shadow-none transition-all hover:bg-primary-hover hover:-translate-y-0.5"
                >
                  {submitted ? "Sent! We'll be in touch" : "Send message"}
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </Container>
    </SectionShell>
  );
}
