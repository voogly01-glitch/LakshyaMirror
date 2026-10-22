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
  FileText,
  Lock,
  Crown
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
  theme?: 'light' | 'dark';
  isPro?: boolean;
  onOpenSubscription?: () => void;
}

export const ErrorMirrorDashboard: React.FC<ErrorMirrorDashboardProps> = ({
  currentExam,
  attempts,
  profile,
  onLaunchWeakTopicPractice,
  onOpenReport,
  onUpdateDailyStudy,
  theme = 'light',
  isPro = false,
  onOpenSubscription,
}) => {
  const isLight = theme === 'light';
  const mirror = generatePreparationMirror(currentExam, attempts);

  // Daily work efficiency calculation
  const hoursCompleted = Math.round((profile.todayStudyMinutes / 60) * 10) / 10;
  const hoursPct = Math.min(100, Math.round((hoursCompleted / profile.dailyGoalHours) * 100));
  const qPct = Math.min(100, Math.round((profile.todayQuestionsSolved / profile.dailyGoalQuestions) * 100));
  const dailyEfficiency = Math.round((hoursPct * 0.5) + (qPct * 0.5));

  // Determine highest priority subject to focus on
  const sortedSubjectsByPriority = [...mirror.subjectPerformance].sort((a, b) => {
    return (a.accuracyPct - b.accuracyPct) || (b.negativeDeductions - a.negativeDeductions);
  });
  const prioritySubject = sortedSubjectsByPriority[0];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 ${
      isLight ? 'text-slate-800' : 'text-slate-100'
    }`}>
      
      {/* Mirror Header & One-Click Summary Banner */}
      <div className={`relative rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/60 border-slate-200'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-700/80'
      }`}>
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Asli Mirror & Error Diagnostics</span>
              </span>
              <span className="text-xs text-slate-500">
                AI & Statistical Error GPS
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Aapki Preparation Ka Real Mirror
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              यहाँ आपको पता चलेगा कि आप अभी किस लेवल पर हैं, कितनी तैयारी हो चुकी है, कौन-से टॉपिक्स कमज़ोर (Weak) हैं, और नेगेटिव मार्क्स कहाँ कट रहे हैं।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {!isPro && onOpenSubscription && (
              <button
                onClick={onOpenSubscription}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/25 transition cursor-pointer text-xs sm:text-sm"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>Unlock Full Asli Mirror (₹199)</span>
              </button>
            )}

            <button
              onClick={onOpenReport}
              className={`flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-2xl shadow-md transition cursor-pointer text-xs sm:text-sm border ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
              }`}
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>One-Click Complete Report</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Scorecard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          
          {/* Readiness Level */}
          <div className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Readiness Level</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className={`text-base sm:text-lg font-black mt-1 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {mirror.readinessBadge.label}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {mirror.readinessBadge.description}
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Syllabus Covered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {mirror.overallCompletion}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {mirror.completedTopicsCount} of {mirror.totalTopicsCount} topics done
            </div>
          </div>

          {/* Overall Test Accuracy */}
          <div className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Test Accuracy</span>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {mirror.overallAccuracy}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across {mirror.totalQuestionsPracticed} solved MCQs
            </div>
          </div>

          {/* Negative Marks Drain */}
          <div className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-rose-200 shadow-sm' : 'bg-slate-950/70 border-rose-500/30'
          }`}>
            <div className="text-xs text-rose-500 font-medium flex items-center justify-between">
              <span>Negative Marks Lost</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1">
              -{mirror.totalNegativeMarksDeducted} marks
            </div>
            <div className="text-[11px] text-rose-500 font-medium mt-1">
              Potential gain: +{mirror.potentialScoreGain} marks
            </div>
          </div>

        </div>
      </div>

      {/* 2-Column Section: Mistake Pattern Summary + Daily Work Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Mistake Pattern Breakdown (Where mistakes happen) */}
        <div className={`rounded-3xl p-5 sm:p-6 shadow-sm border space-y-5 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h2 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Summary of Mistakes (कहाँ चूक हो रही है)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Total Errors: {mirror.mistakes.totalErrors}
            </span>
          </div>

          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            अगर आप अपनी Silly Mistakes और Guesswork को कम करें, तो आपका स्कोर <strong className="text-emerald-600 font-bold">+{mirror.potentialScoreGain} मार्क्स</strong> सीधे बढ़ सकता है!
          </p>

          {/* Error Bars */}
          <div className="space-y-3.5">
            {[
              {
                tag: 'Conceptual Gaps (कांसेप्ट अधूरा / नियम भूले)',
                count: mirror.mistakes.conceptual,
                color: 'bg-rose-500',
                desc: 'Standard notes दोबारा रिवाइज करें और 15 PYQs लगायें।',
              },
              {
                tag: 'Silly / Calculation Slips (जल्दबाज़ी में गलत टिक)',
                count: mirror.mistakes.calculation + mirror.mistakes.silly,
                color: 'bg-amber-500',
                desc: 'Question पूरा पढ़ने के बाद ही टिक लगायें। Step-by-step हल करें।',
              },
              {
                tag: 'Time Pressure Panics (आखरी 10 मिनट की हड़बड़ी)',
                count: mirror.mistakes.time_pressure,
                color: 'bg-purple-500',
                desc: 'Sectional time management: Easy questions पहले करें।',
              },
              {
                tag: 'Speculative Guesswork (अंदाज़े से तुक्का लगाना)',
                count: mirror.mistakes.guesswork,
                color: 'bg-cyan-500',
                desc: 'नेगेटिव मार्किंग में Unattempted छोड़ना -1 अंक गंवाने से बेहतर है!',
              },
              {
                tag: 'Misread INCORRECT / NOT (गलत विकल्प पढ़ लिया)',
                count: mirror.mistakes.misread,
                color: 'bg-orange-500',
                desc: 'Question में NOT, INCORRECT, EXCEPT को ध्यान से देखें।',
              },
            ].map((err, idx) => {
              const totalErr = Math.max(1, mirror.mistakes.totalErrors);
              const pct = Math.round((err.count / totalErr) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{err.tag}</span>
                    <span className="text-slate-500 font-mono">
                      {err.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${err.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{err.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Work Efficiency & Target Tracker */}
        <div className={`rounded-3xl p-5 sm:p-6 shadow-sm border space-y-5 flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                <h2 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Daily Work Efficiency & Consistency
                </h2>
              </div>
              <span className="text-xs bg-amber-500/15 text-amber-600 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                {profile.streakDays} Days Active
              </span>
            </div>

            <p className={`text-xs mb-5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              रोज़ाना निर्धारित पढ़ाई और MCQs हल करने से एग्जाम डेट से पहले पूरा सिलेबस कवर होता है।
            </p>

            {/* Efficiency Meter Ring / Bar */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Today's Work Output Index</div>
                  <div className="text-3xl font-black text-amber-500 mt-0.5">
                    {dailyEfficiency}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Streak Status</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">
                    🔥 On Track
                  </div>
                </div>
              </div>

              {/* Progress bars for hours & MCQs */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Study Hours Today: <strong>{hoursCompleted} hrs</strong></span>
                    <span className="text-slate-500">Target: {profile.dailyGoalHours} hrs</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                      style={{ width: `${hoursPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Questions Solved Today: <strong>{profile.todayQuestionsSolved}</strong></span>
                    <span className="text-slate-500">Target: {profile.dailyGoalQuestions} MCQs</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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
          <div className={`p-3.5 rounded-2xl border mt-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Log Work:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateDailyStudy(30, 0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                +30 min Study
              </button>
              <button
                onClick={() => onUpdateDailyStudy(60, 0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                +1 Hour Study
              </button>
              <button
                onClick={() => onUpdateDailyStudy(0, 15)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-xs text-indigo-600 hover:text-white border border-indigo-500/30 cursor-pointer transition font-bold"
              >
                +15 MCQs Solved
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Critical Weakness Radar (कहाँ कमी है & कौन-सा Topic Weak है) */}
      <div className={`rounded-3xl p-5 sm:p-6 shadow-sm border space-y-6 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Weakness Radar: कौन-सा टॉपिक कमज़ोर है और कहाँ ध्यान देना है
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ये टॉपिक्स आपके ओवरऑल स्कोर को नीचे खींच रहे हैं। हर कमज़ोर टॉपिक के आगे सीधे 10 प्रश्नों की रिकवरी ड्रिल दी गई है।
            </p>
          </div>

          <span className="text-xs font-bold text-rose-600 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
            {mirror.weakTopics.length} Focus Areas Detected
          </span>
        </div>

        {/* Weak Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mirror.weakTopics.map((wt, idx) => (
            <div
              key={wt.topicId || idx}
              className={`rounded-2xl p-4.5 space-y-3 relative border transition-all ${
                isLight ? 'bg-slate-50 border-rose-200 hover:border-rose-300' : 'bg-slate-950 border-rose-500/30 hover:border-rose-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {wt.subjectName} • {wt.chapterName}
                  </span>
                  <h3 className={`font-bold text-sm sm:text-base mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {wt.topicName}
                  </h3>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 border border-rose-500/40">
                  {wt.urgency}
                </span>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 text-xs py-1 border-y border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">Accuracy</div>
                  <div className="font-bold text-rose-600">{wt.accuracy}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Negative Lost</div>
                  <div className="font-bold text-rose-600">-{wt.negativeMarksLost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Major Error</div>
                  <div className="font-bold text-amber-600 capitalize">{wt.dominantMistake}</div>
                </div>
              </div>

              {/* Actionable prescription */}
              <div className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-300'
              }`}>
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Solve Targeted Recovery Drill (10 Qs)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
