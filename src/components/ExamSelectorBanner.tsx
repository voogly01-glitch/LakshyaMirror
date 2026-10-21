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
  ChevronRight
} from 'lucide-react';
import { Exam, ExamTier, ExamStream } from '../types';

interface ExamSelectorBannerProps {
  exams: Exam[];
  currentExam: Exam;
  onSelectExam: (examId: string) => void;
  onLaunchMajorTest: () => void;
  overallCompletionPct: number;
}

export const ExamSelectorBanner: React.FC<ExamSelectorBannerProps> = ({
  exams,
  currentExam,
  onSelectExam,
  onLaunchMajorTest,
  overallCompletionPct,
}) => {
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
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Tier & Stream Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tier Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase">Level:</span>
            
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTier === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tiers
            </button>

            <button
              onClick={() => setSelectedTier('national')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTier === 'national'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>National</span>
            </button>

            <button
              onClick={() => setSelectedTier('state')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTier === 'state'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>State Exam</span>
            </button>

            <button
              onClick={() => setSelectedTier('district')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTier === 'district'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>District Level</span>
            </button>

            <button
              onClick={() => setSelectedTier('international')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTier === 'international'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>International</span>
            </button>
          </div>

          {/* Quick Stream Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Stream:</span>
            {(['all', 'medical', 'nursing', 'civil_services', 'state_services'] as const).map((str) => (
              <button
                key={str}
                onClick={() => setSelectedStream(str)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedStream === str
                    ? 'bg-slate-700 text-white border border-slate-500'
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
                className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    ex.tier === 'national' 
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : ex.tier === 'state'
                      ? 'bg-amber-500/20 text-amber-300'
                      : ex.tier === 'district'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {ex.tier}
                  </span>
                  <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                    {ex.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Active Exam Hero Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Title & Marking Scheme */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target Exam
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {currentExam.stream.replace('_', ' ')} • {currentExam.state || currentExam.tier}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentExam.name}
              </h1>

              <p className="text-sm text-slate-300">
                {currentExam.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Score: <strong className="text-white">{currentExam.targetScore}</strong> / {currentExam.totalMarks}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Marking Scheme: <strong className="text-emerald-400">+{currentExam.markingScheme.correct}</strong> / <strong className="text-rose-400">-{currentExam.markingScheme.incorrectPenalty}</strong> (Negative)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Date: <strong className="text-white">{currentExam.targetExamDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Countdown & Major Test Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              
              {/* Countdown Card */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center min-w-[130px]">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
                  <span>Countdown</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {daysRemaining}
                </div>
                <div className="text-[10px] text-slate-400">Days to D-Day</div>
              </div>

              {/* Major Full Test Simulation Button */}
              <div className="space-y-1.5">
                <button
                  onClick={onLaunchMajorTest}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Take Major Mock Exam</span>
                </button>
                <div className="text-[11px] text-slate-400 text-center sm:text-right">
                  {overallCompletionPct >= 60 ? (
                    <span className="text-emerald-400 font-medium">✓ Syllabus Ready for Full Mock</span>
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
