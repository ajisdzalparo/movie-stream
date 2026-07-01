import { Metadata } from "next";
import { WatchlistClient } from "@/components/watchlist/watchlist-client";

export const metadata: Metadata = {
  title: "Your Watchlist - ShientaMovie",
  description: "Manage your saved movies, TV series, and continue watching items.",
};

export default function WatchlistPage() {
  return <WatchlistClient />;
}
