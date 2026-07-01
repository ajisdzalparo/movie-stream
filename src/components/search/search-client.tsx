/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Film, Tv, Layers } from "lucide-react";
import { MovieCard } from "@/components/ui/movie-card";
import { TMDBContent } from "@/lib/tmdb";

interface SearchClientProps {
  initialResults: TMDBContent[];
}

export function SearchClient({ initialResults }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";
  
  const getValidTab = (val: string | null): "all" | "movie" | "tv" => {
    if (val === "movie" || val === "tv") return val;
    return "all";
  };

  const [inputVal, setInputVal] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv">(getValidTab(typeParam));

  // Debounce search input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (inputVal.trim()) params.set("q", inputVal.trim());
      if (activeTab !== "all") params.set("type", activeTab);
      
      router.push(`/search?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [inputVal, activeTab, router]);

  // Sync state if URL changes externally
  useEffect(() => {
    setInputVal(queryParam);
    setActiveTab(getValidTab(typeParam));
  }, [queryParam, typeParam]);

  // Filter results client side based on tab (and pass TMDB results)
  const filteredResults = initialResults.filter((item) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv");
    if (activeTab === "movie") return mediaType === "movie";
    if (activeTab === "tv") return mediaType === "tv";
    return true;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Search Input Hero Section */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold md:text-3xl text-white mb-4">Discover Content</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for movies, TV series, actors..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full h-12 px-5 pl-12 rounded-full border border-border bg-[#151D30] text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg transition-all"
          />
          <SearchIcon className="absolute left-4.5 top-3.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex justify-center items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
              : "bg-[#151D30] border-border text-muted-foreground hover:text-white"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>All Content</span>
        </button>
        <button
          onClick={() => setActiveTab("movie")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            activeTab === "movie"
              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
              : "bg-[#151D30] border-border text-muted-foreground hover:text-white"
          }`}
        >
          <Film className="h-3.5 w-3.5" />
          <span>Movies</span>
        </button>
        <button
          onClick={() => setActiveTab("tv")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            activeTab === "tv"
              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
              : "bg-[#151D30] border-border text-muted-foreground hover:text-white"
          }`}
        >
          <Tv className="h-3.5 w-3.5" />
          <span>TV Shows</span>
        </button>
      </div>

      {/* Results Section */}
      <div>
        {filteredResults.length > 0 ? (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Found {filteredResults.length} item{filteredResults.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in">
              {filteredResults.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-muted-foreground">No matches found</p>
            <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
              We couldn&apos;t find any titles matching &quot;{inputVal}&quot;. Try searching for something else or double check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
