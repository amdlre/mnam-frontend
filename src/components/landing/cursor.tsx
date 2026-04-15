'use client';

import { useEffect, useRef } from 'react';

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;

    if (!dot || !outline) return;

    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const moveCursor = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Immediate move for dot
      dot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    };

    const animateOutline = () => {
      // Smooth follow for outline
      const speed = 0.15;
      outlineX += (cursorX - outlineX) * speed;
      outlineY += (cursorY - outlineY) * speed;

      outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

      requestAnimationFrame(animateOutline);
    };

    const handleHoverEvents = () => {
      const hoverables = document.querySelectorAll('a, button, input, select, textarea, .hover-target');

      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
      });
    };

    window.addEventListener('mousemove', moveCursor);
    handleHoverEvents();
    const animationId = requestAnimationFrame(animateOutline);

    // Re-bind hover events periodically for dynamically added elements
    const observer = new MutationObserver(handleHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={outlineRef} className="cursor-outline hidden md:block" />
      <div ref={dotRef} className="cursor-dot hidden md:block" />
    </>
  );
};

export default Cursor;
