/* eslint-disable react-hooks/set-state-in-effect */
 
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Play, List } from "lucide-react";
import { TMDBSeason } from "@/lib/tmdb";

interface TvWatchControlsProps {
  tvId: number;
  showName: string;
  totalSeasons: number;
  currentSeason: number;
  currentEpisode: number;
  initialSeasonDetails: TMDBSeason;
}

export function TvWatchControls({
  tvId,
  showName,
  totalSeasons,
  currentSeason,
  currentEpisode,
  initialSeasonDetails,
}: TvWatchControlsProps) {
  const router = useRouter();
  const [seasonNum, setSeasonNum] = useState(currentSeason);
  const [seasonDetails, setSeasonDetails] = useState<TMDBSeason>(initialSeasonDetails);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSeason = useCallback(async (num: number) => {
    setSeasonNum(num);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tv/${tvId}/season/${num}`);
      if (res.ok) {
        const data = await res.json() as TMDBSeason;
        setSeasonDetails(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [tvId]);

  useEffect(() => {
    if (currentSeason !== seasonNum) {
      fetchSeason(currentSeason);
    } 
  }, [currentSeason, fetchSeason, seasonNum]);

  const episodes = seasonDetails?.episodes || [];
  const totalEpisodesInSeason = episodes.length;

  const hasPrev = currentEpisode > 1 || currentSeason > 1;
  const hasNext = currentEpisode < totalEpisodesInSeason || currentSeason < totalSeasons;

  const handlePrev = () => {
    if (currentEpisode > 1) {
      router.push(`/watch/tv/${tvId}?season=${currentSeason}&episode=${currentEpisode - 1}`);
    } else if (currentSeason > 1) {
      // Fetch previous season details first to get the last episode number
      setIsLoading(true);
      fetch(`/api/tv/${tvId}/season/${currentSeason - 1}`)
        .then((res) => res.json())
        .then((data) => {
          const lastEp = data.episodes?.length || 1;
          router.push(`/watch/tv/${tvId}?season=${currentSeason - 1}&episode=${lastEp}`);
        })
        .catch(() => {
          router.push(`/watch/tv/${tvId}?season=${currentSeason - 1}&episode=1`);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleNext = () => {
    if (currentEpisode < totalEpisodesInSeason) {
      router.push(`/watch/tv/${tvId}?season=${currentSeason}&episode=${currentEpisode + 1}`);
    } else if (currentSeason < totalSeasons) {
      router.push(`/watch/tv/${tvId}?season=${currentSeason + 1}&episode=1`);
    }
  };

  const handleSeasonDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = Number(e.target.value);
    fetchSeason(num);
  };

  return (
    <div className="mt-6 max-w-5xl mx-auto">
      {/* Navigation Buttons (Prev / Next Episode) */}
      <div className="flex justify-between items-center bg-[#151D30] rounded-xl border border-border p-4 mb-6 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={!hasPrev || isLoading}
          className="flex items-center gap-1.5 rounded bg-[#0B0F19] hover:bg-black border border-border px-4 py-2 text-xs text-foreground font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Prev Episode</span>
        </button>

        <span className="text-xs font-semibold text-muted-foreground text-center">
          S{currentSeason} : E{currentEpisode} • {showName}
        </span>

        <button
          onClick={handleNext}
          disabled={!hasNext || isLoading}
          className="flex items-center gap-1.5 rounded bg-primary hover:bg-red-700 px-4 py-2 text-xs text-white font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(229,9,20,0.2)]"
        >
          <span>Next Episode</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Episode Selector list */}
      <div className="bg-[#151D30] rounded-xl border border-border p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-border pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <List className="h-4 w-4 text-primary" />
            <span>Playlist / Episode List</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Season:</span>
            <select
              value={seasonNum}
              onChange={handleSeasonDropdownChange}
              className="rounded bg-[#0B0F19] border border-border px-3 py-1.5 text-xs text-foreground font-semibold focus:border-primary focus:outline-none cursor-pointer"
            >
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Season {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-1">
            {episodes.map((ep) => {
              const isCurrent = seasonNum === currentSeason && ep.episode_number === currentEpisode;
              return (
                <Link
                  key={ep.id}
                  href={`/watch/tv/${tvId}?season=${seasonNum}&episode=${ep.episode_number}`}
                  className={`flex flex-col justify-between p-3 rounded-lg border text-left transition-all ${
                    isCurrent
                      ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(229,9,20,0.1)]"
                      : "bg-[#0B0F19] border-border hover:border-white/20 hover:bg-black"
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                      Episode {ep.episode_number}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5" title={ep.name}>
                      {ep.name || `Episode ${ep.episode_number}`}
                    </h4>
                  </div>
                  {isCurrent && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-primary font-bold">
                      <Play className="h-2.5 w-2.5 fill-primary" />
                      <span>Playing</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
