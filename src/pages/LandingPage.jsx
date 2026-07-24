import { lazy, Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import TrustedCompanies from '@/components/sections/TrustedCompanies';
import Stats from '@/components/sections/Stats';

const HowItWorks = lazy(() => import('@/components/sections/HowItWorks'));
const Courses = lazy(() => import('@/components/sections/Courses'));
const DashboardPreview = lazy(() => import('@/components/sections/DashboardPreview'));
const CertificateShowcase = lazy(() => import('@/components/sections/CertificateShowcase'));
const TestimonialScroll = lazy(() => import('@/components/sections/TestimonialScroll'));
const FAQ = lazy(() => import('@/components/sections/FAQ'));
const Contact = lazy(() => import('@/components/sections/Contact'));

function SectionFallback() {
  return <div className="min-h-[200px]" aria-hidden />;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen text-text bg-bg transition-colors duration-300">
      <div className="min-h-screen">
        <main id="main">
          <Hero />
          <TrustedCompanies />
          <Stats />
          <Suspense fallback={<SectionFallback />}>
            <HowItWorks />
            <Courses />
            <DashboardPreview />
            <CertificateShowcase />
            <TestimonialScroll />
            <FAQ />
            <Contact />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
