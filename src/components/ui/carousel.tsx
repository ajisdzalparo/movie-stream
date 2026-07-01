"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./movie-card";
import { TMDBContent } from "@/lib/tmdb";

interface CarouselProps {
  title: string;
  items: TMDBContent[];
}

export function Carousel({ title, items }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/carousel my-8 px-4 md:px-8">
      {/* Title */}
      <h2 className="mb-4 text-lg font-bold md:text-xl tracking-tight text-white flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-primary"></span>
        {title}
      </h2>

      {/* Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-6 md:left-10 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity hover:bg-black/90 group-hover/carousel:opacity-100 md:block focus:outline-none focus:ring-2 focus:ring-primary shadow-lg border border-white/10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-6 md:right-10 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity hover:bg-black/90 group-hover/carousel:opacity-100 md:block focus:outline-none focus:ring-2 focus:ring-primary shadow-lg border border-white/10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slider Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto overflow-y-hidden gap-4 pb-4 pt-1 scroll-smooth no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-[140px] sm:w-[180px] md:w-[220px] shrink-0">
            <MovieCard item={item} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
