'use client';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeSection({ title, content, alignment = null }) {
    const sectionRef = useRef(null)

    useGSAP(() => {
        if (sectionRef) {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                pinSpacing: true,
                scrub: false,
            });

        }
    });

    return (
        <>
            <section ref={sectionRef} className="min-h-screen w-full flex flex-col justify-center">
                <h2 className="text-9xl font-italianno mb-10 font-light">{title}</h2>
                <p className="text-4xl font-light">{content}</p>
            </section>
        </>
    )
}   