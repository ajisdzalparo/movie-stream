import { Metadata } from "next";
import Link from "next/link";
import { Star, Calendar, ChevronLeft } from "lucide-react";
import { getTVShowDetails, getTVSeasonDetails } from "@/lib/tmdb";
import { SmartPlayer } from "@/components/ui/smart-player";
import { TvWatchControls } from "@/components/tv/tv-watch-controls";
import { Carousel } from "@/components/ui/carousel";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const resolvedSearchParams = await searchParams;
  const s = parseInt(resolvedSearchParams.season || "1");
  const e = parseInt(resolvedSearchParams.episode || "1");
  
  const show = await getTVShowDetails(id);
  
  return {
    title: `Watching: S${s}E${e} - ${show?.name || "TV Show"} - NetStream`,
    description: `Watch Season ${s} Episode ${e} of ${show?.name} online for free on NetStream.`,
  };
}

export default async function WatchTVPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const resolvedSearchParams = await searchParams;
  const s = parseInt(resolvedSearchParams.season || "1");
  const e = parseInt(resolvedSearchParams.episode || "1");

  const [show, seasonDetails] = await Promise.all([
    getTVShowDetails(id),
    getTVSeasonDetails(id, s),
  ]);

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">TV Show not found</h1>
        <p className="text-muted-foreground mt-2">The TV Show you are trying to watch does not exist.</p>
      </div>
    );
  }

  const currentEpisodeDetails = seasonDetails?.episodes?.find((ep) => ep.episode_number === e);
  const similarShows = show.similar?.results || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Back Button */}
      <Link
        href={`/tv/${id}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white mb-6 font-semibold transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Series Details</span>
      </Link>

      {/* Main Video Player */}
      <SmartPlayer
        tmdbId={id}
        type="tv"
        title={`${show.name || "TV Show"} - Season ${s} Episode ${e}`}
        season={s}
        episode={e}
      />

      {/* Season and Episode Watch Controls */}
      <TvWatchControls
        tvId={id}
        showName={show.name || "TV Show"}
        totalSeasons={show.number_of_seasons || 1}
        currentSeason={s}
        currentEpisode={e}
        initialSeasonDetails={seasonDetails}
      />

      {/* Episode Info / Show Info Details Panel */}
      <div className="mt-8 max-w-5xl mx-auto rounded-xl bg-[#151D30] border border-border p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
          {show.vote_average > 0 && (
            <span className="text-amber-400 font-bold">★ {show.vote_average.toFixed(1)}</span>
          )}
          <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A"}</span>
          <span>Season {s} • Episode {e}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 uppercase text-[9px] font-bold text-white tracking-wider">
            TV Series
          </span>
        </div>

        <h1 className="text-2xl font-bold md:text-3xl text-white mt-3">
          {currentEpisodeDetails?.name ? `${e}. ${currentEpisodeDetails.name}` : `Episode ${e}`}
        </h1>
        <h2 className="text-xs font-bold text-primary tracking-wide uppercase mt-1">
          {show.name}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border pt-4">
          {currentEpisodeDetails?.overview || show.overview}
        </p>
      </div>

      {/* Recommendations */}
      {similarShows.length > 0 && (
        <div className="mt-12 -mx-4 md:-mx-8 border-t border-border/10 pt-4">
          <Carousel title="Recommended for You" items={similarShows.map(t => ({ ...t, media_type: 'tv' }))} />
        </div>
      )}
    </div>
  );
}
