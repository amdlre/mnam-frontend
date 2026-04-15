'use client';

import { useEffect, useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  const content = {
    terms: {
      title: 'شروط الانضمام لبرنامج شركاء منام',
      body: (
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 md:text-base">
          <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <h4 className="mb-2 font-bold text-amber-800">ملاحظة هامة</h4>
            <p className="text-sm text-amber-700">
              نحرص في منام على جودة الوحدات لضمان أعلى عائد للمالك وأفضل تجربة للضيف.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">1. ملكية العقار وموقعه</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>يجب تقديم صك ملكية إلكتروني ساري المفعول أو وكالة شرعية رسمية لإدارة العقار.</li>
              <li>أن يقع العقار في المدن التي تغطيها خدماتنا حالياً (الرياض، جدة، الخبر).</li>
              <li>أن يكون العقار في حي مكتمل الخدمات (طرق معبدة، إنارة، مياه، صرف صحي).</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">2. جاهزية الوحدة</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>أن تكون الوحدة بحالة إنشائية ممتازة وخالية من العيوب الظاهرة (تسريبات، شقوق، رطوبة).</li>
              <li>تركيب مكيفات سبليت أو مركزية بحالة ممتازة في جميع الغرف.</li>
              <li>توفر مطبخ مركب بالكامل.</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">3. التأثيث والتجهيز (في حال الإدارة الشاملة)</h4>
            <p className="mb-2">
              للملاك الراغبين في باقة &ldquo;التشغيل الكامل&rdquo;، يجب الالتزام بمعايير &ldquo;منام&rdquo; للتأثيث، والتي تشمل:
            </p>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>استخدام مفروشات فندقية (مراتب سرير طبية، بياضات قطنية بيضاء).</li>
              <li>توفير شاشة ذكية (Smart TV) واتصال إنترنت فايبر عالي السرعة.</li>
              <li>توفير دخول ذكي (قفل ذكي) للباب الرئيسي.</li>
            </ul>
            <p className="mt-2 text-xs text-slate-400">* يمكن لفريق منام الإشراف على التأثيث مقابل رسوم إضافية.</p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">4. الرسوم والعوائد</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>نسبة الإدارة التشغيلية تتراوح بين 20% إلى 25% من إجمالي الدخل الشهري.</li>
              <li>يتم تحويل الأرباح للمالك في موعد أقصاه يوم 10 من كل شهر ميلادي.</li>
              <li>فترة التعاقد الأدنى هي سنة ميلادية واحدة قابلة للتجديد.</li>
            </ul>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'سياسة الخصوصية وحماية البيانات',
      body: (
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 md:text-base">
          <p>
            نحترم في شركة منام خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً للأنظمة المعمول بها في المملكة العربية السعودية.
          </p>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">جمع البيانات</h4>
            <p>
              نقوم بجمع البيانات اللازمة فقط لتقديم خدماتنا، مثل الاسم، رقم الجوال، وبيانات العقار للملاك، أو بيانات الهوية للضيوف
              لغرض التسجيل في منصة &ldquo;شموس&rdquo; الأمنية.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">استخدام المعلومات</h4>
            <p>
              تستخدم المعلومات لـ: إدارة الحجوزات، تحسين تجربة المستخدم، التواصل بخصوص العروض أو التحديثات، والامتثال للمتطلبات
              القانونية.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">مشاركة البيانات</h4>
            <p>
              لا نقوم ببيع بياناتك لأطراف ثالثة. نشارك البيانات فقط مع الجهات الحكومية عند الطلب الرسمي (مثل وزارة السياحة أو وزارة
              الداخلية).
            </p>
          </div>
        </div>
      ),
    },
  };

  const selectedContent = type ? content[type] : { title: '', body: null };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ${
          animate ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6 md:p-8">
          <h3 className="text-xl font-black text-slate-900 md:text-2xl">{selectedContent.title}</h3>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8">{selectedContent.body}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-white"
          >
            إغلاق
          </button>
          {type === 'terms' && (
            <button
              onClick={() => {
                onClose();
                document.getElementById('owners')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-primary"
            >
              موافق، ابدأ التسجيل
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
