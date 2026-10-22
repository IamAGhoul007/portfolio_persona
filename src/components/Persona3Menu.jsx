import React, { useState, useEffect, useRef } from 'react';
import { RESUME_DATA } from '../data/resumeData';
import {
  playPop,
  playBoop,
  playChime,
  playOneMore,
  playBgm,
  isBgmMuted,
  toggleBgmMute,
  resumeAudioContext
} from '../utils/audio';
import { ProjectModal } from './ProjectModal';
import { TicTacToeModal } from './TicTacToeModal';
import { ContactModal } from './ContactModal';
import { GithubIcon, LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';
import {
  Zap,
  Cpu,
  Activity,
  Award,
  GraduationCap,
  Users,
  Settings,
  Gamepad2,
  Mail,
  Play,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX,
  Star,
  Building2,
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

// Calculate astronomical lunar phase for Persona 3 Moon Phase HUD
function getMoonPhase() {
  const now = new Date();
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const cycleDays = 29.53058770576;
  const diffDays = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % cycleDays) + cycleDays) % cycleDays;
  const phaseIndex = Math.floor((phase / cycleDays) * 8);

  const phases = [
    { name: 'NEW MOON', icon: '🌑', phaseNum: '0/8' },
    { name: 'WAXING CRESCENT', icon: '🌒', phaseNum: '2/8' },
    { name: 'FIRST QUARTER', icon: '🌓', phaseNum: '4/8' },
    { name: 'WAXING GIBBOUS', icon: '🌔', phaseNum: '6/8' },
    { name: 'FULL MOON', icon: '🌕', phaseNum: '8/8' },
    { name: 'WANING GIBBOUS', icon: '🌖', phaseNum: '6/8' },
    { name: 'LAST QUARTER', icon: '🌗', phaseNum: '4/8' },
    { name: 'WANING CRESCENT', icon: '🌘', phaseNum: '2/8' },
  ];
  return phases[phaseIndex % 8];
}

export function Persona3Menu() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [activeSimulatorProject, setActiveSimulatorProject] = useState(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confettiClicks, setConfettiClicks] = useState(0);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [bgmMuted, setBgmMuted] = useState(() => isBgmMuted());
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  // Real-time Persona 3 Calendar Date, Time & Dark Hour Detection
  const [clockTime, setClockTime] = useState(() => {
    const d = new Date();
    return {
      date: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
      day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()],
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isDarkHour: d.getHours() === 0,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setClockTime({
        date: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
        day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()],
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        isDarkHour: d.getHours() === 0,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const moonPhase = getMoonPhase();

  // Mobile Handheld Haptic feedback (12ms subtle pulse)
  const triggerHaptic = (ms = 12) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch (e) {}
  };

  // Background Lo-Fi music initialization with instantaneous cross-platform gesture unlocking
  useEffect(() => {
    let isStarted = false;

    const unlockAudio = () => {
      if (isStarted) return;
      resumeAudioContext();
      playBgm()
        .then(() => {
          isStarted = true;
          setIsAudioUnlocked(true);
          cleanup();
        })
        .catch(() => {
          // Play was blocked by browser autoplay policy; will retry on first touch/pointerdown/click
        });
    };

    const events = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click', 'touchend', 'wheel'];

    const cleanup = () => {
      events.forEach((event) => {
        window.removeEventListener(event, unlockAudio, { capture: true });
        document.removeEventListener(event, unlockAudio, { capture: true });
      });
    };

    // Attempt immediately (works on desktop if user previously visited domain or autoplay is allowed)
    unlockAudio();

    // Listen on earliest touch/pointer down on document & window with capture phase
    events.forEach((event) => {
      window.addEventListener(event, unlockAudio, { capture: true, passive: true });
      document.addEventListener(event, unlockAudio, { capture: true, passive: true });
    });

    return () => {
      cleanup();
    };
  }, []);

  const handleToggleBgm = () => {
    playPop();
    triggerHaptic(15);
    resumeAudioContext();
    const newMuted = toggleBgmMute();
    setBgmMuted(newMuted);
    if (!newMuted) {
      setIsAudioUnlocked(true);
    }
  };

  // Player Level & EXP system (resets to Level 0 and 0 XP on every page reload)
  const [level, setLevel] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);

  useEffect(() => {
    try {
      localStorage.removeItem('p3_player_level');
      localStorage.removeItem('p3_player_xp');
    } catch (e) {}
  }, []);

  const [levelUpToast, setLevelUpToast] = useState(null);

  // XP scaling formula: Level 0: 100 XP, Level 1: 200 XP, Level 2: 300 XP, etc.
  const getXpForLevel = (lvl) => {
    return 100 + lvl * 100;
  };

  // HP dynamically scales from 50 (Lv 0) to 850 (Lv 99)
  const getHpForLevel = (lvl) => {
    if (lvl >= 99) return 850;
    return Math.round(50 + (lvl / 99) * 800);
  };

  // SP dynamically scales from 20 (Lv 0) to 320 (Lv 99)
  const getSpForLevel = (lvl) => {
    if (lvl >= 99) return 320;
    return Math.round(20 + (lvl / 99) * 300);
  };

  const addXp = (amount = 100) => {
    if (level >= 99) return;
    triggerHaptic(20);

    let newXp = currentXp + amount;
    let newLevel = level;
    let leveledUp = false;

    while (newLevel < 99 && newXp >= getXpForLevel(newLevel)) {
      newXp -= getXpForLevel(newLevel);
      newLevel += 1;
      leveledUp = true;
    }

    if (newLevel >= 99) {
      newLevel = 99;
      newXp = 0;
    }

    setLevel(newLevel);
    setCurrentXp(newXp);

    if (leveledUp) {
      playOneMore();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.25, x: 0.2 },
          colors: ['#00D2FF', '#FFE600', '#FF1E44', '#FFFFFF'],
        });
      } catch (e) {}
      setLevelUpToast(`LEVEL UP! LV ${newLevel}`);
      setTimeout(() => setLevelUpToast(null), 2500);
    }
  };

  const baseMenuItems = [
    { id: 'HOME', label: 'HOME', desc: 'Operative Intro & Mission Brief', color: '#00D2FF' },
    { id: 'SKILL', label: 'SKILL', desc: 'Technical Stack & Masteries', color: '#FF1E44' },
    { id: 'PERSONA', label: 'PERSONA', desc: 'Projects & Production Agents', color: '#00D2FF' },
    { id: 'STATS', label: 'STATS', desc: 'Career History & Deployment', color: '#00E5FF' },
    { id: 'EQUIP', label: 'EQUIP', desc: 'Verified Arcana Certifications', color: '#FFE600' },
    { id: 'CALENDAR', label: 'CALENDAR', desc: 'Education & Academic Standing', color: '#38BDF8' },
    { id: 'COMMU', label: 'COMMU', desc: 'Social Links & Contact Channels', color: '#A855F7' },
    { id: 'SYSTEM', label: 'SYSTEM', desc: 'Audio & System Settings', color: '#10B981' },
  ];

  // The [SECRET] tab only appears below SYSTEM once unlocked via 20 clicks on the Celebrate button in SYSTEM
  const menuItems = isSecretUnlocked
    ? [
        ...baseMenuItems,
        { id: 'SECRET', label: '[SECRET]', desc: 'Secret Tic-Tac-Toe Minigame', color: '#FFE600' },
      ]
    : baseMenuItems;

  const menuColRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleSelectTab = (tabId) => {
    triggerHaptic(12);
    // User interacted with tab: ensure audio plays if not muted
    playBgm().catch(() => {});
    if (tabId === 'SECRET') {
      playOneMore();
      setIsGameOpen(true);
      return;
    }
    playPop();
    setActiveTab(tabId);
  };

  const goToNextTab = () => {
    const currentIndex = menuItems.findIndex((m) => m.id === activeTab);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    handleSelectTab(menuItems[nextIndex].id);
  };

  const goToPrevTab = () => {
    const currentIndex = menuItems.findIndex((m) => m.id === activeTab);
    const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    handleSelectTab(menuItems[prevIndex].id);
  };

  // Auto-scroll active tab into view in the horizontal mobile ribbon
  useEffect(() => {
    if (menuColRef.current) {
      const activeBtn = menuColRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeTab]);

  // Mobile horizontal swipe gestures to switch between tactical panels
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe with higher horizontal than vertical delta & 45px threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.25 && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Swiped Left (finger dragged right-to-left) -> GO TO NEXT PANEL
        goToNextTab();
      } else {
        // Swiped Right (finger dragged left-to-right) -> GO TO PREV PANEL
        goToPrevTab();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard JRPG Console Controller Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (activeSimulatorProject) {
          playPop();
          setActiveSimulatorProject(null);
        } else if (isGameOpen) {
          playPop();
          setIsGameOpen(false);
        } else if (isContactOpen) {
          playPop();
          setIsContactOpen(false);
        }
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        handleToggleBgm();
        return;
      }

      // Quick 1-8 numeric tab jumping
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= menuItems.length) {
        e.preventDefault();
        handleSelectTab(menuItems[num - 1].id);
        return;
      }

      // ArrowUp or W: Navigate up the menu
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        playBoop();
        const currentIndex = menuItems.findIndex((m) => m.id === activeTab);
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        handleSelectTab(menuItems[prevIndex].id);
      }

      // ArrowDown or S: Navigate down the menu
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        playBoop();
        const currentIndex = menuItems.findIndex((m) => m.id === activeTab);
        const nextIndex = (currentIndex + 1) % menuItems.length;
        handleSelectTab(menuItems[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, menuItems, activeSimulatorProject, isGameOpen, isContactOpen]);

  const handleCelebrate = () => {
    playChime();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#00D2FF', '#FF1E44', '#FFE600', '#FFFFFF', '#004CE8'],
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setConfettiClicks((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 20 && !isSecretUnlocked) {
        setIsSecretUnlocked(true);
        playOneMore();
        try {
          confetti({
            particleCount: 260,
            spread: 140,
            origin: { y: 0.4 },
            colors: ['#FFE600', '#FF1E44', '#00D2FF', '#FFFFFF', '#39FF14'],
          });
        } catch (e) {}
      }
      return nextCount;
    });
  };

  return (
    <div
      className="p3-menu-wrapper"
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        overflowX: 'hidden',
      }}
    >
      {/* =================================================================
          TOP HUD BAR: Player Status & XP Bar (Top-Left)
          ================================================================= */}
      <div
        className="p3-top-hud"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Top-Left: Persona 3 Operative HUD Card with Level & XP Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
            background: 'rgba(5, 12, 34, 0.92)',
            border: '2px solid var(--p3-cyan)',
            boxShadow: '4px 4px 0px #000, 0 0 20px rgba(0, 210, 255, 0.35)',
            padding: '0.45rem 1rem',
            transform: 'skewX(-8deg)',
            position: 'relative',
          }}
          className="p3-party-hud"
        >
          {/* Avatar Thumbnail */}
          <div
            style={{
              width: '38px',
              height: '38px',
              border: '1.5px solid var(--p3-cyan)',
              overflow: 'hidden',
              background: '#000',
              transform: 'skewX(8deg)',
              flexShrink: 0,
            }}
          >
            <img
              src="./assets/p3_hero_avatar.jpg"
              alt="Aman"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ transform: 'skewX(8deg)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.35rem', color: '#FFF', lineHeight: 1, fontWeight: 800 }}>
                AMAN MATHUR
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-p3-display)',
                  color: level >= 99 ? 'var(--p3-gold)' : 'var(--p3-cyan)',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                }}
              >
                LV {level}
              </span>
              {levelUpToast && (
                <span
                  style={{
                    background: 'var(--p3-gold)',
                    color: '#000',
                    fontFamily: 'var(--font-p3-display)',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    padding: '0.1rem 0.4rem',
                    boxShadow: '2px 2px 0 #000',
                    animation: 'pulse 1s infinite',
                  }}
                >
                  {levelUpToast}
                </span>
              )}
            </div>

            {/* HP and SP meters */}
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.78rem', fontFamily: 'var(--font-p3-mono)', margin: '0.15rem 0' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>
                HP {getHpForLevel(level)}/{getHpForLevel(level)}
              </span>
              <span style={{ color: 'var(--p3-cyan)', fontWeight: 700 }}>
                SP {getSpForLevel(level)}/{getSpForLevel(level)}
              </span>
            </div>

            {/* EXP Progress Bar */}
            <div style={{ minWidth: '170px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-p3-mono)', color: '#94A3B8', marginBottom: '2px' }}>
                <span style={{ color: 'var(--p3-gold)', fontWeight: 700 }}>EXP</span>
                <span>
                  {level >= 99 ? 'MAX LEVEL' : `${currentXp} / ${getXpForLevel(level)} XP`}
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#000', border: '1px solid #1E293B', overflow: 'hidden' }}>
                <div
                  style={{
                    width: level >= 99 ? '100%' : `${Math.min(100, (currentXp / getXpForLevel(level)) * 100)}%`,
                    height: '100%',
                    background: level >= 99 ? 'var(--p3-gold)' : 'linear-gradient(90deg, #0066FF, #00D2FF)',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right: Persona 3 Real-Time Clock & Lunar Phase HUD */}
        <div
          className="p3-clock-hud"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: clockTime.isDarkHour ? 'rgba(20, 35, 10, 0.95)' : 'rgba(5, 12, 34, 0.92)',
            border: clockTime.isDarkHour ? '2px solid var(--p3-dark-hour-green)' : '2px solid var(--p3-cyan)',
            boxShadow: clockTime.isDarkHour
              ? '4px 4px 0px #000, 0 0 25px rgba(57, 255, 20, 0.4)'
              : '4px 4px 0px #000, 0 0 20px rgba(0, 210, 255, 0.3)',
            padding: '0.4rem 0.9rem',
            transform: 'skewX(-8deg)',
            fontFamily: 'var(--font-p3-mono)',
          }}
        >
          <div style={{ transform: 'skewX(8deg)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Date & Day Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  background: clockTime.isDarkHour ? 'var(--p3-dark-hour-green)' : 'var(--p3-crimson)',
                  color: clockTime.isDarkHour ? '#000' : '#FFF',
                  fontFamily: 'var(--font-p3-display)',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  padding: '0.05rem 0.45rem',
                  lineHeight: 1,
                  boxShadow: '2px 2px 0px #000',
                }}
              >
                {clockTime.date}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-p3-display)',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: clockTime.isDarkHour ? 'var(--p3-dark-hour-green)' : 'var(--p3-cyan)',
                  lineHeight: 1,
                }}
              >
                {clockTime.day}
              </span>
            </div>

            {/* Live Clock / Dark Hour tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-p3-display)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: clockTime.isDarkHour ? 'var(--p3-dark-hour-green)' : '#FFFFFF',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}
              >
                {clockTime.time}
              </span>
              {clockTime.isDarkHour && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--p3-dark-hour-green)',
                    fontWeight: 800,
                    animation: 'pulse 1s infinite',
                  }}
                >
                  DARK HOUR
                </span>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'rgba(0, 210, 255, 0.35)' }} />

            {/* Lunar Phase */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              title={`Astronomical Phase: ${moonPhase.name} (${moonPhase.phaseNum})`}
            >
              <span style={{ fontSize: '1.15rem', lineHeight: 1 }} role="img" aria-label={moonPhase.name}>
                {moonPhase.icon}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-p3-display)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: 'var(--p3-gold)',
                    lineHeight: 1,
                  }}
                >
                  {moonPhase.phaseNum}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: '#94A3B8',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {moonPhase.name}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'rgba(0, 210, 255, 0.35)' }} />

            {/* Quick BGM Sound HUD Toggle */}
            <button
              onClick={handleToggleBgm}
              className="p3-hud-sound-pill"
              style={{
                background: bgmMuted ? 'rgba(255, 30, 68, 0.25)' : 'rgba(0, 210, 255, 0.2)',
                border: bgmMuted ? '1px solid var(--p3-crimson)' : '1px solid var(--p3-cyan)',
                color: bgmMuted ? 'var(--p3-crimson)' : 'var(--p3-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-p3-tech)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
              title={bgmMuted ? "Unmute BGM (Persona 3 Lo-Fi)" : "Mute BGM"}
              aria-label={bgmMuted ? "Unmute BGM" : "Mute BGM"}
            >
              {bgmMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{bgmMuted ? 'BGM OFF' : 'BGM ON'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standby Audio Notification Banner (Disappears automatically as soon as user touches/clicks anywhere) */}
      {!isAudioUnlocked && !bgmMuted && (
        <div
          onClick={handleToggleBgm}
          style={{
            cursor: 'pointer',
            background: 'linear-gradient(90deg, rgba(0, 76, 232, 0.9), rgba(0, 210, 255, 0.9))',
            color: '#FFF',
            border: '2px solid #FFF',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.5), 4px 4px 0 #000',
            padding: '0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-p3-display)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '0.65rem',
            animation: 'pulse 1.8s infinite',
            zIndex: 20,
            transform: 'skewX(-4deg)',
          }}
        >
          <div style={{ transform: 'skewX(4deg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={16} />
            <span>[ PERSONA 3 AUDIO STANDBY ] // TAP ANYWHERE TO START BGM</span>
          </div>
        </div>
      )}

      {/* =================================================================
          MAIN CONTENT AREA:
          Left: Upside-Down Floating Protagonist
          Center: Persona 3 Slanted Menu Column
          Right: Dynamic Slide-In Submenu Content Panel
          ================================================================= */}
      <div
        className="p3-main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(230px, 270px) minmax(210px, 240px) minmax(360px, 1fr)',
          gap: '1.8rem',
          alignItems: 'start',
          flex: 1,
          margin: '1rem 0',
          zIndex: 5,
        }}
      >
        {/* Column 1: Upside-down Protagonist Frame (Exact recreation from user video & image) */}
        <div className="p3-protagonist-col" style={{ position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '3px solid var(--p3-cyan)',
              boxShadow: '6px 6px 0px #000, 0 0 35px var(--p3-cyan-glow)',
              transform: 'skewX(-4deg)',
              background: '#040B22',
            }}
            className="p3-protagonist-frame"
          >
            <img
              src="./assets/p3_reload_protagonist.jpg"
              alt="Persona 3 Reload Protagonist Floating Upside Down"
              className="p3-protagonist-img"
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '3/4',
                objectFit: 'cover',
                display: 'block',
                filter: 'contrast(1.08) brightness(1.02)',
              }}
            />
            {/* Overlay label */}
            <div
              className="p3-protagonist-label"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.82)',
                border: '1px solid var(--p3-cyan)',
                padding: '0.3rem 0.6rem',
                fontFamily: 'var(--font-p3-mono)',
                fontSize: '0.75rem',
                color: 'var(--p3-cyan)',
                letterSpacing: '0.08em',
                textAlign: 'center',
              }}
            >
              SINKING INTO THE HEART // AMAN
            </div>
          </div>
        </div>

        {/* Column 2: Persona 3 Slanted Menu Navigation Strip */}
        <div className="p3-menu-nav-wrapper">
          {/* Mobile Prev Tab Arrow */}
          <button
            type="button"
            className="p3-mobile-nav-arrow p3-mobile-prev"
            onClick={goToPrevTab}
            aria-label="Previous Tactical Panel"
          >
            ◀
          </button>

          <div
            ref={menuColRef}
            className="p3-menu-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              position: 'relative',
            }}
          >
            {menuItems.map((item, idx) => {
              const isActive = activeTab === item.id;

              return (
                <div
                  key={item.id}
                  data-tab={item.id}
                  className="p3-menu-item"
                  onClick={() => handleSelectTab(item.id)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isActive ? 'translateX(18px) scale(1.04)' : 'translateX(0)',
                  }}
                  onMouseEnter={() => playBoop()}
                >
                  {/* Menu Option Cutout Banner */}
                  <div
                    className="p3-menu-banner"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: isActive ? '0.35rem 1.6rem 0.35rem 1.4rem' : '0.25rem 1.2rem',
                      background: isActive
                        ? item.color === '#FF1E44'
                          ? 'linear-gradient(90deg, #FF1E44 0%, #FF4565 100%)'
                          : 'linear-gradient(90deg, #00D2FF 0%, #0066FF 100%)'
                        : 'rgba(5, 12, 34, 0.65)',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      border: isActive ? '2px solid #FFFFFF' : '1.5px solid var(--p3-border)',
                      boxShadow: isActive ? '5px 5px 0px #000, 0 0 25px rgba(0, 210, 255, 0.5)' : '2px 2px 0px #000',
                      transform: 'skewX(-14deg)',
                      minWidth: '200px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        transform: 'skewX(14deg)',
                        fontFamily: 'var(--font-p3-display)',
                        fontSize: isActive ? '2.1rem' : '1.7rem',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        lineHeight: 1,
                        textShadow: isActive ? '2px 2px 0px #000' : 'none',
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        className="p3-active-tag"
                        style={{
                          transform: 'skewX(14deg)',
                          fontFamily: 'var(--font-p3-mono)',
                          fontSize: '0.75rem',
                          background: '#000000',
                          color: '#FFFFFF',
                          padding: '0.1rem 0.4rem',
                          fontWeight: 700,
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Next Tab Arrow */}
          <button
            type="button"
            className="p3-mobile-nav-arrow p3-mobile-next"
            onClick={goToNextTab}
            aria-label="Next Tactical Panel"
          >
            ▶
          </button>
        </div>

        {/* Mobile Swipe / Panel Status Bar */}
        <div className="p3-mobile-swipe-hint">
          <span>◀ SWIPE PANELS // {activeTab} [{menuItems.findIndex((m) => m.id === activeTab) + 1}/{menuItems.length}] ▶</span>
        </div>

        {/* Right Column: Active Persona 3 Submenu Screen (Sliding In) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            background: 'rgba(4, 9, 28, 0.92)',
            border: '3px solid var(--p3-cyan)',
            boxShadow: '8px 8px 0px #000, 0 0 45px rgba(0, 210, 255, 0.35)',
            padding: '2rem',
            position: 'relative',
            maxHeight: '82vh',
            overflowY: 'auto',
            transform: 'skewX(-2deg)',
            backdropFilter: 'blur(16px)',
          }}
          className="p3-submenu-container"
        >
          <div style={{ transform: 'skewX(2deg)' }}>
            {/* SUBMENU: HOME (Welcome & Introduction) */}
            {activeTab === 'HOME' && (
              <HomePanel
                data={RESUME_DATA}
                onSelectTab={handleSelectTab}
                onOpenContactModal={() => setIsContactOpen(true)}
              />
            )}

            {/* SUBMENU: SKILL */}
            {activeTab === 'SKILL' && (
              <SkillPanel
                categories={RESUME_DATA.skillsData}
                selectedCategory={selectedSkillCategory}
                onSelectCategory={setSelectedSkillCategory}
                onAddXp={addXp}
              />
            )}

            {/* SUBMENU: PERSONA (Projects) */}
            {activeTab === 'PERSONA' && (
              <PersonaPanel
                projects={RESUME_DATA.projects}
                onOpenSimulator={(p) => setActiveSimulatorProject(p)}
              />
            )}

            {/* SUBMENU: STATS (Experience) */}
            {activeTab === 'STATS' && (
              <StatsPanel experiences={RESUME_DATA.experiences} />
            )}

            {/* SUBMENU: EQUIP (Certifications) */}
            {activeTab === 'EQUIP' && (
              <EquipPanel certifications={RESUME_DATA.certifications} />
            )}

            {/* SUBMENU: CALENDAR (Education) */}
            {activeTab === 'CALENDAR' && (
              <CalendarPanel education={RESUME_DATA.education} />
            )}

            {/* SUBMENU: COMMU (Contact & Socials) */}
            {activeTab === 'COMMU' && (
              <CommuPanel
                data={RESUME_DATA}
                onOpenContactModal={() => setIsContactOpen(true)}
              />
            )}

            {/* SUBMENU: SYSTEM (Audio & System Controls) */}
            {activeTab === 'SYSTEM' && (
              <SystemPanel
                onCelebrate={handleCelebrate}
                confettiClicks={confettiClicks}
                isSecretUnlocked={isSecretUnlocked}
                bgmMuted={bgmMuted}
                onToggleBgm={handleToggleBgm}
              />
            )}
          </div>
        </div>
      </div>

      {/* =================================================================
          BOTTOM COMMAND HELPER (Exact Persona 3 Reload Button Guide)
          ================================================================= */}
      <div
        className="p3-bottom-hud"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.8rem',
          borderTop: '2px solid rgba(0, 210, 255, 0.3)',
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: 'var(--font-p3-tech)', color: '#94A3B8', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--p3-cyan)', fontWeight: 800 }}>OPERATIVE AMAN MATHUR</span> // SOFTWARE DEVELOPMENT ENGINEER @ PRODAPT
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            fontFamily: 'var(--font-p3-display)',
            fontSize: '1.2rem',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            flexWrap: 'wrap',
          }}
        >
          <span className="p3-keyboard-hints" style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)', marginRight: '0.4rem' }}>
            <span style={{ color: 'var(--p3-gold)' }}>[W/S/↑/↓]</span> SELECT &middot; <span style={{ color: 'var(--p3-gold)' }}>[1-8]</span> JUMP &middot; <span style={{ color: 'var(--p3-gold)' }}>[M]</span> MUTE
          </span>
          <span>
            <span style={{ color: 'var(--p3-cyan)' }}>Ⓐ</span> CONFIRM
          </span>
          <span>
            <span style={{ color: '#FF1E44' }}>Ⓑ</span> CLOSE
          </span>
        </div>
      </div>

      {/* Dynamic Modals */}
      {activeSimulatorProject && (
        <ProjectModal
          project={activeSimulatorProject}
          onClose={() => setActiveSimulatorProject(null)}
        />
      )}

      {isGameOpen && (
        <TicTacToeModal
          isOpen={isGameOpen}
          onClose={() => setIsGameOpen(false)}
        />
      )}

      {isContactOpen && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 0: HOME (General Introduction, Welcome & Mission Brief)
// -------------------------------------------------------------
function HomePanel({ data, onSelectTab, onOpenContactModal }) {
  return (
    <div>
      {/* Banner Header */}
      <div style={{ marginBottom: '1.4rem' }}>
        <div
          className="p3-banner-title"
          style={{
            fontSize: '1.2rem',
            padding: '0.15rem 0.8rem',
            background: 'var(--p3-cyan)',
            color: '#000',
            fontWeight: 900,
          }}
        >
          <span>MISSION DECK // S.E.E.S. ARCHIVE ENTRANCE</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', color: '#FFF', lineHeight: 1.05, marginTop: '0.35rem' }}>
          WELCOME, OPERATIVE
        </h2>
        <div style={{ fontFamily: 'var(--font-p3-tech)', color: 'var(--p3-cyan)', fontSize: '1.05rem', marginTop: '0.25rem', letterSpacing: '0.04em' }}>
          AMAN MATHUR // AI ARCHITECT &amp; SOFTWARE DEVELOPMENT ENGINEER
        </div>
      </div>

      {/* Welcoming Message & General Resume Intro */}
      <div
        style={{
          background: 'rgba(5, 14, 42, 0.85)',
          borderLeft: '4px solid var(--p3-cyan)',
          borderTop: '1px solid var(--p3-border)',
          borderRight: '1px solid var(--p3-border)',
          borderBottom: '1px solid var(--p3-border)',
          padding: '1.4rem 1.6rem',
          marginBottom: '1.4rem',
        }}
      >
        <p style={{ fontSize: '1.05rem', color: '#F1F5F9', lineHeight: 1.6, marginBottom: '0.8rem' }}>
          <strong style={{ color: 'var(--p3-cyan)' }}>Thank you for visiting my tactical portfolio archive!</strong> I am thrilled to welcome you to my digital command center. As a <strong style={{ color: '#FFF' }}>Software Development Engineer at Prodapt</strong> and Computer Science graduate from <strong style={{ color: '#FFF' }}>SRM Institute of Science &amp; Technology</strong> (9.7 / 10 CGPA), I architect production-grade AI systems, LangGraph-orchestrated multi-agent autonomous workflows, and high-throughput real-time distributed data pipelines.
        </p>
        <p style={{ fontSize: '0.96rem', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
          Feel free to navigate through my technical arsenal in <strong>SKILL</strong>, test live simulation benches in <strong>PERSONA</strong>, inspect career history at Prodapt in <strong>STATS</strong>, and review verified credentials in <strong>EQUIP</strong>.
        </p>
      </div>

      {/* Subtle Secret Hint Box */}
      <div
        style={{
          background: 'rgba(255, 230, 0, 0.07)',
          border: '1.5px dashed rgba(255, 230, 0, 0.65)',
          boxShadow: '0 0 25px rgba(255, 230, 0, 0.12)',
          padding: '1.1rem 1.4rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              background: 'var(--p3-gold)',
              color: '#000',
              fontFamily: 'var(--font-p3-display)',
              fontSize: '0.85rem',
              fontWeight: 900,
              padding: '0.1rem 0.5rem',
              transform: 'skewX(-8deg)',
            }}
          >
            CLASSIFIED TRANSMISSION
          </span>
          <span style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.78rem', color: 'var(--p3-gold)' }}>
            // DARK HOUR FREQUENCY
          </span>
        </div>
        <p style={{ fontSize: '0.94rem', color: '#FEF08A', lineHeight: 1.55, margin: 0, fontFamily: 'var(--font-p3-mono)' }}>
          👁️ <em>Rumors circulate across the Midnight Hour... An uncatalogued secret minigame protocol lies encrypted somewhere deep in the system.</em>
        </p>
      </div>

      {/* Core Telemetry At A Glance */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-p3-display)', color: 'var(--p3-cyan)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          OPERATIVE TELEMETRY // QUICK GLANCE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem' }}>
          {data.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(5, 14, 42, 0.8)',
                border: '1px solid var(--p3-border)',
                padding: '0.9rem 1rem',
                transform: 'skewX(-4deg)',
              }}
            >
              <div style={{ transform: 'skewX(4deg)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)', marginBottom: '0.2rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.45rem', fontFamily: 'var(--font-p3-display)', color: '#FFF', fontWeight: 800 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--p3-cyan)', fontFamily: 'var(--font-p3-mono)', marginTop: '0.2rem' }}>
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Quick Action Shortcuts */}
      <div>
        <div style={{ fontSize: '1rem', fontFamily: 'var(--font-p3-display)', color: '#94A3B8', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          SELECT DEPLOYMENT VECTOR
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
          <button
            onClick={() => {
              playPop();
              onSelectTab('SKILL');
            }}
            className="p3-btn"
            style={{ fontSize: '1.1rem' }}
          >
            <span>INSPECT SKILLS</span>
          </button>
          <button
            onClick={() => {
              playPop();
              onSelectTab('PERSONA');
            }}
            className="p3-btn p3-btn-secondary"
            style={{ fontSize: '1.1rem' }}
          >
            <span>VIEW PERSONA PROJECTS</span>
          </button>
          <button
            onClick={() => {
              playPop();
              onSelectTab('STATS');
            }}
            className="p3-btn p3-btn-secondary"
            style={{ fontSize: '1.1rem' }}
          >
            <span>CAREER TELEMETRY</span>
          </button>
          <button
            onClick={() => {
              playPop();
              onOpenContactModal();
            }}
            className="p3-btn p3-btn-secondary"
            style={{ fontSize: '1.1rem' }}
          >
            <span>INITIATE COMMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 1: SKILL (Technical Stack & Masteries)
// -------------------------------------------------------------
function SkillPanel({ categories, selectedCategory, onSelectCategory, onAddXp }) {
  const [xpTag, setXpTag] = useState(null);

  const filterOptions = ['ALL', ...categories.map((c) => c.category)];

  const displayedGroups =
    selectedCategory === 'ALL'
      ? categories
      : categories.filter((c) => c.category === selectedCategory);

  const handleSkillClick = (name) => {
    playChime();
    setXpTag(name);
    if (onAddXp) onAddXp(100);
    setTimeout(() => setXpTag(null), 1000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#FF1E44' }}>
            <span>USE A SKILL // ARSENAL</span>
          </div>
          <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
            TECHNICAL MASTERIES
          </h2>
        </div>
        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-p3-mono)', color: 'var(--p3-cyan)' }}>
          TOTAL: 28 VERIFIED CAPABILITIES · CLICK TO OVERCLOCK +100 EXP
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              playPop();
              onSelectCategory(opt);
            }}
            style={{
              padding: '0.25rem 0.8rem',
              background: selectedCategory === opt ? 'var(--p3-cyan)' : 'rgba(5, 12, 34, 0.7)',
              color: selectedCategory === opt ? '#000000' : '#CBD5E1',
              border: selectedCategory === opt ? '1.5px solid #FFFFFF' : '1px solid var(--p3-border)',
              fontFamily: 'var(--font-p3-tech)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transform: 'skewX(-8deg)',
            }}
          >
            <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>{opt}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {displayedGroups.map((group) => (
          <div key={group.category}>
            <div
              style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-p3-display)',
                color: 'var(--p3-cyan)',
                letterSpacing: '0.06em',
                marginBottom: '0.6rem',
                borderBottom: '1px solid var(--p3-border)',
                paddingBottom: '0.2rem',
              }}
            >
              {group.category}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
              {group.skills.map((skill) => {
                const isHovered = xpTag === skill.name;

                return (
                  <div
                    key={skill.name}
                    onClick={() => handleSkillClick(skill.name)}
                    style={{
                      background: isHovered ? 'rgba(0, 210, 255, 0.25)' : 'rgba(5, 14, 42, 0.75)',
                      border: isHovered ? '2px solid var(--p3-gold)' : '1px solid var(--p3-border)',
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      transform: isHovered ? 'skewX(-6deg) scale(1.03)' : 'skewX(-6deg)',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Floating +100 EXP badge on click */}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-14px',
                          right: '10px',
                          background: 'var(--p3-gold)',
                          color: '#000',
                          padding: '0.15rem 0.6rem',
                          fontFamily: 'var(--font-p3-display)',
                          fontSize: '1.15rem',
                          fontWeight: 900,
                          boxShadow: '2px 2px 0 #000, 0 0 15px rgba(255, 230, 0, 0.7)',
                          zIndex: 20,
                          transform: 'skewX(-10deg)',
                          pointerEvents: 'none',
                        }}
                      >
                        <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>
                          +100 EXP! ⚡
                        </span>
                      </div>
                    )}

                    <div style={{ transform: 'skewX(6deg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.3rem', color: '#FFF' }}>
                          {skill.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.75rem', color: 'var(--p3-gold)' }}>
                          {skill.stars} ★
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)', marginBottom: '0.5rem' }}>
                        {skill.highlight}
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#000', border: '1px solid #1E293B' }}>
                        <div
                          style={{
                            width: `${skill.level}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #0055FF, #00D2FF)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 2: PERSONA (Projects & Production Agents)
// -------------------------------------------------------------
function PersonaPanel({ projects, onOpenSimulator }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#00D2FF' }}>
          <span>EQUIP PERSONA // PROJECTS</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          PRODUCTION AGENTS & DATA ENGINES
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            style={{
              background: 'rgba(5, 14, 42, 0.85)',
              borderLeft: '4px solid var(--p3-cyan)',
              borderTop: '1px solid var(--p3-border)',
              borderRight: '1px solid var(--p3-border)',
              borderBottom: '1px solid var(--p3-border)',
              padding: '1.6rem 1.8rem',
              boxShadow: '4px 4px 0px #000',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.82rem', color: 'var(--p3-cyan)', marginBottom: '0.2rem', letterSpacing: '0.06em' }}>
                  PROJECT 0{idx + 1} // {proj.badge}
                </div>
                <h3 style={{ fontFamily: 'var(--font-p3-display)', fontSize: '2rem', color: '#FFF', lineHeight: 1.1 }}>
                  {proj.title}
                </h3>
                <div style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '1.05rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                  {proj.subtitle}
                </div>
              </div>

              <span
                style={{
                  background: 'rgba(0, 210, 255, 0.12)',
                  border: '1px solid var(--p3-cyan)',
                  color: 'var(--p3-cyan)',
                  fontFamily: 'var(--font-p3-mono)',
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.6rem',
                  fontWeight: 700,
                  transform: 'skewX(-6deg)',
                }}
              >
                TACTICAL SPEC // {proj.year}
              </span>
            </div>

            <p style={{ fontSize: '0.96rem', color: '#E2E8F0', lineHeight: 1.6, margin: '0.8rem 0 1rem 0' }}>
              {proj.summary}
            </p>

            {/* Bullet points from resume */}
            {proj.points && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.2rem', padding: 0 }}>
                {proj.points.map((pt, i) => (
                  <li key={i} style={{ fontSize: '0.9rem', color: '#94A3B8', display: 'flex', gap: '0.55rem', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--p3-cyan)', flexShrink: 0 }}>&gt;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.3rem' }}>
              {proj.tags.map((t) => (
                <span key={t} className="p3-tag" style={{ fontSize: '0.75rem' }}>
                  <span>{t}</span>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  playChime();
                  onOpenSimulator(proj);
                }}
                className="p3-btn p3-btn-sm"
              >
                <Play size={14} />
                <span>LAUNCH SIMULATOR</span>
              </button>
              <a
                href={proj.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => playPop()}
                className="p3-btn p3-btn-secondary p3-btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <GithubIcon size={14} />
                <span>VIEW REPOSITORY</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PERSONA 5-AXIS ARCANA RADAR CHART (Calibrated to Real Project Telemetry)
// MA (Magic) 88 · LU (Luck) 76 · EN (Endurance) 72 · ST (Strength) 64 · AG (Agility) 58
// -------------------------------------------------------------
function PersonaRadarChart() {
  const [activeStatIndex, setActiveStatIndex] = useState(null);

  const stats = [
    { key: 'ST', label: 'Strength', value: 64, spec: 'Distributed PySpark ETL & Star Schemas', color: '#FF1E44' },
    { key: 'MA', label: 'Magic', value: 88, spec: 'Autonomous LangGraph Multi-Agents & Vector RAG', color: '#00D2FF' },
    { key: 'EN', label: 'Endurance', value: 72, spec: 'Enterprise Telecom Automation & 99.9% Airflow DAGs', color: '#10B981' },
    { key: 'AG', label: 'Agility', value: 58, spec: 'FastAPI Microservices & React Dynamic Interfaces', color: '#FFE600' },
    { key: 'LU', label: 'Luck', value: 76, spec: '9.7 CGPA Standing, Claude & Oracle GenAI Certs', color: '#A855F7' },
  ];

  // Dynamically determine the highest stat
  const topStat = [...stats].sort((a, b) => b.value - a.value)[0];

  const size = 280;
  const center = 140;
  const radius = 95;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index, scale) => {
    const angle = (Math.PI * 2 / stats.length) * index - Math.PI / 2;
    const r = radius * scale;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const statPolygonPoints = stats
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.value / 100);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      style={{
        background: 'rgba(5, 14, 42, 0.85)',
        border: '2px solid var(--p3-cyan)',
        boxShadow: '4px 4px 0px #000, 0 0 20px rgba(0, 210, 255, 0.25)',
        padding: '1.4rem',
        marginBottom: '1.8rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.8rem', color: 'var(--p3-cyan)', letterSpacing: '0.08em' }}>
            OPERATIVE TACTICAL PARAMETERS // ARCANA RADAR
          </div>
          <h3 style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.8rem', color: '#FFF', lineHeight: 1, margin: '0.15rem 0 0 0' }}>
            PERSONA ATTRIBUTE MATRIX
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-p3-mono)',
            fontSize: '0.78rem',
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1px solid var(--p3-cyan)',
            color: 'var(--p3-cyan)',
            padding: '0.2rem 0.6rem',
            fontWeight: 700,
          }}
        >
          MAX RATING: 99
        </span>
      </div>

      {/* Dynamic Build User Remark */}
      <div
        style={{
          background: 'rgba(0, 210, 255, 0.08)',
          borderLeft: `4px solid ${topStat.color}`,
          borderTop: '1px solid rgba(0, 210, 255, 0.25)',
          borderRight: '1px solid rgba(0, 210, 255, 0.25)',
          borderBottom: '1px solid rgba(0, 210, 255, 0.25)',
          padding: '0.6rem 1rem',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span
            style={{
              background: topStat.color,
              color: '#000',
              fontFamily: 'var(--font-p3-display)',
              fontSize: '0.85rem',
              fontWeight: 900,
              padding: '0.1rem 0.5rem',
              lineHeight: 1,
              letterSpacing: '0.05em',
            }}
          >
            TACTICAL ARCHETYPE
          </span>
          <span
            style={{
              fontFamily: 'var(--font-p3-display)',
              fontSize: '1.35rem',
              color: '#FFFFFF',
              letterSpacing: '0.03em',
            }}
          >
            &ldquo;Aman is a <span style={{ color: topStat.color, fontWeight: 900, textTransform: 'uppercase' }}>{topStat.label}</span> build user&rdquo;
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.78rem', color: '#94A3B8' }}>
          DOMINANT STAT: <span style={{ color: topStat.color, fontWeight: 800 }}>{topStat.key} ({topStat.value}/99)</span> &middot; {topStat.spec}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.2rem',
          alignItems: 'center',
        }}
      >
        {/* SVG Radar Visualizer */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#004CE8" stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {/* Concentric Pentagonal Grid Webs */}
            {levels.map((lvl) => {
              const pts = stats
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={pts}
                  fill="none"
                  stroke="rgba(0, 210, 255, 0.18)"
                  strokeWidth="1"
                  strokeDasharray={lvl === 1 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Axis Spokes from center to outer points */}
            {stats.map((_, i) => {
              const { x, y } = getCoordinates(i, 1.0);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(0, 210, 255, 0.28)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Stat Polygon */}
            <polygon
              points={statPolygonPoints}
              fill="url(#radarGlow)"
              stroke="#00D2FF"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.6))' }}
            />

            {/* Interactive Stat Vertices & Badges */}
            {stats.map((s, i) => {
              const { x, y } = getCoordinates(i, s.value / 100);
              const labelPos = getCoordinates(i, 1.22);
              const isSelected = activeStatIndex === i;

              return (
                <g
                  key={s.key}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveStatIndex(i)}
                  onMouseLeave={() => setActiveStatIndex(null)}
                  onClick={() => setActiveStatIndex(activeStatIndex === i ? null : i)}
                >
                  {/* Glowing Node Point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={s.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.2s ease', filter: isSelected ? 'drop-shadow(0 0 6px #FFF)' : 'none' }}
                  />

                  {/* Axis Label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#FFE600' : '#FFFFFF'}
                    style={{
                      fontFamily: 'var(--font-p3-display)',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      transition: 'fill 0.2s ease',
                    }}
                  >
                    {s.key} {s.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tactical Parameters Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {stats.map((s, i) => {
            const isSelected = activeStatIndex === i;
            return (
              <div
                key={s.key}
                onMouseEnter={() => setActiveStatIndex(i)}
                onMouseLeave={() => setActiveStatIndex(null)}
                onClick={() => setActiveStatIndex(activeStatIndex === i ? null : i)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: isSelected ? 'rgba(0, 210, 255, 0.15)' : 'rgba(5, 12, 34, 0.6)',
                  border: isSelected ? `1px solid ${s.color}` : '1px solid rgba(27, 43, 92, 0.6)',
                  borderLeft: `3px solid ${s.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.2rem', color: s.color, fontWeight: 900, lineHeight: 1 }}>
                      {s.key}
                    </span>
                    <span style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '0.92rem', color: '#FFF', fontWeight: 700, textTransform: 'uppercase' }}>
                      {s.label}
                    </span>
                    {s.key === topStat.key && (
                      <span
                        style={{
                          background: topStat.color,
                          color: '#000',
                          fontFamily: 'var(--font-p3-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '0.1rem 0.35rem',
                          lineHeight: 1,
                          letterSpacing: '0.04em',
                        }}
                      >
                        TOP STAT
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.95rem', color: isSelected ? '#FFE600' : '#FFF', fontWeight: 800 }}>
                    {s.value} / 99
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                  {s.spec}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 3: STATS (Experience & Deployment)
// -------------------------------------------------------------
function StatsPanel({ experiences }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#00E5FF' }}>
          <span>CHARACTER STATS // DEPLOYMENT</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          CAREER & WORK TELEMETRY
        </h2>
      </div>

      {/* Persona 5-Axis Arcana Radar Chart */}
      <PersonaRadarChart />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={{
              background: 'rgba(5, 14, 42, 0.75)',
              borderLeft: `4px solid ${exp.color}`,
              borderTop: '1px solid var(--p3-border)',
              borderRight: '1px solid var(--p3-border)',
              borderBottom: '1px solid var(--p3-border)',
              padding: '1.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.7rem', color: '#FFF', lineHeight: 1 }}>
                  {exp.role}
                </h3>
                <div style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '1.1rem', color: 'var(--p3-cyan)' }}>
                  {exp.company} // {exp.location}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.85rem', color: '#94A3B8' }}>
                {exp.period}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 210, 255, 0.08)', padding: '0.4rem 0.8rem', fontSize: '0.88rem', color: '#E0F2FE', marginBottom: '0.8rem', fontFamily: 'var(--font-p3-mono)' }}>
              ★ MANDATE: {exp.highlight}
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {exp.responsibilities.slice(0, 3).map((r, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#CBD5E1', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--p3-cyan)' }}>&gt;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {exp.skills.map((s) => (
                <span key={s} className="p3-tag" style={{ fontSize: '0.72rem' }}>
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 4: EQUIP (Certifications)
// -------------------------------------------------------------
function EquipPanel({ certifications }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#FFE600' }}>
          <span>EQUIP ARCANA // CERTIFICATIONS</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          VERIFIED INDUSTRY CREDENTIALS
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {certifications.map((cert) => (
          <div
            key={cert.title}
            onClick={() => playChime()}
            style={{
              background: 'rgba(5, 14, 42, 0.8)',
              border: cert.featured ? '2px solid var(--p3-cyan)' : '1px solid var(--p3-border)',
              padding: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ background: cert.featured ? 'var(--p3-cyan)' : '#1E293B', color: cert.featured ? '#000' : '#FFF', fontSize: '0.75rem', fontFamily: 'var(--font-p3-display)', padding: '0.1rem 0.5rem', fontWeight: 700 }}>
                  {cert.tier}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>
                  {cert.issuer}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.5rem', color: '#FFF', lineHeight: 1.1, marginBottom: '0.4rem' }}>
                {cert.title}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--p3-cyan)', fontFamily: 'var(--font-p3-mono)', marginBottom: '0.8rem' }}>
                {cert.validity}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.4 }}>
                {cert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 5: CALENDAR (Education)
// -------------------------------------------------------------
function CalendarPanel({ education }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#38BDF8' }}>
          <span>CALENDAR // ACADEMICS</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          ACADEMIC MILESTONES & HONORS
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {education.map((edu, idx) => (
          <div
            key={edu.institution}
            style={{
              background: 'rgba(5, 14, 42, 0.8)',
              border: '2px solid var(--p3-cyan)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.8rem', color: '#FFF', lineHeight: 1 }}>
                  {edu.institution}
                </h3>
                <div style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '1.1rem', color: 'var(--p3-cyan)' }}>
                  {edu.degree}
                </div>
              </div>
              <div style={{ background: '#FFF', color: '#000', fontFamily: 'var(--font-p3-display)', fontSize: '1.4rem', padding: '0.2rem 0.8rem', fontWeight: 900 }}>
                {edu.score}
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.8rem' }}>
              {edu.period} // {edu.location}
            </div>

            <div style={{ background: 'rgba(0, 210, 255, 0.08)', padding: '0.5rem 0.8rem', fontSize: '0.88rem', color: '#E0F2FE' }}>
              ★ {edu.highlight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 6: COMMU (Social Links & Contact Channels)
// -------------------------------------------------------------
function CommuPanel({ data, onOpenContactModal }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    playChime();
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#A855F7' }}>
          <span>COMMU // SOCIAL LINKS</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          TACTICAL CONTACT & SOCIAL NETWORK
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '520px' }}>
        {/* Email */}
        <div style={{ background: 'rgba(5, 14, 42, 0.8)', border: '1.5px solid var(--p3-border)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>DIRECT TRANSMISSION</div>
            <div style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '1.2rem', color: '#FFF', fontWeight: 700 }}>
              {data.email}
            </div>
          </div>
          <button onClick={copyEmail} className="p3-btn p3-btn-sm">
            <span>{copied ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        {/* Phone */}
        <div style={{ background: 'rgba(5, 14, 42, 0.8)', border: '1.5px solid var(--p3-border)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>VOICE / WHATSAPP</div>
            <div style={{ fontFamily: 'var(--font-p3-tech)', fontSize: '1.2rem', color: '#FFF', fontWeight: 700 }}>
              {data.phone}
            </div>
          </div>
          <a href={`tel:${data.phone}`} className="p3-btn p3-btn-secondary p3-btn-sm" style={{ textDecoration: 'none' }}>
            <span>CALL</span>
          </a>
        </div>

        {/* Social Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <a
            href={data.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p3-btn p3-btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <LinkedinIcon size={18} color="var(--p3-cyan)" />
            <span>LINKEDIN</span>
          </a>
          <a
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="p3-btn p3-btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <GithubIcon size={18} />
            <span>GITHUB</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUBPANEL 7: SYSTEM (Audio & System Controls)
// -------------------------------------------------------------
function SystemPanel({ onCelebrate, confettiClicks, isSecretUnlocked, bgmMuted, onToggleBgm }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="p3-banner-title" style={{ fontSize: '1.2rem', padding: '0.15rem 0.8rem', background: '#10B981' }}>
          <span>SYSTEM // PROTOCOLS</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1, marginTop: '0.3rem' }}>
          SYSTEM SETTINGS & AUDIO CONTROLS
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '480px' }}>
        {/* Lo-Fi Background Music Controller Card */}
        <div
          style={{
            background: 'rgba(5, 14, 42, 0.85)',
            border: bgmMuted ? '1.5px solid var(--p3-border)' : '2px solid var(--p3-cyan)',
            boxShadow: bgmMuted ? '3px 3px 0 #000' : '5px 5px 0 #000, 0 0 25px rgba(0, 210, 255, 0.3)',
            padding: '1.2rem 1.4rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.9rem',
            transform: 'skewX(-4deg)',
            transition: 'all 0.18s ease',
          }}
        >
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.78rem', color: 'var(--p3-cyan)', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              AUDIO FREQUENCY // PERSONA 3 LO-FI
            </div>
            <div style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.45rem', color: '#FFF', fontWeight: 800 }}>
              {bgmMuted ? 'BGM: MUTED 🔇' : 'BGM: PLAYING 🎵'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)', marginTop: '0.2rem' }}>
              Iwatodai Dorm -Reload- Lo-Fi Beats
            </div>
          </div>

          <button
            onClick={onToggleBgm}
            className={`p3-btn p3-btn-sm ${bgmMuted ? 'p3-btn-secondary' : 'p3-btn-crimson'}`}
            style={{
              fontSize: '1rem',
              minHeight: '44px',
              padding: '0.45rem 1.2rem',
              transform: 'skewX(4deg)',
              cursor: 'pointer',
            }}
            aria-label={bgmMuted ? 'Unmute Persona 3 Lo-Fi Background Music' : 'Mute Persona 3 Lo-Fi Background Music'}
          >
            {bgmMuted ? (
              <>
                <VolumeX size={18} />
                <span>UNMUTE BGM</span>
              </>
            ) : (
              <>
                <Volume2 size={18} />
                <span>MUTE BGM</span>
              </>
            )}
          </button>
        </div>

        {/* Celebrate Confetti Button (Click 20 times to unlock secret) */}
        <button
          onClick={onCelebrate}
          className="p3-btn p3-btn-crimson"
          style={{ padding: '0.8rem 1.5rem', fontSize: '1.3rem' }}
        >
          <Sparkles size={20} />
          <span>CELEBRATE JOURNEY [CONFETTI]</span>
        </button>

        {/* Secret Unlocked Badge */}
        {isSecretUnlocked && (
          <div
            style={{
              background: 'rgba(255, 230, 0, 0.12)',
              border: '2px solid var(--p3-gold)',
              boxShadow: '0 0 25px rgba(255, 230, 0, 0.35)',
              padding: '0.8rem 1.2rem',
              color: 'var(--p3-gold)',
              fontFamily: 'var(--font-p3-tech)',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              transform: 'skewX(-6deg)',
            }}
          >
            <div style={{ transform: 'skewX(6deg)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={18} />
              <span>★ SECRET PROTOCOL UNLOCKED: "[SECRET]" TAB AVAILABLE BELOW SYSTEM ★</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
