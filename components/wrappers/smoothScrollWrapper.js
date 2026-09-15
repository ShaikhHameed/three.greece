'use client'
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export default function SmoothScrollLayout({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const smootherRef = useRef(null);

  useGSAP(() => {
    // Initialize ScrollSmoother
    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 2.5, // Seconds it takes to "catch up" to native scroll position
      effects: true, // Enables data-speed and data-lag parallax attributes
    });
  }, { scope: wrapperRef }); // Scope animations inside wrapper

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
