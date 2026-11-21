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
  Target
} from 'lucide-react';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(false);

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
    <div className="min-h-screen bg-black text-white font-body selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[650px] -left-32 w-[420px] h-[420px] bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[1300px] -right-32 w-[520px] h-[520px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Floating Navigation Pill */}
      <header className="sticky top-5 z-50 px-4 flex justify-center">
        <nav className="liquid-glass flex items-center justify-between gap-6 rounded px-5 py-2.5 max-w-3xl w-full">
          <a href="#" className="flex items-center gap-2 group text-decoration-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading italic text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              stream-auto-clipper
            </span>
          </a>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#quickstart" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Quickstart
            </a>
            <a href="#config" className="text-xs font-light text-white/70 hover:text-white transition-colors">
              Config
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
      <section className="relative z-10 pt-16 pb-20 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
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
          className={`text-sm sm:text-base text-white/70 max-w-xl font-light leading-relaxed mb-8 transition-all duration-1000 delay-150 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Turn raw gaming streams into high-energy vertical reels and esports cover thumbnails with automatic facecam tracking and 1:1 mobile safe zones.
        </p>

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
                {/* Background Facecam Video Feed */}
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
                      1:1 Profile Grid Safe Zone
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

                  {/* Audio EQ bars animation */}
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

      {/* Capabilities Section */}
      <section id="features" className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
            Engine Capabilities
          </h2>
          <p className="text-xs font-light text-white/60 max-w-md mx-auto">
            Engineered for high-volume creator workflows and automated AI agent execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Multimodal Peak Detection</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Calculates rolling 16-bit PCM decibel loudness peaks with OpenCV frame variance to detect peak action.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Clock size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Dynamic Durations (30s&ndash;75s)</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Preserves comedic timing and clutch conclusions by adapting duration to sustained audio energy.
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
            <h3 className="text-sm font-medium text-white mb-1.5">Pro Gaming Thumbnails</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Generates 150pt display typography, contrast-boosted covers, and strict 1:1 Instagram profile grid boundaries.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Send size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Cross-Platform Dispatch</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Schedules and posts directly to Instagram Reels and YouTube Shorts via the Zernio social media API.
            </p>
          </div>

          <div className="liquid-glass rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <Bot size={16} />
            </div>
            <h3 className="text-sm font-medium text-white mb-1.5">Autonomous Agent Skill</h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Bundles standardized skill specifications so coding agents can execute clipping pipelines hands-free.
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
  "creator_name": "SHROUD",
  "creator_handle": "shroud",
  "game_title": "VALORANT",
  "platform": "TWITCH.TV",
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
