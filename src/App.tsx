import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Zap,
  Clock,
  Smartphone,
  Palette,
  Send,
  Bot,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Code2,
  Volume2,
  ShieldCheck,
  Target,
  BarChart2,
  Layers,
  Award,
  Flame
} from 'lucide-react';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState<'phoenix' | 'carbon'>('phoenix');

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const quickstartCmd = `git clone https://github.com/jvstin47/stream-auto-clipper.git
cd stream-auto-clipper
pip install -r requirements.txt
cp config.example.json config.json
python stream_clipper.py --file gameplay.mp4 --count 5`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quickstartCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax on the 9:16 Hero Reel Mockup
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 12;
      targetY = ((e.clientY - cy) / cy) * 12;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (phoneRef.current) {
        gsap.set(phoneRef.current, {
          rotateY: currentX,
          rotateX: -currentY,
          transformPerspective: 1000
        });
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-indigo-500/30 selection:text-white overflow-x-hidden relative">
      {/* Background Dot Matrix & Grid Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Dots with radial focus mask */}
        <div className="absolute inset-0 bg-dot-pattern opacity-70 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_35%,#000_25%,transparent_100%)]" />
        {/* Faint Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,#000_15%,transparent_100%)]" />

        {/* Ambient Blurred Colored Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-indigo-600/15 blur-[140px] rounded-full animate-pulse-slow" />
        <div className="absolute top-[550px] -left-36 w-[480px] h-[480px] bg-purple-600/12 blur-[150px] rounded-full animate-drift" />
        <div className="absolute top-[1200px] -right-36 w-[560px] h-[560px] bg-blue-600/12 blur-[160px] rounded-full animate-float-reverse" />

        {/* Minimal Animated SVG Telemetry Nodes & Soundwave Lines */}
        <svg
          className="absolute top-48 left-6 sm:left-16 w-48 h-48 opacity-25 animate-drift pointer-events-none hidden md:block"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="50" stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="3" fill="#6366f1" className="animate-ping" />
          <circle cx="150" cy="100" r="2.5" fill="white" />
          <circle cx="100" cy="50" r="2.5" fill="white" />
          <circle cx="65" cy="135" r="2" fill="#ec4899" />
          <path d="M 40 100 Q 70 65 100 100 T 160 100" stroke="rgba(99,102,241,0.5)" strokeWidth="1.2" fill="none" />
        </svg>

        <svg
          className="absolute top-56 right-6 sm:right-16 w-56 h-56 opacity-25 animate-float-reverse pointer-events-none hidden md:block"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="110" cy="110" r="95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="6 8" />
          <circle cx="110" cy="110" r="60" stroke="rgba(245,158,11,0.35)" strokeWidth="1" strokeDasharray="3 5" />
          <polygon points="110,35 175,145 45,145" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <circle cx="110" cy="35" r="2.5" fill="#f59e0b" />
          <circle cx="175" cy="145" r="2.5" fill="white" />
          <circle cx="45" cy="145" r="2.5" fill="white" />
          <circle cx="110" cy="110" r="2" fill="#10b981" className="animate-ping" />
          <line x1="30" y1="110" x2="190" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Floating Navigation Pill */}
      <header className="sticky top-5 z-50 px-4 flex justify-center">
        <nav className="liquid-glass flex items-center justify-between gap-6 rounded px-5 py-2.5 max-w-4xl w-full">
          <a href="#" className="flex items-center gap-2 group text-decoration-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading italic text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              stream-auto-clipper
            </span>
          </a>

          <div className="hidden sm:flex items-center gap-5">
            <a href="#features" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#multichannel" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Multi-Channel
            </a>
            <a href="#safezone" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Safe-Zone Studio
            </a>
            <a href="#quickstart" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Quickstart
            </a>
            <a href="#credits" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Credits
            </a>
          </div>

          <a
            href="https://github.com/jvstin47/stream-auto-clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-strong text-xs font-medium text-white rounded px-3 py-1.5 flex items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <Code2 size={13} />
            <span>GitHub</span>
            <ExternalLink size={10} className="opacity-60" />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div
          className={`liquid-glass inline-flex items-center gap-2 px-3.5 py-1 rounded text-xs font-medium text-indigo-300 mb-6 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <Sparkles size={12} className="text-indigo-400" />
          <span>Automated 9:16 Video Synthesis & Agent Skill</span>
        </div>

        {/* Golden Ratio Title */}
        <h1
          className={`hero-title mb-4 max-w-3xl transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Stream Auto Clipper
        </h1>

        <p
          className={`text-sm sm:text-base text-white/70 max-w-xl font-light leading-relaxed mb-6 transition-all duration-1000 delay-150 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Turn raw gaming streams into high-energy vertical reels and esports cover thumbnails with automatic facecam tracking, 1:1 mobile safe zones, and multi-channel dispatch.
        </p>

        {/* Battle-Tested Metric Badge */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 mb-8 transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="liquid-glass-strong px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs border border-emerald-500/30 text-emerald-300">
            <Award size={13} className="text-emerald-400" />
            <span className="font-medium">100,000+ Views Verified in Production</span>
          </div>
          <div className="liquid-glass px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-white/70">
            <Flame size={12} className="text-amber-400" />
            <span>27.5k Peak Reel Views &bull; 1.6x Loop Ratio</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex items-center justify-center gap-3.5 mb-14 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a
            href="#quickstart"
            className="bg-white text-black text-xs sm:text-sm font-medium rounded px-5 py-2.5 flex items-center gap-2 shadow-[0_0_20px_2px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Terminal size={14} />
            <span>Quickstart</span>
          </a>

          <a
            href="https://github.com/jvstin47/stream-auto-clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass text-white text-xs sm:text-sm font-medium rounded px-5 py-2.5 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Documentation</span>
            <ChevronRight size={13} className="opacity-60" />
          </a>
        </div>

        {/* HERO ELEMENT: Interactive 9:16 Vertical Reel Player Mockup */}
        <div className="relative w-full max-w-2xl flex items-center justify-center my-4">
          {/* Left Feature Card (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-3 absolute -left-20 top-1/4 w-48 text-left z-20">
            <div className="liquid-glass rounded-xl p-3.5 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Zap size={14} />
                <span className="text-[11px] font-semibold tracking-wider uppercase">Energy Peak</span>
              </div>
              <div className="text-xl font-heading italic text-white mb-0.5">9.4 / 10</div>
              <p className="text-[10px] text-white/60 font-light leading-snug">
                PCM RMS audio peak + OpenCV frame motion variance.
              </p>
            </div>

            <div className="liquid-glass rounded-xl p-3.5 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock size={14} />
                <span className="text-[11px] font-semibold tracking-wider uppercase">Dynamic Cut</span>
              </div>
              <div className="text-xl font-heading italic text-white mb-0.5">48.2s</div>
              <p className="text-[10px] text-white/60 font-light leading-snug">
                Extends naturally between 30s&ndash;75s without cutting punchlines.
              </p>
            </div>
          </div>

          {/* Center 9:16 Phone Reel Mockup */}
          <div
            ref={phoneRef}
            className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-[36px] p-2.5 liquid-glass-strong border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.2)] overflow-hidden transition-transform ease-out duration-100"
          >
            {/* Screen Inner Frame */}
            <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black flex flex-col">
              {/* Top 35%: Streamer Facecam Tracking Simulation */}
              <div className="relative h-[34%] w-full bg-zinc-900 overflow-hidden flex items-center justify-center border-b border-indigo-500/30">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover scale-[1.3] filter contrast-110"
                />

                {/* Facecam HUD Overlay */}
                <div className="absolute top-2.5 left-3 flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] font-semibold tracking-widest uppercase bg-black/60 px-1.5 py-0.5 rounded text-white/90">
                    LIVE
                  </span>
                </div>

                <div className="absolute top-2.5 right-3 text-[9px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-emerald-400 z-10 flex items-center gap-1">
                  <Volume2 size={9} />
                  <span>-14 dB</span>
                </div>

                {/* YuNet AI Tracking Box Overlay */}
                <div className="absolute inset-3 border border-indigo-400/50 rounded pointer-events-none flex items-end justify-start p-1.5">
                  <span className="text-[8px] font-mono text-indigo-300 bg-black/70 px-1 rounded">
                    ONNX YuNet &bull; 1.7088
                  </span>
                </div>
              </div>

              {/* Accent Divider Line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_rgba(99,102,241,0.8)]" />

              {/* Bottom 65%: Gameplay Action Tracking */}
              <div className="relative flex-1 w-full bg-zinc-950 overflow-hidden">
                <video
                  src={VIDEO_SRC}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Vignette Overlay for Title Legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                {/* 1:1 Instagram Grid Safe Zone Overlay (Toggled) */}
                {showSafeZone && (
                  <div className="absolute inset-x-0 top-[18%] bottom-[18%] border-2 border-dashed border-amber-400/70 bg-amber-500/10 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded uppercase tracking-wider">
                      1:1 Profile Grid Safe Zone (Y: 420-1500)
                    </span>
                  </div>
                )}

                {/* Esports Title Overlay Inside Reel */}
                <div className="absolute top-4 inset-x-0 px-3 text-center z-10">
                  <div className="inline-block bg-red-600/90 text-white font-heading italic text-[10px] tracking-wider px-2 py-0.5 rounded-sm mb-1 uppercase">
                    VALORANT &bull; HIGHLIGHT
                  </div>
                  <div className="font-heading italic text-2xl text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    SHROUD <span className="text-amber-400">CLUTCH</span>
                  </div>
                </div>

                {/* Bottom Soundwave & Callout Pill */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white/90 z-10">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-[9px] font-mono border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>TWITCH.TV/SHROUD</span>
                  </div>

                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-indigo-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-indigo-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-indigo-400 animate-pulse delay-150" />
                    <span className="w-0.5 h-2.5 bg-indigo-400 animate-pulse delay-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Zone Toggle Button */}
            <button
              onClick={() => setShowSafeZone(!showSafeZone)}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-light text-white/70 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-colors border border-white/10"
            >
              <ShieldCheck size={12} className={showSafeZone ? 'text-amber-400' : 'text-white/50'} />
              <span>{showSafeZone ? 'Hide Safe Zone' : 'Preview 1:1 Safe Zone'}</span>
            </button>
          </div>

          {/* Right Feature Card (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-3 absolute -right-20 top-1/4 w-48 text-left z-20">
            <div className="liquid-glass rounded-xl p-3.5 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Target size={14} />
                <span className="text-[11px] font-semibold tracking-wider uppercase">Facecam Crop</span>
              </div>
              <div className="text-xl font-heading italic text-white mb-0.5">1.7088</div>
              <p className="text-[10px] text-white/60 font-light leading-snug">
                Auto-centered on streamer face, isolates gameplay HUD.
              </p>
            </div>

            <div className="liquid-glass rounded-xl p-3.5 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck size={14} />
                <span className="text-[11px] font-semibold tracking-wider uppercase">Zero Freeze</span>
              </div>
              <div className="text-xl font-heading italic text-white mb-0.5">0.00s</div>
              <p className="text-[10px] text-white/60 font-light leading-snug">
                Normalized PTS timestamps eliminate initial stutter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Telemetry Bar */}
      <section className="relative z-10 py-8 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="liquid-glass rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-heading italic text-white mb-0.5">105,500+</div>
            <div className="text-[11px] text-white/60 font-light">Verified Live Views</div>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-heading italic text-indigo-300 mb-0.5">27.5k</div>
            <div className="text-[11px] text-white/60 font-light">Peak Single Reel Views</div>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-heading italic text-amber-300 mb-0.5">1.60x</div>
            <div className="text-[11px] text-white/60 font-light">Views / Reach Loop Ratio</div>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-heading italic text-emerald-300 mb-0.5">0.00s</div>
            <div className="text-[11px] text-white/60 font-light">Frozen Start Latency</div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
            Engine Capabilities
          </h2>
          <p className="text-xs font-light text-white/60 max-w-md mx-auto">
            Engineered for high-volume creator workflows, multi-channel networks, and autonomous AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Multimodal Peak Detection</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Calculates rolling 16-bit PCM decibel loudness peaks with OpenCV frame variance to detect genuine clutch action.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Clock size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Dynamic Durations (30s&ndash;75s)</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Preserves punchlines and sustained chases by extending duration dynamically based on continuous audio decibels.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Smartphone size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Dual 9:16 Video Synthesis</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Auto-chooses between stacked facecam/gameplay mode and dynamically box-blurred 16:9 landscape fit.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
              <Palette size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">1:1 Safe-Zone Thumbnail Studio</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Mathematical subpixel font centering and lower chest anchoring ($Y \in [1380, 1560]$) prevent overlay collision.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Layers size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Multi-Channel Anti-Collision</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Dispatches clips to separate accounts with pre-flight deduplication blocking accidental cross-posting.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <BarChart2 size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Live Telemetry & Insights</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Built-in <code className="text-purple-300">--insights</code> CLI queries view counts and engagement without opening a browser.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
              <Flame size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Dynamic Category Badging</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Automatic keyword mapping to chromatic badge palettes (Wanted, Combat, Stealth, Speed, Heist).
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Send size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">First-Line Follow CTAs</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Under-110-character caption formatting keeps clickable profile handles above mobile Reels truncation fold.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Bot size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Autonomous Agent Skill</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Standardized skill instructions allow AI coding agents to run capture, review, and publishing end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Channel Architecture Showcase */}
      <section id="multichannel" className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="liquid-glass inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-indigo-300 mb-3">
            <Layers size={12} />
            <span>Parallel Network Scaling</span>
          </div>
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
            Multi-Channel Anti-Collision Engine
          </h2>
          <p className="text-xs font-light text-white/60 max-w-lg mx-auto">
            Scale your content output by 2x&ndash;5x across multiple brand accounts while enforcing 100% unique clip partitioning.
          </p>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-6 border border-white/10">
          {/* Tab selector */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveAccountTab('phoenix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeAccountTab === 'phoenix'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Channel A (@phoenix.clippy)
            </button>
            <button
              onClick={() => setActiveAccountTab('carbon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeAccountTab === 'carbon'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Channel B (@carbon.clippy)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-xs font-mono text-indigo-400 mb-1">
                {activeAccountTab === 'phoenix' ? 'ACTIVE PARTITION: CLIPS 01 - 25, 28' : 'ACTIVE PARTITION: CLIPS 26, 27, 29, 30+'}
              </div>
              <h3 className="text-lg font-heading italic text-white mb-2">
                {activeAccountTab === 'phoenix' ? 'Phoenix Channel Strategy' : 'Carbon Channel Strategy'}
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                {activeAccountTab === 'phoenix'
                  ? 'Primary flagship channel focusing on extreme stunts and heavy combat clips. Shattered 100,000 views in 48 hours with 27.5k views on Underground Subway Shootout.'
                  : 'Secondary high-frequency brand focusing on water pursuits, stealth infiltrations, and street races. Runs with dynamic @carbon.clippy handle swapping.'}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check size={14} />
                  <span>Strict zero-overlap guardrail: pre-flight checks block cross-channel duplication.</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check size={14} />
                  <span>3-hour posting cadence prevents Instagram sibling reach cannibalization.</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check size={14} />
                  <span>Dynamic caption routing: auto-swaps @handle for follower conversion.</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-white/10 font-mono text-[11px] text-white/80 overflow-x-auto">
              <div className="text-white/40 mb-2">// Multi-account dispatch command</div>
              <div className="text-emerald-400 mb-1">
                $ python zernio_publish.py clip.mp4 --now --publish --account {activeAccountTab}
              </div>
              <div className="text-white/60 mb-3">
                &gt; Target: instagram ({activeAccountTab})<br />
                &gt; Deduplication check: PASS (no previous post found)<br />
                &gt; Caption routing: @{activeAccountTab}.clippy<br />
                &gt; Accepted post ID: 6b0{activeAccountTab === 'phoenix' ? '097bebbc1076dc64a6e57' : '2dec7f2c3211763f73ea4'}
              </div>
              <div className="text-indigo-400">
                $ python zernio_publish.py clip.mp4 --insights
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe-Zone Thumbnail Studio Deep Dive */}
      <section id="safezone" className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="liquid-glass inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-amber-300 mb-3">
            <Palette size={12} />
            <span>Zero-Overlap Design</span>
          </div>
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
            1:1 Mobile Safe-Zone Formula
          </h2>
          <p className="text-xs font-light text-white/60 max-w-lg mx-auto">
            Vertical thumbnails look great in 9:16 but get butchered on 1:1 Instagram profile grids unless anchored mathematically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="liquid-glass rounded-xl p-5 border border-white/10">
            <div className="text-xs font-mono text-cyan-400 mb-1">REGION 1: Y = 115 - 230</div>
            <h4 className="text-sm font-medium text-white mb-1.5">Angled Category Badge</h4>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Positioned below top notch safe areas with dynamic chromatic palettes (Siren Cyan, Solar Gold, Toxic Emerald).
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5 border border-amber-500/20 bg-amber-500/5">
            <div className="text-xs font-mono text-amber-400 mb-1">REGION 2: Y = 1380 - 1560</div>
            <h4 className="text-sm font-medium text-white mb-1.5">Chest Safe Zone Hook</h4>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Anchors bold 125pt typography below top game logos and safely above lower player captions. 100% visible in 1:1 grid crop!
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5 border border-white/10">
            <div className="text-xs font-mono text-pink-400 mb-1">REGION 3: Y = 1830</div>
            <h4 className="text-sm font-medium text-white mb-1.5">Live Callout Pill</h4>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Frosted pill with glowing live indicator dot and creator handle, cleanly tucked at the bottom footer.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart Terminal */}
      <section id="quickstart" className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-1.5">
            Quickstart in 4 Steps
          </h2>
          <p className="text-xs font-light text-white/60">
            Run the pipeline on any local video or live stream URL.
          </p>
        </div>

        <div className="liquid-glass-strong rounded-xl p-4 border border-white/10 shadow-xl relative">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-white/70 text-[11px]">bash</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors text-xs"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-white/90 overflow-x-auto leading-relaxed">
            {quickstartCmd}
          </pre>
        </div>
      </section>

      {/* Configuration Section */}
      <section id="config" className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-1.5">
            Universal Configuration
          </h2>
          <p className="text-xs font-light text-white/60">
            Customize creator branding and render parameters in <code className="text-indigo-300">config.json</code>:
          </p>
        </div>

        <div className="liquid-glass rounded-xl p-5 border border-white/10 font-mono text-xs text-white/80 overflow-x-auto leading-relaxed">
          {`{
  "creator_name": "EAGLE GAMING",
  "creator_handle": "eaglegaming",
  "game_title": "GTA 6",
  "platform": "KICK.COM",
  "min_clip_duration": 30.0,
  "max_clip_duration": 75.0,
  "format_preference": "auto",
  "bg_music_volume": 0.08,
  "thumb_main_color": "#FFFFFF",
  "thumb_accent_color": "#FFDD00",
  "thumb_badge_color": "#E10A19"
}`}
        </div>
      </section>

      {/* Credits Section */}
      <section id="credits" className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-1.5">
            Acknowledgements & Credits
          </h2>
          <p className="text-xs font-light text-white/60">
            Built upon ideas and open-source contributions from:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://github.com/AnIntellectualBeing/GTA-Auto-Clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-lg p-3.5 group hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-xs text-white group-hover:text-indigo-300">
                GTA-Auto-Clipper
              </span>
              <ExternalLink size={11} className="opacity-40" />
            </div>
            <p className="text-[11px] text-white/60 font-light">
              by AnIntellectualBeing &mdash; Foundation for stream capture and audio-signal highlight ranking.
            </p>
          </a>

          <a
            href="https://github.com/iamajmeena/neonclipping"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-lg p-3.5 group hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-xs text-white group-hover:text-indigo-300">
                neonclipping
              </span>
              <ExternalLink size={11} className="opacity-40" />
            </div>
            <p className="text-[11px] text-white/60 font-light">
              by iamajmeena &mdash; Corner streamer webcam isolation and stacked portrait layout concepts.
            </p>
          </a>

          <a
            href="https://github.com/Abhinavkumar-07/youtube-instagram-auto-uploader"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-lg p-3.5 group hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-xs text-white group-hover:text-indigo-300">
                youtube-instagram-auto-uploader
              </span>
              <ExternalLink size={11} className="opacity-40" />
            </div>
            <p className="text-[11px] text-white/60 font-light">
              by Abhinavkumar-07 &mdash; Reference patterns for automated multi-platform social media dispatch.
            </p>
          </a>

          <a
            href="https://github.com/opencv/opencv_zoo"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-lg p-3.5 group hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-xs text-white group-hover:text-indigo-300">
                OpenCV Model Zoo
              </span>
              <ExternalLink size={11} className="opacity-40" />
            </div>
            <p className="text-[11px] text-white/60 font-light">
              OpenCV Team &mdash; Lightweight YuNet ONNX face detection model.
            </p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 border-t border-white/10 text-center text-xs text-white/50">
        <p className="mb-1">
          Released under the{' '}
          <a
            href="https://github.com/jvstin47/stream-auto-clipper/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white underline"
          >
            MIT License
          </a>
          . Created by{' '}
          <a
            href="https://github.com/jvstin47"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white underline"
          >
            Justin Joe Mathew
          </a>
          .
        </p>
        <p className="font-light text-white/40 text-[11px]">
          Open-source community project &bull; Not affiliated with Rockstar Games, Twitch, Kick, or YouTube.
        </p>
      </footer>
    </div>
  );
}
