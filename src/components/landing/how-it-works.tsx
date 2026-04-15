'use client';

interface HowItWorksProps {
  onOpenTerms: () => void;
}

const HowItWorks = ({ onOpenTerms }: HowItWorksProps) => {
  const steps = [
    {
      title: 'تواصل معنا',
      desc: 'بياناتك بسيطة، أرسلها لنا وخلال 24 ساعة نكون عندك للمعاينة والتقييم.',
      icon: '1',
    },
    {
      title: 'نجهز عقارك',
      desc: 'فريق التصميم والصيانة يقلب الوحدة 180 درجة لتناسب المعايير الفندقية العالمية.',
      icon: '2',
    },
    {
      title: 'استلم أرباحك',
      desc: 'نبدأ التأجير فوراً، وأنت تتابع الأرباح تنزل في حسابك نهاية كل شهر وأنت مرتاح.',
      icon: '3',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white py-32" id="how">
      <div className="container relative z-10 mx-auto px-6">
        <div className="reveal mx-auto mb-24 max-w-2xl text-center">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary">العملية باختصار</span>
          <h2 className="mb-6 text-4xl font-black text-slate-900 md:text-5xl">سهلناها عليك</h2>
          <p className="text-lg leading-relaxed text-slate-500">
            نظامنا مصمم عشان يشيل عنك الهم، مو يزيده. ثلاث خطوات تفصلك عن الراحة.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-10 right-10 top-12 -z-10 hidden h-[2px] border-t-2 border-dashed border-slate-200 md:block"></div>

          <div className="grid gap-16 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="reveal group relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div
                  className={`relative z-10 mb-10 flex h-24 w-24 rotate-45 items-center justify-center rounded-[2rem] border-[3px] bg-white transition-all duration-500 group-hover:-translate-y-2 ${
                    i === 1 ? 'border-primary shadow-xl shadow-primary/20' : 'border-slate-100 group-hover:border-primary/50'
                  }`}
                >
                  <div className="-rotate-45 text-2xl font-black text-slate-900 transition-colors group-hover:text-primary">
                    {s.icon}
                  </div>
                  {i === 1 && (
                    <div className="absolute inset-0 animate-ping rounded-[2rem] border-[3px] border-primary opacity-20"></div>
                  )}
                </div>

                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="text-balance px-2 font-light leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal delay-300 mt-20 text-center">
          <button
            onClick={onOpenTerms}
            className="text-sm font-bold text-slate-400 underline decoration-2 underline-offset-8 outline-none transition-colors hover:text-primary hover:decoration-primary"
          >
            قراءة شروط الانضمام بالتفصيل
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
