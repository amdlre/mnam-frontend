'use client';

import { useTranslations } from 'next-intl';

interface HowItWorksProps {
  onOpenTerms: () => void;
}

const HowItWorks = ({ onOpenTerms }: HowItWorksProps) => {
  const t = useTranslations('landing.howItWorks');

  const steps = [
    {
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: '1',
    },
    {
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: '2',
    },
    {
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: '3',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-card py-32" id="how">
      <div className="container relative z-10 mx-auto px-6">
        <div className="reveal mx-auto mb-24 max-w-2xl text-center">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary">{t('badge')}</span>
          <h2 className="mb-6 text-4xl font-black text-foreground md:text-5xl">{t('title')}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-10 right-10 top-12 -z-10 hidden h-[2px] border-t-2 border-dashed border-border md:block"></div>

          <div className="grid gap-16 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="reveal group relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div
                  className={`relative z-10 mb-10 flex h-24 w-24 rotate-45 items-center justify-center rounded-[2rem] border-[3px] bg-card transition-all duration-500 group-hover:-translate-y-2 ${i === 1 ? 'border-primary shadow-xl shadow-primary/20' : 'border-border group-hover:border-primary/50'
                    }`}
                >
                  <div className="-rotate-45 text-2xl font-black text-foreground transition-colors group-hover:text-primary">
                    {s.icon}
                  </div>
                  {i === 1 && (
                    <div className="absolute inset-0 animate-ping rounded-[2rem] border-[3px] border-primary opacity-20"></div>
                  )}
                </div>

                <h3 className="mb-4 text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="text-balance px-2 font-light leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal delay-300 mt-20 text-center">
          <button
            onClick={onOpenTerms}
            className="text-sm font-bold text-muted-foreground underline decoration-2 underline-offset-8 outline-none transition-colors hover:text-primary hover:decoration-primary"
          >
            {t('readTerms')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
