import { Link } from "react-router-dom";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MapPin, Phone, Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

import cnlg from "../../assets/navbar/white.png";
import cnlg1 from "../../assets/navbar/Blac.png";

const TECH_COLUMNS = [
  {
    id: "col-1",
    categories: [
      {
        title: "Frontend",
        links: ["HTML", "CSS", "JavaScript", "React.js", "Angular", "Next.js"],
      },
      {
        title: "Backend",
        links: ["Node.js", "Python", "Java", "Go (Golang)", "ASP.NET (C#, VB)"],
      },
    ],
  },
  {
    id: "col-2",
    categories: [
      {
        title: "Databases",
        links: ["MySQL", "PostgreSQL", "Microsoft SQL Server", "MongoDB", "Redis"],
      },
      {
        title: "Testing",
        links: ["Jest / Mocha / Jasmine", "Cypress / Selenium", "Postman / Newman", "Playwright"],
      },
      {
        title: "AI / ML",
        links: ["Python Libraries", "TensorFlow", "Data & NLP"],
      },
    ],
  },
  {
    id: "col-3",
    categories: [
      {
        title: "Cloud Platforms & Services",
        links: ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)"],
      },
      {
        title: "Authentication & Authorization",
        links: ["OAuth / JWT", "Firebase Auth", "Keycloak"],
      },
      {
        title: "Version Control",
        links: ["Git", "GitHub", "Azure", "Microsoft Teams"],
      },
    ],
  },
  {
    id: "col-4",
    categories: [
      {
        title: "DevOps & CI/CD",
        links: ["Docker", "Jenkins", "GitHub Actions"],
      },
      {
        title: "APIs & Microservices",
        links: ["REST APIs", "GraphQL", "WebSockets"],
      },
      {
        title: "Analytics & Monitoring",
        links: ["Google Analytics", "Matomo", "Datadog", "Grafana", "New Relic"],
      },
    ],
  },
];

const UTILITY_LINKS = [
  { label: "Contact", href: "/#contact" },
  { label: "Careers", href: "#" },
  { label: "Support", href: "#" },
  { label: "Partners", href: "#" },
  { label: "Privacy & Security", href: "#" },
  { label: "Sitemap", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookie Preferences", href: "#" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/cloudnexusorg/posts/?feedView=all",
  },
  { label: "Instagram", icon: FaInstagram, href: "#" },
];

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Cloud Nexus, Katara Hills (Bhopal)",
    href: null,
  },
  {
    icon: Phone,
    label: "+1 (202) 555-0100",
    href: "tel:+12025550100",
  },
  {
    icon: Mail,
    label: "hello@cloudnexus.io",
    href: "mailto:hello@cloudnexus.io",
  },
];

function CategoryBlock({ title, links, isFirst }) {
  return (
    <div className={isFirst ? "" : "mt-3.5"}>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-text">
        {title}
      </h4>
      <ul className="mt-1.5 space-y-0">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="block py-[2px] text-[12px] leading-snug text-muted transition-colors hover:text-text"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard() {
  return (
    <div
      className="
        w-full rounded-2xl border p-4
        border-border/70 bg-elevated
        shadow-[var(--shadow-card-value)]
        dark:border-white/[0.08] dark:bg-[#111316]
      "
    >
      <Link
        to="/contact"
        className="
          flex h-9 w-full items-center justify-center rounded-full
          bg-primary text-[13px] font-semibold text-white
          transition-colors duration-200 hover:bg-primary-hover
        "
      >
        Contact Us
      </Link>

      <div className="my-3 border-t border-border/50 dark:border-white/[0.06]" />

      <ul className="space-y-2">
        {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            {href ? (
              <a
                href={href}
                className="group flex items-center gap-2.5 transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary dark:bg-primary/15">
                  <Icon size={12} strokeWidth={2.2} />
                </span>
                <span className="text-[11.5px] leading-tight text-muted group-hover:text-text">
                  {label}
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary dark:bg-primary/15">
                  <Icon size={12} strokeWidth={2.2} />
                </span>
                <span className="text-[11.5px] leading-tight text-muted">
                  {label}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const isDarkTheme = useIsDarkTheme();

  return (
    <footer className="relative bg-bg">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-5 sm:px-8">
        {/* Top — logo + demo */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex shrink-0 items-center">
            <img
              src={isDarkTheme ? cnlg : cnlg1}
              alt="Cloud Nexus"
              className="h-[52px] w-auto object-contain sm:h-[60px] lg:h-[68px]"
            />
          </Link>

          <Button
            to="/demo"
            size="md"
            className="
              h-9 shrink-0 rounded-full border-0 bg-primary px-5
              text-[13px] font-semibold text-white shadow-none
              transition-colors duration-200 hover:bg-primary-hover
            "
          >
            Request a Demo
          </Button>
        </div>

        {/* Main — 4 link cols + contact box */}
        <div className="mt-5 grid items-start gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_248px] lg:gap-x-8">
          {TECH_COLUMNS.map((col) => (
            <div key={col.id} className="min-w-0">
              {col.categories.map((cat, i) => (
                <CategoryBlock
                  key={cat.title}
                  title={cat.title}
                  links={cat.links}
                  isFirst={i === 0}
                />
              ))}
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-1 lg:row-span-1">
            <ContactCard />
          </div>
        </div>

        {/* Bottom bar — compact, no huge gap */}
        <div className="mt-5 border-t border-border/70 pt-4 dark:border-white/[0.06]">
          <nav
            aria-label="Footer utility links"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            {UTILITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[11px] text-muted">
              © {new Date().getFullYear()} CloudNexus Learning, Inc.
            </span>

            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="
                    flex h-7 w-7 items-center justify-center rounded-full
                    border border-border text-muted
                    transition-colors hover:border-primary hover:text-primary
                    dark:border-white/15 dark:hover:border-primary
                  "
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
