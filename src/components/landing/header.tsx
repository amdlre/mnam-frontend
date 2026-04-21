'use client';

import { useState } from 'react';

interface HeaderProps {
  isScrolled: boolean;
  activeSection?: string;
}

const Header = ({ isScrolled, activeSection }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'why', label: 'عن منام' },
    { id: 'how', label: 'آلية العمل' },
    { id: 'owners', label: 'للملاك' },
    { id: 'guests', label: 'للضيوف' },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'border-border/50 bg-white/90 py-3   backdrop-blur-xl'
        : 'border-transparent bg-transparent py-4 md:py-6'
        }`}
    >
      <div className="container relative mx-auto flex items-center justify-between px-6">
        {/* Mobile Menu Toggle */}
        <button
          className="z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-border md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Logo */}
        <div
          className="group z-50 order-2 mx-auto flex cursor-pointer items-center md:order-1 md:mx-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mnam-logo.png"
            alt="Mnam Logo"
            className="h-14 w-14 object-contain drop-  transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="order-2 hidden items-center gap-1 rounded-full border border-white/20 bg-white/50 px-2 py-1.5   backdrop-blur-md md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${activeSection === item.id
                ? 'bg-foreground text-white shadow-md'
                : 'text-muted-foreground hover:bg-card hover:text-primary'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="z-50 order-3 flex items-center gap-3 md:order-3">
          <button
            onClick={() => scrollToSection('footer')}
            className="hidden px-3 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            تواصل معنا
          </button>

          <button
            onClick={() => scrollToSection('owners')}
            className="group flex items-center gap-2 whitespace-nowrap rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-foreground/20 transition-colors duration-300 hover:bg-primary md:px-6"
          >
            <span>انضم كشريك</span>
            <svg
              className="hidden h-4 w-4 transition-transform group-hover:translate-x-[-2px] rtl:rotate-180 md:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`absolute left-0 top-full w-full overflow-hidden border-b border-border bg-white/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-[400px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
      >
        <div className="flex flex-col gap-2 px-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full border-b border-border py-3 text-right text-sm font-bold last:border-0 ${activeSection === item.id ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('footer')}
            className="w-full pt-4 text-right text-sm font-bold text-muted-foreground hover:text-primary"
          >
            تواصل معنا
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
