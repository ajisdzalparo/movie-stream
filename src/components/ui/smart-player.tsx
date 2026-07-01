"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Maximize, Minimize, Server, AlertTriangle, Play, Loader2, Zap } from "lucide-react";

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
  domain: string;
  getUrl: (tmdbId: number, imdbId?: string, season?: number, episode?: number) => string;
}

const SERVERS: EmbedServer[] = [
  {
    name: "VidLink (Cepat)",
    domain: "vidlink.pro",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://vidlink.pro/tv/${tmdbId}/${s}/${e}?autoplay=1`
        : `https://vidlink.pro/movie/${tmdbId}?autoplay=1`;
    }
  },
  {
    name: "VidSrc Pro",
    domain: "vidsrc.pro",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.pro/embed/movie/${id}`;
    }
  },
  {
    name: "VidSrc.me",
    domain: "vidsrc.me",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://vidsrc.me/embed/tv/${tmdbId}/${s}/${e}`
        : `https://vidsrc.me/embed/movie/${tmdbId}`;
    }
  },
  {
    name: "2Embed",
    domain: "2embed.cc",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${s}&e=${e}`
        : `https://www.2embed.cc/embed/${tmdbId}`;
    }
  },
  {
    name: "Embed.su",
    domain: "embed.su",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://embed.su/embed/tv/${id}/${s}/${e}`
        : `https://embed.su/embed/movie/${id}`;
    }
  },
  {
    name: "VidSrc.cc",
    domain: "vidsrc.cc",
    getUrl: (tmdbId, imdbId, s, e) => {
      const id = imdbId || tmdbId;
      return s && e
        ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.cc/v2/embed/movie/${id}`;
    }
  },
  {
    name: "AutoEmbed",
    domain: "autoembed.co",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://autoembed.co/tv/tmdb/${tmdbId}-${s}-${e}`
        : `https://autoembed.co/movie/tmdb/${tmdbId}`;
    }
  },
  {
    name: "SuperEmbed",
    domain: "multiembed.to",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
        : `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1`;
    }
  },
  {
    name: "MoviesAPI",
    domain: "moviesapi.club",
    getUrl: (tmdbId, _imdbId, s, e) => {
      return s && e
        ? `https://moviesapi.club/tv/${tmdbId}-${s}-${e}`
        : `https://moviesapi.club/movie/${tmdbId}`;
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

// Ping a server domain and return response time in ms
async function pingServer(domain: string): Promise<number> {
  const start = performance.now();
  try {
    await fetch(`https://${domain}`, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return performance.now() - start;
  } catch {
    return Infinity; // Server unreachable
  }
}

export function SmartPlayer({ tmdbId, imdbId, type, season, episode, title }: SmartPlayerProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [serverSpeeds, setServerSpeeds] = useState<Record<number, number>>({});
  const [preloadUrl, setPreloadUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-detect fastest server on mount
  useEffect(() => {
    let cancelled = false;

    async function findFastestServer() {
      setIsTesting(true);

      // Check if we have a cached fastest server (valid for 10 minutes)
      try {
        const cached = localStorage.getItem("netstream_fastest_server");
        if (cached) {
          const { index, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            setSelectedServerIndex(index);
            setIsTesting(false);
            return;
          }
        }
      } catch { /* ignore */ }

      // Ping all servers in parallel
      const results = await Promise.all(
        SERVERS.map(async (server, index) => {
          const latency = await pingServer(server.domain);
          return { index, latency };
        })
      );

      if (cancelled) return;

      // Store speeds for display
      const speeds: Record<number, number> = {};
      results.forEach(r => { speeds[r.index] = r.latency; });
      setServerSpeeds(speeds);

      // Select fastest server
      const fastest = results.reduce((best, current) =>
        current.latency < best.latency ? current : best
      );

      if (fastest.latency < Infinity) {
        setSelectedServerIndex(fastest.index);
        // Cache the result
        try {
          localStorage.setItem("netstream_fastest_server", JSON.stringify({
            index: fastest.index,
            timestamp: Date.now(),
          }));
        } catch { /* ignore */ }
      }

      setIsTesting(false);
    }

    findFastestServer();
    return () => { cancelled = true; };
  }, []);

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

  // Preload iframe URL on hover so it starts loading before user clicks play
  const handlePlayHover = useCallback(() => {
    if (!preloadUrl) {
      setPreloadUrl(playerUrl);
    }
  }, [playerUrl, preloadUrl]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(true);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Manual speed test button
  const handleSpeedTest = useCallback(async () => {
    setIsTesting(true);
    const results = await Promise.all(
      SERVERS.map(async (server, index) => {
        const latency = await pingServer(server.domain);
        return { index, latency };
      })
    );

    const speeds: Record<number, number> = {};
    results.forEach(r => { speeds[r.index] = r.latency; });
    setServerSpeeds(speeds);

    const fastest = results.reduce((best, current) =>
      current.latency < best.latency ? current : best
    );

    if (fastest.latency < Infinity) {
      setSelectedServerIndex(fastest.index);
      try {
        localStorage.setItem("netstream_fastest_server", JSON.stringify({
          index: fastest.index,
          timestamp: Date.now(),
        }));
      } catch { /* ignore */ }
    }

    setIsTesting(false);
  }, []);

  // Format latency for display
  const formatLatency = (ms: number) => {
    if (ms === Infinity) return "❌ Timeout";
    if (ms < 300) return `⚡ ${Math.round(ms)}ms`;
    if (ms < 800) return `✅ ${Math.round(ms)}ms`;
    return `🐢 ${Math.round(ms)}ms`;
  };

  return (
    <div className={`w-full transition-all duration-500 ${isTheaterMode ? "max-w-none" : "max-w-5xl mx-auto"}`}>
      {/* DNS Prefetch for all servers - browser starts resolving DNS early */}
      {SERVERS.map((server) => (
        <link key={server.domain} rel="dns-prefetch" href={`https://${server.domain}`} />
      ))}

      {/* Preconnect to selected server for faster iframe load */}
      <link rel="preconnect" href={`https://${currentServer.domain}`} crossOrigin="anonymous" />

      {/* Hidden preload iframe - loads in background when user hovers play */}
      {preloadUrl && !isPlaying && (
        <iframe
          src={preloadUrl}
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          loading="eager"
        />
      )}

      {/* Player Frame */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-base shadow-2xl">
        {!isPlaying ? (
          /* Thumbnail / Play trigger */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-linear-to-t from-[#0B0F19] to-black/80">
            <div
              className="rounded-full bg-primary p-5 shadow-[0_0_30px_rgba(229,9,20,0.5)] transition-transform duration-300 hover:scale-110 cursor-pointer"
              onClick={handlePlay}
              onMouseEnter={handlePlayHover}
            >
              <Play className="h-8 w-8 fill-white text-white translate-x-0.5" />
            </div>
            <h3 className="mt-4 text-lg font-bold md:text-xl text-white">{title}</h3>
            {type === "tv" && season && episode && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Season {season} • Episode {episode}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 max-w-md mt-3">
              {isTesting
                ? "🔍 Mencari server tercepat..."
                : "Hover tombol play untuk mulai preload. Ad-blocker disarankan untuk pengalaman terbaik."}
            </p>
          </div>
        ) : (
          <>
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0F19]/90">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="mt-3 text-sm text-muted-foreground font-medium">
                  Memuat video dari {currentServer.name}...
                </p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={playerUrl}
              className="h-full w-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; web-share; fullscreen"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={handleIframeLoad}
            />
          </>
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
            onChange={(e) => {
              setSelectedServerIndex(Number(e.target.value));
              // Reset playing state to reload with new server
              if (isPlaying) {
                setIsLoading(true);
              }
            }}
            className="rounded bg-[#0B0F19] border border-border px-3 py-1.5 text-xs text-foreground font-semibold focus:border-primary focus:outline-none cursor-pointer"
          >
            {SERVERS.map((server, index) => (
              <option key={index} value={index}>
                {server.name}{serverSpeeds[index] !== undefined ? ` ${formatLatency(serverSpeeds[index])}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Speed Test Button */}
          <button
            onClick={handleSpeedTest}
            disabled={isTesting}
            className="flex items-center gap-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          >
            {isTesting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isTesting ? "Testing..." : "Auto Cepat"}</span>
          </button>

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
