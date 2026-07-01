/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";

interface ContinueWatchingItem {
  id: number;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  watchedAt: string;
}

export function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("shientamovie_continue_watching");
      if (historyJson) {
        setItems(JSON.parse(historyJson));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="my-8 px-4 md:px-8">
      <h2 className="mb-4 text-lg font-bold md:text-xl tracking-tight text-white flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-primary animate-pulse"></span>
        Continue Watching
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((item) => {
          const watchUrl = item.type === "movie" 
            ? `/watch/movie/${item.id}` 
            : `/watch/tv/${item.id}?season=${item.season || 1}&episode=${item.episode || 1}`;

          return (
            <div
              key={`${item.type}-${item.id}`}
              className="group relative flex flex-col justify-between rounded-lg border border-border bg-[#151D30] p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)]"
            >
              <div>
                <span className="inline-block rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-primary mb-2">
                  {item.type === "movie" ? "Movie" : "TV Show"}
                </span>
                <h3 className="truncate text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {item.type === "tv" && item.season && item.episode && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Season {item.season} • Episode {item.episode}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  Last active: {new Date(item.watchedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={watchUrl}
                  className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-bold text-white transition-transform duration-300 hover:scale-105"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Resume</span>
                </Link>
                <Link
                  href={item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
