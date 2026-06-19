import Hero from '@/components/sections/Hero';
import TrustedCompanies from '@/components/sections/TrustedCompanies';
import Stats from '@/components/sections/Stats';
import HowItWorks from '@/components/sections/HowItWorks';
import Courses from '@/components/sections/Courses';
import DashboardPreview from '@/components/sections/DashboardPreview';
// import Mentors from '@/components/sections/Mentors';
import CertificateShowcase from '@/components/sections/CertificateShowcase';
// import Pricing from '@/components/sections/Pricing';
import TestimonialScroll from '@/components/sections/TestimonialScroll';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-text bg-bg transition-colors duration-300">
      <div className="min-h-screen">
        <main id="main">
          <Hero />
          <TrustedCompanies />
          <Stats />
          <HowItWorks />
          <Courses />
          <DashboardPreview />
          {/* <Mentors /> */}
          <CertificateShowcase />
          {/* <Pricing /> */}
          <TestimonialScroll />
          <FAQ />
          <Contact />
        </main>
      </div>
    </div>
  );
}
