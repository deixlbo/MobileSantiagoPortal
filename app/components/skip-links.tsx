'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey === false) {
        setIsVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Link
        href="#main-content"
        onClick={() => setIsVisible(false)}
        className={`skip-link ${isVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200`}
      >
        Skip to main content
      </Link>
      <Link
        href="#navigation"
        onClick={() => setIsVisible(false)}
        className={`skip-link ml-32 ${isVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200`}
      >
        Skip to navigation
      </Link>
    </>
  );
}
