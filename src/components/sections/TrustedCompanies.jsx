import useIsDarkTheme from "../../hooks/useIsDarkTheme";

// Logos that look the same in both themes
import google from "../../assets/company-logo/google.png";
import ibm from "../../assets/company-logo/ibm.png";
import microsoft from "../../assets/company-logo/microsoft.png";
import adobe from "../../assets/company-logo/adobe-removebg-preview.png";
import netflix from "../../assets/company-logo/netflix.png";

// Logos that need a different version per theme
import jpmorganBlack from "../../assets/company-logo/jpmorgan-black.png";
import jpmorganWhite from "../../assets/company-logo/jpmorgan-white.png";
import amazonBlack from "../../assets/company-logo/amazon-black.png";
import amazonOrange from "../../assets/company-logo/amazon-orange.png";
import toyotaBlack from "../../assets/company-logo/toyota-black.png";
import toyotaWhite from "../../assets/company-logo/toyota-white-removebg-preview.png";
import metaLight from "../../assets/company-logo/meta-black.png";
import metaDark from "../../assets/company-logo/meta.png";

// Naming convention used here:
//   *Black  → file intended for LIGHT theme (logo IS in black/dark colors)
//   *White  → file intended for DARK  theme (logo IS in white/light colors)
//   single-name (no -black/-white suffix) → works on BOTH themes (full color)
//
// So for theme-aware companies we map by image CONTENT, not by filename:
//   lightLogo = dark-colored version  (visible on white bg)
//   darkLogo  = light-colored version (visible on dark bg)
const companies = [
  {
    name: "JPMorgan",
    lightLogo: jpmorganBlack,
    darkLogo: jpmorganWhite,
  },
  {
    name: "IBM",
    lightLogo: ibm,
    darkLogo: ibm,
  },
  {
    name: "Microsoft",
    lightLogo: microsoft,
    darkLogo: microsoft,
  },
  {
    name: "Google",
    lightLogo: google,
    darkLogo: google,
  },
  {
    name: "Amazon",
    lightLogo: amazonBlack,
    darkLogo: amazonOrange,
  },
  {
    name: "Toyota",
    lightLogo: toyotaBlack,
    darkLogo: toyotaWhite,
  },
  {
    name: "Adobe",
    lightLogo: adobe,
    darkLogo: adobe,
  },
  {
    name: "Meta",
    lightLogo: metaLight,
    darkLogo: metaDark,
  },
  {
    name: "Netflix",
    lightLogo: netflix,
    darkLogo: netflix,
  },
];

function LogoCard({ company }) {
  const isDarkTheme = useIsDarkTheme();

  return (
    <div
      title={company.name}
      className="group/logo flex min-w-[200px] shrink-0 items-center justify-center opacity-70 transition duration-300 hover:opacity-100"
    >
      <img
        src={isDarkTheme ? company.darkLogo : company.lightLogo}
        alt={company.name}
        className="h-[90px] w-auto max-w-[140px] object-contain transition duration-300 group-hover/logo:scale-110"
      />
    </div>
  );
}

function MarqueeRow({ data }) {
  const extendedData = [...data, ...data];

  return (
    <div className="group relative mx-auto flex max-w-[1250px] overflow-hidden py-4">

      {/* Left Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />

      {/* Right Fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[var(--bg)] to-transparent" />

      {/* Marquee */}
      <div className="flex w-max shrink-0 gap-12 animate-marquee">
        {extendedData.map((company, index) => (
          <LogoCard
            key={`logo-${company.name}-${index}`}
            company={company}
          />
        ))}
      </div>
    </div>
  );
}

export default function TrustedCompanies() {
  return (
    <section className="relative overflow-hidden bg-bg py-20 text-text transition-colors duration-300">

      {/* Background */}
      <div className="absolute inset-0 bg-bg transition-colors duration-300" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6">

        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-[30px] font-bold uppercase tracking-[0.5em] text-primary">
            Our learners now work at
          </p>
        </div>

        {/* Logos */}
        <MarqueeRow data={companies} />
      </div>
    </section>
  );
}