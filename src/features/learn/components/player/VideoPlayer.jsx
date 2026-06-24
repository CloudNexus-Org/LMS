import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings, RotateCcw, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useVideoPlayer } from "@/features/learn/hooks/useVideoPlayer";

function formatTime(s) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function VideoPlayer({ src, lesson, onEnded }) {
  const {
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
  } = useVideoPlayer({ lesson, onEnded });

  return (
    <div
      ref={containerRef}
      onMouseMove={nudgeControls}
      onMouseLeave={() => {
        if (videoRef.current && !videoRef.current.paused) setShowControls(false);
      }}
      className="learn-player group/player relative aspect-video w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-contain"
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Paused overlay */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="learn-player-overlay"
        >
          <motion.span
            className="learn-player-play-btn"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={28} fill="currentColor" />
          </motion.span>
        </button>
      )}

      {/* Top gradient + title */}
      <div
        className={`learn-player-top ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <p className="learn-player-module">{lesson.courseTitle}</p>
        <p className="learn-player-lesson">{lesson.title}</p>
      </div>

      {/* Controls */}
      <div
        className={`learn-player-controls ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <div className="learn-scrubber-row">
          <span className="learn-time">{formatTime(current)}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={onSeek}
            aria-label="Seek"
            className="learn-scrubber"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary) ${progress}%, rgba(255,255,255,0.22) ${progress}%)`,
            }}
          />
          <span className="learn-time text-right">{formatTime(duration)}</span>
        </div>

        <div className="learn-controls-bar">
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="learn-ctrl-btn">
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" onClick={() => seekBy(-10)} aria-label="Back 10 seconds" className="learn-ctrl-btn">
              <RotateCcw size={14} />
            </button>
            <button type="button" onClick={() => seekBy(10)} aria-label="Forward 10 seconds" className="learn-ctrl-btn">
              <RotateCw size={14} />
            </button>
            <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="learn-ctrl-btn">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowRates((s) => !s)}
              aria-label="Playback speed"
              className="learn-rate-btn"
            >
              <Settings size={13} />
              {rate}x
            </button>
            {showRates && (
              <div className="learn-rate-menu">
                {PLAYBACK_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    className={`learn-rate-option ${r === rate ? "learn-rate-active" : ""}`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="learn-ctrl-btn"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
