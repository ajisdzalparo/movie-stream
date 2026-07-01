import { Metadata } from "next";
import Image from "next/image";
import { Star, Calendar, User, Layers } from "lucide-react";
import { getTVShowDetails, getTVSeasonDetails } from "@/lib/tmdb";
import { WatchlistActions } from "@/components/watchlist/watchlist-actions";
import { TvSeasons } from "@/components/tv/tv-seasons";
import { Carousel } from "@/components/ui/carousel";

// ISR setup
export const revalidate = 86400; // Cache page for 24 hours

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const show = await getTVShowDetails(id);
  
  return {
    title: `${show?.name || "TV Show Details"} - ShientaMovie`,
    description: show?.overview || "Watch this TV show on ShientaMovie.",
  };
}

export default async function TVDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  // Parallel fetch basic details and season 1 episodes
  const [show, initialSeasonDetails] = await Promise.all([
    getTVShowDetails(id),
    getTVSeasonDetails(id, 1),
  ]);

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">TV Show not found</h1>
        <p className="text-muted-foreground mt-2">The TV Show you are looking for does not exist.</p>
      </div>
    );
  }

  const { name, overview, poster_path, backdrop_path, vote_average, first_air_date, number_of_seasons, genres, credits, similar } = show;
  const year = first_air_date ? new Date(first_air_date).getFullYear() : "N/A";
  
  const backdropUrl = backdrop_path 
    ? `https://image.tmdb.org/t/p/original${backdrop_path}`
    : null;

  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  const cast = credits?.cast?.slice(0, 10) || [];
  const similarShows = similar?.results || [];

  return (
    <div className="min-h-screen pb-12">
      {/* Banner Backdrop */}
      <div className="relative h-[45vh] w-full bg-black">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={name || "Backdrop"}
            fill
            priority
            className="object-cover opacity-35"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F19] to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
      </div>

      {/* Details Area */}
      <div className="container mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Column */}
          <div className="w-[180px] sm:w-[240px] md:w-[300px] shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#151D30] aspect-[2/3] relative">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={name || "Poster"}
                fill
                sizes="(max-width: 768px) 240px, 300px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-6 text-center text-muted-foreground text-sm font-semibold">
                No Poster Available
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-24">
            <h1 className="text-3xl font-extrabold md:text-5xl lg:text-6xl text-white tracking-tight">
              {name}
            </h1>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs font-semibold text-muted-foreground">
              {vote_average > 0 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{vote_average.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>{number_of_seasons || 1} Season{number_of_seasons && number_of_seasons > 1 ? "s" : ""}</span>
              </div>
              <span className="rounded bg-white/10 px-2 py-0.5 uppercase tracking-wider text-[10px] text-white">
                TV Series
              </span>
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-[#151D30] border border-border px-3.5 py-1 text-xs text-muted-foreground font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="mt-6">
              <h2 className="text-base font-bold text-white mb-2">Synopsis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {overview}
              </p>
            </div>

            {/* Action Buttons */}
            <WatchlistActions
              id={id}
              title={name || "Untitled"}
              type="tv"
              poster_path={poster_path}
              vote_average={vote_average}
              release_date={first_air_date}
            />
          </div>
        </div>

        {/* Seasons & Episodes Selector */}
        <TvSeasons
          tvId={id}
          totalSeasons={number_of_seasons || 1}
          initialSeasonDetails={initialSeasonDetails}
        />

        {/* Cast list */}
        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-primary"></span>
              Top Cast
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
              {cast.map((actor) => {
                const profileUrl = actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : null;

                return (
                  <div key={actor.id} className="w-[100px] sm:w-[120px] shrink-0 text-center">
                    <div className="relative aspect-square w-full rounded-full overflow-hidden border border-border bg-[#151D30] mb-2 shadow-md">
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={actor.name}
                          fill
                          sizes="(max-width: 768px) 100px, 120px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Similar TV Shows */}
        {similarShows.length > 0 && (
          <div className="mt-4 -mx-4 md:-mx-8">
            <Carousel title="Similar Content" items={similarShows.map(t => ({ ...t, media_type: 'tv' }))} />
          </div>
        )}
      </div>
    </div>
  );
}
