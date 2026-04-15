'use client';

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // تحديث شريط التقدم
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // بدء الخروج التدريجي
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

    // اكتمال التحميل
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-500 ${fadeOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
        }`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      {/* Animated Glow Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse [animation-delay:0.5s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[150px] animate-pulse [animation-delay:1s]"></div>
      </div>

      {/* الجزيئات المتحركة */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center">

        {/* الشعار مع تأثير التوهج */}
        <div className="relative mb-8 animate-in zoom-in duration-700">
          {/* التوهج خلف الشعار */}
          <div className="absolute inset-0 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>

          {/* حاوية الشعار */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            {/* حلقات متحركة حول الشعار */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-white/10 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse"></div>

            {/* الشعار */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 animate-float-slow">
              <img
                src="/mnam-logo.png"
                alt="منام"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* اسم الشركة */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight animate-in slide-in-from-bottom duration-700 delay-200">

        </h1>

        {/* الشعار النصي */}
        <p className="text-white/70 text-base md:text-lg font-light mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
          الريادة في إدارة السكن الفندقية
        </p>

        {/* شريط التقدم */}
        <div className="w-48 md:w-64 animate-in fade-in duration-700 delay-500">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-white via-violet-200 to-white rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* تأثير اللمعان على شريط التقدم */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* نسبة التحميل */}
          <div className="flex justify-between mt-3 text-white/50 text-xs font-medium">
            <span>جاري التحميل...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* النقاط المتحركة */}
        <div className="flex gap-2 mt-8 animate-in fade-in duration-700 delay-700">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>

      {/* حقوق النشر في الأسفل */}
      <div className="absolute bottom-8 text-white/30 text-xs font-medium animate-in fade-in duration-700 delay-1000">
        &copy; {new Date().getFullYear()} شركة منام لإدارة الوحدات السكنية
      </div>
    </div>
  );
};

export default SplashScreen;
