// Persona 3 Reload Styled Web Audio Synthesizer
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
}

export function setSoundEnabled(val) {
  soundEnabled = val;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sound_enabled', String(val));
  }
}

// =========================================================================
// Persona 3 Lo-Fi Background Music Controller (Iwatodai Dorm Lo-Fi)
// =========================================================================
let bgmAudio = null;
let bgmMuted = false;

export function initBgm() {
  if (typeof window === 'undefined') return null;
  if (!bgmAudio) {
    // Resilient path resolution across Vercel, Netlify, Render, GitHub Pages, or custom domains
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
      ? import.meta.env.BASE_URL
      : './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    
    let primarySrc;
    try {
      primarySrc = new URL(`${cleanBase}assets/p3_lofi_bgm.mp3`, window.location.href).href;
    } catch (e) {
      primarySrc = `${cleanBase}assets/p3_lofi_bgm.mp3`;
    }

    bgmAudio = new Audio();
    bgmAudio.src = primarySrc;
    bgmAudio.loop = true;
    bgmAudio.volume = 0.35; // comfortable, relaxing lo-fi background volume
    bgmAudio.preload = 'auto';
    bgmAudio.setAttribute('playsinline', 'true');
    bgmAudio.setAttribute('webkit-playsinline', 'true');

    // Secondary fallback for sub-route reloads or alternate CDN asset roots
    bgmAudio.addEventListener('error', () => {
      const fallbackSrc = '/assets/p3_lofi_bgm.mp3';
      if (bgmAudio && bgmAudio.src && !bgmAudio.src.endsWith(fallbackSrc)) {
        bgmAudio.src = fallbackSrc;
        try {
          bgmAudio.load();
          if (!bgmMuted) bgmAudio.play().catch(() => {});
        } catch (e) {}
      }
    });

    const saved = localStorage.getItem('p3_bgm_muted');
    if (saved !== null) {
      bgmMuted = saved === 'true';
    }
    bgmAudio.muted = bgmMuted;

    try {
      bgmAudio.load();
    } catch (e) {}
  }
  return bgmAudio;
}

export function playBgm() {
  const audio = initBgm();
  if (!audio) return Promise.resolve();

  // If user explicitly muted in SYSTEM settings, respect preference
  if (bgmMuted) return Promise.resolve();

  // Make sure Web Audio context is also resumed for sound effects
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch (e) {}

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    return playPromise.catch((err) => {
      // Browser autoplay policy blocked. Gesture listener will retry on user tap
      return Promise.reject(err);
    });
  }
  return Promise.resolve();
}

export function pauseBgm() {
  if (bgmAudio) {
    bgmAudio.pause();
  }
}

export function isBgmMuted() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('p3_bgm_muted');
    if (saved !== null) {
      return saved === 'true';
    }
  }
  return bgmMuted;
}

export function toggleBgmMute() {
  const audio = initBgm();
  bgmMuted = !bgmMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('p3_bgm_muted', String(bgmMuted));
  }
  if (audio) {
    audio.muted = bgmMuted;
    if (!bgmMuted) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }
  return bgmMuted;
}

// Persona 3 Menu Navigation Laser Chirp
export function playPop() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

// Persona 3 Revolver Cylinder Click / Tactical Select
export function playBoop() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Fast mechanical double click
    [0, 0.03].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now + offset);
      osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.03);

      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.03);
    });
  } catch (e) {}
}

// Persona 3 Confirm / Sector Engage Chime
export function playChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [659.25, 880, 1174.66, 1318.51]; // E5, A5, D6, E6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  } catch (e) {}
}

// Critical Strike Impact
export function playCriticalHit() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Heavy low punch
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    subGain.gain.setValueAtTime(0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.25);

    // High slash overtone
    const slashOsc = ctx.createOscillator();
    const slashGain = ctx.createGain();
    slashOsc.type = 'sawtooth';
    slashOsc.frequency.setValueAtTime(1200, now);
    slashOsc.frequency.exponentialRampToValueAtTime(280, now + 0.15);
    slashGain.gain.setValueAtTime(0.18, now);
    slashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    slashOsc.connect(slashGain);
    slashGain.connect(ctx.destination);
    slashOsc.start(now);
    slashOsc.stop(now + 0.15);
  } catch (e) {}
}

// ONE MORE! / Extra Turn Jingle
export function playOneMore() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (e) {}
}

// ALL-OUT ATTACK Finisher Fanfare
export function playAllOutAttack() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Boom impact
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.6);
    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.6);

    // Dynamic triumphant brass chords
    const fanNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    fanNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + 0.1 + idx * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.45);
    });
  } catch (e) {}
}

export function playCelebrate() {
  playAllOutAttack();
}
