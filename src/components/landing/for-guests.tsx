'use client';

const ForGuests = () => {
  const features = [
    { title: 'نظافة 5 نجوم', desc: 'تعقيم شامل بعد كل ضيف ومواد نظافة عالية الجودة.' },
    { title: 'دخول ذكي', desc: 'وصول فوري للوحدة عبر كود خاص بدون انتظار.' },
    { title: 'مواقع مميزة', desc: 'وحداتنا مختارة بعناية في أرقى أحياء الرياض وجدة.' },
  ];

  const unitImages = [
    {
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
      alt: 'صالة معيشة مودرن',
      span: 'row-span-2',
    },
    {
      url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600',
      alt: 'حمام فاخر',
      span: 'row-span-1',
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=600',
      alt: 'غرفة نوم ماستر',
      span: 'row-span-1',
    },
  ];

  const handleBrowseUnits = () => {
    window.open('https://booking.usemnam.com', '_blank');
  };

  return (
    <div className="bg-card py-16 md:py-24" id="guests">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-5/12">
            <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">للضيوف والزوار</span>
            <h2 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
              لا ترضى بأقل من <br />
              <span className="text-primary">الراحة المطلقة.</span>
            </h2>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
              سواء كانت زيارتك للعمل أو الترفيه، وحداتنا مصممة لتعطيك إحساس البيت مع رفاهية الفندق. انترنت سريع، قهوة مختصة،
              وراحة بال.
            </p>

            <div className="mb-10 space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
                    <svg className="h-3.5 w-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleBrowseUnits}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 font-bold text-white shadow-xl shadow-border transition-all hover:bg-foreground/90 sm:w-auto"
            >
              <span>تصفح الوحدات المتاحة</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Grid Layout Images */}
          <div className="h-[400px] w-full lg:h-[500px] lg:w-7/12">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-3 md:gap-4">
              {unitImages.map((img, idx) => (
                <div key={idx} className={`group relative overflow-hidden rounded-2xl md:rounded-3xl ${img.span}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40"></div>
                  <div className="absolute bottom-4 right-4 hidden translate-y-2 text-white opacity-0 transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                    <p className="text-lg font-bold">{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForGuests;
