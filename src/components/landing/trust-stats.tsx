'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface AnimatedCounterProps {
  end: string;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const parseValue = (val: string) =>
      parseFloat(val.replace(/,/g, '').replace(/\+/g, '').replace(/M/g, '').replace(/K/g, ''));
    const target = parseValue(end.toString());

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const percentage = progress / duration;
        const ease = 1 - Math.pow(1 - percentage, 4); // Ease out quart
        setCount(Math.floor(target * ease));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <span ref={countRef}>
      {hasStarted ? (
        <>
          {end.toString().includes('+') ? '+' : ''}
          {count.toLocaleString()}
          {end.toString().includes('M') ? 'M' : end.toString().includes('K') ? 'K' : ''}
          {suffix}
        </>
      ) : (
        '0'
      )}
    </span>
  );
};

const TrustStats = () => {
  const t = useTranslations('landing.trustStats');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), sub: t('stat1Sub') },
    { value: t('stat2Value'), label: t('stat2Label'), sub: t('stat2Sub') },
    { value: t('stat3Value'), label: t('stat3Label'), sub: t('stat3Sub') },
    { value: t('stat4Value'), label: t('stat4Label'), sub: t('stat4Sub') },
  ];

  const partners = [
    {
      name: 'Ministry of Tourism',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ministry_of_Tourism_of_Saudi_Arabia_Logo.svg/512px-Ministry_of_Tourism_of_Saudi_Arabia_Logo.svg.png',
    },
    { name: 'Gathern', logo: 'https://i.postimg.cc/c4f0R57w/Gathern-Logo.png' },
    {
      name: 'Booking.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/512px-Booking.com_logo.svg.png',
    },
    { name: 'Airbnb', logo: 'https://i.postimg.cc/jqQ7Mv4f/Airbnb-Logo.png' },
    {
      name: 'Ministry of Tourism',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ministry_of_Tourism_of_Saudi_Arabia_Logo.svg/512px-Ministry_of_Tourism_of_Saudi_Arabia_Logo.svg.png',
    },
    { name: 'Gathern', logo: 'https://i.postimg.cc/c4f0R57w/Gathern-Logo.png' },
    {
      name: 'Booking.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/512px-Booking.com_logo.svg.png',
    },
    { name: 'Airbnb', logo: 'https://i.postimg.cc/jqQ7Mv4f/Airbnb-Logo.png' },
  ];

  return (
    <div className="overflow-hidden border-t border-border bg-background py-24">
      <div className="container mx-auto px-6">
        {/* Stats Grid */}
        <div className="mb-24 grid grid-cols-2 divide-x divide-x-reverse divide-border/60 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="reveal delay-100 p-4 text-center">
              <span className="mb-2 block font-sans text-5xl font-black tracking-tight text-foreground md:text-6xl">
                <AnimatedCounter end={stat.value} />
              </span>
              <span className="block text-lg font-bold text-foreground">{stat.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Infinite Marquee Partners */}
        <div className="reveal delay-300 text-center">
          <p className="mb-16 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <span className="animate-pulse bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-sm font-black text-transparent">
              {t('partnersTitle')}
            </span>
            <span className="mx-2">&bull;</span>
            {t('partnersSeparator')}
          </p>

          <div className="mask-linear-fade relative w-full overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-24 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
              {[...partners, ...partners].map((partner, idx) => {
                const isBig = partner.name === 'Gathern' || partner.name === 'Airbnb';
                return (
                  <div
                    key={idx}
                    className={`flex min-w-[180px] items-center justify-center ${isBig ? 'h-32' : 'h-16'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className={`h-full w-auto object-contain transition-transform duration-300 hover:scale-110 ${isBig ? 'max-w-[280px]' : 'max-w-[160px]'}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustStats;
