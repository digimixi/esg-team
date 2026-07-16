'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('has_visited_esg_team');
      
      if (!hasVisited) {
        // Mark the session so we don't count the same visitor on every page load or refresh
        sessionStorage.setItem('has_visited_esg_team', 'true');
        
        // Fire the tracking request to our backend
        fetch('/api/analytics/track', {
          method: 'POST',
          // We don't need to block or await this, let it run in the background
        }).catch((err) => {
          console.error('Failed to record visit', err);
        });
      }
    }
  }, []);

  // This is an invisible component, it renders nothing
  return null;
}
