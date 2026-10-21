import React from 'react';
import { 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Flame, 
  Target, 
  Download, 
  Play, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  ShieldAlert, 
  Lightbulb, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { Exam, StudentProfile, TestAttempt } from '../types';
import { generatePreparationMirror } from '../utils/analyticsEngine';

interface ErrorMirrorDashboardProps {
  currentExam: Exam;
  attempts: TestAttempt[];
  profile: StudentProfile;
  onLaunchWeakTopicPractice: (topicId: string, topicName: string, subjectId: string, chapterId: string) => void;
  onOpenReport: () => void;
  onUpdateDailyStudy: (minutes: number, questions: number) => void;
}

export const ErrorMirrorDashboard: React.FC<ErrorMirrorDashboardProps> = ({
  currentExam,
  attempts,
  profile,
  onLaunchWeakTopicPractice,
  onOpenReport,
  onUpdateDailyStudy,
}) => {
  const mirror = generatePreparationMirror(currentExam, attempts);

  // Daily work efficiency calculation
  const hoursCompleted = Math.round((profile.todayStudyMinutes / 60) * 10) / 10;
  const hoursPct = Math.min(100, Math.round((hoursCompleted / profile.dailyGoalHours) * 100));
  const qPct = Math.min(100, Math.round((profile.todayQuestionsSolved / profile.dailyGoalQuestions) * 100));
  const dailyEfficiency = Math.round((hoursPct * 0.5) + (qPct * 0.5));

  // Determine highest priority subject to focus on
  const sortedSubjectsByPriority = [...mirror.subjectPerformance].sort((a, b) => {
    // Sort by low accuracy and high negative deductions
    return (a.accuracyPct - b.accuracyPct) || (b.negativeDeductions - a.negativeDeductions);
  });
  const prioritySubject = sortedSubjectsByPriority[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Mirror Header & One-Click Summary Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Asli Mirror & Error Diagnostics</span>
              </span>
              <span className="text-xs text-slate-400">
                AI & Statistical Error Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aapki Preparation Ka Real Mirror
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Yahan aapko pta chalega ki aap abhi kis level par hain, kitni preparation ho chuki hai, konse topics weak hain, aur negative marks kahan kat rahe hain.
            </p>
          </div>

          {/* One-Click Download Report Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenReport}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition cursor-pointer text-sm"
            >
              <Download className="w-4 h-4" />
              <span>One-Click Complete Report</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Scorecard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          
          {/* Readiness Level */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Readiness Level</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-1 truncate">
              {mirror.readinessBadge.label}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {mirror.readinessBadge.description}
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Syllabus Covered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {mirror.overallCompletion}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {mirror.completedTopicsCount} of {mirror.totalTopicsCount} topics done
            </div>
          </div>

          {/* Overall Test Accuracy */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Test Accuracy</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {mirror.overallAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across {mirror.totalQuestionsPracticed} solved MCQs
            </div>
          </div>

          {/* Negative Marks Drain */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-500/30">
            <div className="text-xs text-rose-300 font-medium flex items-center justify-between">
              <span>Negative Marks Lost</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1">
              -{mirror.totalNegativeMarksDeducted} marks
            </div>
            <div className="text-[11px] text-rose-300/80 mt-1">
              Potential gain: +{mirror.potentialScoreGain} marks
            </div>
          </div>

        </div>

      </div>

      {/* 2-Column Section: Mistake Pattern Summary + Daily Work Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mistake Pattern Breakdown (Where mistakes happen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Summary of Mistakes (Kaha Chook Ho Rahi Hai)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Total Errors: {mirror.mistakes.totalErrors}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Agar aap apni silly mistakes aur guesswork ko eliminate karein, toh aapka target score{' '}
            <strong className="text-emerald-400 font-bold">+{mirror.potentialScoreGain} marks</strong> seedha increase hoga!
          </p>

          {/* Error Bars */}
          <div className="space-y-3.5">
            {[
              {
                tag: 'Conceptual Gaps',
                count: mirror.mistakes.conceptual,
                color: 'bg-rose-500',
                desc: 'Concepts or formulas not clear yet. Re-read standard textbook notes.',
              },
              {
                tag: 'Silly / Calculation Slips',
                count: mirror.mistakes.calculation + mirror.mistakes.silly,
                color: 'bg-amber-500',
                desc: 'Calculation hurry or misreading options. Do 10 numericals without calculator.',
              },
              {
                tag: 'Time Pressure Panics',
                count: mirror.mistakes.time_pressure,
                color: 'bg-purple-500',
                desc: 'Rushed in the last minutes. Practice sectional time management.',
              },
              {
                tag: 'Speculative Guesswork',
                count: mirror.mistakes.guesswork,
                color: 'bg-cyan-500',
                desc: 'Wild guessing. Under negative marking, unattempted is better than -1!',
              },
              {
                tag: 'Misread INCORRECT / NOT',
                count: mirror.mistakes.misread,
                color: 'bg-orange-500',
                desc: 'Overlooked negative phrasing in question stem. Underline key words.',
              },
            ].map((err, idx) => {
              const totalErr = Math.max(1, mirror.mistakes.totalErrors);
              const pct = Math.round((err.count / totalErr) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{err.tag}</span>
                    <span className="text-slate-400 font-mono">
                      {err.count} instances ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${err.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{err.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Work Efficiency & Target Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Daily Work Efficiency & Consistency
                </h2>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
                {profile.streakDays} Days Consistent
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5">
              Daily disciplined output ensures complete coverage before the exam date.
            </p>

            {/* Efficiency Meter Ring / Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Today's Work Output Index</div>
                  <div className="text-3xl font-black text-amber-400 mt-0.5">
                    {dailyEfficiency}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Streak Status</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    🔥 On Track
                  </div>
                </div>
              </div>

              {/* Progress bars for hours & MCQs */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Study Hours Today: {hoursCompleted} hrs</span>
                    <span className="text-slate-400">Target: {profile.dailyGoalHours} hrs</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                      style={{ width: `${hoursPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Questions Solved Today: {profile.todayQuestionsSolved}</span>
                    <span className="text-slate-400">Target: {profile.dailyGoalQuestions} MCQs</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${qPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Log Increment Buttons */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Log Work:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateDailyStudy(30, 0)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 cursor-pointer transition"
              >
                +30 min Study
              </button>
              <button
                onClick={() => onUpdateDailyStudy(60, 0)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 cursor-pointer transition"
              >
                +1 Hour Study
              </button>
              <button
                onClick={() => onUpdateDailyStudy(0, 15)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-xs text-indigo-200 hover:text-white border border-indigo-500/40 cursor-pointer transition font-medium"
              >
                +15 MCQs Solved
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Critical Weakness Radar (Kaha Kami Hai & Konsa Topic Weak Hai) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Weakness Radar: Konsa Topic Weak Hai & Kaha Kami Hai
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ye topics aapke score ko neeche kheench rahe hain. Har weak topic ke aage direct practice drill di gayi hai.
            </p>
          </div>

          <span className="text-xs font-bold text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
            {mirror.weakTopics.length} Focus Areas Detected
          </span>
        </div>

        {/* Weak Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mirror.weakTopics.map((wt, idx) => (
            <div
              key={wt.topicId || idx}
              className="bg-slate-950 border border-rose-500/30 rounded-xl p-4.5 space-y-3 relative hover:border-rose-400 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {wt.subjectName} • {wt.chapterName}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-0.5">
                    {wt.topicName}
                  </h3>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {wt.urgency}
                </span>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 text-xs py-1 border-y border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">Accuracy</div>
                  <div className="font-bold text-rose-400">{wt.accuracy}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Negative Lost</div>
                  <div className="font-bold text-rose-400">-{wt.negativeMarksLost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Major Error</div>
                  <div className="font-bold text-amber-300 capitalize">{wt.dominantMistake}</div>
                </div>
              </div>

              {/* Actionable prescription */}
              <div className="flex items-start gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{wt.recommendation}</span>
              </div>

              {/* Launch Targeted Practice Button */}
              <button
                onClick={() =>
                  onLaunchWeakTopicPractice(
                    wt.topicId,
                    wt.topicName,
                    wt.subjectName,
                    wt.chapterName
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Solve Targeted Recovery Drill (10 Qs)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-Wise Focus Guidance (Konsa Subject Me Kitna Dhyan Dena Hai) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Subject-Wise Focus Guidance (Konsa Subject Me Kitna Dhyan Dena Hai)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Har subject ka completion percentage aur accuracy dekh kar daily schedule plan karein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mirror.subjectPerformance.map((sub) => {
            const isHighPriority = sub.accuracyPct < 65 || sub.completionPct < 50;

            return (
              <div
                key={sub.subjectId}
                className={`p-4 rounded-xl border ${
                  isHighPriority
                    ? 'bg-rose-950/15 border-rose-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-white">{sub.subjectName}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isHighPriority
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isHighPriority ? 'High Attention' : 'On Track'}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Syllabus Covered:</span>
                      <strong className="text-white">{sub.completionPct}%</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${sub.completionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Average Accuracy:</span>
                    <strong className={sub.accuracyPct >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                      {sub.accuracyPct}%
                    </strong>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Negative Marks Lost:</span>
                    <strong className="text-rose-400">-{sub.negativeDeductions} marks</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
