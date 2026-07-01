"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { TMDBSeason } from "@/lib/tmdb";

interface TvSeasonsProps {
  tvId: number;
  totalSeasons: number;
  initialSeasonDetails: TMDBSeason;
}

export function TvSeasons({ tvId, totalSeasons, initialSeasonDetails }: TvSeasonsProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState<TMDBSeason>(initialSeasonDetails);
  const [isLoading, setIsLoading] = useState(false);

  const handleSeasonChange = async (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tv/${tvId}/season/${seasonNum}`);
      if (res.ok) {
        const data = await res.json();
        setSeasonDetails(data);
      }
    } catch (e) {
      console.error("Failed to load season details", e);
    } finally {
      setIsLoading(false);
    }
  };

  const seasonsArray = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  return (
    <div className="mt-8">
      {/* Selector Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary"></span>
          Episodes
        </h2>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Season:</span>
          <select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            className="rounded bg-[#151D30] border border-border px-3 py-1.5 text-xs text-foreground font-semibold focus:border-primary focus:outline-none cursor-pointer"
          >
            {seasonsArray.map((num) => (
              <option key={num} value={num}>
                Season {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        /* Episode Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seasonDetails?.episodes && seasonDetails.episodes.length > 0 ? (
            seasonDetails.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/tv/${tvId}?season=${selectedSeason}&episode=${ep.episode_number}`}
                className="group flex flex-col justify-between rounded-lg border border-border bg-[#151D30] p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)]"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-primary">
                      Episode {ep.episode_number}
                    </span>
                    {ep.vote_average > 0 && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        ★ {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-primary transition-colors">
                    {ep.name || `Episode ${ep.episode_number}`}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {ep.overview || "No overview available for this episode."}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-3.5 w-3.5 fill-primary" />
                    Play Episode
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12 text-muted-foreground text-sm font-semibold">
              No episodes found for this season.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
