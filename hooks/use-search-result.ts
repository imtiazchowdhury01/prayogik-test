
import { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  teacherProfile?: {
    id: string;
    user: {
      name: string;
      avatarUrl: string;
    };
  };
  prices?: Array<{
    regularAmount: number;
    discountedAmount?: number;
    isFree: boolean;
  }>;
}

interface SearchResult {
  courses: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  searchType: "simple" | "advanced";
}

export function useSearchResults(query: string, published: string, advanced: string) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSearchResults = async (page: number, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
        setAllCourses([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const searchUrl = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: page === 1 ? "20" : "10", // First page loads 20, subsequent pages load 10
        published,
        advanced,
      });

      const response = await fetch(`/api/courses/search?${searchUrl.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      
      if (data.success) {
        setSearchResult(data.data);
        
        if (isLoadMore) {
          setAllCourses(prev => [...prev, ...data.data.courses]);
        } else {
          setAllCourses(data.data.courses);
        }
        
        setCurrentPage(page);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (searchResult?.pagination.hasNextPage) {
      fetchSearchResults(currentPage + 1, true);
    }
  };

  const resetAndSearch = () => {
    setCurrentPage(1);
    fetchSearchResults(1, false);
  };

  useEffect(() => {
    if (query) {
      resetAndSearch();
    }
  }, [query, published, advanced]);

  return {
    allCourses,
    searchResult,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore: searchResult?.pagination.hasNextPage || false,
  };
}