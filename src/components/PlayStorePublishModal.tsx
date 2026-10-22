import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  HelpCircle, 
  FileCode, 
  Sparkles,
  Layers,
  ArrowRight,
  AlertTriangle,
  Key,
  Users,
  FileText,
  Terminal,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  Info
} from 'lucide-react';

interface PlayStorePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const PlayStorePublishModal: React.FC<PlayStorePublishModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'build' | 'keystore_fix' | 'whitescreen_fix' | 'store_listing' | 'testers_guide' | 'privacy'>('build');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customPackageName, setCustomPackageName] = useState<string>('com.lakshyamirror.app');
  const [customHost, setCustomHost] = useState<string>(() => {
    try {
      return window.location.hostname || 'lakshyamirror.vercel.app';
    } catch {
      return 'lakshyamirror.vercel.app';
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab === 'store_listing' && canvasRef.current) {
      renderFeatureGraphic(canvasRef.current);
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const renderFeatureGraphic = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1024;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative grid pattern
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glowing nebula orbs
    const glow1 = ctx.createRadialGradient(250, 200, 20, 250, 200, 320);
    glow1.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
    glow1.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = glow1;
    ctx.beginPath();
    ctx.arc(250, 200, 320, 0, Math.PI * 2);
    ctx.fill();

    const glow2 = ctx.createRadialGradient(850, 320, 30, 850, 320, 300);
    glow2.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    glow2.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = glow2;
    ctx.beginPath();
    ctx.arc(850, 320, 300, 0, Math.PI * 2);
    ctx.fill();

    // App Icon Badge in banner
    ctx.save();
    ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.roundRect(100, 150, 110, 110, 24);
    ctx.fill();
    ctx.restore();

    // Icon Inner Compass Symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎯', 155, 205);

    // Main App Title
    ctx.font = '900 52px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Lakshya', 240, 190);
    ctx.fillStyle = '#818cf8';
    ctx.fillText('Mirror', 455, 190);

    // Subtitle Badge
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('OFFICIAL PLAY STORE EDITION • ALL-INDIA EXAM GPS', 242, 225);

    // Tagline
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('Hierarchical Syllabus Tracker • Asli Mistake Mirror • Image MCQs', 242, 265);

    // Target Exams Pills
    const exams = ['NEET-UG', 'AIIMS NORCET', 'JEE MAIN/ADV', 'UPSC CSE', 'STATE PSC'];
    let pillX = 242;
    ctx.font = 'bold 13px sans-serif';
    exams.forEach((exam) => {
      const textWidth = ctx.measureText(exam).width;
      const pillWidth = textWidth + 24;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, 295, pillWidth, 32, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(exam, pillX + 12, 316);

      pillX += pillWidth + 12;
    });

    // Bottom Feature Highlights Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 420, width, 80);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.lineTo(width, 420);
    ctx.stroke();

    ctx.font = '600 15px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('⚡ Negative Mark GPS', 100, 465);
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('🔬 Weakness Radar (<60% Filter)', 380, 465);
    ctx.fillStyle = '#34d399';
    ctx.fillText('📑 One-Click Dossier Export', 720, 465);
  };

  const downloadFeatureGraphic = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'lakshyamirror-playstore-feature-graphic-1024x500.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const storeListing = {
    appName: 'LakshyaMirror - Exam Prep & GPS',
    shortDesc: 'Syllabus roadmap, mock test arena, image MCQs & mistake mirror analytics.',
    fullDesc: `LakshyaMirror is India's most focused, high-yield exam preparation companion and error radar built for NEET-UG, AIIMS NORCET Nursing, JEE, UPSC Civil Services, and State PSC aspirants.

Transform the way you revise. Never repeat the same mistake twice with our proprietary "Asli Mirror" Error Analytics GPS.

🚀 KEY FEATURES:
• Hierarchical Syllabus Flow: Complete stream-to-topic syllabus tracking with interactive Theory Read, Notes Made, and Revision checkboxes.
• Asli Mirror Error Radar: Automatically categorizes your test slips into Conceptual Gaps, Silly Slips, Time Rush, and Wild Guesses.
• Negative Marking Tracker: Pinpoints exactly how many marks you bleed in negative scoring per subject.
• Weakness Radar (<60% Drill): Instantly filters all sub-topics where your accuracy drops below 60% and generates target recovery sets.
• Smart Test Arena: Chapter tests, PYQs (Past Year Questions), and full-length simulated mock tests with official marking schemes.
• Clinical & Scientific Image MCQs: Dedicated visual diagnosis tests (ECG strips, ray optics, biological specimens, electronic circuits).
• Peer Benchmarking: Compare syllabus completion percentage and mock scores against peer ranks.
• 100% Offline Capable & Private: Fast, lightweight PWA architecture that works reliably even on low-speed 2G/3G connections.

Designed with passion for hardworking aspirants aiming for their dream college and service rank!`,
    packageName: customPackageName,
    privacyUrl: `${appUrl}/privacy-policy`,
  };

  const twaManifestJson = `{
  "packageId": "${customPackageName}",
  "host": "${customHost}",
  "name": "LakshyaMirror",
  "launcherName": "LakshyaMirror",
  "themeColor": "#4F46E5",
  "navigationColor": "#020617",
  "backgroundColor": "#020617",
  "startUrl": "/",
  "iconUrl": "https://${customHost}/pwa-512x512.png",
  "maskableIconUrl": "https://${customHost}/pwa-maskable-512x512.png",
  "splashScreenFadeOutDuration": 300,
  "signingKey": {
    "path": "./android.keystore",
    "alias": "android"
  },
  "appVersionCode": 1,
  "appVersionName": "1.0.0",
  "generatorApp": "bubblewrap-cli",
  "webManifestUrl": "https://${customHost}/manifest.json",
  "fallbackType": "customtabs"
}`;

  const assetLinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "${customPackageName}",
      "sha256_cert_fingerprints": [
        "PASTE_YOUR_GOOGLE_PLAY_CONSOLE_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white">
                  Google Play Store Launch Suite
                </h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  TWA • .AAB • Play Console Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Google Trusted Web Activity packaging, signing key troubleshooter & store release kit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'build', label: '1. Build .AAB & APK', icon: Terminal },
            { id: 'keystore_fix', label: '2. Fix SHA-1 Key Mismatch', icon: Key, badge: 'Critical' },
            { id: 'whitescreen_fix', label: '3. Fix Blank Screen', icon: AlertTriangle },
            { id: 'store_listing', label: '4. Store Listing & 1024x500 Graphic', icon: ImageIcon },
            { id: 'testers_guide', label: '5. 20-Tester Closed Testing', icon: Users },
            { id: 'privacy', label: '6. Privacy Policy', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 text-white bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* TAB 1: BUILD .AAB & APK */}
          {activeTab === 'build' && (
            <div className="space-y-6">
              
              {/* Quick Status Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">PWA Manifest</div>
                    <div className="text-[11px] text-emerald-400">Ready (192, 512, Maskable)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Service Worker</div>
                    <div className="text-[11px] text-emerald-400">Registered (Offline Cache v2)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">AssetLinks Host</div>
                    <div className="text-[11px] text-indigo-400">/.well-known/assetlinks.json</div>
                  </div>
                </div>
              </div>

              {/* Package ID & Target URL Config */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Android Application Package Identity</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Must match your Google Play Console app</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Android Package ID (ApplicationId):</label>
                    <input
                      type="text"
                      value={customPackageName}
                      onChange={(e) => setCustomPackageName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-emerald-400 text-xs"
                      placeholder="com.lakshyamirror.app"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Production Web Domain (Host):</label>
                    <input
                      type="text"
                      value={customHost}
                      onChange={(e) => setCustomHost(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-indigo-400 text-xs"
                      placeholder="lakshyamirror.vercel.app"
                    />
                  </div>
                </div>
              </div>

              {/* Method A: Google's Official CLI (Bubblewrap) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      A
                    </span>
                    <h3 className="font-bold text-white text-sm">
                      Recommended: Google Official CLI (Bubblewrap)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                    Direct .AAB Output
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  Run these three commands in your computer's terminal to build the signed Android App Bundle (<code className="text-emerald-400">app-release.aab</code>) directly:
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-slate-400">Terminal Command Pipeline:</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `# 1. Install Google Bubblewrap CLI\nnpm install -g @bubblewrap/cli\n\n# 2. Initialize TWA with your live manifest\nbubblewrap init --manifest https://${customHost}/manifest.json\n\n# 3. Build signed production .aab\nbubblewrap build`,
                          'bubblewrap_all'
                        )
                      }
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'bubblewrap_all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'bubblewrap_all' ? 'Copied All!' : 'Copy Commands'}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-loose">
{`# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize TWA with your manifest
bubblewrap init --manifest https://${customHost}/manifest.json

# 3. Build production Android App Bundle (.aab)
bubblewrap build`}
                  </pre>
                </div>
              </div>

              {/* Method B: PWABuilder Alternative */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      B
                    </span>
                    <h3 className="font-bold text-white text-sm">
                      Web Browser Tool: PWABuilder (No Terminal Required)
                    </h3>
                  </div>
                  <a
                    href="https://www.pwabuilder.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition"
                  >
                    <span>Open PWABuilder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                  <li>
                    Ensure your app is deployed to a permanent public URL (e.g. on Vercel: <code>https://{customHost}</code>).
                  </li>
                  <li>
                    Paste <code>https://{customHost}</code> on <strong>pwabuilder.com</strong> and click <strong>Start</strong>.
                  </li>
                  <li>
                    Click <strong>Package for Stores</strong> $\rightarrow$ select <strong>Google Play</strong>.
                  </li>
                  <li>
                    Under Signing Key, choose <em>"Use existing keystore"</em> (if you already have one) or <em>"Create new"</em>.
                  </li>
                  <li>
                    Click <strong>Generate Package</strong> to download the ready <code className="text-emerald-400 font-bold">.zip</code> containing <code className="text-white">app-release.aab</code>.
                  </li>
                </ol>
              </div>

              {/* Source Code Download for Hosting */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Download Complete Web App Project (.zip)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload to GitHub or drag-and-drop onto <strong>Vercel</strong> or <strong>Netlify</strong> for a free 24/7 permanent custom domain.
                  </p>
                </div>
                <a
                  href="/lakshyamirror-project.zip"
                  download="lakshyamirror-project.zip"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Project .ZIP</span>
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: KEYSTORE MISMATCH FIX (SOLVES USER'S SPECIFIC ERROR) */}
          {activeTab === 'keystore_fix' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>The Google Play "Wrong Signing Key" Error (SHA-1 Mismatch)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  When you saw: <em>"Your Android App Bundle is signed with the wrong key. Expected SHA1: 58:02:A6:C9:... but uploaded has SHA1: 83:30:39:79:..."</em>, this occurs because Google Play Console saves the certificate fingerprint from the very first upload. Any subsequent upload must use the exact same key, or you must reset the upload key.
                </p>
              </div>

              {/* Resolution 1: Official Key Reset in Play Console */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Official Guaranteed Solution: Request Upload Key Reset
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Google's official automated process to accept your new keystore within 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      A
                    </span>
                    <div>
                      In <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">Google Play Console <ExternalLink className="w-3 h-3" /></a>, select your app.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      B
                    </span>
                    <div>
                      Navigate to: <strong className="text-white">Test and release</strong> $\rightarrow$ <strong className="text-white">Setup</strong> $\rightarrow$ <strong className="text-white">App integrity</strong> $\rightarrow$ Click the <strong className="text-emerald-400">App Signing</strong> tab.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      C
                    </span>
                    <div>
                      Scroll down to the <strong className="text-white">"Upload key certificate"</strong> section and click <strong className="text-rose-400 underline cursor-pointer">"Request upload key reset"</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      D
                    </span>
                    <div className="space-y-2 w-full">
                      <span>Export the public certificate from your new keystore as a <code>.pem</code> file using this command:</span>
                      
                      <div className="relative">
                        <pre className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`keytool -export -rfc -keystore android.keystore -alias android -file upload_certificate.pem`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard('keytool -export -rfc -keystore android.keystore -alias android -file upload_certificate.pem', 'keytool_export')}
                          className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'keytool_export' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      E
                    </span>
                    <div>
                      Upload the generated <code className="text-emerald-400">upload_certificate.pem</code> file and click Submit. Google will automatically approve and reset the key within 24-48 hours, and your bundle will upload seamlessly!
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution 2: Check Keystore Fingerprints */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>How to View the SHA-1 and SHA-256 of any Keystore File:</span>
                </h4>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto">
{`keytool -list -v -keystore android.keystore -alias android`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('keytool -list -v -keystore android.keystore -alias android', 'keytool_list')}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'keytool_list' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Resolution 3: If Still in Internal Testing / Draft */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <h4 className="font-bold text-indigo-300 text-xs">Alternative (If App has NOT launched publicly to Production):</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  If your app is still in internal testing or draft, you can create a new App entry in Google Play Console with Package ID <code className="text-white">com.lakshyamirror.neet</code> or <code className="text-white">in.lakshyamirror.app</code> and upload your latest generated <code>.aab</code>. Google Play accepts the fresh signing key without any mismatch error.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: BLANK / WHITE SCREEN FIX */}
          {activeTab === 'whitescreen_fix' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Why Did Nothing Show When Installed On Mobile? (White Screen Cause & Fix)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  When a TWA or APK shows a blank white screen upon launching on a physical Android device, here are the 4 verified root causes and exact solutions:
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Cause 1 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">1</span>
                    <span>Cause: Bundled with an Ephemeral AI Studio Dev URL</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7 leading-relaxed">
                    If the APK was created using a development preview URL (e.g. <code>https://ais-pre-...run.app</code>), those URLs require Google login session cookies and expire! When the Android Webview opens it, it receives a <strong>403 Forbidden</strong> or redirects to Google login, resulting in a blank screen.
                  </p>
                  <div className="pl-7 pt-1">
                    <span className="text-emerald-400 font-bold text-xs block">Solution:</span>
                    <span className="text-slate-300 text-xs">
                      Deploy the downloaded project ZIP to a free permanent production host (such as <strong>Vercel</strong> at <code>https://lakshyamirror.vercel.app</code> or a custom domain), and re-package with that permanent URL.
                    </span>
                  </div>
                </div>

                {/* Cause 2 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">2</span>
                    <span>Cause: Digital Asset Links (assetlinks.json) Verification Failure</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7 leading-relaxed">
                    Android verifies that your domain trusts your app. If <code>/.well-known/assetlinks.json</code> is missing or contains the wrong SHA-256 fingerprint, Chrome TWA might block seamless webview rendering.
                  </p>
                  <div className="pl-7 pt-1 space-y-2">
                    <span className="text-emerald-400 font-bold text-xs block">Solution:</span>
                    <p className="text-slate-300 text-xs">
                      Place your Google Play Console SHA-256 fingerprint in <code>public/.well-known/assetlinks.json</code>:
                    </p>
                    <div className="relative">
                      <pre className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
{assetLinksJson}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(assetLinksJson, 'assetlinks_json')}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'assetlinks_json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>

                    <a
                      href={`https://digitalassetlinks.googleapis.com/v1/statements:check?source.web.site=https://${customHost}&relation=delegate_permission/common.handle_all_urls&target.android_app.package_name=${customPackageName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline pt-1"
                    >
                      <span>Test AssetLinks with Google Statement API</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Cause 3 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">3</span>
                    <span>Cause: Service Worker Navigation Fallback</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7 leading-relaxed">
                    We have updated <code>public/sw.js</code> with safe <code>Promise.allSettled</code> precache and resilient <code>/index.html</code> navigation fallback, ensuring that even if the app launches without network, the cached app shell renders instantly.
                  </p>
                </div>

                {/* Cause 4 */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">4</span>
                    <span>Quick Device Fix: Clear Stale App Cache</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7 leading-relaxed">
                    On your Android test phone: Go to <strong className="text-white">Settings $\rightarrow$ Apps $\rightarrow$ LakshyaMirror $\rightarrow$ Storage $\rightarrow$ Clear Data & Cache</strong>. Then open Chrome and ensure your live URL loads normally.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: STORE LISTING & GRAPHIC KIT */}
          {activeTab === 'store_listing' && (
            <div className="space-y-6">
              
              {/* Graphic Asset Generator Section */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>Official 1024 x 500 Feature Graphic Generator</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Required by Google Play Console at the top of your store page. Click below to download the high-res PNG!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={downloadFeatureGraphic}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download 1024x500 Banner</span>
                    </button>
                    <a
                      href="/pwa-512x512.png"
                      download="lakshyamirror-icon-512x512.png"
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>512x512 Icon</span>
                    </a>
                  </div>
                </div>

                {/* Canvas Preview */}
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 shadow-xl bg-slate-950">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto block max-h-56 sm:max-h-72 object-cover"
                  />
                </div>
              </div>

              {/* Pre-written Store Listing Fields */}
              <div className="space-y-4">
                
                {/* App Name */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white text-xs">
                      App Name (30 characters max - Currently {storeListing.appName.length})
                    </label>
                    <button
                      onClick={() => copyToClipboard(storeListing.appName, 'app_name')}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'app_name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'app_name' ? 'Copied!' : 'Copy Name'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={storeListing.appName}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white text-xs">
                      Short Description (80 characters max - Currently {storeListing.shortDesc.length})
                    </label>
                    <button
                      onClick={() => copyToClipboard(storeListing.shortDesc, 'short_desc')}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'short_desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'short_desc' ? 'Copied!' : 'Copy Short Desc'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={storeListing.shortDesc}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white text-xs">
                      Full Description (High-ranking keywords for Indian exam preparation)
                    </label>
                    <button
                      onClick={() => copyToClipboard(storeListing.fullDesc, 'full_desc')}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'full_desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'full_desc' ? 'Copied!' : 'Copy Full Desc'}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={8}
                    value={storeListing.fullDesc}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans leading-relaxed"
                  />
                </div>

                {/* Category & Tags Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white text-xs block">Category & Rating:</span>
                    <p className="text-slate-400 text-xs">
                      • Category: <strong>Education</strong><br />
                      • Content Rating: <strong>Everyone / 3+</strong><br />
                      • Target Age: <strong>13-15, 16-17, 18+</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white text-xs block">Recommended Store Tags:</span>
                    <p className="text-slate-400 text-xs">
                      Education, Exam Preparation, Study Tools, Mock Test, NEET Preparation
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: 20-TESTER CLOSED TESTING GUIDE */}
          {activeTab === 'testers_guide' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                  <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Google Play 20-Tester Rule (Closed Testing for 14 Days)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Since late 2023, Google requires all personal developer accounts to run a <strong>Closed Test with at least 20 testers opted-in for 14 consecutive days</strong> before applying for Production release. Here is how to complete this effortlessly:
                </p>
              </div>

              {/* Step-by-Step Closed Testing Setup */}
              <div className="space-y-3">
                {[
                  {
                    step: 'Step 1: Create a Google Group',
                    action: 'Go to groups.google.com and create a free group (e.g. lakshyamirror-testers@googlegroups.com). Make membership "Anyone can join" or invite via email.',
                  },
                  {
                    step: 'Step 2: Add Group to Closed Testing in Play Console',
                    action: 'Go to Testing -> Closed testing -> Select your track -> Click "Testers" tab -> Choose "Google Groups" and enter your group email address.',
                  },
                  {
                    step: 'Step 3: Upload your .AAB to the Closed Testing Track',
                    action: 'Click "Create new release" -> Upload app-release.aab -> Save and rollout release to Closed testing.',
                  },
                  {
                    step: 'Step 4: Share the Opt-In Link with 20 Friends / Students',
                    action: 'Copy the "Join on Android" or "Join on the web" link from the bottom of the Testers tab and send it to 20 testers.',
                  },
                  {
                    step: 'Step 5: Keep Testers Opted In for 14 Days',
                    action: 'Testers must install the app on their phone and keep it installed for 14 days. Afterward, the "Apply for production" button unlocks in your dashboard!',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-white text-xs block">{item.step}</strong>
                    <p className="text-slate-400 text-xs">{item.action}</p>
                  </div>
                ))}
              </div>

              {/* Ready-to-Send WhatsApp / Telegram Message Template */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-white text-xs">
                    Ready-to-Send WhatsApp / Telegram Tester Invite Message:
                  </label>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Hey! 🎯 I've built LakshyaMirror, an advanced NEET & competitive exam preparation and error analytics app. I need 20 beta testers on Google Play Store before our official release. Could you please opt-in and test it? It takes just 1 minute:\n\n1. Join our Google Group: https://groups.google.com\n2. Download on Play Store: [PASTE_PLAY_CONSOLE_OPT_IN_LINK_HERE]\n\nThank you so much for your support! 🙏`,
                        'tester_msg'
                      )
                    }
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'tester_msg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'tester_msg' ? 'Copied Message!' : 'Copy Message'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={6}
                  value={`Hey! 🎯 I've built LakshyaMirror, an advanced NEET & competitive exam preparation and error analytics app. I need 20 beta testers on Google Play Store before our official release. Could you please opt-in and test it? It takes just 1 minute:

1. Join our Google Group: https://groups.google.com
2. Download on Play Store: [PASTE_PLAY_CONSOLE_OPT_IN_LINK_HERE]

Thank you so much for your support! 🙏`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-mono text-xs"
                />
              </div>

            </div>
          )}

          {/* TAB 6: PRIVACY POLICY (MANDATORY FOR PLAY STORE APPROVAL) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Google Play Required Privacy Policy</span>
                  </h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `# Privacy Policy for LakshyaMirror\nEffective Date: ${new Date().toLocaleDateString()}\n\nLakshyaMirror ("we", "our", or "us") is dedicated to protecting the privacy of students and aspirants preparing for competitive examinations.\n\n1. Data Collection:\nLakshyaMirror does NOT sell, rent, or trade your personal information. Test attempt history, syllabus checkboxes, and error analytics are securely stored locally on your device via standard browser storage APIs.\n\n2. Child & Student Privacy:\nLakshyaMirror is designed for educational purposes and complies with Google Play Families and Student Privacy standards. We do not knowingly collect personal information from children under 13 without parental consent.\n\n3. Third-Party Services:\nWe may use standard Google Play Services for application delivery and analytics. No advertising networks track your study habits.\n\n4. Contact Us:\nIf you have any questions regarding this Privacy Policy, contact us at: support@lakshyamirror.app`,
                        'privacy_policy'
                      )
                    }
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'privacy_policy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'privacy_policy' ? 'Copied Policy!' : 'Copy Policy Text'}</span>
                  </button>
                </div>
                <p className="text-slate-400 text-xs">
                  Google Play strictly requires a public Privacy Policy URL in <strong className="text-white">Policy $\rightarrow$ App content $\rightarrow$ Privacy Policy</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">Pre-formatted Legal Privacy Policy:</span>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs leading-relaxed space-y-2 max-h-72 overflow-y-auto">
                  <h4 className="font-bold text-white">Privacy Policy for LakshyaMirror</h4>
                  <p className="text-[11px] text-slate-400">Effective Date: October 2026</p>
                  <p>
                    LakshyaMirror ("we", "our", or "us") provides this Privacy Policy to inform you of our policies regarding the collection, use, and disclosure of personal data when you use the LakshyaMirror mobile and web application.
                  </p>
                  <h5 className="font-bold text-white pt-1">1. Information Collection and Storage</h5>
                  <p>
                    All test attempts, customized syllabus bookmarks, error category tags (Silly Slips, Conceptual Gaps), and mock test scores are stored locally on your device using client-side Web Storage. We do not sell your study patterns or personal details to advertisers.
                  </p>
                  <h5 className="font-bold text-white pt-1">2. Offline First Architecture</h5>
                  <p>
                    LakshyaMirror functions offline using Progressive Web App service workers. Static assets are cached directly on your device to guarantee uninterrupted revision in low-connectivity areas.
                  </p>
                  <h5 className="font-bold text-white pt-1">3. Student and Child Safety</h5>
                  <p>
                    LakshyaMirror is fully compliant with Google Play Developer Program Policies, COPPA, and Indian student digital data safety norms.
                  </p>
                  <h5 className="font-bold text-white pt-1">4. Contact Information</h5>
                  <p>
                    For questions or support regarding privacy, please contact the development team at <strong>support@lakshyamirror.app</strong>.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready for Google Play Console Submission</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition"
            >
              Close
            </button>
            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <span>Open Play Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
