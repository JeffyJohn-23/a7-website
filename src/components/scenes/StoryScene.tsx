"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StorySceneProps {
  title: string;
  content: string;
  imageUrl?: string;
  layout?: "left" | "right";
}

export function StoryScene({
  title,
  content,
  imageUrl,
  layout = "left",
}: StorySceneProps) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        opacity: 0,
        x: layout === "left" ? -50 : 50,
      });

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
          opacity: 0,
          x: layout === "left" ? 50 : -50,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [layout]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full bg-background text-white flex items-center py-20 px-6"
    >
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
          layout === "right" ? "md:grid-cols-2" : ""
        }`}
      >
        <div
          ref={contentRef}
          className={layout === "right" ? "md:order-2" : "md:order-1"}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-gray-300 leading-relaxed">{content}</p>
        </div>

        {imageUrl && (
          <div
            ref={imageRef}
            className={`bg-accent rounded-lg aspect-square overflow-hidden ${
              layout === "right" ? "md:order-1" : "md:order-2"
            }`}
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
