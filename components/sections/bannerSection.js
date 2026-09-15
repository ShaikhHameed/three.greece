'use client';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeBanner({ title, content }) {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(titleRef.current,{
            opacity:0,
            y:100,
            delay:4,
            duration:2,
            ease: "power3.out",
        })
        .from(contentRef.current, {
            opacity: 0,
            y: 50,
            duration: 1.5,
            ease: "power3.out",
        });

    },{ scope: containerRef });

    return (
        <>
            <section ref={containerRef} className="min-h-screen w-full flex flex-col text-center justify-end pb-25">
                <h1 ref={titleRef} className="text-9xl font-italianno mb-10 font-light">{title}</h1>
                <p ref={contentRef} className="text-4xl font-light">{content}</p>
            </section>
        </>
    )
}