import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useScrollToTop
 *
 * Custom hook that scrolls to the top of the page whenever the route changes.
 * Call this hook in your main App component or a layout wrapper.
 *
 * Usage:
 * const App = () => {
 *   useScrollToTop();
 *   return (...)
 * }
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
