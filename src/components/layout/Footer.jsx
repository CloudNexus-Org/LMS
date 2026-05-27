import { Link } from "react-router-dom";

import {
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import Button from '@/components/ui/Button';
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

import cnlg from "../../assets/navbar/white.png";
import cnlg1 from "../../assets/navbar/Blac.png";

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
          "Next.js",
        ],
      },
      {
        title: "Backend",
        links: [
          "Node.js",
          "Python",
          "Java",
          "Go (Golang)",
          "ASP.NET (C#, VB)",
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
          "Microsoft SQL Server",
          "MongoDB",
          "Redis",
        ],
      },
      {
        title: "Testing",
        links: [
          "Jest / Mocha / Jasmine",
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
        ],
      },
      {
        title: "Authentication & Authorization",
        links: ["OAuth / JWT", "Firebase Auth", "Keycloak"],
      },
      {
        title: "Version Control",
        links: [
          "Git",
          "GitHub",
          "Azure",
          "Microsoft Teams",
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
        ],
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

const SOCIALS = [
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/cloudnexusorg/posts/?feedView=all",
  },
  { label: "Instagram", icon: FaInstagram, href: "#" },
];

function CategoryBlock({ title, links }) {
  return (
    <div>
      <h4 className="relative  text-[12px] font-bold uppercase tracking-[0.18em] text-text">
        {title}
      </h4>
      <ul className="mt-1 space-y-0.5 text-[13px] leading-5">
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

  const isDarkTheme = useIsDarkTheme();
  return (
    <footer className="relative bg-bg">

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-15 sm:px-6 md:pt-14 lg:px-8">
        {/* Section eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-r from-transparent to-border"
          />

          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-l from-transparent to-border"
          />
        </div>

        {/* 2. MAIN GRID — brand + tech columns */}
        <div className="grid gap-x-15 gap-y-8 lg:grid-cols-[1.1fr_1fr_1fr_1.15fr_1.15fr]">
          {/* Brand column */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <img
                src={isDarkTheme ? cnlg : cnlg1}
                alt="Cloud Nexus Logo"
                className="
                            h-[48px]
                            w-[48px]
                            object-contain
                            "
                          />

              <h1
                className={`
                            text-[20px]
                            font-extrabold
                            tracking-tight

                    ${isDarkTheme
                    ? "text-white"
                    : "text-black"
                  }
                  `}
              >
                CLOUD NEXUS
              </h1>
            </Link>

            <div className="mt-5 space-y-3 text-[13px] leading-5 text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-primary"
                  strokeWidth={2.2}
                  aria-hidden
                />
                <span>
                  Cloud Nexus, Katara Hills(Bhopal)
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
              className="mt-5 relative inline-flex h-[40px] min-w-[90px] items-center justify-center overflow-hidden rounded-none
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
            <div key={col.id} className="space-y-5">
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
      </div>
    </footer>
  );
}
