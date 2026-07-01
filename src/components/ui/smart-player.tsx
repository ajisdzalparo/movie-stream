"use client";

import React, { useState, useEffect } from "react";
import { Maximize, Minimize, Server, AlertTriangle, Play } from "lucide-react";

interface SmartPlayerProps {
  tmdbId: number;
  imdbId?: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
}

interface EmbedServer {
  name: string;
  getUrl: (tmdbId: number, imdbId?: string, season?: number, episode?: number) => string;
}

const SERVERS: EmbedServer[] = [
  {
    name: "Server 1 (VidPlus - Default)",
    getUrl: (tmdbId, imdbId, s, e) => {
      return s && e
        ? `https://player.vidplus.to/embed/tv/${tmdbId}/${s}/${e}?controls=1`
        : `https://player.vidplus.to/embed/movie/${tmdbId}?controls=1`;
    }
  },
  {
    name: "Server 2 (VidSrc.xyz)",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.xyz/embed/movie/${id}`;
    }
  },
  {
    name: "Server 3 (VidSrc.to)",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.to/embed/movie/${id}`;
    }
  },
  {
    name: "Server 4 (Embed.su)",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://embed.su/embed/tv/${id}/${s}/${e}`
        : `https://embed.su/embed/movie/${id}`;
    }
  },
  {
    name: "Server 5 (SuperEmbed)",
    getUrl: (tmdbId, imdbId, s, e) => {
      return s && e
        ? `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
        : `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1`;
    }
  }
];

interface HistoryItem {
  id: number;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  watchedAt: string;
}

export function SmartPlayer({ tmdbId, imdbId, type, season, episode, title }: SmartPlayerProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Save progress to LocalStorage when component mounts or parameters change
  useEffect(() => {
    if (!tmdbId) return;

    try {
      const historyKey = "netstream_continue_watching";
      const existingHistoryJson = localStorage.getItem(historyKey);
      let history = (existingHistoryJson ? JSON.parse(existingHistoryJson) : []) as HistoryItem[];

      // Remove current item if already exists to put it at the top
      history = history.filter((item) => !(item.id === tmdbId && item.type === type));

      // Add current item details
      const historyItem = {
        id: tmdbId,
        type,
        title,
        season,
        episode,
        watchedAt: new Date().toISOString(),
      };

      history.unshift(historyItem);
      // Keep only top 10 items
      localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.error("Failed to save history to local storage", e);
    }
  }, [tmdbId, type, season, episode, title]);

  const currentServer = SERVERS[selectedServerIndex];
  const playerUrl = currentServer.getUrl(tmdbId, imdbId, season, episode);

  return (
    <div className={`w-full transition-all duration-500 ${isTheaterMode ? "max-w-none" : "max-w-5xl mx-auto"}`}>
      {/* Player Frame */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-base shadow-2xl">
        {!isPlaying ? (
          /* Thumbnail / Play trigger for better loading and aesthetic overlay */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-linear-to-t from-[#0B0F19] to-black/80">
            <div className="rounded-full bg-primary p-5 shadow-[0_0_30px_rgba(229,9,20,0.5)] transition-transform duration-300 hover:scale-110 cursor-pointer" onClick={() => setIsPlaying(true)}>
              <Play className="h-8 w-8 fill-white text-white translate-x-0.5" />
            </div>
            <h3 className="mt-4 text-lg font-bold md:text-xl text-white">{title}</h3>
            {type === "tv" && season && episode && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Season {season} • Episode {episode}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 max-w-md mt-3">
              Press play to launch the sandbox video player. Ad-blockers are recommended to filter background server ads.
            </p>
          </div>
        ) : (
          <iframe
            src={playerUrl}
            className="h-full w-full border-none"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; web-share; fullscreen"
            // sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-pointer-lock"
          />
        )}
      </div>

      {/* Control Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#151D30] p-4 border border-border shadow-lg">
        {/* Server Selection */}
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Source:</span>
          <select
            value={selectedServerIndex}
            onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
            className="rounded bg-[#0B0F19] border border-border px-3 py-1.5 text-xs text-foreground font-semibold focus:border-primary focus:outline-none cursor-pointer"
          >
            {SERVERS.map((server, index) => (
              <option key={index} value={index}>
                {server.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Ad-Blocker Hint */}
          <div className="hidden lg:flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] font-medium text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Enable Ad-blocker for best experience</span>
          </div>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="flex items-center gap-1.5 rounded bg-[#0B0F19] hover:bg-black border border-border px-3.5 py-1.5 text-xs text-foreground font-medium transition-colors cursor-pointer"
          >
            {isTheaterMode ? (
              <>
                <Minimize className="h-4 w-4 text-primary" />
                <span>Normal Mode</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4 text-primary" />
                <span>Theater Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
