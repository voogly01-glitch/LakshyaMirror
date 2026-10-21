import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Target, 
  Brain, 
  Calendar, 
  FileText,
  Share2
} from 'lucide-react';
import { Exam, StudentProfile, TestAttempt } from '../types';
import { generatePreparationMirror } from '../utils/analyticsEngine';
import { sharePreparationReport, shareReportAsFile } from '../utils/shareUtils';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  profile: StudentProfile;
  attempts: TestAttempt[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  exam,
  profile,
  attempts,
}) => {
  if (!isOpen) return null;

  const mirror = generatePreparationMirror(exam, attempts);
  const printDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-base text-white">
              Official Preparation & Error Analytics Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={async () => {
                await sharePreparationReport(
                  exam.name,
                  profile.name,
                  mirror.overallCompletion,
                  mirror.overallAccuracy
                );
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-bold rounded-xl text-xs border border-indigo-500/40 shadow-md transition cursor-pointer"
              title="Share Preparation Progress Summary Link"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Share</span>
              <span>Link</span>
            </button>

            <button
              onClick={async () => {
                const reportContent = `================================================
LAKSHYAMIRROR ASPIRANT PREPARATION DOSSIER
================================================
Student: ${profile.name}
Exam: ${exam.name} (${exam.tier.toUpperCase()} LEVEL)
Generated Date: ${printDate}
Target Exam Date: ${exam.targetExamDate}

1. OVERALL STATUS & READINESS:
• Status Level: ${mirror.readinessBadge.label} (${mirror.readinessBadge.description})
• Syllabus Completed: ${mirror.overallCompletion}% (${mirror.completedTopicsCount} of ${mirror.totalTopicsCount} topics)
• Overall Test Accuracy: ${mirror.overallAccuracy}%
• Total MCQs Practiced: ${mirror.totalQuestionsPracticed}
• Negative Marks Lost: -${mirror.totalNegativeMarksDeducted} marks
• Potential Score Gain: +${mirror.potentialScoreGain} marks (recovering silly/guess slips)

2. SUMMARY OF MISTAKES:
• Conceptual Gaps: ${mirror.mistakes.conceptual} errors
• Calculation & Silly Slips: ${mirror.mistakes.calculation + mirror.mistakes.silly} errors
• Time Pressure / Rush: ${mirror.mistakes.time_pressure} errors
• Speculative Guesswork: ${mirror.mistakes.guesswork} errors
• Misread Negative Phrasing: ${mirror.mistakes.misread} errors

3. SUBJECT-WISE BREAKDOWN:
${mirror.subjectPerformance.map((s) => `• ${s.subjectName}: ${s.completionPct}% covered | ${s.accuracyPct}% accuracy | -${s.negativeDeductions} negative marks`).join('\n')}

================================================
LakshyaMirror Preparation & Error Analytics Platform
`;
                await shareReportAsFile(exam.name, profile.name, reportContent);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white font-bold rounded-xl text-xs border border-emerald-500/40 shadow-md transition cursor-pointer"
              title="Share as .txt File with navigator.share({ files })"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share File</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-900 text-slate-100 print:bg-white print:text-black">
          
          {/* Document Header */}
          <div className="border-b-2 border-indigo-500/50 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-bold print:text-indigo-700">
                LAKSHYA MIRROR • ASPIRANT DIAGNOSTIC AUDIT
              </div>
              <h1 className="text-2xl font-black text-white print:text-black mt-0.5">
                Preparation Progress & Error Analysis Report
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                Target Exam: <strong>{exam.name}</strong> ({exam.tier.toUpperCase()} LEVEL)
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 print:text-slate-700 space-y-0.5">
              <div>Student: <strong className="text-white print:text-black">{profile.name}</strong></div>
              <div>Generated: <strong>{printDate}</strong></div>
              <div>Target Date: <strong>{exam.targetExamDate}</strong></div>
            </div>
          </div>

          {/* Core Mirror Diagnostic Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 print:text-amber-700">
                  Current Status Level
                </span>
                <div className="text-xl font-black text-white print:text-black">
                  {mirror.readinessBadge.label}
                </div>
                <div className="text-xs text-slate-400 print:text-slate-600">
                  {mirror.readinessBadge.description}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 rounded bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                  <div className="text-[10px] text-slate-400 print:text-slate-500">Syllabus Done</div>
                  <div className="text-base font-bold text-emerald-400 print:text-emerald-700">{mirror.overallCompletion}%</div>
                </div>

                <div className="p-2 rounded bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                  <div className="text-[10px] text-slate-400 print:text-slate-500">Accuracy</div>
                  <div className="text-base font-bold text-indigo-400 print:text-indigo-700">{mirror.overallAccuracy}%</div>
                </div>

                <div className="p-2 rounded bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                  <div className="text-[10px] text-slate-400 print:text-slate-500">Negative Lost</div>
                  <div className="text-base font-bold text-rose-400 print:text-rose-700">-{mirror.totalNegativeMarksDeducted}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 print:text-slate-700">
              1. Subject-Wise Completion & Test Performance
            </h3>
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 border-b border-slate-800 print:border-slate-300">
                <tr>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5">Syllabus Completed</th>
                  <th className="p-2.5">Test Accuracy</th>
                  <th className="p-2.5">Negative Deductions</th>
                  <th className="p-2.5">Focus Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {mirror.subjectPerformance.map((sub) => (
                  <tr key={sub.subjectId}>
                    <td className="p-2.5 font-medium">{sub.subjectName}</td>
                    <td className="p-2.5">{sub.completionPct}%</td>
                    <td className="p-2.5">{sub.accuracyPct}%</td>
                    <td className="p-2.5 text-rose-400 print:text-rose-600">-{sub.negativeDeductions}</td>
                    <td className="p-2.5">
                      {sub.accuracyPct < 65 ? (
                        <span className="font-bold text-rose-400 print:text-rose-600">High Attention Needed</span>
                      ) : (
                        <span className="text-emerald-400 print:text-emerald-700">Stable Progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary of Mistakes */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 print:text-slate-700">
              2. Summary of Mistakes & Error Classification
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-500 block">Conceptual Gaps:</span>
                <strong className="text-base text-rose-400 print:text-rose-700">{mirror.mistakes.conceptual} errors</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-500 block">Silly / Calculation:</span>
                <strong className="text-base text-amber-400 print:text-amber-700">{mirror.mistakes.calculation + mirror.mistakes.silly} errors</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-500 block">Time Rush Panics:</span>
                <strong className="text-base text-purple-400 print:text-purple-700">{mirror.mistakes.time_pressure} errors</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-500 block">Speculative Guesses:</span>
                <strong className="text-base text-cyan-400 print:text-cyan-700">{mirror.mistakes.guesswork} errors</strong>
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 print:text-emerald-700 font-medium">
              💡 Score Recovery Forecast: Eliminating calculation slips and guesswork will recover approximately +{mirror.potentialScoreGain} marks.
            </p>
          </div>

          {/* Critical Weak Topics Alert */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 print:text-slate-700">
              3. Critical Weak Topics (High Yield Weakness Areas)
            </h3>
            <div className="space-y-2">
              {mirror.weakTopics.slice(0, 4).map((wt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-rose-500/20 print:bg-slate-50 print:border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white print:text-black">{wt.topicName}</div>
                    <div className="text-[11px] text-slate-400 print:text-slate-600">
                      {wt.subjectName} • {wt.chapterName} • Dominant: {wt.dominantMistake}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-400 print:text-rose-700">
                      {wt.accuracy > 0 ? `${wt.accuracy}% Acc` : 'Not tested'}
                    </span>
                    <div className="text-[10px] text-slate-500">{wt.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist for the Week */}
          <div className="p-4 rounded-xl border border-dashed border-slate-700 print:border-slate-300 space-y-2 text-xs">
            <h4 className="font-bold text-white print:text-black">
              Recommended 7-Day Action Plan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 print:text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Solve 30 practice MCQs for top weak topics</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Complete 1 Full-Length Major Mock Test</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Re-read formula sheet and revision notes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Review all flagged 'Review Later' questions</span>
              </label>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 text-center text-[10px] text-slate-500">
            LakshyaMirror Preparation & Monitoring Platform • Verified Student Performance Record
          </div>

        </div>

      </div>
    </div>
  );
};
