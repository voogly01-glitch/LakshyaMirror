import React, { useState } from 'react';
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
  ArrowRight
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
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const storeListing = {
    appName: 'LakshyaMirror - Exam Prep & Error GPS',
    shortDesc: 'Complete syllabus tracking, mock tests, image MCQs & mistake mirror analytics.',
    fullDesc: `LakshyaMirror is your complete exam preparation roadmap and performance monitoring companion designed for competitive exams across all tiers — National (NEET-UG, AIIMS NORCET Nursing, UPSC Civil Services, JEE), State PSC, and District level examinations.

Key Highlights:
• Hierarchical Syllabus Flow: Stream -> Exam -> Subjects -> Chapters -> Topics.
• Step-by-Step Preparation Checklist: Mark Theory Read, Notes Made, Revision Done with live progress percentages.
• Real-time "Asli Mirror" Error Analytics: Automatically tracks negative marks lost and categorizes mistakes into Conceptual Gaps, Silly Slips, Time Rush, and Guesswork.
• Weakness Radar: Pinpoints exact weak topics with <60% accuracy and generates instant targeted recovery drills.
• Smart Test Arena: Practice drills, Chapter Mock Tests, PYQs (Past Year Papers), and full-length Major Tests with authentic negative marking.
• Image-Based MCQs: Dedicated visual questions (ECG traces, clinical instruments, physics ray optics, circuits).
• Peer Benchmarking: Compare syllabus coverage and accuracy against peers and toppers.
• One-Click Printable Performance Dossier: Export comprehensive PDF preparation reports for review.`,
    packageName: 'com.lakshyamirror.app',
  };

  const assetLinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.lakshyamirror.app",
      "sha256_cert_fingerprints": [
        "PASTE_YOUR_PLAY_CONSOLE_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white">
                  Publish to Google Play Store
                </h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Console Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Google TWA (Trusted Web Activity) & PWA Android App Bundle (.aab) Deployment Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Navigation Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { num: 1, title: '1. Generate .AAB Bundle' },
            { num: 2, title: '2. Play Console Setup' },
            { num: 3, title: '3. Store Listing Copy' },
            { num: 4, title: '4. Digital Asset Links' },
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex-1 py-3 px-4 text-center border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeStep === step.num
                  ? 'border-emerald-500 text-white bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* STEP 1: GENERATE .AAB */}
          {activeStep === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Recommended: PWABuilder (Official Microsoft & Google Chromium Tool)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  PWABuilder packages your web application into a signed, production-ready Android App Bundle (<code>.aab</code>) in under 3 minutes without requiring Android Studio installed.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm">3-Minute Step-by-Step Instructions:</h4>
                
                <ol className="list-decimal list-inside space-y-3 pl-1 leading-relaxed">
                  <li>
                    <strong className="text-white">Copy your App URL:</strong>
                    <div className="mt-1 flex items-center gap-2 max-w-lg">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400 text-xs"
                      />
                      <button
                        onClick={() => copyToClipboard(appUrl, 'appUrl')}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'appUrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'appUrl' ? 'Copied' : 'Copy URL'}</span>
                      </button>
                    </div>
                  </li>

                  <li>
                    <strong className="text-white">Open PWABuilder:</strong>
                    <div className="mt-1">
                      <a
                        href="https://www.pwabuilder.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-semibold"
                      >
                        <span>Open PWABuilder.com</span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      </a>
                    </div>
                  </li>

                  <li>
                    Paste the URL and click <strong className="text-white">"Start"</strong>. It will test your app manifest (which we've already configured with name, icons, and theme colors).
                  </li>

                  <li>
                    Click <strong className="text-white">"Package for Stores"</strong> $\rightarrow$ Select <strong className="text-emerald-400">"Google Play"</strong>.
                  </li>

                  <li>
                    Fill in the package configuration:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-400">
                      <li>Package ID: <code className="text-slate-200">{storeListing.packageName}</code></li>
                      <li>App Name: <code className="text-slate-200">{storeListing.appName}</code></li>
                      <li>Version Name: <code className="text-slate-200">1.0.0</code> (Version code: <code className="text-slate-200">1</code>)</li>
                      <li>Signing Key: Choose <em>"Create new"</em> or let PWABuilder generate your keystore.</li>
                    </ul>
                  </li>

                  <li>
                    Click <strong className="text-white">"Generate Package"</strong>. Download the generated <code className="text-emerald-400">.zip</code> file. Inside you will find <strong className="text-white">`app-release.aab`</strong>.
                  </li>
                </ol>
              </div>

              {/* Alternative method: Bubblewrap CLI */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Alternative: Google's Official CLI (Bubblewrap)</span>
                <p className="text-slate-400 text-[11px]">
                  If you prefer using terminal commands:
                </p>
                <pre className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-300 text-[11px] overflow-x-auto">
{`npm install -g @bubblewrap/cli
bubblewrap init --manifest ${appUrl}/manifest.json
bubblewrap build`}
                </pre>
              </div>
            </div>
          )}

          {/* STEP 2: PLAY CONSOLE SETUP */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-1">
                  Google Play Console Setup Checklist
                </h3>
                <p className="text-slate-400">
                  Follow these steps in your verified Google Play Console account at{' '}
                  <a
                    href="https://play.google.com/console"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline inline-flex items-center gap-1"
                  >
                    play.google.com/console <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 'Step 1: Create App',
                    details: 'Click "Create app". App name: "LakshyaMirror", Default language: English (or Hindi), App or game: "App", Free or paid: "Free". Accept Developer Program Policies.',
                  },
                  {
                    step: 'Step 2: App Access',
                    details: 'Select "All functionality in my app is available without special access restrictions".',
                  },
                  {
                    step: 'Step 3: Ads Declaration',
                    details: 'Select "No, my app does not contain ads" (or Yes if you add AdMob later).',
                  },
                  {
                    step: 'Step 4: Content Rating Questionnaire',
                    details: 'Category: "Educational / Utility". Answer the simple violence/offensive language questionnaire (all No). Rating will be "Everyone / 3+".',
                  },
                  {
                    step: 'Step 5: Target Audience',
                    details: 'Select age groups: 13-15, 16-17, 18 and over (Aspirants & Students).',
                  },
                  {
                    step: 'Step 6: Government & News App Declarations',
                    details: 'Select "No" for News app, COVID-19 app, Financial apps, and Government app.',
                  },
                  {
                    step: 'Step 7: Store Settings & Category',
                    details: 'App category: "Education". Tags: Education, Exam Preparation, Study. Contact email: your email.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-white text-xs block">{item.step}</strong>
                    <p className="text-slate-400 text-xs">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: STORE LISTING COPY */}
          {activeStep === 3 && (
            <div className="space-y-5">
              <p className="text-slate-400">
                Copy and paste these pre-written store listing texts directly into your Google Play Store listing page:
              </p>

              {/* App Title */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-white text-xs">App Name (up to 30 characters)</label>
                  <button
                    onClick={() => copyToClipboard(storeListing.appName, 'name')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'name' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={storeListing.appName}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-white text-xs">Short Description (up to 80 characters)</label>
                  <button
                    onClick={() => copyToClipboard(storeListing.shortDesc, 'short')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'short' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'short' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={storeListing.shortDesc}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-white text-xs">Full Description</label>
                  <button
                    onClick={() => copyToClipboard(storeListing.fullDesc, 'full')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'full' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={storeListing.fullDesc}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white leading-relaxed font-sans"
                />
              </div>

              {/* Graphic Assets Requirements */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Required Graphic Assets for Play Store:</span>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-xs">
                  <li><strong className="text-slate-200">App Icon</strong>: 512 x 512 px PNG (32-bit color, with alpha)</li>
                  <li><strong className="text-slate-200">Feature Graphic</strong>: 1024 x 500 px JPG or PNG (banner for top of store page)</li>
                  <li><strong className="text-slate-200">Phone Screenshots</strong>: At least 2 screenshots (16:9 or 9:16 aspect ratio). You can take screenshots directly from this app in your browser!</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 4: DIGITAL ASSET LINKS */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Digital Asset Links Verification (Full-Screen Native Mode)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Google Play uses <code>assetlinks.json</code> to prove that your Android app owns the web domain. Once verified, Android removes the browser URL address bar completely, giving your users a 100% native full-screen app experience!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-white text-xs">
                    File Location: <code>public/.well-known/assetlinks.json</code>
                  </label>
                  <button
                    onClick={() => copyToClipboard(assetLinksJson, 'assetlinks')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'assetlinks' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'assetlinks' ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
{assetLinksJson}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <strong className="text-indigo-300 text-xs block">Where to get your SHA-256 fingerprint:</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-xs pl-1">
                  <li>In Google Play Console, go to your app $\rightarrow$ <strong className="text-slate-200">Setup</strong> $\rightarrow$ <strong className="text-slate-200">App Signing</strong>.</li>
                  <li>Copy the <strong className="text-slate-200">"SHA-256 certificate fingerprint"</strong>.</li>
                  <li>Paste it into <code>public/.well-known/assetlinks.json</code> inside the quotes.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <strong className="text-emerald-300 text-xs block">Final Step: Upload & Release!</strong>
                <p className="text-slate-400 text-xs">
                  Go to <strong className="text-slate-200">Testing $\rightarrow$ Internal testing</strong> (or Production) $\rightarrow$ Click <strong className="text-slate-200">Create new release</strong> $\rightarrow$ Drag and drop your <code className="text-emerald-400 font-bold">app-release.aab</code> file $\rightarrow$ Click <strong className="text-emerald-400">Review release</strong> $\rightarrow$ Submit!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
            disabled={activeStep === 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            Previous Step
          </button>

          <div className="text-xs text-slate-400">
            Step {activeStep} of 4
          </div>

          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep((s) => Math.min(4, s + 1))}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Done • Ready to Publish
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
