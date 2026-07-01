"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Eye, EyeOff, Play } from "lucide-react";
import Link from "next/link";

interface WatchlistActionsProps {
  id: number;
  title: string;
  type: "movie" | "tv";
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface LocalWatchlistItem {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt?: string;
}

export function WatchlistActions({
  id,
  title,
  type,
  poster_path,
  vote_average,
  release_date,
  first_air_date,
}: WatchlistActionsProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    try {
      // Check Watchlist
      const watchlistJson = localStorage.getItem("shientamovie_watchlist");
      if (watchlistJson) {
        const watchlist = JSON.parse(watchlistJson) as LocalWatchlistItem[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInWatchlist(watchlist.some((item) => item.id === id && item.type === type));
      }

      // Check Watched
      const watchedJson = localStorage.getItem("shientamovie_watched");
      if (watchedJson) {
        const watched = JSON.parse(watchedJson) as number[];
        setIsWatched(watched.includes(id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [id, type]);

  const toggleWatchlist = () => {
    try {
      const watchlistJson = localStorage.getItem("shientamovie_watchlist");
      let watchlist = (watchlistJson ? JSON.parse(watchlistJson) : []) as LocalWatchlistItem[];

      if (isInWatchlist) {
        watchlist = watchlist.filter((item) => !(item.id === id && item.type === type));
        setIsInWatchlist(false);
      } else {
        watchlist.push({
          id,
          title,
          type,
          poster_path,
          vote_average,
          release_date,
          first_air_date,
          addedAt: new Date().toISOString(),
        });
        setIsInWatchlist(true);
      }
      localStorage.setItem("shientamovie_watchlist", JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWatched = () => {
    try {
      const watchedJson = localStorage.getItem("shientamovie_watched");
      let watched = watchedJson ? JSON.parse(watchedJson) : [];

      if (isWatched) {
        watched = watched.filter((watchedId: number) => watchedId !== id);
        setIsWatched(false);
      } else {
        watched.push(id);
        setIsWatched(true);
      }
      localStorage.setItem("shientamovie_watched", JSON.stringify(watched));
    } catch (e) {
      console.error(e);
    }
  };

  const watchUrl = type === "movie" 
    ? `/watch/movie/${id}` 
    : `/watch/tv/${id}?season=1&episode=1`;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      {/* Play Button */}
      <Link
        href={watchUrl}
        className="flex items-center gap-2 rounded bg-primary hover:bg-red-700 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.3)] cursor-pointer"
      >
        <Play className="h-4 w-4 fill-white" />
        <span>Watch Now</span>
      </Link>

      {/* Watchlist Toggle */}
      <button
        onClick={toggleWatchlist}
        className={`flex items-center gap-2 rounded border px-5 py-3 text-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${
          isInWatchlist
            ? "border-primary bg-primary/10 text-primary"
            : "border-white/15 bg-white/5 hover:bg-white/10 text-white"
        }`}
      >
        {isInWatchlist ? (
          <>
            <Check className="h-4 w-4" />
            <span>In Watchlist</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Add to Watchlist</span>
          </>
        )}
      </button>

      {/* Mark as Watched Toggle */}
      <button
        onClick={toggleWatched}
        className={`flex items-center gap-2 rounded border px-5 py-3 text-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${
          isWatched
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
            : "border-white/15 bg-white/5 hover:bg-white/10 text-white"
        }`}
      >
        {isWatched ? (
          <>
            <EyeOff className="h-4 w-4" />
            <span>Watched</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            <span>Mark as Watched</span>
          </>
        )}
      </button>
    </div>
  );
}
