'use client';

import { useRef, useState } from 'react';

const Hero = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    if (window.innerWidth < 1024) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    setRotate({ x: y, y: -x });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex min-h-[95vh] items-center overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40 lg:pb-40 lg:pt-48">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-hero-pattern opacity-40 mix-blend-multiply"></div>
      <div className="absolute right-0 top-0 -z-10 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/4 animate-float-slow rounded-full bg-indigo-600/10 blur-[80px] md:h-[800px] md:w-[800px] md:blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] -translate-x-1/4 translate-y-1/3 animate-float-reverse rounded-full bg-fuchsia-500/10 blur-[60px] md:h-[600px] md:w-[600px] md:blur-[100px]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-white/80 via-transparent to-transparent opacity-60"></div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-24">
          {/* Text Content */}
          <div className="relative z-20 text-right lg:w-1/2">
            <div className="reveal group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2   backdrop-blur-md transition-all hover:shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary transition-colors group-hover:bg-primary"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-foreground transition-colors group-hover:text-primary">
                مفهوم جديد للاستثمار العقاري
              </span>
            </div>

            <h1 className="reveal delay-100 mb-8 text-balance text-5xl font-black leading-[1.15] tracking-tighter text-foreground drop-  sm:text-6xl md:text-7xl md:leading-[1.1] lg:text-8xl">
              استثمر بذكاء، <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text pb-2 text-transparent">
                واسكن بفخامة.
              </span>
            </h1>

            <p className="reveal delay-200 mb-10 max-w-xl text-balance text-lg font-normal leading-relaxed text-muted-foreground md:text-xl">
              نحول وحدتك السكنية إلى وجهة فندقية بمعايير عالمية. إدارة متكاملة تضمن راحة بالك وتعظيم عوائدك، وتجربة إقامة لا تُنسى لضيوفنا.
            </p>

            <div className="reveal delay-300 mb-16 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <button
                onClick={() => scrollToSection('owners')}
                className="group relative w-full overflow-hidden rounded-2xl bg-foreground px-10 py-5 text-base font-bold text-white shadow-2xl shadow-foreground/30 ring-4 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/90 hover:ring-foreground/10 active:scale-95 sm:w-auto"
              >
                <span className="absolute inset-0 h-full w-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                <span className="relative z-10 flex items-center gap-3">
                  <span>ابدأ رحلة الاستثمار</span>
                  <svg
                    className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => scrollToSection('guests')}
                className="w-full rounded-2xl border border-border bg-white/60 px-10 py-5 text-base font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white hover:text-primary hover:shadow-lg active:scale-95 sm:w-auto"
              >
                <span>حجز إقامة</span>
              </button>
            </div>

            <div className="reveal delay-500 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-8">
              <div className="hover-target group cursor-default">
                <p className="text-3xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                  +250
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground group-hover:text-foreground">وحدة سكنية</p>
              </div>
              <div className="hover-target group cursor-default">
                <p className="text-3xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                  98%
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground group-hover:text-foreground">رضا العملاء</p>
              </div>
              <div className="hover-target group cursor-default">
                <p className="text-3xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                  24/7
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground group-hover:text-foreground">دعم متواصل</p>
              </div>
            </div>
          </div>

          {/* Visual Content - 3D Tilt Effect */}
          <div
            className="reveal delay-300 relative z-10 mt-12 w-full lg:mt-0 lg:w-1/2"
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={imageRef}
              className="group relative z-10 h-[450px] w-full overflow-hidden rounded-[2.5rem] border-[8px] border-white/80 bg-muted shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out md:h-[650px]"
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1400"
                alt="Mnam Luxury Interior"
                className="h-full w-full scale-110 object-cover transition-transform duration-[2s] group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-80"></div>

              {/* Floating Review Card */}
              <div
                className="glass-card absolute bottom-8 left-6 right-6 rounded-3xl p-6 md:bottom-12 md:left-10 md:right-10"
                style={{ transform: 'translateZ(60px)' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex -space-x-3 space-x-reverse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-border  ">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                      </div>
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-foreground text-[10px] font-bold text-white  ">
                      +2k
                    </div>
                  </div>
                  <div className="flex text-lg text-amber-400 drop- ">★★★★★</div>
                </div>
                <p className="text-sm font-bold leading-relaxed text-foreground">
                  &ldquo;تجربة استثنائية بكل المقاييس. الاهتمام بالتفاصيل مذهل!&rdquo;
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-16 -top-16 hidden h-72 w-72 animate-pulse-slow opacity-30 md:block"></div>

            {/* Stats Card */}
            <div className="absolute -right-8 top-[40%] z-20 hidden cursor-pointer rounded-3xl border border-white/50 bg-white/95 p-6 shadow-xl backdrop-blur-xl transition-transform duration-300 hover:scale-105 md:-right-14 md:block">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/20 text-3xl text-secondary shadow-inner">
                  📈
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">متوسط العائد السنوي</p>
                  <p className="text-2xl font-black text-foreground">18% - 22%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
