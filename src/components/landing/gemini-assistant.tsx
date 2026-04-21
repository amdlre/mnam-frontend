'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const KNOWLEDGE_BASE = `
  معلومات شركة "منام" (Manam):
  1. **من نحن**: شركة سعودية متخصصة في إدارة وتشغيل الوحدات السكنية وتحويلها إلى نزل فندقية فاخرة. نحن لسنا مكتب عقار تقليدي، نحن شركة تشغيل فندقي.

  2. **خدماتنا للملاك (شركاء النجاح)**:
     - ندير العقار بالكامل (نظافة، صيانة، تسويق، استقبال، تحصيل مبالغ).
     - النسبة: نتقاضى نسبة إدارة تتراوح بين 20% إلى 25% من إجمالي الدخل.
     - العقود: سنوية وتجدد تلقائياً.
     - التقارير: توجد لوحة تحكم للمالك لمتابعة الأرباح والإشغال لحظة بلحظة.
     - متطلبات الانضمام: صك ملكية، موقع في (الرياض، جدة، الخبر)، وحدة بحالة ممتازة، تكييف ومطبخ راكب.
     - التأثيث: نطلب تأثيث فندقي (يمكننا الإشراف عليه بمقابل).

  3. **خدماتنا للضيوف (النزلاء)**:
     - نوفر شقق مخدومة بنظام الفندقة (دخول ذكي، نظافة، انترنت فايبر).
     - الحجز: يتم حصراً عبر منصات الحجز المعتمدة مثل (Gathern, Booking, Airbnb) وليس عبر الدردشة مباشرة.

  4. **سياسة الردود**:
     - إذا طلب شخص "استئجار شقة" أو "هل لديكم شقق للإيجار": وجهه لزر "تصفح الوحدات" أو أخبره أننا نعرض وحداتنا على تطبيقات الحجز مثل جاذرن وبوكينج، ونحن هنا لإدارة العقارات للملاك.
     - إذا طلب شخص "شراء عقار": اعتذر بلطف، نحن ندير العقارات ولا نبيعها.
     - إذا سأل عن "الإيجار السنوي التقليدي": وضح أننا نركز على التأجير اليومي/الشهري الفندقي لتعظيم العائد، وليس الإيجار السنوي الثابت القديم.
     - معلومات التواصل: واتساب 966538721499.
  `;

const GeminiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'يا هلا! حياك في منام 👋\nأنا هنا عشان أجاوبك على أي شي يخص إدارة عقارك أو حجز إقامتك معنا.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = ['كيف أضيف عقاري عندكم؟', 'كم نسبتكم من الأرباح؟', 'أبي أحجز شقة في الرياض', 'هل تأثثون الشقة؟'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: textToSend,
        config: {
          systemInstruction: `
            أنت المساعد الذكي الرسمي لشركة "منام".

            تعليمات الشخصية:
            - اسمك "مساعد منام".
            - تتحدث باللهجة السعودية البيضاء المحترفة والودودة.
            - إجاباتك مختصرة جداً ومباشرة (لا تكتب مقالات طويلة).
            - هدفك الأساسي: إقناع الملاك بتسجيل عقاراتهم، وتوجيه الضيوف لمنصات الحجز.

            السياق وقاعدة المعرفة (استخدم هذه المعلومات فقط للإجابة):
            ${KNOWLEDGE_BASE}

            قواعد صارمة:
            1. إذا كان السؤال خارج نطاق عمل "منام" (مثلاً: أسئلة عن الرياضة، الطقس، الدين، السياسة، أو برمجة)، اعتذر بأدب وقل: "معليش، أنا متخصص بس في خدمات منام وإدارة العقارات."
            2. لا تخترع معلومات غير موجودة في قاعدة المعرفة.
            3. إذا سأل العميل عن حجز شقة، لا تطلب منه تفاصيل الحجز، بل قل له أن الحجز يتم عبر روابط المنصات في الموقع.
            `,
        },
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: response.text || 'معليش، ما فهمت عليك زين. ممكن تعيد الصياغة؟' },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'الخدمة عليها ضغط حالياً، بس فريقنا موجود عالواتساب!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed z-[100] font-sans transition-all duration-300 ${isOpen
          ? 'inset-0 bg-black/60 backdrop-blur-sm md:inset-auto md:bottom-6 md:left-6 md:bg-transparent md:backdrop-blur-none'
          : 'bottom-6 left-6'
        }`}
      dir="rtl"
    >
      {/* Mobile Backdrop */}
      {isOpen && <div className="absolute inset-0 md:hidden" onClick={() => setIsOpen(false)}></div>}

      {isOpen ? (
        <div className="absolute bottom-0 flex h-[90vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-border/50 bg-white text-right shadow-2xl md:relative md:h-[550px] md:w-[400px] md:rounded-[1.5rem]">
          {/* Header */}
          <div className="relative flex flex-shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-primary via-violet-600 to-indigo-600 p-4 text-white shadow-lg md:p-5">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-2xl"></div>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="group relative">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-transparent p-1.5 transition-transform group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/mnam-logo.png" alt="Bot" className="h-full w-full object-contain" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-[3px] border-primary bg-green-500 shadow-lg">
                  <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-50"></span>
                </div>
              </div>
              <div>
                <span className="block text-base font-bold">مساعد منام</span>
                <span className="flex items-center gap-1 text-[11px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  متصل الآن &bull; ذكاء اصطناعي
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="group relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-all duration-200 hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform group-hover:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-muted to-card p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                {m.role === 'assistant' && (
                  <div className="ml-2 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-transparent p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/mnam-logo.png" alt="Bot" className="h-full w-full object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-relaxed ${m.role === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/20'
                      : 'rounded-tl-sm border border-border bg-white text-foreground shadow-md'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-white px-5 py-4 shadow-md">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.3s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions & Input */}
          <div className="flex-shrink-0 border-t border-border bg-white">
            {messages.length < 3 && (
              <div className="flex gap-2 overflow-x-auto px-3 py-3">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="flex-shrink-0 whitespace-nowrap rounded-xl border border-border bg-gradient-to-r from-muted to-muted px-4 py-2 text-xs font-medium   transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 p-3 pt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 rounded-xl border border-border bg-muted px-4 py-3.5 text-right text-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`rounded-xl p-3 transition-all duration-200 ${!input.trim() || isLoading
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:scale-95'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-90 transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Open Button */
        <div className="relative">
          <span className="absolute -right-1 -top-1 z-50 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-5 w-5 rounded-full border-2 border-white bg-green-500 shadow-md"></span>
          </span>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative z-40 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-indigo-600 text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
            <svg
              className="relative z-10 h-7 w-7 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>

            <span className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              اسألني أي شي! 💬
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
