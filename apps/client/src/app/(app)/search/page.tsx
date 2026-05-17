'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, History, TrendingUp, Filter, Sparkles, UserCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { ContentCard } from '@/components/feed/ContentCard';
import { apiClient } from '@/lib/api/client';

interface Creator {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

interface Content {
  id: string;
  title?: string;
  type: string;
  accessRule: string;
  creatorName: string;
  thumbnailUrl?: string;
}

interface SearchResult {
  creators: Creator[];
  content: Content[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({ creators: [], content: [] });
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ['Live', 'Artists', 'Design', 'Tech', 'Cooking', 'Fitness', 'Music'];

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    // Don't search if query is empty
    if (!searchQuery.trim()) {
      setResults({ creators: [], content: [] });
      setError(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await apiClient.get<SearchResult>('/search', {
        params: {
          q: searchQuery,
          type: '', // Can be extended later for filtering by type
        },
      });
      setResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results. Please try again.');
      setResults({ creators: [], content: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search with 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const hasResults = results.creators.length > 0 || results.content.length > 0;
  const showEmptyState = hasSearched && !isLoading && !hasResults && query.trim();

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Search Header */}
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Discover <Sparkles className="w-6 h-6 text-[#9E398D]" />
            </h1>
            <p className="text-sm text-neutral-400 font-medium tracking-tight">Search for your favorite creators and content.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-r from-[#9E398D]/20 to-[#521E49]/20 rounded-3xl blur-2xl transition-all duration-500',
              isFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            )}
          />
          <div
            className={clsx(
              'relative flex items-center gap-4 bg-[#0a0a0a] border rounded-3xl p-5 transition-all duration-300',
              isFocused ? 'border-[#9E398D] shadow-2xl' : 'border-white/10'
            )}
          >
            <Search className={clsx('w-6 h-6 transition-colors flex-shrink-0', isFocused ? 'text-[#9E398D]' : 'text-neutral-500')} />
            <input
              type="text"
              placeholder="Search creators, posts, or live streams..."
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-neutral-600 font-medium text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {isLoading && <Loader2 className="w-5 h-5 text-[#9E398D] animate-spin flex-shrink-0" />}
            {!isLoading && (
              <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all flex-shrink-0">
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Only show categories and trending when no query */}
      {!query.trim() && (
        <>
          {/* Recommended Tags */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#9E398D]" /> Trending Right Now
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-6 py-2.5 rounded-full border border-white/5 bg-white/5 hover:bg-[#9E398D]/10 hover:border-[#9E398D]/20 hover:text-[#9E398D] text-sm font-black uppercase tracking-widest transition-all hover:scale-105"
                  onClick={() => setQuery(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Start Discovery State */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 text-neutral-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Recent Discoveries</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Start Discovery</h3>
                <p className="text-sm text-neutral-500 font-medium">Type something to explore the AeviaLive ecosystem.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Search Results */}
      {query.trim() && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">
              {isLoading ? 'Searching...' : `Results for "${query}"`}
            </h2>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          {showEmptyState && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">No results for "{query}"</h3>
                <p className="text-sm text-neutral-500 font-medium">Try adjusting your search terms.</p>
              </div>
            </div>
          )}

          {/* Creators Section */}
          {results.creators.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                Creators ({results.creators.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.creators.map((creator) => (
                  <a
                    key={creator.id}
                    href={`/creators/${creator.username}`}
                    className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 p-6 transition-all hover:border-[#9E398D]/30 hover:shadow-[0_10px_40px_-15px_rgba(158,57,141,0.2)]"
                  >
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9E398D] to-[#521E49] flex items-center justify-center text-xl font-bold text-white overflow-hidden ring-2 ring-transparent group-hover:ring-[#9E398D]/20 transition-all">
                        {creator.avatarUrl ? (
                          <img src={creator.avatarUrl} alt={creator.displayName || creator.username} className="w-full h-full object-cover" />
                        ) : (
                          creator.displayName?.[0]?.toUpperCase() || creator.username[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{creator.displayName || creator.username}</h4>
                        <p className="text-xs text-neutral-500 font-medium">@{creator.username}</p>
                      </div>
                      <button className="px-4 py-2 rounded-full border border-[#9E398D]/30 bg-[#9E398D]/10 text-[#9E398D] text-xs font-bold uppercase tracking-widest hover:bg-[#9E398D] hover:text-white transition-all w-full">
                        View Profile
                      </button>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Content Section */}
          {results.content.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                Content ({results.content.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.content.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    creatorName={item.creatorName}
                    type={item.type as 'IMAGE' | 'VIDEO' | 'POST'}
                    accessRule={item.accessRule as 'FREE' | 'SUBSCRIPTION' | 'PPV'}
                    title={item.title}
                    createdAt="Just now"
                    thumbnailUrl={item.thumbnailUrl}
                    isLocked={item.accessRule !== 'FREE'}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
