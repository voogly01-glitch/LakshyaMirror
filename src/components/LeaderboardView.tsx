import React from 'react';
import { 
  Award, 
  Crown, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Medal,
  Share2 
} from 'lucide-react';
import { LeaderboardEntry, Exam, StudentProfile } from '../types';
import { shareLink } from '../utils/shareUtils';

interface LeaderboardViewProps {
  currentExam: Exam;
  leaderboard: LeaderboardEntry[];
  profile: StudentProfile;
  userCompletionPct: number;
  userAccuracy: number;
  theme?: 'light' | 'dark';
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentExam,
  leaderboard,
  profile,
  userCompletionPct,
  userAccuracy,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // Find current user entry in leaderboard or construct it
  const userEntry = leaderboard.find((l) => l.isCurrentUser) || {
    id: 'user-default',
    rank: 14,
    name: `${profile.name} (You)`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    location: 'India',
    syllabusCompletion: userCompletionPct,
    averageAccuracy: userAccuracy,
    testsCompleted: 24,
    majorTestScore: 595,
    isCurrentUser: true,
  };

  const topper = leaderboard[0];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 ${
      isLight ? 'text-slate-800' : 'text-slate-100'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Peer Comparison & All-India Rank Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare your syllabus pace, test accuracy, and readiness with other aspirants of{' '}
            <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentExam.name}</strong>.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-slate-500">Your Current Rank:</span>
          <span className="font-black text-amber-500 text-base">#{userEntry.rank}</span>
          <span className="text-slate-400">• Top 4%</span>
        </div>
      </div>

      {/* Comparison Grid: You vs Topper vs Batch Average */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Your Performance Card */}
        <div className={`rounded-3xl p-5 shadow-sm relative border ${
          isLight 
            ? 'bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border-indigo-200' 
            : 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/40'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Your Stats
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 text-xs font-bold">
              Rank #{userEntry.rank}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={userEntry.avatar}
              alt="You"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
            />
            <div>
              <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{profile.name}</div>
              <div className="text-xs text-slate-500">{currentExam.name}</div>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Syllabus Covered:</span>
              <strong className="text-emerald-600 font-bold">{userCompletionPct}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test Accuracy:</span>
              <strong className="text-indigo-600 font-bold">{userAccuracy}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Score:</span>
              <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentExam.targetScore}</strong>
            </div>

            <div className="pt-2">
              <button
                onClick={async () => {
                  await shareLink(
                    `My Rank #${userEntry.rank} in ${currentExam.name} - LakshyaMirror`,
                    `🏆 I'm currently Rank #${userEntry.rank} in ${currentExam.name} on LakshyaMirror!\n• Syllabus Covered: ${userCompletionPct}%\n• Average Accuracy: ${userAccuracy}%\nBenchmark your prep on LakshyaMirror:`,
                    window.location.origin
                  );
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share My Rank & Stats</span>
              </button>
            </div>
          </div>
        </div>

        {/* Topper (AIR 1) Card */}
        <div className={`rounded-3xl p-5 shadow-sm relative border ${
          isLight ? 'bg-white border-amber-200' : 'bg-slate-900 border-amber-500/40'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Topper (AIR 1)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold">
              AIR #1
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={topper.avatar}
              alt={topper.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500"
            />
            <div>
              <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{topper.name}</div>
              <div className="text-xs text-slate-500">{topper.location}</div>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Syllabus Covered:</span>
              <strong className="text-emerald-600 font-bold">{topper.syllabusCompletion}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test Accuracy:</span>
              <strong className="text-amber-500 font-bold">{topper.averageAccuracy}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Major Test Score:</span>
              <strong className={isLight ? 'text-slate-900' : 'text-white'}>{topper.majorTestScore}</strong>
            </div>
          </div>
        </div>

        {/* Batch Average Card */}
        <div className={`rounded-3xl p-5 shadow-sm relative border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Cohort Average</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold">
              Mid Tier
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-base">
              Avg
            </div>
            <div>
              <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Active Cohort (3,400+ Aspirants)</div>
              <div className="text-xs text-slate-500">Pan-India Batch</div>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Syllabus Covered:</span>
              <strong className="text-slate-600 dark:text-slate-300">46%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test Accuracy:</span>
              <strong className="text-slate-600 dark:text-slate-300">62.5%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Major Test Score:</span>
              <strong className="text-slate-600 dark:text-slate-300">480</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Full Leaderboard Table */}
      <div className={`rounded-3xl shadow-sm overflow-hidden border ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'border-slate-800'
        }`}>
          <h2 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Top Aspirants Leaderboard</span>
          </h2>
          <span className="text-xs text-slate-500">Real-time Ranking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase tracking-wider text-[11px] border-b ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Syllabus Done</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Tests Taken</th>
                <th className="py-3 px-4 text-right">Major Score</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {leaderboard.map((entry) => {
                const isMe = entry.isCurrentUser;
                return (
                  <tr
                    key={entry.id}
                    className={`transition ${
                      isMe
                        ? isLight ? 'bg-indigo-50 text-slate-900 font-semibold border-l-4 border-l-indigo-600' : 'bg-indigo-950/40 text-white font-semibold border-l-4 border-l-indigo-500'
                        : isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-black">
                          🥇
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/40 text-slate-700 font-black">
                          🥈
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-700 font-black">
                          🥉
                        </span>
                      ) : (
                        <span className="font-bold text-slate-500">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{entry.location}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${entry.syllabusCompletion}%` }}
                          />
                        </div>
                        <span className="font-bold text-emerald-600">{entry.syllabusCompletion}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">
                      {entry.averageAccuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {entry.testsCompleted} tests
                    </td>
                    <td className={`py-3.5 px-4 text-right font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {entry.majorTestScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
