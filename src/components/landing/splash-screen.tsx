'use client';

import { useEffect, useMemo, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen = ({ onComplete, duration = 3000 }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Generate deterministic particle positions to avoid hydration mismatch
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: ((i * 37 + 13) % 100),
        top: ((i * 53 + 7) % 100),
        delay: (i * 0.25) % 5,
        duration: 5 + (i % 5),
      })),
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

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
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-500 ${fadeOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      {/* Animated Glow Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-violet-500/30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-600/20 blur-[120px] [animation-delay:0.5s]"></div>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-500/15 blur-[150px] [animation-delay:1s]"></div>
      </div>

      {/* Floating Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="animate-landing-float absolute h-2 w-2 rounded-full bg-white/20"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 h-40 w-40 animate-pulse rounded-full bg-white/20 blur-3xl"></div>
          <div className="relative flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
            <div className="animate-landing-spin-slow absolute inset-0 rounded-full border-2 border-white/20"></div>
            <div className="animate-landing-spin-reverse absolute inset-2 rounded-full border-2 border-white/10"></div>
            <div className="absolute inset-4 animate-pulse rounded-full border border-white/5"></div>
            <div className="relative h-20 w-20 animate-float-slow md:h-24 md:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mnam-logo.png" alt="Mnam" className="h-full w-full object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>

        {/* Company Name */}
        <h1 className="mb-3 text-4xl font-black tracking-tight text-white md:text-6xl"></h1>

        {/* Tagline */}
        <p className="mb-12 text-base font-light text-white/70 md:text-lg">
          الريادة في إدارة السكن الفندقية
        </p>

        {/* Progress Bar */}
        <div className="w-48 md:w-64">
          <div className="h-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-white via-violet-200 to-white transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="animate-landing-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs font-medium text-white/50">
            <span>جاري التحميل...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Bouncing Dots */}
        <div className="mt-8 flex gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.1s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.2s]"></div>
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-8 text-xs font-medium text-white/30">
        &copy; {new Date().getFullYear()} شركة منام لإدارة الوحدات السكنية
      </div>
    </div>
  );
};

export default SplashScreen;
