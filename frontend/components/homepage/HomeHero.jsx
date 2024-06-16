"use client";

import HomeSearchBar from "./HomeSearchBar";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

const HomeHero = () => {
    const slider = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Duplicate content for seamless looping
        const totalWidth = slider.current.scrollWidth;
        const numRepeats = Math.ceil(window.innerWidth / totalWidth) + 1;
        for (let i = 0; i < numRepeats; i++) {
            slider.current.innerHTML += slider.current.innerHTML;
        }

        gsap.to(slider.current, {
            xPercent: -50, // Move slider to the left
            ease: "none",
            repeat: -1,
            duration: 20, // Adjust duration for speed
        });
    }, []);

    return (
        <div className="hero-image flex flex-col w-full h-80 items-center justify-center relative">
            <div className="absolute w-full h-full bg-black bg-opacity-40 z-0"></div>
            {/* Overlay */}

            <div className="sliderContainer w-full overflow-hidden">
                <div ref={slider} className="slider flex">
                    <p>TAYLOR SWIFT IS COMING TO SINGAPORE! BOOK YOUR TICKETS RIGHT NOW</p>
                    <div className="divider"></div>
                    <p>COLDPLAY, BACK AGAIN ON JANUARY 2023, ARE YOU GUYS READY?</p>
                    <div className="divider"></div>
                    <p>DON'T MISS OUT ON THE 1975 CONCERT, HAPPENING END OF THE YEAR</p>
                </div>
            </div>

            <div className="z-10 font-bold text-white text-3xl mb-3 text-center">
                Don't miss out!
                <br />
                Explore the <span className="text-yellow-300">vibrant events</span> happening locally and globally
            </div>
            <HomeSearchBar />
        </div>
    )
};

export default HomeHero;
