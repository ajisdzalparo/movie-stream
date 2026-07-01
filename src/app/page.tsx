import Link from "next/link";
import Image from "next/image";
import { Play, Info, AlertCircle, Star } from "lucide-react";
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getPopularMovies, 
  getTopRatedTVShows,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTVShows,
  isTMDBConfigured 
} from "@/lib/tmdb";
import { Carousel } from "@/components/ui/carousel";
import { ContinueWatching } from "@/components/watchlist/continue-watching";

export default async function Home() {
  const configured = isTMDBConfigured();
  
  // Parallel fetch movie sections
  const [trendingMovies, trendingTVShows, popularMovies, topRatedTVShows, nowPlaying, upcoming, popularTV] = await Promise.all([
    getTrendingMovies(),
    getTrendingTVShows(),
    getPopularMovies(),
    getTopRatedTVShows(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getPopularTVShows(),
  ]);

  // Pick first trending movie for the Hero Banner
  const heroItem = trendingMovies[0] || popularMovies[0];

  const heroBackdrop = heroItem?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      {heroItem && (
        <section className="relative h-[70vh] w-full flex items-end justify-start bg-black">
          {heroBackdrop ? (
            <Image
              src={heroBackdrop}
              alt={heroItem.title || heroItem.name || "Hero Banner"}
              fill
              priority
              className="object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F19] to-slate-900" />
          )}

          {/* Gradients to blend banner */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/20 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-4 md:px-8 pb-12">
            <span className="inline-block rounded bg-primary/20 border border-primary/30 px-2.5 py-1 text-xs uppercase font-bold tracking-wider text-primary mb-3">
              Trending Today
            </span>
            <h1 className="text-3xl font-extrabold md:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-md">
              {heroItem.title || heroItem.name}
            </h1>
            
            {heroItem.vote_average > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{heroItem.vote_average.toFixed(1)} Rating</span>
              </div>
            )}

            <p className="mt-4 text-sm md:text-base text-muted-foreground line-clamp-3 md:line-clamp-4 leading-relaxed max-w-lg">
              {heroItem.overview}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/watch/${heroItem.media_type || 'movie'}/${heroItem.id}`}
                className="flex items-center gap-2 rounded bg-primary hover:bg-red-700 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Watch Now</span>
              </Link>
              <Link
                href={`/${heroItem.media_type || 'movie'}/${heroItem.id}`}
                className="flex items-center gap-2 rounded bg-white/10 hover:bg-white/20 border border-white/15 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
              >
                <Info className="h-4 w-4" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Warning Alert if TMDB Key is missing */}
      {!configured && (
        <div className="mx-4 md:mx-8 mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-500 text-sm">Demo Mode Active (TMDB API Key Missing)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Currently running on fallback mock data. To load live content, add your API Key in your <code className="rounded bg-black/40 px-1 py-0.5 text-white">.env.local</code> as <code className="font-semibold text-white">TMDB_API_KEY=your_key</code>.
                </p>
              </div>
            </div>
            <a 
              href="https://www.themoviedb.org/settings/api" 
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-amber-500 hover:underline shrink-0"
            >
              Get TMDB Key &rarr;
            </a>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      <ContinueWatching />

      {/* Carousels */}
      <div className="flex flex-col gap-2">
        <Carousel title="Trending Movies" items={trendingMovies} />
        <Carousel title="Trending TV Series" items={trendingTVShows} />
        <Carousel title="Now Playing" items={nowPlaying} />
        <Carousel title="Popular Releases" items={popularMovies} />
        <Carousel title="Upcoming Movies" items={upcoming} />
        <Carousel title="Top Rated TV Shows" items={topRatedTVShows} />
        <Carousel title="Popular TV Shows" items={popularTV} />
      </div>
    </div>
  );
}
