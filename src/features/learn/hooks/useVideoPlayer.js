import { useState, useRef, useCallback, useEffect } from "react";

export function useVideoPlayer({ lesson, onEnded, onRegisterSeek }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rate, setRate] = useState(1);
  const [showRates, setShowRates] = useState(false);

  const hideTimerRef = useRef(null);

  // Auto-hide controls
  const nudgeControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (videoRef.current && !videoRef.current.paused) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2400);
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    clearTimeout(hideTimerRef.current);
  }, []);

  // Reset when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrent(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [lesson.id]);

  useEffect(() => clearHideTimer, [clearHideTimer]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const seekBy = useCallback((delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  }, []);

  const onSeek = useCallback((e) => {
    const v = videoRef.current;
    if (!v) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * (v.duration || 0);
    setProgress(pct);
  }, []);

  const setPlaybackRate = useCallback((r) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = r;
    setRate(r);
    setShowRates(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        seekBy(-10);
      } else if (e.code === "ArrowRight") {
        seekBy(10);
      } else if (e.code === "KeyM") {
        toggleMute();
      } else if (e.code === "KeyF") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seekBy, toggleMute, toggleFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Video event handlers
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleLoadedMetadata = useCallback((e) => setDuration(e.currentTarget.duration || 0), []);
  const handleTimeUpdate = useCallback((e) => {
    const v = e.currentTarget;
    setCurrent(v.currentTime || 0);
    setProgress(((v.currentTime || 0) / (v.duration || 1)) * 100);
  }, []);
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  }, [onEnded]);

  const seekTo = useCallback((seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, seconds));
    setShowControls(true);
  }, []);

  useEffect(() => {
    onRegisterSeek?.(seekTo);
  }, [onRegisterSeek, seekTo]);

  return {
    videoRef,
    containerRef,
    isPlaying,
    isMuted,
    progress,
    duration,
    current,
    showControls,
    setShowControls,
    isFullscreen,
    rate,
    showRates,
    setShowRates,
    nudgeControls,
    togglePlay,
    toggleMute,
    seekBy,
    onSeek,
    setPlaybackRate,
    toggleFullscreen,
    handlePlay,
    handlePause,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
    seekTo,
  };
}
