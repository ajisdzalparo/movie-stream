import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { TMDBContent } from "@/lib/tmdb";

interface MovieCardProps {
  item: TMDBContent;
}

export function MovieCard({ item }: MovieCardProps) {
  const { id, title, name, poster_path, vote_average, release_date, first_air_date } = item;
  const mediaType = item.media_type || (title ? "movie" : "tv");
  const displayTitle = title || name || "Untitled";
  const dateStr = release_date || first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : "N/A";
  
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  return (
    <Link href={`/${mediaType}/${id}`} className="group block relative rounded-md overflow-hidden bg-[#151D30] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] border border-transparent hover:border-primary/50">
      {/* Aspect Ratio Box (2:3) */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-[#0B0F19]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <span className="text-sm font-semibold line-clamp-3 text-muted-foreground">{displayTitle}</span>
            <span className="mt-2 text-xs text-muted-foreground/60 capitalize">{mediaType}</span>
          </div>
        )}

        {/* Rating overlay */}
        {vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-[#0B0F19]/80 px-2 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur-sm shadow-md">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Media type overlay (right-top) */}
        <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground backdrop-blur-sm">
          {mediaType === "movie" ? "Movie" : "TV"}
        </div>
        
        {/* Hover info gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3">
          <p className="text-xs text-muted-foreground line-clamp-3">{item.overview}</p>
        </div>
      </div>

      {/* Info section below card */}
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {year} • <span className="capitalize">{mediaType === "movie" ? "Movie" : "TV Series"}</span>
        </p>
      </div>
    </Link>
  );
}
