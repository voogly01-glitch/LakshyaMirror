import React, { useState } from 'react';
import { 
  X, 
  Layout, 
  Server, 
  Globe, 
  Database, 
  CheckCircle2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  Cloud, 
  ShieldCheck,
  Zap,
  Terminal,
  FileCode
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [activeSegment, setActiveSegment] = useState<'frontend' | 'backend' | 'hosting' | 'storage'>('frontend');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className={`w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200 border transition-colors ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-slate-900 border-slate-700/80 text-slate-100'
        }`}
      >
        
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b flex items-start sm:items-center justify-between gap-4 ${
          isLight ? 'bg-indigo-50/50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                <Layers className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-black text-lg sm:text-xl tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  System Architecture & Infrastructure Blueprint
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 border border-indigo-500/30">
                  Full-Stack Architecture
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Detailed breakdown of Frontend, Backend, Cloud Hosting, and Data Storage layers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Segment Navigation Tabs */}
        <div className={`flex border-b text-xs font-bold overflow-x-auto no-scrollbar ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          {[
            { id: 'frontend', label: '1. Frontend Segment', icon: Layout, desc: 'Web, Tablet & Mobile UI' },
            { id: 'backend', label: '2. Backend Segment', icon: Server, desc: 'Node/Express & UPI Webhooks' },
            { id: 'hosting', label: '3. Hosting Segment', icon: Globe, desc: 'CDN, Cloud Run & Play Store' },
            { id: 'storage', label: '4. Data Storage Segment', icon: Database, desc: 'IndexedDB & Relational Schemas' },
          ].map((tab) => {
            const isActive = activeSegment === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSegment(tab.id as any)}
                className={`flex-1 py-3.5 px-4 text-center border-b-2 whitespace-nowrap transition cursor-pointer flex flex-col items-center gap-1 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:text-indigo-400'
                    : isLight
                    ? 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                <span className="text-[10px] font-normal opacity-80 hidden sm:inline">
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Segment Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          
          {/* ========================================================================= */}
          {/* SEGMENT 1: FRONTEND */}
          {/* ========================================================================= */}
          {activeSegment === 'frontend' && (
            <div className="space-y-6">
              
              {/* Responsive Display Architecture (Web, Tablet, Mobile) */}
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Monitor className="w-4 h-4 text-indigo-500" />
                  <span>Responsive Display Architecture (Web • Tablet • Mobile)</span>
                </h3>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  Tailwind CSS v4 with mobile-first viewport styling ensuring long medical diagrams and question text render with zero horizontal overflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Web Display */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center gap-2 font-bold text-xs text-indigo-500 mb-2">
                      <Monitor className="w-4 h-4" />
                      <span>Desktop Web (≥ 1024px)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• Split-pane CBT Test Arena (Question left, Question Palette right)</li>
                      <li>• 4-Column Asli Mirror Error breakdown & KPI dashboards</li>
                      <li>• Full-width syllabus roadmap with inline Theory/Notes checkboxes</li>
                      <li>• Fixed Top Navigation with quick progress telemetry bar</li>
                    </ul>
                  </div>

                  {/* Tablet Display */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center gap-2 font-bold text-xs text-purple-500 mb-2">
                      <Tablet className="w-4 h-4" />
                      <span>Tablet / iPad (768px - 1023px)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• 2-Column fluid responsive card grid</li>
                      <li>• Touch-optimized 44px tap targets for MCQ radio options</li>
                      <li>• Swipeable test question palette with compact badges</li>
                      <li>• Optimized landscape/portrait PDF generation view</li>
                    </ul>
                  </div>

                  {/* Mobile Display */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-500 mb-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile Device (&lt; 768px)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• Single column stack with sticky bottom action buttons</li>
                      <li>• Full-screen modal test view with image pinch-zoom overlay</li>
                      <li>• Horizontal scroll filter pills for subjects & exam tiers</li>
                      <li>• Native Web Share API integration (WhatsApp / Telegram)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Core Frontend Tech Stack & Libraries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                  <h4 className="font-bold text-xs uppercase text-indigo-500">Core UI Libraries</h4>
                  <div className="space-y-1 text-slate-500">
                    <div>• <strong>React 19 + TypeScript</strong>: High-speed JSX component rendering</div>
                    <div>• <strong>Tailwind CSS v4</strong>: Theme-aware utility classes (`bg-white` & dark mode)</div>
                    <div>• <strong>Lucide React</strong>: 50+ lightweight SVG iconography elements</div>
                    <div>• <strong>Canvas Confetti</strong>: Student victory micro-animations</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                  <h4 className="font-bold text-xs uppercase text-emerald-500">PWA & Offline Engine</h4>
                  <div className="space-y-1 text-slate-500">
                    <div>• <strong>Service Worker (`sw.js`)</strong>: Cache-first static asset precaching</div>
                    <div>• <strong>Web App Manifest</strong>: 512x512 maskable icons, standalone display</div>
                    <div>• <strong>Web Share API (`shareLink`, `shareFiles`)</strong>: Native system sheet sharing</div>
                    <div>• <strong>LocalStorage Sync</strong>: Offline syllabus progress & test attempts</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SEGMENT 2: BACKEND */}
          {/* ========================================================================= */}
          {activeSegment === 'backend' && (
            <div className="space-y-6">
              
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Server className="w-4 h-4 text-purple-500" />
                  <span>Node.js / Express Server Architecture & API Endpoints</span>
                </h3>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  Lightweight backend running Express handles curriculum retrieval, test score calculations with negative penalties, and payment gateway webhooks.
                </p>

                {/* API Endpoints Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border rounded-xl overflow-hidden text-[11px]">
                    <thead className={isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'}>
                      <tr>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Endpoint</th>
                        <th className="p-2.5">Purpose</th>
                        <th className="p-2.5">Security / Auth</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? 'divide-slate-200 bg-white' : 'divide-slate-800 bg-slate-900'}`}>
                      <tr>
                        <td className="p-2.5 font-mono text-emerald-600 font-bold">GET</td>
                        <td className="p-2.5 font-mono">/api/exams</td>
                        <td>Returns multi-tier exam curricula (NEET, NORCET, UPSC)</td>
                        <td>Public / Cached</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-indigo-600 font-bold">POST</td>
                        <td className="p-2.5 font-mono">/api/tests/evaluate</td>
                        <td>Server-side grading: applies +4/-1 or +1/-0.33 marking</td>
                        <td>Session Token</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-purple-600 font-bold">POST</td>
                        <td className="p-2.5 font-mono">/api/payments/razorpay/order</td>
                        <td>Generates INR order for UPI / RuPay payment</td>
                        <td>HMAC-SHA256 signature</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-purple-600 font-bold">POST</td>
                        <td className="p-2.5 font-mono">/api/payments/webhook</td>
                        <td>Webhook handler: activates student subscription</td>
                        <td>Secret Key Verify</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono text-amber-600 font-bold">POST</td>
                        <td className="p-2.5 font-mono">/api/admin/verify</td>
                        <td>Verifies 4-digit Master Security PIN (7860)</td>
                        <td>Rate-Limited / PIN Salt</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Payment Webhook Express Route */}
              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-900 text-slate-200' : 'bg-slate-950 border-slate-800 text-slate-200'}`}>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Backend Payment Webhook Sample (`server.ts`)</span>
                  <button
                    onClick={() => copyCode(`// Express UPI Webhook Verification
app.post('/api/payments/webhook', async (req, res) => {
  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const { userId, planId } = payment.notes;
    await activateSubscription(userId, planId, payment.id);
    return res.json({ status: 'ok', unlocked: true });
  }
  res.status(200).send();
});`, 'webhook')}
                    className="flex items-center gap-1 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'webhook' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`app.post('/api/payments/webhook', async (req, res) => {
  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const { userId, planId } = payment.notes;
    await activateSubscription(userId, planId, payment.id);
    return res.json({ status: 'ok', unlocked: true });
  }
  res.status(200).send();
});`}
                </pre>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SEGMENT 3: HOSTING */}
          {/* ========================================================================= */}
          {activeSegment === 'hosting' && (
            <div className="space-y-6">
              
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Production Hosting, Edge CDN & Google Play Store Pipeline</span>
                </h3>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  The production build deploys as a static edge SPA backed by Google Cloud Run / Vercel Edge with zero latency for Indian users.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  
                  {/* Edge Web Hosting */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h4 className="font-bold text-xs text-indigo-500 mb-1.5">Edge CDN Web Hosting</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• <strong>Vercel / Cloud Run</strong>: Automatic Mumbai/Delhi edge nodes</li>
                      <li>• <strong>SSL & HTTPS</strong>: Automatic Let's Encrypt TLS 1.3 certificates</li>
                      <li>• <strong>Brotli & Gzip Compression</strong>: 187KB gzipped total bundle size</li>
                      <li>• <strong>Custom Domain</strong>: `lakshyamirror.com` DNS CNAME records</li>
                    </ul>
                  </div>

                  {/* Android Play Store Package */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h4 className="font-bold text-xs text-emerald-500 mb-1.5">Android Google Play Store (.aab)</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• <strong>Google TWA</strong>: Trusted Web Activity wrapper (Chrome 72+)</li>
                      <li>• <strong>App Bundle</strong>: `app-release.aab` signed with release keystore</li>
                      <li>• <strong>Package ID</strong>: `com.lakshyamirror.app`</li>
                      <li>• <strong>Native UI</strong>: Standalone mode without browser address bar</li>
                    </ul>
                  </div>

                  {/* Domain Ownership Verification */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h4 className="font-bold text-xs text-purple-500 mb-1.5">Digital Asset Links</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-500">
                      <li>• <strong>Path</strong>: `/.well-known/assetlinks.json`</li>
                      <li>• <strong>Verification</strong>: SHA-256 fingerprint validation</li>
                      <li>• <strong>Zero Browser Chrome</strong>: Ensures native app look on phone</li>
                      <li>• <strong>MIME Header</strong>: `Content-Type: application/json`</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Deploy Command Checklist */}
              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Quick 1-Command Production Deployments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px]">
                    <span className="text-slate-500"># Deploy to Vercel (100% Free Edge)</span>
                    <div className="text-emerald-400 mt-1">npx vercel --prod</div>
                  </div>
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px]">
                    <span className="text-slate-500"># Deploy to Firebase Hosting</span>
                    <div className="text-indigo-400 mt-1">firebase deploy --only hosting</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SEGMENT 4: DATA STORAGE */}
          {/* ========================================================================= */}
          {activeSegment === 'storage' && (
            <div className="space-y-6">
              
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Data Storage & Database Schemas (Client Offline + Cloud DB)</span>
                </h3>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  Two-tier data strategy: IndexedDB/LocalStorage on the device for 100% offline test taking, synced with PostgreSQL / Firestore in the cloud.
                </p>

                {/* Database Table Schemas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  
                  {/* Users & Subscriptions Schema */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h4 className="font-bold text-xs text-indigo-500 mb-1.5 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>1. Users & Subscriptions Schema</span>
                    </h4>
                    <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[10px] text-indigo-300 overflow-x-auto">
{`TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(120) UNIQUE,
  target_exam_id VARCHAR(64),
  streak_days INT DEFAULT 0,
  daily_goal_questions INT DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW()
);

TABLE subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  plan_tier VARCHAR(32), -- 'monthly', 'target6m', 'annual'
  is_active BOOLEAN DEFAULT TRUE,
  valid_until DATE,
  upi_ref VARCHAR(100),
  amount_inr INT
);`}
                    </pre>
                  </div>

                  {/* Tests & Mistakes Schema */}
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h4 className="font-bold text-xs text-emerald-500 mb-1.5 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>2. Tests & Mistake Mirror Schema</span>
                    </h4>
                    <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[10px] text-emerald-300 overflow-x-auto">
{`TABLE test_attempts (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  exam_id VARCHAR(64),
  test_type VARCHAR(32), -- 'practice', 'mock', 'pyq', 'major'
  net_score NUMERIC(5,2),
  max_score INT,
  accuracy NUMERIC(5,2),
  negative_marks NUMERIC(5,2),
  timestamp BIGINT
);

TABLE mistake_logs (
  id VARCHAR(64) PRIMARY KEY,
  attempt_id VARCHAR(64) REFERENCES test_attempts(id),
  question_id VARCHAR(64),
  mistake_tag VARCHAR(32), -- 'conceptual', 'silly', 'time'
  user_note TEXT
);`}
                    </pre>
                  </div>

                </div>
              </div>

              {/* Local Storage Keys Reference */}
              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Offline Client Storage Keys</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded border">lakshya_exams</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded border">lakshya_attempts</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded border">lakshya_subscription</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded border">lakshya_theme</div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Architecture verified for high-concurrency CBT exam loads and Play Store TWA guidelines.</span>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
