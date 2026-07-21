import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { footerShell } from "@/styles/theme";
import Button from "@/components/ui/Button";
import { scrollToTop } from "@/utils/scroll";

const FOOTER_COLUMNS = [
  {
    title: "Courses",
    links: [
      { label: "Browse All Courses", to: "/courses" },
      { label: "Categories", to: "/explore/categories" },
      { label: "Certifications", to: "/student/certificates" },
      { label: "Live Classes", href: "#" },
      { label: "Free Courses", href: "#" },
      { label: "Learning Paths", to: "/courses" },
      { label: "Skill Assessments", href: "#" },
      { label: "Enterprise Plans", href: "#" },
    ],
  },
  {
    title: "For Students",
    links: [
      { label: "My Dashboard", to: "/student/dashboard" },
      { label: "Browse Courses", to: "/student/catalog" },
      { label: "My Learning", to: "/student/courses" },
      { label: "Assignments", href: "#" },
      { label: "Certificates", to: "/student/certificates" },
      { label: "Discussion Forums", href: "#" },
      { label: "Mobile App", href: "#" },
      { label: "Student Support", href: "#" },
    ],
  },
  {
    title: "For Instructors",
    links: [
      { label: "Teach on CloudNexus", to: "/signup" },
      { label: "Instructor Portal", to: "/mentor/dashboard" },
      { label: "Course Builder", to: "/mentor/upload" },
      { label: "Analytics & Payouts", to: "/mentor/analytics" },
      { label: "Instructor Community", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Blog & Guides", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "API Documentation", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "System Status", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Affiliate Program", href: "#" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Contact", href: "mailto:hello@cloudnexus.io" },
  { label: "Careers", href: "#" },
  { label: "Support", href: "#" },
  { label: "Partners", href: "#" },
  { label: "Privacy & Security", href: "#" },
  { label: "Sitemap", href: "#" },
];

const POLICY_LINKS = [
  { label: "Terms of Use", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookie Preferences", href: "#" },
];

const SOCIALS = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "X", icon: FaXTwitter, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/cloudnexusorg/posts/?feedView=all",
  },
];

const FOOTER_HOVER = "transition-colors duration-200 hover:text-primary";

function FooterLink({ label, href, to, className = "" }) {
  const base = `text-[12px] leading-5 text-muted ${FOOTER_HOVER}`;

  if (to) {
    return (
      <Link to={to} className={`${base} ${className}`}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={`${base} ${className}`}>
      {label}
    </a>
  );
}

function WhereToFindUsCard() {
  return (
    <div className="flex w-full max-w-[420px] flex-col bg-transparent lg:max-w-none">
      <h3 className="text-[14px] font-bold leading-none tracking-wide text-text dark:text-white">
        Where To Find Us
      </h3>

      <div className="mt-6 flex items-start gap-3">
        <span
          aria-hidden
          className="
            mt-0.5
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-primary/10
          "
        >
          <MapPin
            size={15}
            strokeWidth={2.2}
            className="text-primary"
          />
        </span>

        <address className="min-w-0 space-y-1 not-italic">
          <p className="text-[12px] leading-5 text-text dark:text-white">
            2nd Stage BTM Layout
          </p>
          <p className="text-[12px] leading-5 text-muted dark:text-[#b8bec8]">
            Bengaluru, Karnataka 560076, IN
          </p>
        </address>
      </div>

      <div
        aria-hidden
        className="
          my-5
          h-px
          w-full
          bg-gradient-to-r
          from-primary/50
          via-primary/25
          to-transparent
        "
      />

      <p className="text-[12px] leading-[1.8] text-muted dark:text-[#c5cad6]">
        We provide innovative technology solutions, transforming digital
        infrastructure through advanced advancements, ensuring scalability,
        security, and seamless integration for sustainable growth.
      </p>
    </div>
  );
}

function LinkColumn({ title, links }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <h4 className="mb-4 text-[14px] font-bold uppercase tracking-[0.14em] text-primary dark:text-white">
        {title}
      </h4>

      <ul className="flex flex-col space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink
              label={link.label}
              href={link.href}
              to={link.to}
              className="text-[12px] text-[#3d4a63] dark:text-[#c5cad6]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleExploreCourses = () => {
    if (location.pathname === "/courses") {
      scrollToTop();
      return;
    }
    navigate("/courses");
  };

  return (
    <footer className={`relative z-10 ${footerShell}`}>
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <Link
            to="/"
            className={`text-[26px] font-bold leading-none tracking-tight ${FOOTER_HOVER}`}
          >
            <span className="text-text dark:text-white">Cloud</span>
            <span className="text-primary">Nexus</span>
          </Link>

          <Button
            type="button"
            onClick={handleExploreCourses}
            variant="primary"
            size="md"
            className="relative z-10 shrink-0 bg-primary px-6 shadow-[0_8px_20px_-10px_var(--primary)] hover:bg-primary-hover"
          >
            Explore Courses
          </Button>
        </div>

        <div className="h-px w-full bg-border dark:bg-white/10" />

        {/* Middle section */}
        <div className="grid items-start gap-8 py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-10 lg:py-12 xl:gap-x-12">
          <div
            className="
              flex
              w-full
              items-start
              border-b
              border-border
              pb-8
              lg:border-b-0
              lg:border-r
              lg:pb-0
              lg:pr-8
              xl:pr-12
              dark:border-white/10
              dark:lg:border-r-white/10
            "
          >
            <WhereToFindUsCard />
          </div>

          <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:gap-x-8 md:grid-cols-4 md:gap-x-6 lg:gap-x-8 xl:gap-x-10">
            {FOOTER_COLUMNS.map((col) => (
              <LinkColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border dark:bg-white/10" />

        {/* Bottom section */}
        <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  to={link.to}
                  className="dark:text-[#c5cad6]"
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] leading-5 text-subtle dark:text-[#8b95a8]">
              <span>&copy; {year} CloudNexus Learning, Inc.</span>
              {POLICY_LINKS.map((link) => (
                <a key={link.label} href={link.href} className={FOOTER_HOVER}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 lg:ml-auto">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-primary/40
                  text-primary
                  transition-all
                  duration-200
                  hover:border-primary
                  hover:bg-primary-soft
                  hover:text-primary
                  dark:border-white/40
                  dark:text-white
                  dark:hover:border-primary
                  dark:hover:bg-primary/10
                  dark:hover:text-primary
                "
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
