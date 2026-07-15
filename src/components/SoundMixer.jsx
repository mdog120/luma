import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, CloudRain, Flame, Users, Play, Pause } from 'lucide-react';

const TRACKS = [
  {
    id: 'lofi',
    name: 'Cozy Lo-Fi',
    icon: Music,
    url: '/audio/lofi.mp3',
    defaultVolume: 0.4
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: CloudRain,
    url: '/audio/rain.mp3',
    defaultVolume: 0.0 // starts silent
  },
  {
    id: 'cafe',
    name: 'Café Chatter',
    icon: Users,
    url: '/audio/cafe.mp3',
    defaultVolume: 0.0 // starts silent
  },
  {
    id: 'fire',
    name: 'Crackling Fire',
    icon: Flame,
    url: '/audio/fire.mp3',
    defaultVolume: 0.0 // starts silent
  }
];

export default function SoundMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [volumes, setVolumes] = useState(
    TRACKS.reduce((acc, track) => ({ ...acc, [track.id]: track.defaultVolume }), {})
  );

  const audioRefs = useRef({});
  const audioContextRef = useRef(null);
  const gainNodesRef = useRef({});

  useEffect(() => {
    // Create audio elements
    TRACKS.forEach(track => {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.volume = track.defaultVolume; // Initial baseline volume
      audioRefs.current[track.id] = audio;
    });

    return () => {
      // Clean up audio elements and contexts on unmount
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Initialize Web Audio API on user interaction (to bypass browser autoplay blocks)
  const initAudioContext = () => {
    if (audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      TRACKS.forEach(track => {
        const audio = audioRefs.current[track.id];
        if (audio) {
          // Route HTML5 Audio -> Web Audio source -> Gain Node -> Speakers
          const source = ctx.createMediaElementSource(audio);
          const gainNode = ctx.createGain();
          
          // Set volume multiplier up to 3.0x to amplify quiet audio loops
          gainNode.gain.value = volumes[track.id] * 3.0;
          
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          gainNodesRef.current[track.id] = gainNode;
          
          // Set element volume to max (gain node handles actual volume control)
          audio.volume = 1.0;
        }
      });
    } catch (e) {
      console.warn("Web Audio API not supported or failed to initialize, falling back to standard audio volume.", e);
    }
  };

  // Handle Play/Pause all
  const togglePlay = () => {
    initAudioContext();
    
    // Resume context if suspended by browser
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
      setIsPlaying(false);
    } else {
      Object.values(audioRefs.current).forEach(audio => {
        audio.play().catch(err => {
          console.warn("Audio play blocked by browser policy. Interaction required first.", err);
        });
      });
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (id, val) => {
    const vol = parseFloat(val);
    setVolumes(prev => ({ ...prev, [id]: vol }));
    
    initAudioContext();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Apply volume changes
    if (gainNodesRef.current[id]) {
      // Scale gain node volume up to 300%
      gainNodesRef.current[id].gain.value = vol * 3.0;
    } else if (audioRefs.current[id]) {
      // Fallback
      audioRefs.current[id].volume = vol;
    }
    
    // Auto play if turned up while master play is on
    if (isPlaying && audioRefs.current[id]) {
      audioRefs.current[id].play().catch(() => {});
    }
  };

  const isMuted = Object.values(volumes).every(v => v === 0);

  return (
    <div className={`sound-mixer-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="sound-mixer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Ambient Sounds Mixer"
      >
        {isMuted || !isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {isOpen && (
        <div className="sound-mixer-panel">
          <div className="mixer-header">
            <h3>Ambient Mixer</h3>
            <button 
              className={`mixer-play-btn ${isPlaying ? 'playing' : ''}`} 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause Ambient' : 'Play Ambient'}</span>
            </button>
          </div>

          <div className="mixer-tracks">
            {TRACKS.map(track => {
              const Icon = track.icon;
              const vol = volumes[track.id];
              return (
                <div key={track.id} className="mixer-track">
                  <div className="track-info">
                    <Icon size={16} className={`track-icon ${vol > 0 && isPlaying ? 'active' : ''}`} />
                    <span className="track-name">{track.name}</span>
                  </div>
                  <div className="track-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={vol}
                      onChange={(e) => handleVolumeChange(track.id, e.target.value)}
                      className="volume-slider"
                    />
                    <span className="volume-percentage">{Math.round(vol * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
