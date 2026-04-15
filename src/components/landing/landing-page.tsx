'use client';

import { useState, useEffect } from 'react';

import Header from './header';
import Hero from './hero';
import WhyUs from './why-us';
import HowItWorks from './how-it-works';
import ForOwners from './for-owners';
import ForGuests from './for-guests';
import TrustStats from './trust-stats';
import FAQ from './faq';
import Footer from './footer';
import GeminiAssistant from './gemini-assistant';
import LegalModal from './legal-modal';
import Cursor from './cursor';
import SplashScreen from './splash-screen';

const LandingPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Reveal Animation Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 },
    );

    const revealedElements = document.querySelectorAll('.reveal');
    revealedElements.forEach((el) => revealObserver.observe(el));

    // Active Section Observer for Navigation
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
      },
    );

    const sections = document.querySelectorAll('#why, #how, #owners, #guests');
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealedElements.forEach((el) => revealObserver.unobserve(el));
      sections.forEach((section) => sectionObserver.unobserve(section));
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} duration={3500} />}
      <Cursor />
      <div className="relative min-h-screen font-sans">
        <Header isScrolled={isScrolled} activeSection={activeSection} />
        <main>
          <Hero />
          <WhyUs />
          <HowItWorks onOpenTerms={() => setLegalModalType('terms')} />
          <ForOwners />
          <ForGuests />
          <TrustStats />
          <FAQ />
        </main>
        <Footer onOpenLegal={(type) => setLegalModalType(type)} />
        <GeminiAssistant />
        <LegalModal isOpen={!!legalModalType} type={legalModalType} onClose={() => setLegalModalType(null)} />
      </div>
    </>
  );
};

export default LandingPage;
