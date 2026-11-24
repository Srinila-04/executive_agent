import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Right-side video pane running the looping background video (/assets/video/right-bg.mp4)
 * High-definition, crystal clear, using only the user-provided video.
 * Includes infinite loop watchdog, autoplay resilience, and tab-focus auto-resume.
 */
export default function RightVideoPane({ className = '' }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const safePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict muted settings required by modern browser autoplay policies (especially when file has an audio track)
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setVideoLoaded(true);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.log('Autoplay deferred, awaiting interaction:', err.message);
          }
        });
    }
  }, []);

  // 1. Initial play and event bindings
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    safePlay();

    const handleCanPlay = () => safePlay();
    video.addEventListener('canplay', handleCanPlay);

    // 2. Tab Visibility & Window Focus Recovery:
    // Browsers automatically freeze background video when switching tabs/windows.
    // This resumes playback immediately when returning to the tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const v = videoRef.current;
        if (v && v.paused) {
          safePlay();
        }
      }
    };

    const handleFocus = () => {
      const v = videoRef.current;
      if (v && v.paused) {
        safePlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // 3. Persistent Interaction Trigger:
    // If browser suspended autoplay, any user interaction on the page immediately resumes it.
    const handleUserInteraction = () => {
      const v = videoRef.current;
      if (v && v.paused) {
        safePlay();
      }
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    // 4. Stall & Freeze Watchdog:
    // Checks every 1.5 seconds if video paused or ended, ensuring it NEVER gets stuck.
    const watchdogInterval = setInterval(() => {
      const v = videoRef.current;
      if (v && document.visibilityState === 'visible' && (v.paused || v.ended)) {
        v.muted = true;
        v.defaultMuted = true;
        if (v.ended) {
          v.currentTime = 0;
        }
        v.play().catch(() => {});
      }
    }, 1500);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      clearInterval(watchdogInterval);
    };
  }, [safePlay]);

  return (
    <div
      className={`hub-right-video-container ${className}`}
      onClick={safePlay}
      style={{ cursor: 'default' }}
    >
      {/* Dedicated Looping Background Video - Uninterrupted Continuous Playback */}
      <video
        ref={videoRef}
        className="hub-bg-video clear-video"
        src="/assets/video/right-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onCanPlay={() => {
          setVideoLoaded(true);
          safePlay();
        }}
        onLoadedData={() => {
          setVideoLoaded(true);
          safePlay();
        }}
        onEnded={() => {
          // Manual loop fallback to prevent freeze at 8-second video boundary
          const v = videoRef.current;
          if (v) {
            v.currentTime = 0;
            v.play().catch(() => {});
          }
        }}
        onPause={() => {
          // Resume if paused unexpectedly while page is visible
          if (document.visibilityState === 'visible') {
            const v = videoRef.current;
            if (v && v.paused) {
              v.play().catch(() => {});
            }
          }
        }}
      />
      {/* Seamless Feathering Gradient: Smoothly blends video left edge into the blueprint side */}
      <div className="hub-video-seam-blend-overlay" />
    </div>
  );
}
