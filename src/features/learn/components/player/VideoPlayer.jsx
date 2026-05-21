import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings, RotateCcw, RotateCw } from "lucide-react";
import { useVideoPlayer } from "@/features/learn/hooks/useVideoPlayer";

// Format time utility helper for the video player
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
      className="group/player relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-[var(--shadow-elevated)]"
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full"
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Center play button when paused */}
      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-black/10 backdrop-blur-[1px] transition-opacity duration-200"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform duration-200 hover:scale-105 md:h-20 md:w-20">
            <Play size={28} fill="currentColor" />
          </span>
        </button>
      ) : null}

      {/* Lesson title overlay (top-left) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/55 to-transparent px-4 py-3 transition-opacity duration-200 sm:px-5 sm:py-4 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
          {lesson.courseTitle}
        </div>
        <div className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-white sm:text-[15px]">
          {lesson.title}
        </div>
      </div>

      {/* Controls bar */}
      <div
        className={`pointer-events-auto absolute inset-x-0 bottom-0 z-10 px-3 pb-3 transition-opacity duration-200 sm:px-5 sm:pb-4 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div className="mb-2 flex items-center gap-2">
          <span className="min-w-[36px] text-[11px] font-medium text-white/80">
            {formatTime(current)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={onSeek}
            aria-label="Seek"
            className="cn-scrubber h-1 w-full appearance-none rounded-full bg-white/25"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary) ${progress}%, transparent ${progress}%)`,
            }}
          />
          <span className="min-w-[36px] text-right text-[11px] font-medium text-white/80">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-black/45 px-2 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              type="button"
              onClick={() => seekBy(-10)}
              aria-label="Back 10 seconds"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={() => seekBy(10)}
              aria-label="Forward 10 seconds"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              <RotateCw size={14} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowRates((s) => !s)}
              aria-label="Playback speed"
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11.5px] font-semibold text-white hover:bg-white/15"
            >
              <Settings size={13} />
              {rate}x
            </button>
            {showRates ? (
              <div className="absolute bottom-9 right-10 z-20 grid w-28 grid-cols-1 gap-0.5 rounded-lg border border-white/10 bg-black/90 p-1 backdrop-blur-md">
                {PLAYBACK_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    className={`rounded-md px-2 py-1 text-left text-[12px] font-medium transition-colors hover:bg-white/15 ${
                      r === rate ? "text-primary" : "text-white"
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isFullscreen ? (
                <Minimize2 size={14} />
              ) : (
                <Maximize2 size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
