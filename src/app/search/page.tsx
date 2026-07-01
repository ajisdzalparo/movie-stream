import { searchMulti, getAllDiscoverContent } from "@/lib/tmdb";
import { SearchClient } from "@/components/search/search-client";

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  // If no query, show all discover content (trending + popular + now playing + upcoming + TV)
  const results = query
    ? await searchMulti(query)
    : await getAllDiscoverContent();

  return <SearchClient initialResults={results} />;
}
