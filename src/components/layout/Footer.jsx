import {
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaDiscord,
  FaFacebookF,
} from "react-icons/fa";
import { ArrowRight, MapPin, Phone, Mail, Heart } from "lucide-react";
import Button from "../ui/Button";
import BrandMark from "../ui/BrandMark";

const TECH_COLUMNS = [
  {
    id: "col-1",
    categories: [
      {
        title: "Frontend",
        links: [
          "HTML",
          "CSS",
          "JavaScript",
          "React.js",
          "Angular",
          "Vue.js",
          "Svelte",
          "Next.js",
        ],
      },
      {
        title: "Backend",
        links: [
          "Node.js",
          "Python (Django, Flask, FastAPI)",
          "Ruby on Rails",
          "Java",
          "Go (Golang)",
          "PHP (Laravel)",
          "ASP.NET (C#, VB)",
          "Scala",
        ],
      },
    ],
  },
  {
    id: "col-2",
    categories: [
      {
        title: "Databases",
        links: [
          "MySQL",
          "PostgreSQL",
          "Oracle",
          "Microsoft SQL Server",
          "MongoDB",
          "Redis",
          "Cassandra",
        ],
      },
      {
        title: "Testing",
        links: [
          "Jest / Mocha / Jasmine",
          "RTL / Vitest",
          "Cypress / Selenium",
          "Postman / Newman",
          "Playwright",
        ],
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
        links: [
          "Amazon Web Services (AWS)",
          "Microsoft Azure",
          "Google Cloud Platform (GCP)",
          "Heroku",
          "Netlify / Vercel",
        ],
      },
      {
        title: "Authentication & Authorization",
        links: ["OAuth / JWT", "Firebase Auth", "Auth0", "Keycloak"],
      },
      {
        title: "Version Control",
        links: [
          "Git",
          "GitHub / GitLab / Bitbucket",
          "SVN / Perforce / Azure",
          "Slack / Microsoft Teams",
        ],
      },
    ],
  },
  {
    id: "col-4",
    categories: [
      {
        title: "DevOps & CI/CD",
        links: [
          "Docker",
          "Jenkins",
          "GitHub Actions",
          "CircleCI",
          "ArgoCD",
          "Ansible",
          "Prometheus + Grafana",
        ],
      },
      {
        title: "APIs & Microservices",
        links: ["REST APIs", "GraphQL", "gRPC", "WebSockets"],
      },
      {
        title: "Analytics & Monitoring",
        links: ["Google Analytics", "Matomo", "Datadog", "Grafana", "New Relic"],
      },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/cloudnexusorg/posts/?feedView=all",
  },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Twitter", icon: FaTwitter, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
  { label: "Discord", icon: FaDiscord, href: "#" },
];

function CategoryBlock({ title, links }) {
  return (
    <div>
      <h4 className="relative pl-3 text-[12px] font-bold uppercase tracking-[0.18em] text-text">
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-accent"
        />
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-[13px] leading-5">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="group/link inline-flex items-center gap-1 text-muted transition-all duration-200 hover:text-text"
            >
              <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                {link}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ logoText = "CLOUD NEXUS" }) {
  return (
    <footer className="relative bg-bg">
      {/* Gradient hairline divider at the very top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1320px] px-5 pt-10 sm:px-6 md:pt-14 lg:px-8">
        {/* Section eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-r from-transparent to-border"
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-subtle">
            Explore the stack
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-l from-transparent to-border"
          />
        </div>

        {/* 2. MAIN GRID — brand + tech columns */}
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[1.1fr_1fr_1fr_1.15fr_1.15fr]">
          {/* Brand column */}
          <div>
            <BrandMark logoText={logoText} size="md" />

            <p className="mt-4 max-w-xs text-[13px] leading-6 text-muted">
              Mentor-led tracks in cloud, AI, and full-stack — graded on real
              projects, shipped by engineers from ex-FAANG teams.
            </p>

            <div className="mt-5 space-y-3 text-[13px] leading-5 text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-primary"
                  strokeWidth={2.2}
                  aria-hidden
                />
                <span>
                  7250 Dallas Parkway, Suite 400
                  <br />
                  Plano, TX 75024, United States
                </span>
              </div>
              <a
                href="tel:+15558675309"
                className="flex items-start gap-2.5 transition-colors duration-200 hover:text-text"
              >
                <Phone
                  size={14}
                  className="mt-0.5 shrink-0 text-primary"
                  strokeWidth={2.2}
                  aria-hidden
                />
                <span>
                  +1 (555) 867-5309
                  <br />
                  +1 (123) 275-7454
                </span>
              </a>
              <a
                href="mailto:hello@cloudnexus.io"
                className="flex items-center gap-2.5 transition-colors duration-200 hover:text-text"
              >
                <Mail
                  size={14}
                  className="shrink-0 text-primary"
                  strokeWidth={2.2}
                  aria-hidden
                />
                <span>hello@cloudnexus.io</span>
              </a>
            </div>

            <Button
              to="/contact"
              size="md"
              rightIcon={<ArrowRight size={14} />}
              className="mt-5"
            >
              Contact us
            </Button>

            <div className="mt-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-subtle">
                Follow along
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {SOCIALS.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_6px_16px_-8px_var(--primary)]"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 4 tech-stack columns */}
          {TECH_COLUMNS.map((col) => (
            <div key={col.id} className="space-y-7">
              {col.categories.map((cat) => (
                <CategoryBlock
                  key={cat.title}
                  title={cat.title}
                  links={cat.links}
                />
              ))}
            </div>
          ))}
        </div>

        {/* BOTTOM BAND */}
        <div className="relative mt-10 pt-5 pb-7">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
          <div className="flex flex-col items-start justify-between gap-4 text-[12px] text-subtle md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p>
                &copy; {new Date().getFullYear()} Cloud Nexus, Inc. All rights
                reserved.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted transition hover:border-success/40 hover:text-text"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                All systems normal
              </a>
              <span className="hidden items-center gap-1 text-[11px] text-muted lg:inline-flex">
                <Heart
                  size={11}
                  className="fill-danger text-danger"
                  strokeWidth={2}
                  aria-hidden
                />
                Made with care in Plano &amp; Bengaluru
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#" className="transition hover:text-text">
                Privacy policy
              </a>
              <a href="#" className="transition hover:text-text">
                Terms of service
              </a>
              <a href="#" className="transition hover:text-text">
                Cookie policy
              </a>
              <a href="#" className="transition hover:text-text">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
