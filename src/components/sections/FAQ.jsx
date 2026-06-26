import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { faqs } from '@/data/faq';
import SectionShell from "@/app/layouts/SectionShell";
import Container from '@/components/ui/Container';

const EASE = [0.16, 1, 0.3, 1];

function FAQItem({ faq, isOpen, onToggle, id, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
      className="border-b border-border/70 last:border-b-0"
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className="
            group flex w-full items-center gap-4
            py-5 text-left
            transition-colors
          "
        >
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden
            className={`
              shrink-0
              text-muted
              transition-all duration-300
              group-hover:text-primary
              ${isOpen ? "rotate-180 text-primary" : ""}
            `}
          />
          <span
            className={`
              flex-1
              text-[15px] md:text-[16px]
              font-semibold
              text-text
              transition-colors
              group-hover:text-primary
              ${isOpen ? "text-primary" : ""}
            `}
          >
            {faq.question}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-5 pl-[34px] pr-4 text-[14px] leading-7 text-muted">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <SectionShell id="faq">
      <Container size="default" className="!max-w-[1100px]">
        {/* HEADING */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="
              font-display
              text-[clamp(2rem,5vw,3.25rem)]
              font-extrabold
              leading-[1.1]
              tracking-tight
              gradient-text
            "
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
            className="mt-5 text-[14px] leading-7 text-muted md:whitespace-nowrap md:text-[20px]"
          >
            Everything you need to know about courses, mentors, students,
            assignments, and learning progress.
          </motion.p>
        </div>

        {/* LIST */}
        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              id={`faq-${index}`}
              index={index}
              faq={faq}
              isOpen={activeIndex === index}
              onToggle={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
