import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EXAMS, 
  INITIAL_QUESTIONS, 
  INITIAL_TEST_ATTEMPTS, 
  INITIAL_PROFILE, 
  INITIAL_LEADERBOARD 
} from './data/initialData';
import { INITIAL_SUBSCRIPTION } from './data/subscriptionPlans';
import { INITIAL_STUDENTS } from './data/studentsData';
import { INITIAL_CUSTOM_PACKAGES } from './data/customPackagesData';
import { 
  Exam, 
  Question, 
  TestAttempt, 
  StudentProfile, 
  LeaderboardEntry, 
  ExamSubject, 
  ExamChapter, 
  ExamTopic,
  UserSubscription,
  ThemeMode,
  StudentUser,
  CustomPackage
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
import { SubscriptionModal } from './components/SubscriptionModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { 
  Play, 
  ShieldCheck, 
  Brain, 
  Award, 
  Eye, 
  RotateCcw, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Crown,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state: defaults to crisp 'light' white background as requested
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('lakshya_theme') as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Indian Student Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('lakshya_subscription');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION;
    } catch {
      return INITIAL_SUBSCRIPTION;
    }
  });

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

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isStudentLoginModalOpen, setIsStudentLoginModalOpen] = useState<boolean>(false);

  // Students & Custom Packages State
  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [studentUser, setStudentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('lakshya_student_user');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS[0];
    } catch {
      return INITIAL_STUDENTS[0];
    }
  });

  const [customPackages, setCustomPackages] = useState<CustomPackage[]>(() => {
    try {
      const saved = localStorage.getItem('lakshya_custom_packages');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOM_PACKAGES;
    } catch {
      return INITIAL_CUSTOM_PACKAGES;
    }
  });

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
      localStorage.setItem('lakshya_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_student_user', JSON.stringify(studentUser));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [studentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_custom_packages', JSON.stringify(customPackages));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [customPackages]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lakshya_theme', theme);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('lakshya_subscription', JSON.stringify(subscription));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [subscription]);

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
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
      setSubscription(INITIAL_SUBSCRIPTION);
      setTheme('light');
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

  const handleStudentLogin = (user: StudentUser) => {
    setStudentUser(user);
    if (user.targetExamId) {
      setCurrentExamId(user.targetExamId);
      setProfile((prev) => ({ ...prev, currentExamId: user.targetExamId }));
    }
    if (user.subscriptionTier && user.subscriptionTier !== 'free') {
      setSubscription({
        tier: user.subscriptionTier as any,
        isActive: true,
        validUntil: user.subscriptionExpiry || '',
        planName: user.subscriptionPlanName || 'Lakshya Pro',
      });
    }
    setStudents((prev) => prev.map((s) => (s.id === user.id ? { ...user, isLoggedIn: true } : s)));
  };

  const handleStudentLogout = () => {
    if (studentUser) {
      setStudents((prev) => prev.map((s) => (s.id === studentUser.id ? { ...s, isLoggedIn: false } : s)));
    }
    setStudentUser(null);
  };

  const handleStudentUpdate = (updatedUser: StudentUser) => {
    setStudentUser(updatedUser);
    setStudents((prev) => prev.map((s) => (s.id === updatedUser.id ? updatedUser : s)));
  };

  const handleAddCustomPackage = (newPkg: CustomPackage) => {
    setCustomPackages((prev) => [newPkg, ...prev]);
  };

  const handleUpdateCustomPackage = (updatedPkg: CustomPackage) => {
    setCustomPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  const handleDeleteCustomPackage = (pkgId: string) => {
    setCustomPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const handleUpdateStudents = (updatedList: StudentUser[]) => {
    setStudents(updatedList);
    if (studentUser) {
      const fresh = updatedList.find((s) => s.id === studentUser.id);
      if (fresh) {
        setStudentUser(fresh);
        if (fresh.subscriptionTier && fresh.subscriptionTier !== 'free') {
          setSubscription({
            tier: fresh.subscriptionTier as any,
            isActive: true,
            validUntil: fresh.subscriptionExpiry || '',
            planName: fresh.subscriptionPlanName || 'Lakshya Pro',
          });
        }
      }
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 pb-16 md:pb-0 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      
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
        theme={theme}
        onToggleTheme={handleToggleTheme}
        subscription={subscription}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        studentUser={studentUser}
        onOpenStudentLogin={() => setIsStudentLoginModalOpen(true)}
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
          theme={theme}
          isPro={subscription.isActive}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
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
            theme={theme}
            isPro={subscription.isActive}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
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
            theme={theme}
            isPro={subscription.isActive}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {/* TAB 3: SMART TEST ARENA */}
        {activeTab === 'arena' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Smart Test Arena & Mock Exam Simulator
                  </h1>
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Experience Computer Based Test (CBT) environment with negative marking, image-based MCQs, and instant error diagnosis.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    handleLaunchTest({
                      testType: 'major',
                      title: `${currentExam.name} - Full Length Major Mock Test`,
                    })
                  }
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Launch Major Mock Test</span>
                  {!subscription.isActive && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">PRO</span>
                  )}
                </button>
              </div>
            </div>

            {/* 4 Test Modes Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-3xl p-5 space-y-3 border transition ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Topic Practice Drill</h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                  className={`w-full py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Start Practice
                </button>
              </div>

              <div className={`rounded-3xl p-5 space-y-3 border transition ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Chapter Mock Test</h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                  className="w-full py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600 text-purple-600 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Take Chapter Mock
                </button>
              </div>

              <div className={`rounded-3xl p-5 space-y-3 border transition ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>PYQs Past Papers</h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                  className="w-full py-2 rounded-xl bg-amber-600/15 hover:bg-amber-600 text-amber-600 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Solve PYQs
                </button>
              </div>

              <div className={`rounded-3xl p-5 space-y-3 border transition ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-cyan-500/30'
              }`}>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Image-Based MCQs Drill</h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                  className="w-full py-2 rounded-xl bg-cyan-600/15 hover:bg-cyan-600 text-cyan-600 hover:text-white text-xs font-semibold cursor-pointer transition"
                >
                  Start Image Drill
                </button>
              </div>
            </div>

            {/* Past Test History & Mistake Review */}
            <div className={`rounded-3xl p-5 sm:p-6 shadow-sm border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>Recent Test History & Error Monitoring</span>
              </h2>

              <div className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {testAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{att.testTitle}</span>
                        <span className={`uppercase text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {att.testType}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {new Date(att.timestamp).toLocaleDateString()} • {att.attempted}/{att.totalQuestions} attempted
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-slate-500">Score / Max</div>
                        <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{att.netScore} / {att.maxScore}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-slate-500">Accuracy</div>
                        <div className="font-bold text-emerald-600">{att.accuracy}%</div>
                      </div>

                      <div className="text-right">
                        <div className="text-rose-500 font-bold">-{att.negativeMarks} neg</div>
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
            theme={theme}
            students={students}
            onUpdateStudents={handleUpdateStudents}
            customPackages={customPackages}
            onAddCustomPackage={handleAddCustomPackage}
            onUpdateCustomPackage={handleUpdateCustomPackage}
            onDeleteCustomPackage={handleDeleteCustomPackage}
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

      {/* Indian Student Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentSubscription={subscription}
        onActivateSubscription={(newSub) => setSubscription(newSub)}
        theme={theme}
        customPackages={customPackages}
        targetExamId={currentExamId}
      />

      {/* Full-Stack Architecture Blueprint Modal (Frontend, Backend, Hosting, Data Storage) */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        theme={theme}
      />

      {/* Student Login, Registration & Profile Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginModalOpen}
        onClose={() => setIsStudentLoginModalOpen(false)}
        currentUser={studentUser}
        onLogin={handleStudentLogin}
        onLogout={handleStudentLogout}
        onUpdateUser={handleStudentUpdate}
        exams={exams}
        subscription={subscription}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        theme={theme}
      />

    </div>
  );
}
