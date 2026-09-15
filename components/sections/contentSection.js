'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeSection({ title, content, alignment = null }) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                pinSpacing: true,
                scrub: 1,
            }
        });

        tl.fromTo(
            titleRef.current,
            {
                y: 100,
                opacity: 0,
                start:"bottom-=30%",
                markers:true,
            },
            {
                y: 0,
                opacity: 1,
                ease: "none",
            }
        )
        
        .fromTo(
            contentRef.current,
            {
                y: 100,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                ease: "none",
            },
            0 // starts at the same time as title
        );

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="min-h-screen w-full flex flex-col justify-center px-4"
        >
            <h2
                ref={titleRef}
                className="text-4xl md:text-9xl font-caesar mb-5 font-light"
            >
                {title}
            </h2>

            <p
                ref={contentRef}
                className="text-xl md:text-4xl font-light"
            >
                {content}
            </p>
        </section>
    );
}