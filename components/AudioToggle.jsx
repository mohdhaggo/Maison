"use client";

import { useEffect, useRef, useState } from "react";

// Drop an ElevenLabs-generated soundscape/voiceover at public/audio/ambience.mp3
// and this control appears automatically.
const TRACK = "/audio/ambience.mp3";

export default function AudioToggle() {
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const probe = document.createElement("audio");
    probe.oncanplaythrough = () => setAvailable(true);
    probe.onerror = () => setAvailable(false);
    probe.src = TRACK;
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = 0.5;
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  if (!available) return null;

  return (
    <>
      <audio ref={audioRef} src={TRACK} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute ambience" : "Play ambience"}
        className="absolute bottom-7 right-7 z-20 h-11 w-11 rounded-full glass-strong flex items-center justify-center text-gold hover:border-gold transition-colors pointer-events-auto"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="m22 9-6 6M16 9l6 6" />
          </svg>
        )}
      </button>
    </>
  );
}
