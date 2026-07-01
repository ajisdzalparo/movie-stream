import { searchMulti } from "@/lib/tmdb";
import { SearchClient } from "@/components/search/search-client";

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  // Fetch search results on the server
  const results = await searchMulti(query);

  return <SearchClient initialResults={results} />;
}
