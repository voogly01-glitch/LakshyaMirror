import React from 'react';
import { 
  Compass, 
  Flame, 
  Printer, 
  Settings, 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Clock, 
  Zap, 
  BookOpen, 
  ShieldCheck,
  ChevronDown,
  Smartphone,
  Lock,
  LogOut,
  Share2,
  Crown,
  Layers,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { Exam, StudentProfile, UserSubscription, StudentUser } from '../types';
import { shareApp } from '../utils/shareUtils';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  exams: Exam[];
  currentExam: Exam;
  onSelectExam: (examId: string) => void;
  activeTab: 'roadmap' | 'mirror' | 'arena' | 'leaderboard' | 'admin';
  setActiveTab: (tab: 'roadmap' | 'mirror' | 'arena' | 'leaderboard' | 'admin') => void;
  profile: StudentProfile;
  overallCompletionPct: number;
  onOpenReport: () => void;
  onOpenPublishModal: () => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  isAdmin: boolean;
  adminEmail?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  subscription: UserSubscription;
  onOpenSubscription: () => void;
  onOpenArchitecture: () => void;
  studentUser?: StudentUser | null;
  onOpenStudentLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  exams,
  currentExam,
  onSelectExam,
  activeTab,
  setActiveTab,
  profile,
  overallCompletionPct,
  onOpenReport,
  onOpenPublishModal,
  onOpenAdminLogin,
  onAdminLogout,
  isAdmin,
  adminEmail,
  theme,
  onToggleTheme,
  subscription,
  onOpenSubscription,
  onOpenArchitecture,
  studentUser,
  onOpenStudentLogin,
}) => {
  const isLight = theme === 'light';

  return (
    <>
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors shadow-sm ${
        isLight 
          ? 'bg-white/95 border-slate-200 text-slate-800' 
          : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('roadmap')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                  <Compass className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`font-black text-lg tracking-tight ${isLight ? 'text-slate-900' : 'bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent'}`}>
                    Lakshya<span className="text-indigo-600">Mirror</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hidden xs:inline">
                    Exam GPS
                  </span>
                </div>
                <p className={`text-[11px] hidden lg:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Hierarchical Roadmap • Asli Mirror • Weakness & Negative Mark GPS
                </p>
              </div>
            </div>

            {/* Exam Selector Pill Dropdown */}
            <div className="relative group max-w-xs hidden md:block">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                isLight 
                  ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-300' 
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
              }`}>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  currentExam.tier === 'national' 
                    ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                    : currentExam.tier === 'state'
                    ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                    : currentExam.tier === 'district'
                    ? 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30'
                    : 'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                }`}>
                  {currentExam.tier}
                </span>
                <span className={`text-xs font-semibold truncate max-w-[120px] lg:max-w-[160px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentExam.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              {/* Dropdown Menu */}
              <div className={`absolute left-0 mt-1 w-80 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}>
                <div className={`px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider border-b mb-1 ${
                  isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800'
                }`}>
                  Switch Target Exam
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1">
                  {exams.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => onSelectExam(ex.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        ex.id === currentExam.id
                          ? 'bg-indigo-600/15 text-indigo-600 font-bold border border-indigo-500/30'
                          : isLight 
                          ? 'text-slate-700 hover:bg-slate-100' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold">{ex.name}</div>
                        <div className="text-[10px] opacity-70 capitalize">{ex.tier} • {ex.stream.replace('_', ' ')}</div>
                      </div>
                      {ex.id === currentExam.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar (Hidden on Mobile/Tablet) */}
            <div className="hidden xl:flex items-center gap-3 text-xs">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-800/60 border-slate-700/50'
              }`}>
                <span className="text-slate-500">Syllabus:</span>
                <div className="w-16 h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${overallCompletionPct}%` }}
                  />
                </div>
                <span className="font-bold text-indigo-600">{overallCompletionPct}%</span>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 px-3 py-1.5 rounded-lg font-bold">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>{profile.streakDays}d Streak</span>
              </div>
            </div>

            {/* Action Tools: Pro Unlock + Theme Toggle + Share + Architecture */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Subscription Pro Pass Button */}
              {subscription.isActive ? (
                <button
                  onClick={onOpenSubscription}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer"
                  title="Your LakshyaMirror Pro subscription is active"
                >
                  <Crown className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">Pro Active</span>
                  <span className="sm:hidden">Pro</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSubscription}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 transition cursor-pointer animate-pulse"
                  title="Unlock All Tests, Image MCQs & Weakness Radar (Starting ₹199)"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unlock Pro (₹199)</span>
                  <span className="sm:hidden">Pro Pass</span>
                </button>
              )}

              {/* Student Login / Profile Pill */}
              {studentUser?.isLoggedIn ? (
                <button
                  onClick={onOpenStudentLogin}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    isLight 
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900' 
                      : 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-700/80 text-indigo-200'
                  }`}
                  title={`Logged in as ${studentUser.name} (${studentUser.targetYear}) - Click to view profile & package`}
                >
                  <span className="text-base">{studentUser.avatar || '👨‍⚕️'}</span>
                  <span className="hidden sm:inline max-w-[85px] truncate">{studentUser.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenStudentLogin}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    isLight 
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' 
                      : 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-700 text-indigo-300'
                  }`}
                  title="Student Login / Registration"
                >
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Student Login</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}

              {/* Theme Toggle (White Background vs Dark) */}
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                }`}
                title={isLight ? 'Switch to Dark Mode' : 'Switch to Clean White Background'}
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Architecture Blueprint Button */}
              <button
                onClick={onOpenArchitecture}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isLight 
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' 
                    : 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-300'
                }`}
                title="View Full-Stack System Architecture Blueprint"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden md:inline">Architecture</span>
              </button>

              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* Play Store Launch Suite Button */}
              <button
                onClick={onOpenPublishModal}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300'
                }`}
                title="Google Play Store Launch Suite & AAB Deployment Kit"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Play Store</span>
                <span className="sm:hidden">Play</span>
              </button>

              {/* Native Web Share Button */}
              <button
                onClick={async () => {
                  await shareApp();
                }}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Share LakshyaMirror with Friends & Study Groups"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
              </button>

              {/* Download Report Button */}
              <button
                onClick={onOpenReport}
                className={`p-2 rounded-xl border transition cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-medium ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Download & Print Preparation Report"
              >
                <Printer className="w-4 h-4 text-indigo-500" />
                <span className="hidden lg:inline">Report</span>
              </button>

              {/* Admin Button */}
              {isAdmin ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-sm cursor-pointer"
                    title="Admin Portal Active"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                  <button
                    onClick={onAdminLogout}
                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                      isLight ? 'bg-slate-100 text-slate-500 hover:text-rose-600' : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                    }`}
                    title="Log out of Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className={`p-2 rounded-xl border transition cursor-pointer text-xs font-medium flex items-center gap-1 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title="Admin Login (PIN 7860)"
                >
                  <Lock className="w-4 h-4 text-purple-500" />
                  <span className="hidden lg:inline">Admin</span>
                </button>
              )}
            </div>

          </div>

          {/* Navigation Tabs Bar (Desktop / Tablet) */}
          <nav className={`hidden md:flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t text-xs sm:text-sm font-medium ${
            isLight ? 'border-slate-200' : 'border-slate-800/60'
          }`}>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Syllabus & Roadmap Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('mirror')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                activeTab === 'mirror'
                  ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Asli Mirror & Mistakes Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                activeTab === 'arena'
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Test Arena (PYQs & Image MCQs)</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Peer Rank & Level Comparison</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                    : 'text-purple-600 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-900/30'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin CMS (Curriculum Manager)</span>
              </button>
            )}
          </nav>

        </div>
      </header>

      {/* Persistent Bottom Navigation Bar for Mobile (< 768px) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md px-2 py-2 flex items-center justify-around text-[10px] font-bold ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-600' : 'bg-slate-950/95 border-slate-800 text-slate-300'
      }`}>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'roadmap' ? 'text-indigo-600 font-black' : 'opacity-70'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Syllabus</span>
        </button>

        <button
          onClick={() => setActiveTab('mirror')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'mirror' ? 'text-rose-600 font-black' : 'opacity-70'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>Mirror</span>
        </button>

        <button
          onClick={() => setActiveTab('arena')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'arena' ? 'text-emerald-600 font-black' : 'opacity-70'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Test Arena</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'leaderboard' ? 'text-amber-600 font-black' : 'opacity-70'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Rank</span>
        </button>

        <button
          onClick={onOpenSubscription}
          className="flex flex-col items-center gap-1 p-1 rounded-lg text-amber-500 font-black"
        >
          <Crown className="w-5 h-5 fill-amber-500/20" />
          <span>Pro Pass</span>
        </button>
      </div>
    </>
  );
};
