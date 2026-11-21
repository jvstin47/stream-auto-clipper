import { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-indigo-500/30 selection:text-white">
      {/* Subtle ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[1200px] -right-40 w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Floating Liquid-Glass Navigation */}
      <header className="sticky top-5 z-50 px-4 flex justify-center">
        <nav className="liquid-glass flex items-center justify-between gap-6 sm:gap-8 rounded px-5 py-2.5 max-w-4xl w-full">
          <a href="#" className="flex items-center gap-2.5 group text-decoration-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading italic text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              stream-auto-clipper
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-light text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#quickstart" className="text-sm font-light text-white/70 hover:text-white transition-colors">
              Quickstart
            </a>
            <a href="#config" className="text-sm font-light text-white/70 hover:text-white transition-colors">
              Config
            </a>
            <a href="#credits" className="text-sm font-light text-white/70 hover:text-white transition-colors">
              Credits
            </a>
          </div>

          <a
            href="https://github.com/jvstin47/stream-auto-clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-strong text-xs font-medium text-white rounded px-3.5 py-1.5 flex items-center gap-1.5 transition-all hover:scale-[1.03] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.12)] active:scale-[0.97]"
          >
            <Code2 size={13} />
            <span>GitHub</span>
            <ExternalLink size={11} className="opacity-60" />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div
          className={`liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium text-indigo-300 mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Sparkles size={13} className="text-indigo-400" />
          <span>Open-Source Stream Highlight & Short-Form Automation</span>
        </div>

        <h1
          className={`hero-title mb-6 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Stream Auto Clipper
        </h1>

        <p
          className={`text-base sm:text-lg text-white/75 max-w-2xl font-light leading-relaxed mb-10 transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Transform long gaming streams and VODs into high-energy 9:16 vertical reels with pro
          cover thumbnails and mobile safe zones — fully automated as a CLI tool or AI agent skill.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mb-14 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="#quickstart"
            className="group relative bg-white text-black text-sm font-medium rounded px-7 py-3 overflow-hidden active:scale-[0.97] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Terminal size={15} />
              <span>Get Started</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>

          <a
            href="https://github.com/jvstin47/stream-auto-clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass text-white text-sm font-medium rounded px-6 py-3 flex items-center gap-2 active:scale-[0.97] transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <FileText size={15} />
            <span>Read Docs</span>
            <ChevronRight size={14} className="opacity-60" />
          </a>
        </div>

        {/* Key Metrics / Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
          <div className="liquid-glass rounded p-3.5 text-center">
            <div className="text-xl font-heading italic text-white mb-0.5">30s &ndash; 75s</div>
            <div className="text-[11px] text-white/60 font-light">Dynamic Duration</div>
          </div>
          <div className="liquid-glass rounded p-3.5 text-center">
            <div className="text-xl font-heading italic text-white mb-0.5">0.00s</div>
            <div className="text-[11px] text-white/60 font-light">Zero Initial Freeze</div>
          </div>
          <div className="liquid-glass rounded p-3.5 text-center">
            <div className="text-xl font-heading italic text-white mb-0.5">1:1 Safe</div>
            <div className="text-[11px] text-white/60 font-light">Grid Compliant</div>
          </div>
          <div className="liquid-glass rounded p-3.5 text-center">
            <div className="text-xl font-heading italic text-white mb-0.5">Multi-Platform</div>
            <div className="text-[11px] text-white/60 font-light">Reels & Shorts</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading italic text-3xl sm:text-4xl text-white mb-3">
            Engine Capabilities
          </h2>
          <p className="text-sm font-light text-white/65 max-w-xl mx-auto">
            A production-ready pipeline engineered to eliminate tedious manual video editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Multimodal Peak Detection</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              Scans 16-bit PCM RMS loudness peaks alongside OpenCV frame pixel motion variance to reliably score hype moments.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Clock size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Dynamic Clip Durations</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              Clips dynamically extend between 30 and 75 seconds based on audio/action decay, capturing complete sequences naturally.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Smartphone size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Dual 9:16 Video Synthesis</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              Auto-switches between stacked layout (top 33% facecam + bottom 67% gameplay) and blurred landscape fit with audio ducking.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Palette size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Pro Gaming Thumbnails</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              High-impact 150pt display typography, 3D drop shadow, and strict 1:1 Instagram profile grid safe zone compliance (Y: 420&ndash;1500).
            </p>
          </div>

          {/* Feature 5 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Send size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Cross-Platform Dispatch</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              Automates scheduling and publishing directly to Instagram Reels and YouTube Shorts via the Zernio social API.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Bot size={20} />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Autonomous Agent Skill</h3>
            <p className="text-xs text-white/65 leading-relaxed font-light">
              Bundles standardized skill instructions so AI coding agents can discover, configure, and execute clipping pipelines hands-free.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart Terminal */}
      <section id="quickstart" className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading italic text-3xl sm:text-4xl text-white mb-3">
            Quickstart in 4 Steps
          </h2>
          <p className="text-sm font-light text-white/65">
            Clone the repo, install requirements, configure branding, and run the pipeline.
          </p>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-5 border border-white/10 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono ml-2 text-white/70">bash &mdash; terminal</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-white/90 overflow-x-auto leading-relaxed whitespace-pre">
            {quickstartCmd}
          </pre>
        </div>
      </section>

      {/* Configuration Section */}
      <section id="config" className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading italic text-3xl sm:text-4xl text-white mb-3">
            Universal Configuration
          </h2>
          <p className="text-sm font-light text-white/65">
            Customize creator branding, duration limits, and palette in <code className="text-indigo-300">config.json</code>:
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-6 border border-white/10 font-mono text-xs text-white/85 overflow-x-auto leading-relaxed">
          <div className="text-white/40 mb-2">// config.json</div>
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

      {/* Credits & Acknowledgements */}
      <section id="credits" className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading italic text-3xl sm:text-4xl text-white mb-3">
            Acknowledgements & Credits
          </h2>
          <p className="text-sm font-light text-white/65">
            Built upon ideas and research from these open-source projects:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/AnIntellectualBeing/GTA-Auto-Clipper"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-xl p-4.5 group transition-all hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-sm text-white group-hover:text-indigo-300 transition-colors">
                GTA-Auto-Clipper
              </span>
              <ExternalLink size={12} className="opacity-40" />
            </div>
            <p className="text-xs text-white/60 font-light">
              by AnIntellectualBeing &mdash; Foundation for stream recording and audio-signal highlight ranking.
            </p>
          </a>

          <a
            href="https://github.com/iamajmeena/neonclipping"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-xl p-4.5 group transition-all hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-sm text-white group-hover:text-indigo-300 transition-colors">
                neonclipping
              </span>
              <ExternalLink size={12} className="opacity-40" />
            </div>
            <p className="text-xs text-white/60 font-light">
              by iamajmeena &mdash; Corner streamer webcam isolation and stacked portrait layout concepts.
            </p>
          </a>

          <a
            href="https://github.com/Abhinavkumar-07/youtube-instagram-auto-uploader"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-xl p-4.5 group transition-all hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-sm text-white group-hover:text-indigo-300 transition-colors">
                youtube-instagram-auto-uploader
              </span>
              <ExternalLink size={12} className="opacity-40" />
            </div>
            <p className="text-xs text-white/60 font-light">
              by Abhinavkumar-07 &mdash; Reference patterns for automated multi-platform social media dispatch.
            </p>
          </a>

          <a
            href="https://github.com/opencv/opencv_zoo"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-xl p-4.5 group transition-all hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-sm text-white group-hover:text-indigo-300 transition-colors">
                OpenCV Model Zoo
              </span>
              <ExternalLink size={12} className="opacity-40" />
            </div>
            <p className="text-xs text-white/60 font-light">
              OpenCV Team &mdash; Lightweight YuNet ONNX face detection model.
            </p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/10 text-center text-xs text-white/50">
        <p className="mb-2">
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
        <p className="font-light text-white/40">
          Open-source community project &bull; Not affiliated with Rockstar Games, Twitch, Kick, or YouTube.
        </p>
      </footer>
    </div>
  );
}
