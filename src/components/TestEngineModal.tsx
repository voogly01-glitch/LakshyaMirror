import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Maximize2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RotateCcw, 
  Award, 
  Zap, 
  Brain,
  FileQuestion,
  Eye,
  Flag,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, Exam, TestAttempt, TestAnswerRecord, MistakeTag } from '../types';
import { shareScorecard, shareScorecardAsFile } from '../utils/shareUtils';

interface TestEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  testParams: {
    testType: 'practice' | 'mock' | 'pyq' | 'major';
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    title: string;
  };
  allQuestions: Question[];
  onSaveAttempt: (attempt: TestAttempt) => void;
}

export const TestEngineModal: React.FC<TestEngineModalProps> = ({
  isOpen,
  onClose,
  exam,
  testParams,
  allQuestions,
  onSaveAttempt,
}) => {
  // Filter questions for this test session
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [mistakeTags, setMistakeTags] = useState<Record<string, MistakeTag>>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 mins default
  const [testPhase, setTestPhase] = useState<'testing' | 'submitted'>('testing');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Initialize questions
  useEffect(() => {
    if (!isOpen) return;

    let filtered = allQuestions.filter((q) => {
      // If major test, pick all questions for this exam
      if (testParams.testType === 'major') {
        return q.examId === exam.id;
      }
      // If subject/chapter/topic specified
      if (testParams.topicId && q.topicId === testParams.topicId) return true;
      if (testParams.chapterId && q.chapterId === testParams.chapterId) return true;
      if (testParams.subjectId && q.subjectId === testParams.subjectId) return true;
      // Default to matching exam
      return q.examId === exam.id;
    });

    // If still empty, fallback to all questions for exam or any sample
    if (filtered.length === 0) {
      filtered = allQuestions.filter((q) => q.examId === exam.id);
    }
    if (filtered.length === 0) {
      filtered = allQuestions;
    }

    // Limit to reasonable drill size (e.g., 5-20 questions)
    const count = testParams.testType === 'major' ? Math.min(25, filtered.length) : Math.min(10, filtered.length);
    const selected = filtered.slice(0, count);

    setQuestions(selected);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview({});
    setQuestionTimes({});
    setMistakeTags({});
    setUserNotes({});
    setTestPhase('testing');
    setShowConfirmSubmit(false);

    // Duration: 1.5 mins per question
    setSecondsRemaining(Math.max(120, selected.length * 90));
  }, [isOpen, testParams, allQuestions, exam]);

  // Countdown timer
  useEffect(() => {
    if (testPhase !== 'testing' || !isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });

      // Track time spent on current question
      setQuestionTimes((prev) => ({
        ...prev,
        [currentIdx]: (prev[currentIdx] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [testPhase, isOpen, currentIdx]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (testPhase !== 'testing') return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: prev[currentIdx] === optIdx ? null : optIdx,
    }));
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx],
    }));
  };

  const handleSubmitTest = () => {
    setShowConfirmSubmit(false);
    setTestPhase('submitted');

    // Trigger victory confetti
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Calculate scorecard
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const answerRecords: TestAnswerRecord[] = questions.map((q, idx) => {
      const selected = userAnswers[idx] ?? null;
      const isAns = selected !== null;
      const isCorr = isAns && selected === q.correctIndex;

      if (!isAns) {
        unattempted++;
      } else if (isCorr) {
        correct++;
      } else {
        incorrect++;
      }

      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect: isCorr,
        timeTakenSec: questionTimes[idx] || 30,
        mistakeTag: isCorr ? undefined : q.suggestedMistakeTag || 'conceptual',
        bookmarked: markedForReview[idx] || false,
      };
    });

    const posMarks = correct * exam.markingScheme.correct;
    const negMarks = incorrect * exam.markingScheme.incorrectPenalty;
    const net = posMarks - negMarks;
    const max = questions.length * exam.markingScheme.correct;
    const acc = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const pct = max > 0 ? Math.round((Math.max(0, net) / max) * 100) : 0;

    const attempt: TestAttempt = {
      id: `att-${Date.now()}`,
      testTitle: testParams.title,
      testType: testParams.testType,
      examId: exam.id,
      examName: exam.name,
      subjectId: testParams.subjectId,
      chapterId: testParams.chapterId,
      topicId: testParams.topicId,
      timestamp: Date.now(),
      totalQuestions: questions.length,
      attempted: correct + incorrect,
      correct,
      incorrect,
      unattempted,
      positiveMarks: posMarks,
      negativeMarks: Math.round(negMarks * 10) / 10,
      netScore: Math.round(net * 10) / 10,
      maxScore: max,
      percentage: pct,
      accuracy: acc,
      timeSpentSeconds: Object.values(questionTimes).reduce((a, b) => a + b, 0),
      answers: answerRecords,
    };

    onSaveAttempt(attempt);
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Test Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              testParams.testType === 'major'
                ? 'bg-emerald-500/20 text-emerald-300'
                : testParams.testType === 'pyq'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">
                {testParams.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="capitalize">{testParams.testType} Mode</span>
                <span>•</span>
                <span>Marking: +{exam.markingScheme.correct} / -{exam.markingScheme.incorrectPenalty}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {testPhase === 'testing' && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                secondsRemaining < 60
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}>
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {testPhase === 'testing' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Question Pane */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Question Header & Tags */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-400 text-sm">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  {currentQ.pyqYear && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      PYQ {currentQ.pyqYear}
                    </span>
                  )}
                  {currentQ.imageUrl && (
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>Image MCQ</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleToggleMarkReview}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition text-xs ${
                    markedForReview[currentIdx]
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{markedForReview[currentIdx] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <p className="text-base text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                {currentQ.text}
              </p>

              {/* Image if Image-based MCQ */}
              {currentQ.imageUrl && (
                <div className="relative group rounded-xl overflow-hidden border border-slate-700 max-w-lg bg-slate-950">
                  <img
                    src={currentQ.imageUrl}
                    alt={currentQ.imageAlt || 'MCQ Diagram'}
                    className="w-full h-48 sm:h-64 object-cover cursor-pointer hover:scale-102 transition duration-300"
                    onClick={() => setExpandedImage(currentQ.imageUrl || null)}
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-[11px] text-slate-300 flex items-center gap-1 pointer-events-none">
                    <Maximize2 className="w-3 h-3" />
                    <span>Click to zoom</span>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIdx] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {optionLetters[optIdx]}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer text-xs font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setUserAnswers((prev) => {
                        const next = { ...prev };
                        delete next[currentIdx];
                        return next;
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs transition cursor-pointer"
                  >
                    Clear Response
                  </button>

                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((i) => i + 1)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition cursor-pointer"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Question Palette Sidebar */}
            <div className="w-full md:w-64 bg-slate-950 p-4 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Question Palette
                </h3>

                {/* Status Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-600" />
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
                    <span>Not Answered</span>
                  </div>
                </div>

                {/* Grid of numbers */}
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const isAns = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
                    const isMarked = markedForReview[idx];
                    const isCurr = currentIdx === idx;

                    let bg = 'bg-slate-800 text-slate-300 border-slate-700';
                    if (isMarked) {
                      bg = 'bg-purple-600 text-white border-purple-400 font-bold';
                    } else if (isAns) {
                      bg = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 rounded-lg border flex items-center justify-center text-xs transition cursor-pointer ${bg} ${
                          isCurr ? 'ring-2 ring-indigo-400 scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button on Bottom */}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                >
                  Submit Test Now
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* Detailed Results & Mistakes Diagnostic Screen */
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Scorecard Hero */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400">
                    Test Completed
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    Performance & Error Mirror
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review your mistakes below and self-diagnose why you got them wrong.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Accuracy</div>
                    <div className="text-2xl font-black text-emerald-400">
                      {Math.round(
                        (questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length /
                          Math.max(1, Object.keys(userAnswers).length)) *
                          100
                      )}%
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Net Score</div>
                    <div className="text-2xl font-black text-white">
                      {Math.round(
                        (questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length * exam.markingScheme.correct -
                          questions.filter((q, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== q.correctIndex).length * exam.markingScheme.incorrectPenalty) * 10
                      ) / 10}
                      <span className="text-xs text-slate-400 font-normal"> / {questions.length * exam.markingScheme.correct}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Correct:</span>
                  <span className="font-bold text-emerald-400 ml-1.5">
                    {questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length} (+{questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length * exam.markingScheme.correct} marks)
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-rose-500/20">
                  <span className="text-slate-400">Incorrect:</span>
                  <span className="font-bold text-rose-400 ml-1.5">
                    {questions.filter((q, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== q.correctIndex).length} (-{Math.round(questions.filter((q, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== q.correctIndex).length * exam.markingScheme.incorrectPenalty * 10) / 10} negative)
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Unattempted:</span>
                  <span className="font-bold text-slate-300 ml-1.5">
                    {questions.filter((_, idx) => userAnswers[idx] === undefined || userAnswers[idx] === null).length}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Time Spent:</span>
                  <span className="font-bold text-indigo-300 ml-1.5">
                    {formatTime(Object.values(questionTimes).reduce((a, b) => a + b, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Error Audit List */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Flag className="w-4 h-4 text-indigo-400" />
                <span>Question-by-Question Mistake Audit</span>
              </h4>

              {questions.map((q, idx) => {
                const userAns = userAnswers[idx] ?? null;
                const isCorrect = userAns === q.correctIndex;
                const isSkipped = userAns === null;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-950/10 border-emerald-500/30'
                        : isSkipped
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-rose-950/15 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isSkipped
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {isCorrect ? '✓ Correct' : isSkipped ? '– Skipped' : '✗ Incorrect (Negative Mark)'}
                        </span>
                        <span className="text-xs text-slate-400">Q{idx + 1}</span>
                      </div>

                      {/* Interactive Mistake Tagging Dropdown for Wrong Questions */}
                      {!isCorrect && !isSkipped && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-rose-300 font-semibold">
                            Diagnosis:
                          </span>
                          <select
                            value={mistakeTags[q.id] || q.suggestedMistakeTag || 'conceptual'}
                            onChange={(e) =>
                              setMistakeTags((prev) => ({
                                ...prev,
                                [q.id]: e.target.value as MistakeTag,
                              }))
                            }
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-rose-400"
                          >
                            <option value="conceptual">Concept Gap / Rule Forgot</option>
                            <option value="calculation">Calculation / Numerical Slip</option>
                            <option value="silly">Silly Mistake / Overlooked Option</option>
                            <option value="time_pressure">Time Rush / Panicked</option>
                            <option value="guesswork">Speculative Guesswork</option>
                            <option value="misread">Misread NOT / INCORRECT</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-100 font-medium whitespace-pre-line mb-3">
                      {q.text}
                    </p>

                    {q.imageUrl && (
                      <div className="mb-3 max-w-sm rounded-lg overflow-hidden border border-slate-700">
                        <img
                          src={q.imageUrl}
                          alt="MCQ image"
                          className="w-full h-40 object-cover cursor-pointer"
                          onClick={() => setExpandedImage(q.imageUrl || null)}
                        />
                      </div>
                    )}

                    {/* Options status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {q.options.map((opt, oIdx) => {
                        const isRight = oIdx === q.correctIndex;
                        const isSelectedByStudent = userAns === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between ${
                              isRight
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-medium'
                                : isSelectedByStudent
                                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 font-medium'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {isRight && <span className="text-[10px] uppercase font-bold text-emerald-400">Correct Answer</span>}
                            {isSelectedByStudent && !isRight && <span className="text-[10px] uppercase font-bold text-rose-400">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <strong className="text-indigo-400 block mb-1">Concept Solution & High-Yield Takeaway:</strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close / Return & Share Scorecard Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={async () => {
                    const correctCount = questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length;
                    const incorrectCount = questions.filter((q, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== q.correctIndex).length;
                    const pos = correctCount * exam.markingScheme.correct;
                    const neg = incorrectCount * exam.markingScheme.incorrectPenalty;
                    const net = Math.round((pos - neg) * 10) / 10;
                    const max = questions.length * exam.markingScheme.correct;
                    const acc = (correctCount + incorrectCount > 0) ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
                    await shareScorecard(exam.name, testParams.title, net, max, acc);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-200 hover:text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  title="Share Scorecard via Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Share Scorecard</span>
                </button>

                <button
                  onClick={async () => {
                    const correctCount = questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length;
                    const incorrectCount = questions.filter((q, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== q.correctIndex).length;
                    const unattemptedCount = questions.length - (correctCount + incorrectCount);
                    const pos = correctCount * exam.markingScheme.correct;
                    const neg = incorrectCount * exam.markingScheme.incorrectPenalty;
                    const net = Math.round((pos - neg) * 10) / 10;
                    const max = questions.length * exam.markingScheme.correct;
                    const acc = (correctCount + incorrectCount > 0) ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

                    const scoreCardText = `=========================================
LAKSHYAMIRROR CBT TEST SCORECARD
=========================================
Exam: ${exam.name}
Test: ${testParams.title}
Mode: ${testParams.testType.toUpperCase()}
Date: ${new Date().toLocaleString()}

PERFORMANCE SUMMARY:
• Net Score: ${net} / ${max}
• Accuracy: ${acc}%
• Correct: ${correctCount} (+${pos} marks)
• Incorrect: ${incorrectCount} (-${neg} negative marks)
• Unattempted: ${unattemptedCount}
• Marking Scheme: +${exam.markingScheme.correct} / -${exam.markingScheme.incorrectPenalty}

QUESTION BREAKDOWN:
${questions.map((q, idx) => {
  const uAns = userAnswers[idx] ?? null;
  const isC = uAns === q.correctIndex;
  const isS = uAns === null;
  return `Q${idx + 1}: ${isC ? 'CORRECT' : isS ? 'SKIPPED' : 'INCORRECT'} | Your choice: ${uAns !== null ? q.options[uAns] : 'None'} | Correct: ${q.options[q.correctIndex]}`;
}).join('\n')}

Diagnosed via LakshyaMirror Exam Platform
`;
                    await shareScorecardAsFile(exam.name, testParams.title, scoreCardText);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 hover:text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  title="Share Scorecard as Text File"
                >
                  <FileQuestion className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share Result File</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                Done • View Updated Asli Mirror Analytics
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Confirmation Submit Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Submit Test Confirmation</span>
            </h3>
            <p className="text-sm text-slate-300">
              You have answered{' '}
              <strong className="text-emerald-400">{Object.keys(userAnswers).length}</strong> out of{' '}
              <strong className="text-white">{questions.length}</strong> questions.
              {Object.keys(userAnswers).length < questions.length && (
                <span className="block mt-1 text-amber-400 text-xs">
                  ⚠️ {questions.length - Object.keys(userAnswers).length} question(s) are unattempted.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={expandedImage}
              alt="Enlarged MCQ diagram"
              className="max-w-full max-h-[85vh] rounded-xl object-contain border border-slate-700 shadow-2xl"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-slate-800 text-white rounded-full hover:bg-slate-700 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
