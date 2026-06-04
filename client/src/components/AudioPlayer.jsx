// src/components/AudioPlayer.jsx
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Download } from "lucide-react";

export default function AudioPlayer({ src, title, onPlay, onDownload }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (onPlay) onPlay();
    }
    setPlaying(!playing);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div
      style={{
        background: "var(--navy)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={togglePlay}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--gold)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        {playing ? (
          <Pause size={18} color="var(--navy)" />
        ) : (
          <Play size={18} color="var(--navy)" />
        )}
      </button>

      <div style={{ flex: 1 }}>
        {title && (
          <p
            style={{
              fontSize: 12,
              color: "rgba(248,245,239,0.7)",
              marginBottom: 6,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </p>
        )}
        <div
          onClick={seek}
          style={{
            height: 4,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "var(--gold)",
              borderRadius: 2,
              transition: "width 0.1s",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(248,245,239,0.5)" }}>
            {fmt(current)}
          </span>
          <span style={{ fontSize: 11, color: "rgba(248,245,239,0.5)" }}>
            {fmt(duration)}
          </span>
        </div>
      </div>

      {onDownload && (
        <button
          onClick={onDownload}
          style={{
            background: "none",
            border: "none",
            color: "rgba(248,245,239,0.5)",
            cursor: "pointer",
            padding: 4,
          }}
          title="Download sermon"
        >
          <Download size={16} />
        </button>
      )}
    </div>
  );
}
