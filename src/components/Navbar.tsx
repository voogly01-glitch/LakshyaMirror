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
  Share2
} from 'lucide-react';
import { Exam, StudentProfile } from '../types';
import { shareApp } from '../utils/shareUtils';

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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('roadmap')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  Lakshya<span className="text-indigo-400">Mirror</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Prep & Error GPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Workflow • Asli Mirror • Weakness & Mistakes Analytics
              </p>
            </div>
          </div>

          {/* Exam Selector Pill Dropdown */}
          <div className="relative group max-w-xs sm:max-w-md hidden md:block">
            <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl transition cursor-pointer">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                currentExam.tier === 'national' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentExam.tier === 'state'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : currentExam.tier === 'district'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {currentExam.tier}
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px] lg:max-w-[180px]">
                {currentExam.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-1 w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                Switch Target Exam
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {exams.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => onSelectExam(ex.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      ex.id === currentExam.id
                        ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold">{ex.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ex.tier} • {ex.stream.replace('_', ' ')}</div>
                    </div>
                    {ex.id === currentExam.id && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar: Completion + Efficiency Streak */}
          <div className="hidden xl:flex items-center gap-3 text-xs">
            {/* Syllabus progress badge */}
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">Syllabus:</span>
              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallCompletionPct}%` }}
                />
              </div>
              <span className="font-bold text-indigo-300">{overallCompletionPct}%</span>
            </div>

            {/* Streak & Today Questions */}
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span className="font-bold">{profile.streakDays}d Streak</span>
              <span className="text-amber-400/60">•</span>
              <span>{profile.todayQuestionsSolved} MCQs today</span>
            </div>
          </div>

          {/* Action Tools: Play Store Publish + Download Report + Admin Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPublishModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="Publish this app to Google Play Store"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Store Guide</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium transition shadow-sm cursor-pointer"
              title="Download & Print Preparation Report"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Download Report</span>
            </button>

            <button
              onClick={async () => {
                await shareApp();
              }}
              className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 hover:text-white px-3 py-1.5 rounded-xl border border-indigo-500/40 text-xs font-medium transition shadow-sm cursor-pointer"
              title="Share LakshyaMirror with Friends & Study Groups"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Admin Authentication Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-500/20 cursor-pointer"
                  title="Admin Portal Active"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin CMS</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
                  title="Log out of Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-slate-700 hover:border-purple-500/40 transition cursor-pointer"
                title="Admin Login to manage exams and curriculum"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/60 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus & Roadmap Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('mirror')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'mirror'
                ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Asli Mirror & Mistakes Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'arena'
                ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Smart Test Arena (PYQs & Image MCQs)</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'leaderboard'
                ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Peer Rank & Level Comparison</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin CMS (Add Subjects/Tests/PYQs)</span>
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
