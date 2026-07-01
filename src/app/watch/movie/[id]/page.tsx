import { Metadata } from "next";
import Link from "next/link";
import { Star, Calendar, Clock, ChevronLeft } from "lucide-react";
import { getMovieDetails } from "@/lib/tmdb";
import { SmartPlayer } from "@/components/ui/smart-player";
import { Carousel } from "@/components/ui/carousel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const movie = await getMovieDetails(id);
  
  return {
    title: `Watching: ${movie?.title || "Movie"} - NetStream`,
    description: `Watch ${movie?.title} online for free on NetStream.`,
  };
}

export default async function WatchMoviePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const movie = await getMovieDetails(id);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <p className="text-muted-foreground mt-2">The movie you are trying to watch does not exist.</p>
      </div>
    );
  }

  const { title, overview, vote_average, release_date, runtime, genres, similar } = movie;
  const year = release_date ? new Date(release_date).getFullYear() : "N/A";
  const hours = runtime ? Math.floor(runtime / 60) : 0;
  const minutes = runtime ? runtime % 60 : 0;
  const durationStr = runtime ? `${hours}h ${minutes}m` : null;
  const similarMovies = similar?.results || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Back Button */}
      <Link
        href={`/movie/${id}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white mb-6 font-semibold transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Details</span>
      </Link>

      {/* Main Video Player */}
      <SmartPlayer
        tmdbId={id}
        imdbId={movie.imdb_id}
        type="movie"
        title={title || "Untitled Movie"}
        season={undefined}
        episode={undefined}
      />

      {/* Movie Info Details Panel */}
      <div className="mt-8 max-w-5xl mx-auto rounded-xl bg-[#151D30] border border-border p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
          {vote_average > 0 && (
            <span className="text-amber-400 font-bold">★ {vote_average.toFixed(1)}</span>
          )}
          <span>{year}</span>
          {durationStr && <span>{durationStr}</span>}
          <span className="rounded bg-white/10 px-2 py-0.5 uppercase text-[9px] font-bold text-white tracking-wider">
            Movie
          </span>
        </div>

        <h1 className="text-2xl font-bold md:text-3xl text-white mt-3">{title}</h1>

        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {genres.map((g) => (
              <span
                key={g.id}
                className="text-[10px] font-semibold text-muted-foreground bg-[#0B0F19] px-2.5 py-1 rounded"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border pt-4">
          {overview}
        </p>
      </div>

      {/* Recommendations */}
      {similarMovies.length > 0 && (
        <div className="mt-12 -mx-4 md:-mx-8 border-t border-border/10 pt-4">
          <Carousel title="Recommended for You" items={similarMovies.map(m => ({ ...m, media_type: 'movie' }))} />
        </div>
      )}
    </div>
  );
}
