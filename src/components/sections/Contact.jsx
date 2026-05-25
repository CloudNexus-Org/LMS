import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Button from '@/components/ui/Button';
import photo from '@/assets/Girlimage.png';

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-[52px] w-full rounded-[5px] border border-border bg-bg px-5 text-[14px] text-text outline-none transition placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-[100px] overflow-hidden bg-bg px-4 py-10 text-text transition-colors duration-300 lg:min-h-screen flex items-center"
    >
      {/* GRID */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      {/* GLOW */}
      <div className="absolute left-[-120px] top-[50px] h-[300px] w-[300px] rounded-full border border-primary/20" />
      <div className="absolute right-[-80px] top-[-50px] h-[240px] w-[240px] rounded-full bg-primary-soft blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px]">

        {/* HEADING */}
        <div className="mb-8 text-center">
          <h2 className="text-[34px] font-black tracking-[-0.05em] text-primary md:text-[54px]">
            Get In Touch
          </h2>

          <p className="mx-auto mt-4 max-w-[560px] text-[20px] leading-7 text-muted">
            Fill up the form and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* MAIN BOX */}
        <div className="rounded-[5px] border border-border bg-elevated p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-7">

          <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">

            {/* LEFT */}
            <div
              className="
                relative overflow-hidden rounded-[5px]
                border border-border
                bg-bg
                p-7
              "
            >

              {/* CONTENT */}
              <div className="relative z-10">
                <h3 className="text-[32px] font-black leading-tight text-text">
                  Let’s Work together!
                </h3>

                <p className="mt-4 max-w-[320px] text-[14px] leading-7 text-muted">
                  Whether you're a learner, mentor, or team lead 
                  our team is here to help you grow faster.
                </p>

                <div className="mt-10 flex flex-col space-y-7">

                  <Info
                    icon={<MapPin size={17} />}
                    title="Address"
                    text=" Cloud Nexus, Katara Hills(Bhopal)  "
                  />

                  <Info
                    icon={<Mail size={17} />}
                    title="Email"
                    text="hello@cloudnexus.io"
                  />

                  <Info
                    icon={<Phone size={17} />}
                    title="Phone"
                    text="+1 (202) 555-0100"
                  />
                </div>
              </div>

              {/* IMAGE */}
              <img
                src={photo}
                alt="contact"
                className="
                            absolute bottom-0
                            right-[-18px]
                            h-[150px]
                            object-contain
                          
                            sm:right-0
                            sm:h-[180px]
                          
                            md:right-[-16%]
                            md:h-[290px]
                          "
              />
            </div>

            {/* RIGHT */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center px-2 lg:px-4"
            >

              <div className="grid gap-4 md:grid-cols-2">

                <Field id="firstName" label="First Name">
                  <input
                    id="firstName"
                    placeholder="John"
                    className={inputCls}
                  />
                </Field>

                <Field id="lastName" label="Last Name">
                  <input
                    id="lastName"
                    placeholder="Doe"
                    className={inputCls}
                  />
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
                    rows="4"
                    placeholder="Write your message..."
                    className="
                      w-full resize-none rounded-[5px]
                      border border-border
                      bg-bg
                      px-5 py-4
                      text-[14px]
                      text-text
                      outline-none
                      transition
                      placeholder:text-subtle
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                    "
                  />
                </Field>

                {/* BUTTON */}
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-[12px] text-subtle">
                    By submitting, you agree to our privacy policy.
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                                     className="
    relative
    inline-flex
    h-[35px]
    min-w-[80px]
    items-center
    justify-center

    overflow-hidden
rounded-none
    border border-[#d9e2ff]
    dark:border-white/10

    bg-white
    dark:bg-primary

    px-6

    text-[12px]
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
                    rightIcon={<Send size={16} />}
                  >
                    {submitted
                      ? "Sent! We'll be in touch"
                      : "Send message"}
                  </Button>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4">

      <span
        className="
          flex h-[40px] w-[40px]
          items-center justify-center
          rounded-[5px]
          bg-primary-soft
          text-primary
        "
      >
        {icon}
      </span>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
          {title}
        </p>

        <p className="mt-1 max-w-[240px] text-[14px] leading-7 text-text">
          {text}
        </p>
      </div>
    </div>
  );
}