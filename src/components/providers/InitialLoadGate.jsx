import { useEffect, useState } from 'react';
import InitialLoadScreen from '../ui/InitialLoadScreen';
import { isInitialLoadComplete, runInitialBootstrap } from '../../utils/imageCache';

const SPLASH_FADE_MS = 320;

export default function InitialLoadGate({ children }) {
  const skipSplash = isInitialLoadComplete();
  const [ready, setReady] = useState(skipSplash);
  const [showSplash, setShowSplash] = useState(!skipSplash);
  const [progress, setProgress] = useState(0.04);

  useEffect(() => {
    if (ready) return undefined;

    let cancelled = false;

    runInitialBootstrap((ratio) => {
      if (!cancelled) setProgress(ratio);
    })
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || !showSplash) return undefined;

    const id = window.setTimeout(() => setShowSplash(false), SPLASH_FADE_MS);
    return () => window.clearTimeout(id);
  }, [ready, showSplash]);

  useEffect(() => {
    if (!showSplash) return undefined;

    const { documentElement: root } = document;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [showSplash]);

  return (
    <>
      {children}
      {showSplash ? <InitialLoadScreen progress={progress} exiting={ready} /> : null}
    </>
  );
}
