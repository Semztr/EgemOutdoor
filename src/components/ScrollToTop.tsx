import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  // Disable browser's automatic scroll restoration to avoid jumping to previous position
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Jump instantly to the top on route change to ensure header is visible immediately
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
