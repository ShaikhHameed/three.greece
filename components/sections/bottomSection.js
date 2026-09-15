'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BottomSection({ title}) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
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
                start:"start 90%",
                markers:true,
            },
            {
                y: 0,
                opacity: 1,
                ease: "none",
            }
        )

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="min-h-screen w-full flex flex-col text-center justify-end pb-25"
        >
            <h2
                ref={titleRef}
                className="text-8xl font-caesar mb-10 font-light"
            >
                {title}
            </h2>
        </section>
    );
}