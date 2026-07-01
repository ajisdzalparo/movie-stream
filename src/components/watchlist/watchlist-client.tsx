/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Eye, Trash2, Play, Info } from "lucide-react";
import Image from "next/image";

interface WatchlistItem {
  id: number;
  title: string;
  type: "movie" | "tv";
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: string;
}

export function WatchlistClient() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchedIds, setWatchedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");

  useEffect(() => {
    try {
      const watchlistJson = localStorage.getItem("shientamovie_watchlist");
      if (watchlistJson) {
        setWatchlist(JSON.parse(watchlistJson));
      }

      const watchedJson = localStorage.getItem("shientamovie_watched");
      if (watchedJson) {
        setWatchedIds(JSON.parse(watchedJson));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const removeFromWatchlist = (id: number, type: "movie" | "tv") => {
    try {
      const updated = watchlist.filter((item) => !(item.id === id && item.type === type));
      setWatchlist(updated);
      localStorage.setItem("shientamovie_watchlist", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllWatchlist = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      setWatchlist([]);
      localStorage.removeItem("shientamovie_watchlist");
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your watching history?")) {
      setWatchedIds([]);
      localStorage.removeItem("shientamovie_watched");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl text-white">Your Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your personal watchlist and viewing history.
          </p>
        </div>

        {/* Clear buttons */}
        {activeTab === "watchlist" && watchlist.length > 0 && (
          <button
            onClick={clearAllWatchlist}
            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded border border-red-500/20 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
        {activeTab === "history" && watchedIds.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded border border-red-500/20 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === "watchlist"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-white"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Watchlist ({watchlist.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-white"
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Watched Titles ({watchedIds.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "watchlist" ? (
        watchlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => {
              const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                : null;
              const year = item.release_date || item.first_air_date
                ? new Date(item.release_date || item.first_air_date!).getFullYear()
                : "N/A";
              const watchUrl = item.type === "movie"
                ? `/watch/movie/${item.id}`
                : `/watch/tv/${item.id}?season=1&episode=1`;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="group relative flex flex-col justify-between rounded-lg border border-border bg-[#151D30] overflow-hidden"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover object-top opacity-70 group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs font-semibold text-muted-foreground">
                        {item.title}
                      </div>
                    )}
                    <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[9px] uppercase font-bold text-white tracking-wider">
                      {item.type === "movie" ? "Movie" : "TV"}
                    </span>
                    <button
                      onClick={() => removeFromWatchlist(item.id, item.type)}
                      className="absolute top-2 right-2 rounded bg-red-600/95 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Link
                        href={watchUrl}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded bg-primary hover:bg-red-700 py-2 text-xs font-bold text-white transition-all shadow-[0_0_10px_rgba(229,9,20,0.15)] cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>Watch</span>
                      </Link>
                      <Link
                        href={item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
                        className="rounded border border-white/10 hover:border-white/20 bg-[#0B0F19] hover:bg-black p-2 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-semibold text-muted-foreground">Your watchlist is empty</h3>
            <p className="text-xs text-muted-foreground/55 mt-1 max-w-xs">
              Explore trending titles on the homepage and click &quot;Add to Watchlist&quot; to save them here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-all cursor-pointer"
            >
              Browse Movies
            </Link>
          </div>
        )
      ) : (
        /* Watched History tab (display lists of watched content) */
        watchedIds.length > 0 ? (
          <div className="bg-[#151D30] rounded-xl border border-border p-6 max-w-3xl mx-auto shadow-lg">
            <p className="text-xs text-muted-foreground mb-4">
              Here are the IDs of titles you have marked as watched.
            </p>
            <div className="flex flex-wrap gap-2">
              {watchedIds.map((watchedId) => (
                <div
                  key={watchedId}
                  className="flex items-center gap-2 rounded-full bg-[#0B0F19] border border-border px-4 py-2 text-xs font-bold text-white shadow-inner"
                >
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  <span>ID: {watchedId}</span>
                  <Link
                    href={`/search?q=${watchedId}`}
                    className="text-[10px] text-primary hover:underline font-semibold border-l border-white/10 pl-2 ml-1"
                  >
                    Locate
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Eye className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-semibold text-muted-foreground">No watched history found</h3>
            <p className="text-xs text-muted-foreground/55 mt-1 max-w-xs">
              Mark titles as watched on their details pages to keep track of what you&apos;ve finished.
            </p>
          </div>
        )
      )}
    </div>
  );
}
