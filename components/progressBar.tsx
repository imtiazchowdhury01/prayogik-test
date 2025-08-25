// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Create a custom hook to handle navigation state
function useNavigation() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationStartTimeRef = useRef(null);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    navigationStartTimeRef.current = Date.now();
  }, []);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
    navigationStartTimeRef.current = null;
  }, []);

  return {
    isNavigating,
    navigationStartTime: navigationStartTimeRef.current,
    startNavigation,
    endNavigation,
  };
}

export default function TopProgressBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigation = useNavigation();

  // Use refs to track intervals, timeouts, and current route
  const progressIntervalRef = useRef(null);
  const showBarTimeoutRef = useRef(null);
  const hideBarTimeoutRef = useRef(null);
  const pendingNavigationRef = useRef(false);
  const currentPathRef = useRef(pathname);
  const currentSearchParamsRef = useRef(searchParams);

  const startLoading = () => {
    // Mark that we have a pending navigation
    pendingNavigationRef.current = true;
    navigation.startNavigation();

    // Clear any existing timeout
    if (showBarTimeoutRef.current) {
      clearTimeout(showBarTimeoutRef.current);
    }

    if (hideBarTimeoutRef.current) {
      clearTimeout(hideBarTimeoutRef.current);
    }

    // Set a delay before showing the progress bar
    showBarTimeoutRef.current = setTimeout(() => {
      // Only show if we still have a pending navigation
      if (pendingNavigationRef.current) {
        setLoading(true);
        setProgress(0);

        // Clear any existing interval
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        // Start a new progress interval
        progressIntervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressIntervalRef.current);
              return 90;
            }
            return prev + (prev < 30 ? 10 : prev < 60 ? 5 : 2);
          });
        }, 100);
      }
    }, 150); // 150ms delay before showing the progress bar
  };

  const completeLoading = () => {
    // Mark that navigation is no longer pending
    pendingNavigationRef.current = false;
    navigation.endNavigation();

    // Clear the show bar timeout
    if (showBarTimeoutRef.current) {
      clearTimeout(showBarTimeoutRef.current);
      showBarTimeoutRef.current = null;
    }

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // If the bar is already visible, animate it to completion
    if (loading) {
      // Force progress to 100%
      setProgress(100);

      // Hide the bar after a short delay to ensure animation completes
      if (hideBarTimeoutRef.current) {
        clearTimeout(hideBarTimeoutRef.current);
      }

      hideBarTimeoutRef.current = setTimeout(() => {
        setLoading(false);
        setProgress(0);
        hideBarTimeoutRef.current = null;
      }, 400);
    } else {
      // If the bar isn't visible yet, just reset states
      setLoading(false);
      setProgress(0);
    }
  };

  // Intercept link clicks to start loading immediately
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLinkClick = (e) => {
        const element = e.target.closest("a");

        // Only handle internal links
        if (
          element &&
          element.href &&
          element.href.startsWith(window.location.origin) &&
          !element.target &&
          !element.download &&
          !element.rel?.includes("external")
        ) {
          // Get the path from the link
          const url = new URL(element.href);
          const linkPathname = url.pathname;
          const linkSearchParams = url.searchParams.toString();

          // Only start loading if this is a different route
          if (
            linkPathname !== currentPathRef.current ||
            linkSearchParams !== currentSearchParamsRef.current.toString()
          ) {
            startLoading();
          }
        }
      };

      // Add click event listener
      document.addEventListener("click", handleLinkClick);

      return () => {
        document.removeEventListener("click", handleLinkClick);
      };
    }
  }, []);

  // Monitor route changes
  useEffect(() => {
    const currentPath = pathname;
    const currentParams = searchParams.toString();
    const previousPath = currentPathRef.current;
    const previousParams = currentSearchParamsRef.current?.toString() || "";

    // Update refs to track current route
    currentPathRef.current = currentPath;
    currentSearchParamsRef.current = searchParams;

    // Skip initial render
    if (previousPath === currentPath && previousParams === currentParams) {
      return;
    }

    // If this is a route change (not just initial render)
    if (previousPath !== undefined) {
      // If we don't have a pending navigation yet, this was triggered by direct router change
      if (!pendingNavigationRef.current) {
        startLoading();
      }

      // Complete with a small delay to ensure UI updates are visible
      setTimeout(() => {
        completeLoading();
      }, 50);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (showBarTimeoutRef.current) {
        clearTimeout(showBarTimeoutRef.current);
      }
      if (hideBarTimeoutRef.current) {
        clearTimeout(hideBarTimeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  // Force complete loading if stuck at 90% for too long
  useEffect(() => {
    if (progress >= 90 && progress < 100) {
      const forceCompleteTimeout = setTimeout(() => {
        if (pendingNavigationRef.current) {
          // If we're still pending, force complete after delay
          completeLoading();
        }
      }, 3000); // Force complete after 3 seconds at 90%

      return () => clearTimeout(forceCompleteTimeout);
    }
  }, [progress]);

  if (!loading && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-primary-500 z-[99999] transition-all duration-300"
      style={{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
        transition:
          progress === 100
            ? "width 0.3s ease-out, opacity 0.3s ease-out"
            : "width 0.3s ease-out",
      }}
    />
  );
}
