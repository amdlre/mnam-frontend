'use client';

import { useRef, useState } from 'react';

interface Feature {
  title: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`reveal group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-2xl hover:shadow-border/50 md:p-10 ${index === 0 || index === 3 || index === 4 ? 'md:col-span-2' : ''
        }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-start">
        <div
          className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} border border-transparent text-3xl   transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:border-black/5`}
        >
          {feature.icon}
        </div>
        <h3 className="mb-4 text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
          {feature.title}
        </h3>
        <p className="mt-auto text-balance text-base font-normal leading-relaxed text-muted-foreground md:text-lg">
          {feature.desc}
        </p>
      </div>

      {/* Decorative Blob */}
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-tr from-slate-50 to-transparent opacity-0 blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:opacity-100"></div>
    </div>
  );
};

const WhyUs = () => {
  const features: Feature[] = [
    {
      title: 'إدارة شاملة 360°',
      desc: 'من الاستلام للتسليم، ندير كل تفصيل: النظافة، الصيانة، والاستقبال. ريح بالك واترك لنا القيادة الكاملة.',
      icon: '⚡',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'تسويق رقمي ذكي',
      desc: 'ظهور في Booking, Airbnb, Gathern بأفضل الصور والوصف لضمان أعلى نسبة إشغال.',
      icon: '🎯',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'عائد استثماري أعلى',
      desc: 'خوارزميات تسعير ديناميكية لتعظيم الأرباح.',
      icon: '📈',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'تقارير فورية وشفافة',
      desc: 'لوحة تحكم للملاك تعطيك كل ريال وين راح ووين جاء. تتبع أداء عقارك لحظة بلحظة وبكل شفافية.',
      icon: '📱',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'تشغيل سعودي 100%',
      desc: 'فريقنا سعودي بالكامل، نفهم ثقافتنا وعاداتنا، ونعرف كيف نرحب بالضيف ونكرمه بضيافة أصيلة تعكس هويتنا وتزيد من رضا النزلاء.',
      icon: '🇸🇦',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'ضيافة فاخرة',
      desc: 'مواد نظافة ومستلزمات 5 نجوم لراحة ضيوفك.',
      icon: '✨',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <section className="relative bg-background py-32" id="why">
      {/* Separator */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="reveal max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">لماذا تختار منام؟</span>
            <h2 className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-6xl">
              نحول العقار الجامد، <br />
              <span className="text-muted-foreground">إلى تجربة حية ومربحة.</span>
            </h2>
          </div>
          <p className="reveal delay-100 max-w-sm text-lg font-light leading-relaxed text-muted-foreground">
            نجمع بين التكنولوجيا والضيافة الأصيلة لنقدم حلاً يريح المالك ويسعد الضيف.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
