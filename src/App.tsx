import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EXAMS, 
  INITIAL_QUESTIONS, 
  INITIAL_TEST_ATTEMPTS, 
  INITIAL_PROFILE, 
  INITIAL_LEADERBOARD 
} from './data/initialData';
import { 
  Exam, 
  Question, 
  TestAttempt, 
  StudentProfile, 
  LeaderboardEntry, 
  ExamSubject, 
  ExamChapter, 
  ExamTopic 
} from './types';
import { calculateExamCompletion, generatePreparationMirror } from './utils/analyticsEngine';
import { Navbar } from './components/Navbar';
import { ExamSelectorBanner } from './components/ExamSelectorBanner';
import { RoadmapSyllabusView } from './components/RoadmapSyllabusView';
import { ErrorMirrorDashboard } from './components/ErrorMirrorDashboard';
import { TestEngineModal } from './components/TestEngineModal';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminPortal } from './components/AdminPortal';
import { PrintReportModal } from './components/PrintReportModal';
import { PlayStorePublishModal } from './components/PlayStorePublishModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { 
  Play, 
  ShieldCheck, 
  Brain, 
  Award, 
  Eye, 
  RotateCcw, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  // Load state from localStorage or initial dataset
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_exams');
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [currentExamId, setCurrentExamId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lakshya_current_exam_id');
      return saved || 'exam-neet-ug';
    } catch {
      return 'exam-neet-ug';
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_questions');
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_attempts');
      return saved ? JSON.parse(saved) : INITIAL_TEST_ATTEMPTS;
    } catch {
      return INITIAL_TEST_ATTEMPTS;
    }
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('lakshya_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<'roadmap' | 'mirror' | 'arena' | 'leaderboard' | 'admin'>('roadmap');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('lakshya_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      return sessionStorage.getItem('lakshya_admin_email') || 'voogly01@gmail.com';
    } catch {
      return 'voogly01@gmail.com';
    }
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [activeTestParams, setActiveTestParams] = useState<{
    testType: 'practice' | 'mock' | 'pyq' | 'major';
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    title: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lakshya_exams', JSON.stringify(exams));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_current_exam_id', currentExamId);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [currentExamId]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_questions', JSON.stringify(questions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_attempts', JSON.stringify(testAttempts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [testAttempts]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [profile]);

  // Current active exam object
  const currentExam = exams.find((e) => e.id === currentExamId) || exams[0];

  // Calculate overall metrics
  const completionData = calculateExamCompletion(currentExam);
  const mirrorData = generatePreparationMirror(currentExam, testAttempts);

  // Handlers
  const handleSelectExam = (examId: string) => {
    setCurrentExamId(examId);
    setProfile((prev) => ({ ...prev, currentExamId: examId }));
  };

  const handleUpdateTopic = (
    subjectId: string,
    chapterId: string,
    topicId: string,
    updates: Partial<ExamTopic>
  ) => {
    setExams((prevExams) =>
      prevExams.map((exam) => {
        if (exam.id !== currentExam.id) return exam;

        const updatedSubjects = exam.subjects.map((sub) => {
          if (sub.id !== subjectId) return sub;

          const updatedChapters = sub.chapters.map((chap) => {
            if (chap.id !== chapterId) return chap;

            const updatedTopics = chap.topics.map((t) => {
              if (t.id !== topicId) return t;
              return { ...t, ...updates };
            });

            return { ...chap, topics: updatedTopics };
          });

          return { ...sub, chapters: updatedChapters };
        });

        return { ...exam, subjects: updatedSubjects };
      })
    );
  };

  const handleLaunchTest = (params: {
    testType: 'practice' | 'mock' | 'pyq' | 'major';
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    title: string;
  }) => {
    setActiveTestParams(params);
  };

  const handleSaveAttempt = (attempt: TestAttempt) => {
    setTestAttempts((prev) => [attempt, ...prev]);

    // Update student daily metrics
    setProfile((prev) => ({
      ...prev,
      todayQuestionsSolved: prev.todayQuestionsSolved + attempt.attempted,
      todayStudyMinutes: prev.todayStudyMinutes + Math.round(attempt.timeSpentSeconds / 60),
    }));

    // Update leaderboard entry
    setLeaderboard((prev) =>
      prev.map((entry) => {
        if (!entry.isCurrentUser) return entry;
        return {
          ...entry,
          syllabusCompletion: completionData.overallPercentage,
          averageAccuracy: mirrorData.overallAccuracy || 75,
          testsCompleted: entry.testsCompleted + 1,
        };
      })
    );
  };

  const handleUpdateDailyStudy = (minutes: number, questionsCount: number) => {
    setProfile((prev) => ({
      ...prev,
      todayStudyMinutes: prev.todayStudyMinutes + minutes,
      todayQuestionsSolved: prev.todayQuestionsSolved + questionsCount,
    }));
  };

  // Admin Handlers
  const handleAddExam = (newExam: Exam) => {
    setExams((prev) => [...prev, newExam]);
    setCurrentExamId(newExam.id);
  };

  const handleAddSubject = (examId: string, subject: ExamSubject) => {
    setExams((prev) =>
      prev.map((ex) => (ex.id === examId ? { ...ex, subjects: [...ex.subjects, subject] } : ex))
    );
  };

  const handleAddChapter = (examId: string, subjectId: string, chapter: ExamChapter) => {
    setExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== examId) return ex;
        const subs = ex.subjects.map((s) =>
          s.id === subjectId ? { ...s, chapters: [...s.chapters, chapter] } : s
        );
        return { ...ex, subjects: subs };
      })
    );
  };

  const handleAddTopic = (
    examId: string,
    subjectId: string,
    chapterId: string,
    topic: ExamTopic
  ) => {
    setExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== examId) return ex;
        const subs = ex.subjects.map((s) => {
          if (s.id !== subjectId) return s;
          const chaps = s.chapters.map((c) =>
            c.id === chapterId ? { ...c, topics: [...c.topics, topic] } : c
          );
          return { ...s, chapters: chaps };
        });
        return { ...ex, subjects: subs };
      })
    );
  };

  const handleAddQuestion = (question: Question) => {
    setQuestions((prev) => [question, ...prev]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset to initial authentic sample data?')) {
      localStorage.clear();
      setExams(INITIAL_EXAMS);
      setQuestions(INITIAL_QUESTIONS);
      setTestAttempts(INITIAL_TEST_ATTEMPTS);
      setProfile(INITIAL_PROFILE);
      setLeaderboard(INITIAL_LEADERBOARD);
      setCurrentExamId('exam-neet-ug');
      setActiveTab('roadmap');
    }
  };

  const handleAdminLoginSuccess = (email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    try {
      sessionStorage.setItem('lakshya_admin_auth', 'true');
      sessionStorage.setItem('lakshya_admin_email', email);
    } catch {}
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('lakshya_admin_auth');
    } catch {}
    if (activeTab === 'admin') {
      setActiveTab('roadmap');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        exams={exams}
        currentExam={currentExam}
        onSelectExam={handleSelectExam}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        overallCompletionPct={completionData.overallPercentage}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        isAdmin={isAdmin}
        adminEmail={adminEmail}
      />

      {/* Target Exam Selector & Hero Banner (Shown on Roadmap, Mirror, Arena) */}
      {activeTab !== 'admin' && (
        <ExamSelectorBanner
          exams={exams}
          currentExam={currentExam}
          onSelectExam={handleSelectExam}
          onLaunchMajorTest={() =>
            handleLaunchTest({
              testType: 'major',
              title: `${currentExam.name} - Full Length Major Mock Test`,
            })
          }
          overallCompletionPct={completionData.overallPercentage}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB 1: ROADMAP & SYLLABUS CHECKLIST */}
        {activeTab === 'roadmap' && (
          <RoadmapSyllabusView
            currentExam={currentExam}
            onUpdateTopic={handleUpdateTopic}
            onLaunchTest={handleLaunchTest}
          />
        )}

        {/* TAB 2: ASLI MIRROR & ERROR WEAKNESS ANALYTICS */}
        {activeTab === 'mirror' && (
          <ErrorMirrorDashboard
            currentExam={currentExam}
            attempts={testAttempts}
            profile={profile}
            onLaunchWeakTopicPractice={(topicId, topicName, subjectId, chapterId) => {
              handleLaunchTest({
                testType: 'practice',
                subjectId,
                chapterId,
                topicId,
                title: `${topicName} - Targeted Weakness Recovery Drill`,
              });
            }}
            onOpenReport={() => setIsReportModalOpen(true)}
            onUpdateDailyStudy={handleUpdateDailyStudy}
          />
        )}

        {/* TAB 3: SMART TEST ARENA */}
        {activeTab === 'arena' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    Smart Test Arena & Mock Exam Simulator
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Experience Computer Based Test (CBT) environment with negative marking, image-based MCQs, and instant error diagnosis.
                </p>
              </div>

              <button
                onClick={() =>
                  handleLaunchTest({
                    testType: 'major',
                    title: `${currentExam.name} - Full Length Major Mock Test`,
                  })
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Major Mock Test</span>
              </button>
            </div>

            {/* 4 Test Modes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Topic Practice Drill</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Quick 10-15 questions to check fundamental concept retention.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleLaunchTest({
                      testType: 'practice',
                      title: `${currentExam.name} - Practice Drill`,
                    })
                  }
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition"
                >
                  Start Practice
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Chapter Mock Test</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Timed chapter test with negative marking penalty and score analysis.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleLaunchTest({
                      testType: 'mock',
                      title: `${currentExam.name} - Chapter Mock Test`,
                    })
                  }
                  className="w-full py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Take Chapter Mock
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">PYQs Past Papers</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Authentic exam questions from 2024, 2023, 2022 archives.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleLaunchTest({
                      testType: 'pyq',
                      title: `${currentExam.name} - Past Year Papers (PYQ)`,
                    })
                  }
                  className="w-full py-2 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Solve PYQs
                </button>
              </div>

              <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Image-Based MCQs Drill</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Dedicated paper with ECGs, surgical tools, circuits, and diagrams.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleLaunchTest({
                      testType: 'mock',
                      title: `${currentExam.name} - High-Yield Image MCQs Paper`,
                    })
                  }
                  className="w-full py-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Start Image Drill
                </button>
              </div>
            </div>

            {/* Past Test History & Mistake Review */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                <span>Recent Test History & Error Monitoring</span>
              </h2>

              <div className="divide-y divide-slate-800">
                {testAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{att.testTitle}</span>
                        <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {att.testType}
                        </span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        {new Date(att.timestamp).toLocaleDateString()} • {att.attempted}/{att.totalQuestions} attempted
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-slate-400">Score / Max</div>
                        <div className="font-bold text-white">{att.netScore} / {att.maxScore}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-slate-400">Accuracy</div>
                        <div className="font-bold text-emerald-400">{att.accuracy}%</div>
                      </div>

                      <div className="text-right">
                        <div className="text-rose-400 font-bold">-{att.negativeMarks} neg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PEER COMPARISON & LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            currentExam={currentExam}
            leaderboard={leaderboard}
            profile={profile}
            userCompletionPct={completionData.overallPercentage}
            userAccuracy={mirrorData.overallAccuracy || 74}
          />
        )}

        {/* TAB 5: ADMIN CMS */}
        {activeTab === 'admin' && (
          <AdminPortal
            exams={exams}
            allQuestions={questions}
            onAddExam={handleAddExam}
            onAddSubject={handleAddSubject}
            onAddChapter={handleAddChapter}
            onAddTopic={handleAddTopic}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Interactive CBT Test Engine Modal */}
      {activeTestParams && (
        <TestEngineModal
          isOpen={!!activeTestParams}
          onClose={() => setActiveTestParams(null)}
          exam={currentExam}
          testParams={activeTestParams}
          allQuestions={questions}
          onSaveAttempt={handleSaveAttempt}
        />
      )}

      {/* Printable / Downloadable Preparation Report Modal */}
      <PrintReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        exam={currentExam}
        profile={profile}
        attempts={testAttempts}
      />

      {/* Google Play Store Publishing Guide Modal */}
      <PlayStorePublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        appUrl={window.location.origin}
      />

      {/* Admin Authentication & PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
