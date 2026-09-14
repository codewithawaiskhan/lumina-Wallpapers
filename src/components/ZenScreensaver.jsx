import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export const ZenScreensaver = ({
  wallpapers,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [intervalSec, setIntervalSec] = useState(8);

  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef([]);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Wallpaper cycle timer
  useEffect(() => {
    if (!isPlaying || !wallpapers.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
    }, intervalSec * 1000);
    return () => clearInterval(interval);
  }, [isPlaying, wallpapers, intervalSec]);

  // Ambient Web Audio Synthesizer for Zen atmosphere
  const toggleAudio = () => {
    if (isMuted) {
      startAmbientAudio();
      setIsMuted(false);
    } else {
      stopAmbientAudio();
      setIsMuted(true);
    }
  };

  const startAmbientAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create warm ambient chord drone
      const freqs = [130.81, 196.00, 261.63, 329.63]; // C minor / major warm pad
      const nodes = [];

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        nodes.push(osc);
      });

      synthNodesRef.current = nodes;
    } catch (e) {
      console.warn('Web Audio playback failed', e);
    }
  };

  const stopAmbientAudio = () => {
    if (synthNodesRef.current) {
      synthNodesRef.current.forEach((n) => {
        try { n.stop(); } catch(e){}
      });
      synthNodesRef.current = [];
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientAudio();
    };
  }, []);

  if (!wallpapers.length) return null;

  const currentWp = wallpapers[currentIndex];
  const bgImg = currentWp.src.original || currentWp.src.large2x || currentWp.src.large;

  const formatHoursMinutes = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="zen-fullscreen-overlay">
      {/* Cinematic Background Image with Ken Burns animation */}
      <img
        key={currentWp.id}
        src={bgImg}
        alt={currentWp.title}
        className="zen-bg-image"
      />

      {/* Zen UI Overlay */}
      <div className="zen-ui-layer">
        {/* Top Bar: Title & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="glass-pill" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <Sparkles size={14} color="#38bdf8" />
              <span>Zen Screensaver Mode</span>
            </span>
            <span style={{ fontSize: '0.88rem', color: '#e2e8f0', textShadow: '0 2px 8px #000' }}>
              {currentWp.title} • Photo by {currentWp.photographer}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Audio Toggle */}
            <button
              className="btn-icon"
              onClick={toggleAudio}
              title={isMuted ? "Enable Zen Ambient Soundscape" : "Mute Soundscape"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="#10b981" />}
            </button>

            {/* Close */}
            <button
              className="btn-icon"
              onClick={onClose}
              title="Exit Zen Mode (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Center Minimalist Clock */}
        <div style={{ textAlign: 'center' }}>
          <div className="zen-clock">{formatHoursMinutes(currentTime)}</div>
          <div className="zen-date">{formatFullDate(currentTime)}</div>
        </div>

        {/* Bottom Slideshow Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-icon"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + wallpapers.length) % wallpapers.length)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="btn-icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              className="btn-icon"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % wallpapers.length)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Timing Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Cycle Speed:</span>
            {[5, 8, 15, 30].map((sec) => (
              <button
                key={sec}
                className="glass-pill"
                onClick={() => setIntervalSec(sec)}
                style={{
                  padding: '3px 9px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  background: intervalSec === sec ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                  border: 'none',
                  color: '#fff'
                }}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
