"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Film, Tv, Bookmark, Home } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Movies", path: "/search?type=movie", icon: Film },
    { name: "TV Shows", path: "/search?type=tv", icon: Tv },
    { name: "Watchlist", path: "/watchlist", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#0B0F19]/90 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-2xl font-black tracking-wider text-transparent transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-400 drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">
            NETSTREAM
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden space-x-6 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path.split("?")[0]));
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-60 rounded-full border border-border bg-[#151D30] pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground transition-all duration-300 focus:w-72 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Search Icon for Mobile (hidden desktop, redirects to search page) */}
          <Link
            href="/search"
            className="rounded-full p-2 text-muted-foreground hover:bg-[#151D30] hover:text-foreground sm:hidden"
          >
            <Search className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
