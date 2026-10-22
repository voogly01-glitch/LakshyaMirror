import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Building2, 
  Flame, 
  Target, 
  Calendar, 
  AlertCircle, 
  Play, 
  Sparkles,
  ChevronRight,
  Crown,
  Lock
} from 'lucide-react';
import { Exam, ExamTier, ExamStream } from '../types';

interface ExamSelectorBannerProps {
  exams: Exam[];
  currentExam: Exam;
  onSelectExam: (examId: string) => void;
  onLaunchMajorTest: () => void;
  overallCompletionPct: number;
  theme?: 'light' | 'dark';
  isPro?: boolean;
  onOpenSubscription?: () => void;
}

export const ExamSelectorBanner: React.FC<ExamSelectorBannerProps> = ({
  exams,
  currentExam,
  onSelectExam,
  onLaunchMajorTest,
  overallCompletionPct,
  theme = 'light',
  isPro = false,
  onOpenSubscription,
}) => {
  const isLight = theme === 'light';
  const [selectedTier, setSelectedTier] = React.useState<ExamTier | 'all'>(currentExam.tier);
  const [selectedStream, setSelectedStream] = React.useState<ExamStream | 'all'>('all');

  // Filter exams by selected tier and stream
  const filteredExams = exams.filter((ex) => {
    const tierMatches = selectedTier === 'all' || ex.tier === selectedTier;
    const streamMatches = selectedStream === 'all' || ex.stream === selectedStream;
    return tierMatches && streamMatches;
  });

  // Calculate days remaining to target exam date
  const daysRemaining = React.useMemo(() => {
    const targetDate = new Date(currentExam.targetExamDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [currentExam.targetExamDate]);

  return (
    <div className={`border-b transition-colors px-4 sm:px-6 lg:px-8 py-5 sm:py-6 ${
      isLight 
        ? 'bg-white border-slate-200' 
        : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800/80 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        
        {/* Tier & Stream Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tier Buttons */}
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/90 border-slate-700'
          }`}>
            <span className="text-[11px] font-semibold text-slate-500 px-2 uppercase">Level:</span>
            
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedTier === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              All Tiers
            </button>

            <button
              onClick={() => setSelectedTier('national')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedTier === 'national'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>National</span>
            </button>

            <button
              onClick={() => setSelectedTier('state')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedTier === 'state'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>State Exam</span>
            </button>

            <button
              onClick={() => setSelectedTier('district')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedTier === 'district'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>District Level</span>
            </button>

            <button
              onClick={() => setSelectedTier('international')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedTier === 'international'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>International</span>
            </button>
          </div>

          {/* Quick Stream Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Stream:</span>
            {(['all', 'medical', 'nursing', 'civil_services', 'state_services'] as const).map((str) => (
              <button
                key={str}
                onClick={() => setSelectedStream(str)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  selectedStream === str
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {str === 'all'
                  ? 'All Streams'
                  : str === 'medical'
                  ? 'Medical (NEET)'
                  : str === 'nursing'
                  ? 'Nursing (NORCET)'
                  : str === 'civil_services'
                  ? 'Civil Services (UPSC)'
                  : 'State / District Admin'}
              </button>
            ))}
          </div>

        </div>

        {/* Exam Cards Carousel / Selection Row */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {filteredExams.map((ex) => {
            const isCurrent = ex.id === currentExam.id;
            return (
              <button
                key={ex.id}
                onClick={() => onSelectExam(ex.id)}
                className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                    : isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : ex.tier === 'national' 
                      ? 'bg-emerald-500/20 text-emerald-600'
                      : ex.tier === 'state'
                      ? 'bg-amber-500/20 text-amber-600'
                      : ex.tier === 'district'
                      ? 'bg-cyan-500/20 text-cyan-600'
                      : 'bg-purple-500/20 text-purple-600'
                  }`}>
                    {ex.tier}
                  </span>
                  <span className="text-xs font-semibold truncate max-w-[180px] sm:max-w-[220px]">
                    {ex.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Active Exam Hero Banner */}
        <div className={`relative rounded-3xl p-5 sm:p-7 shadow-lg overflow-hidden border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-100'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30'
        }`}>
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Title & Marking Scheme */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600/10 text-indigo-600 border border-indigo-500/20">
                  Target Exam
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {currentExam.stream.replace('_', ' ')} • {currentExam.state || currentExam.tier} Level
                </span>
              </div>

              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {currentExam.name}
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {currentExam.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800/80 border-slate-700/60 text-slate-200'
                }`}>
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Target: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentExam.targetScore}</strong> / {currentExam.totalMarks}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800/80 border-slate-700/60 text-slate-200'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    Marking: <strong className="text-emerald-600">+{currentExam.markingScheme.correct}</strong> / <strong className="text-rose-500">-{currentExam.markingScheme.incorrectPenalty}</strong> (Negative)
                  </span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800/80 border-slate-700/60 text-slate-200'
                }`}>
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Target Date: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentExam.targetExamDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Countdown & Major Test Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto">
              
              {/* Countdown Card */}
              <div className={`p-4 rounded-2xl text-center min-w-[130px] border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  <span>Countdown</span>
                </div>
                <div className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {daysRemaining}
                </div>
                <div className="text-[10px] text-slate-500">Days to D-Day</div>
              </div>

              {/* Major Full Test Simulation Button */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    if (!isPro && onOpenSubscription) {
                      // Prompt upgrade or allow launch
                      onLaunchMajorTest();
                    } else {
                      onLaunchMajorTest();
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Launch Major Mock Test</span>
                  {!isPro && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold ml-1">
                      PRO
                    </span>
                  )}
                </button>
                <div className="text-[11px] text-slate-500 text-center sm:text-right">
                  {overallCompletionPct >= 60 ? (
                    <span className="text-emerald-600 font-semibold">✓ Syllabus Ready for Full Mock</span>
                  ) : (
                    <span>Syllabus {overallCompletionPct}% • Recommended before D-Day</span>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
