import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Layers, 
  BookOpen, 
  FileQuestion, 
  Save, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  RefreshCw,
  FolderPlus,
  ShieldCheck,
  Award,
  Lock,
  KeyRound,
  Users,
  PackageCheck
} from 'lucide-react';
import { Exam, ExamSubject, ExamChapter, ExamTopic, Question, ExamTier, ExamStream, MistakeTag, StudentUser, CustomPackage } from '../types';
import { AdminStudentsTab } from './admin/AdminStudentsTab';
import { AdminPackagesTab } from './admin/AdminPackagesTab';

interface AdminPortalProps {
  exams: Exam[];
  allQuestions: Question[];
  onAddExam: (exam: Exam) => void;
  onAddSubject: (examId: string, subject: ExamSubject) => void;
  onAddChapter: (examId: string, subjectId: string, chapter: ExamChapter) => void;
  onAddTopic: (examId: string, subjectId: string, chapterId: string, topic: ExamTopic) => void;
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onResetData: () => void;
  theme?: 'light' | 'dark';
  students: StudentUser[];
  onUpdateStudents: (students: StudentUser[]) => void;
  customPackages: CustomPackage[];
  onAddCustomPackage: (pkg: CustomPackage) => void;
  onUpdateCustomPackage: (pkg: CustomPackage) => void;
  onDeleteCustomPackage: (pkgId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  exams,
  allQuestions,
  onAddExam,
  onAddSubject,
  onAddChapter,
  onAddTopic,
  onAddQuestion,
  onDeleteQuestion,
  onResetData,
  theme = 'light',
  students,
  onUpdateStudents,
  customPackages,
  onAddCustomPackage,
  onUpdateCustomPackage,
  onDeleteCustomPackage,
}) => {
  const isLight = theme === 'light';
  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'packages' | 'questions' | 'curriculum' | 'new_exam' | 'security'>('students');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security PIN states
  const [customPin, setCustomPin] = useState(localStorage.getItem('lakshya_admin_pin') || '7860');
  const [newPinVal, setNewPinVal] = useState('');
  const [confirmPinVal, setConfirmPinVal] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Form states: New Question
  const [qExamId, setQExamId] = useState(exams[0]?.id || '');
  const [qSubjectId, setQSubjectId] = useState(exams[0]?.subjects[0]?.id || '');
  const [qChapterId, setQChapterId] = useState(exams[0]?.subjects[0]?.chapters[0]?.id || '');
  const [qTopicId, setQTopicId] = useState('');
  const [qType, setQType] = useState<'practice' | 'mock' | 'pyq' | 'major'>('practice');
  const [qPyqYear, setQPyqYear] = useState<number>(2024);
  const [qText, setQText] = useState('');
  const [qImageUrl, setQImageUrl] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qMistakeTag, setQMistakeTag] = useState<MistakeTag>('conceptual');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Form states: New Subject / Chapter / Topic
  const [curricExamId, setCurricExamId] = useState(exams[0]?.id || '');
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#6366f1');
  
  const [selSubForChap, setSelSubForChap] = useState('');
  const [newChapName, setNewChapName] = useState('');
  const [newChapWeightage, setNewChapWeightage] = useState<'high' | 'medium' | 'low'>('high');

  const [selChapForTop, setSelChapForTop] = useState('');
  const [newTopName, setNewTopName] = useState('');
  const [newTopHours, setNewTopHours] = useState(4);
  const [newTopPriority, setNewTopPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Form states: New Exam
  const [newExamName, setNewExamName] = useState('');
  const [newExamTier, setNewExamTier] = useState<ExamTier>('national');
  const [newExamStream, setNewExamStream] = useState<ExamStream>('medical');
  const [newExamState, setNewExamState] = useState('');
  const [newExamTagline, setNewExamTagline] = useState('');
  const [newExamTargetDate, setNewExamTargetDate] = useState('2027-06-01');
  const [newExamTargetScore, setNewExamTargetScore] = useState(650);
  const [newExamTotalMarks, setNewExamTotalMarks] = useState(720);
  const [newExamCorrectMark, setNewExamCorrectMark] = useState(4);
  const [newExamNegativeMark, setNewExamNegativeMark] = useState(1);

  // Selected exam for lookup
  const currentExamObj = exams.find((e) => e.id === qExamId) || exams[0];
  const currentSubjectObj = currentExamObj?.subjects.find((s) => s.id === qSubjectId);
  const currentChapterObj = currentSubjectObj?.chapters.find((c) => c.id === qChapterId);

  const showFlash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOptA || !qOptB) {
      alert('Please fill out the question text and at least options A and B.');
      return;
    }

    const newQ: Question = {
      id: `q-${Date.now()}`,
      examId: qExamId,
      subjectId: qSubjectId,
      chapterId: qChapterId,
      topicId: qTopicId || undefined,
      type: qType,
      pyqYear: qType === 'pyq' ? qPyqYear : undefined,
      text: qText.trim(),
      imageUrl: qImageUrl.trim() || undefined,
      options: [qOptA.trim(), qOptB.trim(), qOptC.trim() || 'Option C', qOptD.trim() || 'Option D'],
      correctIndex: qCorrectIdx,
      explanation: qExplanation.trim() || 'Standard solution based on syllabus curriculum.',
      suggestedMistakeTag: qMistakeTag,
      difficulty: qDifficulty,
    };

    onAddQuestion(newQ);
    showFlash('✓ New Question / Image MCQ created and added to question bank!');
    setQText('');
    setQImageUrl('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const sub: ExamSubject = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      color: newSubColor,
      chapters: [],
    };

    onAddSubject(curricExamId, sub);
    showFlash(`✓ Subject "${newSubName}" added successfully!`);
    setNewSubName('');
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapName.trim() || !selSubForChap) return;

    const chap: ExamChapter = {
      id: `chap-${Date.now()}`,
      name: newChapName.trim(),
      weightage: newChapWeightage,
      topics: [],
    };

    onAddChapter(curricExamId, selSubForChap, chap);
    showFlash(`✓ Chapter "${newChapName}" added successfully!`);
    setNewChapName('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopName.trim() || !selSubForChap || !selChapForTop) return;

    const top: ExamTopic = {
      id: `top-${Date.now()}`,
      name: newTopName.trim(),
      estimatedHours: Number(newTopHours) || 3,
      priority: newTopPriority,
      theoryRead: false,
      notesMade: false,
      revisionDone: false,
      status: 'not_started',
      bookmarked: false,
    };

    onAddTopic(curricExamId, selSubForChap, selChapForTop, top);
    showFlash(`✓ Topic "${newTopName}" added with study checklist!`);
    setNewTopName('');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;

    const ex: Exam = {
      id: `exam-${Date.now()}`,
      name: newExamName.trim(),
      tier: newExamTier,
      stream: newExamStream,
      state: newExamState.trim() || undefined,
      tagline: newExamTagline.trim() || 'Comprehensive exam preparation curriculum.',
      targetExamDate: newExamTargetDate,
      targetScore: Number(newExamTargetScore),
      totalMarks: Number(newExamTotalMarks),
      durationMinutes: 180,
      markingScheme: {
        correct: Number(newExamCorrectMark),
        incorrectPenalty: Number(newExamNegativeMark),
        unattempted: 0,
      },
      subjects: [],
    };

    onAddExam(ex);
    showFlash(`✓ Exam "${newExamName}" created and added to available exams!`);
    setNewExamName('');
    setNewExamTagline('');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (!newPinVal || newPinVal.length < 4) {
      setPinError('New PIN must be at least 4 digits or characters.');
      return;
    }
    if (newPinVal !== confirmPinVal) {
      setPinError('New PIN and confirmation PIN do not match.');
      return;
    }
    localStorage.setItem('lakshya_admin_pin', newPinVal);
    setCustomPin(newPinVal);
    setNewPinVal('');
    setConfirmPinVal('');
    showFlash('✓ Admin Security PIN successfully updated! Use this new PIN for future logins.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Admin Control & Student Management
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage student registrations, customized packages & pricing, curriculum, and question bank.
          </p>
        </div>

        <button
          onClick={onResetData}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition cursor-pointer ${
            isLight ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-300' : 'bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-300 border-slate-700'
          }`}
          title="Reset to default authentic curriculum and questions"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Defaults</span>
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 text-xs font-semibold overflow-x-auto no-scrollbar ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <button
          onClick={() => setActiveAdminTab('students')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students Directory ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('packages')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'packages'
              ? 'bg-amber-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Customised Packages ({customPackages.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('questions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'questions'
              ? 'bg-indigo-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Question Bank ({allQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('curriculum')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'curriculum'
              ? 'bg-purple-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Curriculum Tree</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('new_exam')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'new_exam'
              ? 'bg-emerald-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Exam</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'security'
              ? 'bg-rose-600 text-white shadow-md'
              : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Master PIN</span>
        </button>
      </div>

      {/* TAB: STUDENTS DIRECTORY & MANAGEMENT */}
      {activeAdminTab === 'students' && (
        <AdminStudentsTab
          students={students}
          onUpdateStudents={onUpdateStudents}
          exams={exams}
          customPackages={customPackages}
          theme={theme}
          showFlash={showFlash}
        />
      )}

      {/* TAB: CUSTOM PACKAGES MANAGER */}
      {activeAdminTab === 'packages' && (
        <AdminPackagesTab
          customPackages={customPackages}
          onAddCustomPackage={onAddCustomPackage}
          onUpdateCustomPackage={onUpdateCustomPackage}
          onDeleteCustomPackage={onDeleteCustomPackage}
          exams={exams}
          theme={theme}
          showFlash={showFlash}
        />
      )}

      {/* TAB 1: ADD QUESTION & TEST BANK */}
      {activeAdminTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Question Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Create New MCQ (Supports Image MCQs & PYQs)</span>
            </h2>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              
              {/* Exam & Subject selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Exam</label>
                  <select
                    value={qExamId}
                    onChange={(e) => {
                      setQExamId(e.target.value);
                      const ex = exams.find((x) => x.id === e.target.value);
                      if (ex && ex.subjects.length > 0) {
                        setQSubjectId(ex.subjects[0].id);
                        if (ex.subjects[0].chapters.length > 0) {
                          setQChapterId(ex.subjects[0].chapters[0].id);
                        }
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                  <select
                    value={qSubjectId}
                    onChange={(e) => {
                      setQSubjectId(e.target.value);
                      const sub = currentExamObj?.subjects.find((s) => s.id === e.target.value);
                      if (sub && sub.chapters.length > 0) {
                        setQChapterId(sub.chapters[0].id);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {currentExamObj?.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Chapter</label>
                  <select
                    value={qChapterId}
                    onChange={(e) => setQChapterId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {currentSubjectObj?.chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type & PYQ year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Question Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
                  >
                    <option value="practice">Practice Drill</option>
                    <option value="mock">Chapter Mock Test</option>
                    <option value="pyq">Previous Year Question (PYQ)</option>
                    <option value="major">Major Mock Test (Final Exam)</option>
                  </select>
                </div>

                {qType === 'pyq' && (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">PYQ Exam Year</label>
                    <input
                      type="number"
                      value={qPyqYear}
                      onChange={(e) => setQPyqYear(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard (High Yield)</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Question Statement</label>
                <textarea
                  rows={3}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter the question text here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image URL input with Live Preview */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Image URL (Optional for Image-based MCQs - ECG, Anatomy, Circuits, Maps)</span>
                </label>
                <input
                  type="text"
                  value={qImageUrl}
                  onChange={(e) => setQImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or web image link"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder:text-slate-500"
                />
                {qImageUrl && (
                  <div className="mt-2 max-w-xs rounded-lg overflow-hidden border border-slate-700">
                    <img src={qImageUrl} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                <label className="block text-slate-400 font-semibold">Options & Correct Answer Selection</label>
                
                {[
                  { label: 'Option A', val: qOptA, set: setQOptA, idx: 0 },
                  { label: 'Option B', val: qOptB, set: setQOptB, idx: 1 },
                  { label: 'Option C', val: qOptC, set: setQOptC, idx: 2 },
                  { label: 'Option D', val: qOptD, set: setQOptD, idx: 3 },
                ].map((item) => (
                  <div key={item.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={qCorrectIdx === item.idx}
                      onChange={() => setQCorrectIdx(item.idx)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="w-16 font-semibold text-slate-400">{item.label}:</span>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={`Enter ${item.label}`}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                    {qCorrectIdx === item.idx && (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation & Mistake Category Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Detailed Explanation / Formula</label>
                  <textarea
                    rows={2}
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="Explain why the option is correct..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Likely Error Category (If Student Fails)</label>
                  <select
                    value={qMistakeTag}
                    onChange={(e) => setQMistakeTag(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="conceptual">Concept Gap / Rule Forgot</option>
                    <option value="calculation">Calculation Slip</option>
                    <option value="silly">Silly Mistake</option>
                    <option value="time_pressure">Time Rush</option>
                    <option value="guesswork">Guesswork Trap</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Save Question to Question Bank
                </button>
              </div>

            </form>
          </div>

          {/* Question Bank Explorer List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col max-h-[750px]">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Existing Questions Bank</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                {allQuestions.length} Questions
              </span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {allQuestions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">#{idx + 1} • {q.type.toUpperCase()}</span>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-slate-200 line-clamp-2 font-medium">
                    {q.text}
                  </p>

                  {q.imageUrl && (
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded flex items-center gap-1 w-max">
                      <ImageIcon className="w-3 h-3" />
                      <span>Has Image</span>
                    </span>
                  )}

                  <div className="text-[11px] text-emerald-400">
                    Ans: {q.options[q.correctIndex]}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CURRICULUM MANAGER (ADD SUBJECTS, CHAPTERS, TOPICS) */}
      {activeAdminTab === 'curriculum' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Select Exam */}
          <div className="md:col-span-3 bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <span className="font-bold text-slate-300">Targeting Exam:</span>
            <select
              value={curricExamId}
              onChange={(e) => {
                setCurricExamId(e.target.value);
                const ex = exams.find((x) => x.id === e.target.value);
                if (ex && ex.subjects.length > 0) {
                  setSelSubForChap(ex.subjects[0].id);
                  if (ex.subjects[0].chapters.length > 0) {
                    setSelChapForTop(ex.subjects[0].chapters[0].id);
                  }
                }
              }}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2 flex-1"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.tier})
                </option>
              ))}
            </select>
          </div>

          {/* Form 1: Add Subject */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>1. Add New Subject</span>
            </h3>

            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Zoology, General Law, Microeconomics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Theme Color</label>
                <input
                  type="color"
                  value={newSubColor}
                  onChange={(e) => setNewSubColor(e.target.value)}
                  className="w-full h-9 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
              >
                + Add Subject
              </button>
            </form>
          </div>

          {/* Form 2: Add Chapter */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>2. Add New Chapter</span>
            </h3>

            <form onSubmit={handleCreateChapter} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Subject</label>
                <select
                  value={selSubForChap}
                  onChange={(e) => setSelSubForChap(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Choose Subject --</option>
                  {exams.find((x) => x.id === curricExamId)?.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={newChapName}
                  onChange={(e) => setNewChapName(e.target.value)}
                  placeholder="e.g. Thermodynamics, Indian Judiciary"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Exam Weightage</label>
                <select
                  value={newChapWeightage}
                  onChange={(e) => setNewChapWeightage(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="high">High Weightage</option>
                  <option value="medium">Medium Weightage</option>
                  <option value="low">Low Weightage</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg cursor-pointer"
              >
                + Add Chapter
              </button>
            </form>
          </div>

          {/* Form 3: Add Topic with Checklist */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-emerald-400" />
              <span>3. Add New Topic</span>
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Chapter</label>
                <select
                  value={selChapForTop}
                  onChange={(e) => setSelChapForTop(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Choose Chapter --</option>
                  {exams
                    .find((x) => x.id === curricExamId)
                    ?.subjects.find((s) => s.id === selSubForChap)
                    ?.chapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Topic Name</label>
                <input
                  type="text"
                  value={newTopName}
                  onChange={(e) => setNewTopName(e.target.value)}
                  placeholder="e.g. Carnot Engine & Efficiency"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Est. Study Hours</label>
                  <input
                    type="number"
                    value={newTopHours}
                    onChange={(e) => setNewTopHours(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newTopPriority}
                    onChange={(e) => setNewTopPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="high">High Yield</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
              >
                + Add Topic to Checklist
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 3: CREATE NEW EXAM */}
      {activeAdminTab === 'new_exam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto space-y-5 text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <span>Create New Exam (National, State, District, International)</span>
          </h2>

          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Exam Full Name</label>
              <input
                type="text"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="e.g. State Police Sub-Inspector (SI), GATE CS, District Revenue"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Exam Tier / Level</label>
                <select
                  value={newExamTier}
                  onChange={(e) => setNewExamTier(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="national">National Level</option>
                  <option value="state">State Exam</option>
                  <option value="district">District Level</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Stream / Field</label>
                <select
                  value={newExamStream}
                  onChange={(e) => setNewExamStream(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="medical">Medical (NEET / AYUSH)</option>
                  <option value="nursing">Nursing (NORCET / Staff Nurse)</option>
                  <option value="civil_services">Civil Services (UPSC / State PSC)</option>
                  <option value="engineering">Engineering (JEE / GATE)</option>
                  <option value="state_services">State & District Administration</option>
                  <option value="defense">Defense (NDA / CDS / AFCAT)</option>
                  <option value="banking_ssc">Banking & SSC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tagline / Description</label>
              <input
                type="text"
                value={newExamTagline}
                onChange={(e) => setNewExamTagline(e.target.value)}
                placeholder="Brief goal of the exam..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Date</label>
                <input
                  type="date"
                  value={newExamTargetDate}
                  onChange={(e) => setNewExamTargetDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Score</label>
                <input
                  type="number"
                  value={newExamTargetScore}
                  onChange={(e) => setNewExamTargetScore(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Correct Mark (+)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newExamCorrectMark}
                  onChange={(e) => setNewExamCorrectMark(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Negative Penalty (-)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExamNegativeMark}
                  onChange={(e) => setNewExamNegativeMark(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer text-sm"
            >
              Create Exam & Open for Students
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ADMIN SECURITY & PIN MANAGEMENT */}
      {activeAdminTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl mx-auto space-y-6 text-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Admin Security Credentials & Master PIN
              </h2>
              <p className="text-slate-400">
                Manage access authorization for adding syllabus and questions.
              </p>
            </div>
          </div>

          {/* Current Master PIN Status */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Active Admin Master PIN:</span>
              <span className="font-mono font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 tracking-widest text-sm">
                {customPin}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only users who know this PIN can access the Admin CMS to add questions, upload diagrams, or edit the syllabus.
            </p>
          </div>

          {/* Change PIN Form */}
          <form onSubmit={handleUpdatePin} className="space-y-4">
            <h3 className="font-bold text-slate-200 text-xs">Update Security PIN:</h3>

            {pinError && (
              <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">New 4-Digit PIN or Password</label>
              <input
                type="password"
                required
                value={newPinVal}
                onChange={(e) => setNewPinVal(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Confirm New PIN</label>
              <input
                type="password"
                required
                value={confirmPinVal}
                onChange={(e) => setConfirmPinVal(e.target.value)}
                placeholder="Confirm new PIN"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition cursor-pointer"
            >
              Update Admin Master PIN
            </button>
          </form>

          {/* Reset PIN back to default button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span>Forgotten PIN fallback:</span>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('lakshya_admin_pin', '7860');
                setCustomPin('7860');
                showFlash('✓ PIN reset to default master PIN: 7860');
              }}
              className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Reset to Factory Default (7860)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
