import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  HelpCircle, 
  FileCheck, 
  Play, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Award, 
  BookMarked,
  FileText,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, ExamSubject, ExamChapter, ExamTopic, TopicStatus } from '../types';
import { calculateTopicProgress } from '../utils/analyticsEngine';

interface RoadmapSyllabusViewProps {
  currentExam: Exam;
  onUpdateTopic: (
    subjectId: string,
    chapterId: string,
    topicId: string,
    updates: Partial<ExamTopic>
  ) => void;
  onLaunchTest: (params: {
    testType: 'practice' | 'mock' | 'pyq' | 'major';
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    title: string;
  }) => void;
}

export const RoadmapSyllabusView: React.FC<RoadmapSyllabusViewProps> = ({
  currentExam,
  onUpdateTopic,
  onLaunchTest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'review_later' | 'high_priority'>('all');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    // Expand first subject by default
    const map: Record<string, boolean> = {};
    if (currentExam.subjects.length > 0) {
      map[currentExam.subjects[0].id] = true;
    }
    return map;
  });

  const toggleSubject = (subId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleMarkCompleted = (
    subId: string,
    chapId: string,
    topic: ExamTopic
  ) => {
    const isNowCompleted = topic.status !== 'completed';
    if (isNowCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    onUpdateTopic(subId, chapId, topic.id, {
      status: isNowCompleted ? 'completed' : 'in_progress',
      theoryRead: isNowCompleted ? true : topic.theoryRead,
      notesMade: isNowCompleted ? true : topic.notesMade,
      revisionDone: isNowCompleted ? true : topic.revisionDone,
      completedAt: isNowCompleted ? new Date().toISOString().slice(0, 10) : undefined,
    });
  };

  const handleToggleReviewLater = (
    subId: string,
    chapId: string,
    topic: ExamTopic
  ) => {
    const newStatus: TopicStatus = topic.status === 'review_later' ? 'in_progress' : 'review_later';
    onUpdateTopic(subId, chapId, topic.id, {
      status: newStatus,
      bookmarked: newStatus === 'review_later' ? true : topic.bookmarked,
    });
  };

  // Stats for current exam syllabus
  let totalTopics = 0;
  let completedTopics = 0;
  let reviewLaterTopics = 0;
  let inProgressTopics = 0;

  currentExam.subjects.forEach((s) => {
    s.chapters.forEach((c) => {
      c.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'completed') completedTopics++;
        else if (t.status === 'review_later') reviewLaterTopics++;
        else if (t.status === 'in_progress') inProgressTopics++;
      });
    });
  });

  const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Sequence Header & Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="text-indigo-400">Preparation Flow:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">{currentExam.tier} Level</span>
          <span>&gt;</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">{currentExam.stream.replace('_', ' ')}</span>
          <span>&gt;</span>
          <span className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-500/30">{currentExam.name}</span>
          <span>&gt;</span>
          <span className="text-slate-300">Subject</span>
          <span>&gt;</span>
          <span className="text-slate-300">Chapter</span>
          <span>&gt;</span>
          <span className="text-slate-300">Topic Checklist</span>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Total Topics</div>
            <div className="text-2xl font-bold text-white mt-1">{totalTopics}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across {currentExam.subjects.length} subjects</div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{completedTopics}</div>
            <div className="text-[11px] text-emerald-400/70 mt-0.5">{overallPercent}% of syllabus done</div>
          </div>

          <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Review Later</span>
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{reviewLaterTopics}</div>
            <div className="text-[11px] text-amber-400/70 mt-0.5">Flagged for revision</div>
          </div>

          <div className="bg-slate-900 border border-blue-500/20 rounded-xl p-4">
            <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>In Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{inProgressTopics}</div>
            <div className="text-[11px] text-blue-400/70 mt-0.5">Currently studying</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic name, chapter, formula, notes..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[11px] px-1">Filter:</span>
          {(
            [
              { key: 'all', label: 'All Topics' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'review_later', label: 'Review Later' },
              { key: 'completed', label: 'Completed' },
              { key: 'high_priority', label: 'High Priority' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                statusFilter === item.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects & Chapters List */}
      <div className="space-y-6">
        {currentExam.subjects.map((subject) => {
          const isExpanded = expandedSubjects[subject.id] ?? false;

          // Compute subject level stats
          let subTotal = 0;
          let subDone = 0;
          subject.chapters.forEach((c) => {
            c.topics.forEach((t) => {
              subTotal++;
              if (t.status === 'completed') subDone++;
            });
          });
          const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

          // Filter chapters and topics
          const filteredChapters = subject.chapters.map((chap) => {
            const filteredTopics = chap.topics.filter((top) => {
              const queryMatches =
                top.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (top.notes && top.notes.toLowerCase().includes(searchQuery.toLowerCase()));

              let statusMatches = true;
              if (statusFilter === 'completed') statusMatches = top.status === 'completed';
              else if (statusFilter === 'in_progress') statusMatches = top.status === 'in_progress';
              else if (statusFilter === 'review_later') statusMatches = top.status === 'review_later';
              else if (statusFilter === 'high_priority') statusMatches = top.priority === 'high';

              return queryMatches && statusMatches;
            });

            return {
              ...chap,
              topics: filteredTopics,
            };
          }).filter((chap) => chap.topics.length > 0 || searchQuery === '');

          if (filteredChapters.every((c) => c.topics.length === 0) && searchQuery !== '') {
            return null; // hide subject if no matching topics
          }

          return (
            <div
              key={subject.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition"
            >
              {/* Subject Header */}
              <div
                onClick={() => toggleSubject(subject.id)}
                className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800/80 hover:bg-slate-800 cursor-pointer border-b border-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-10 rounded-full"
                    style={{ backgroundColor: subject.color || '#6366f1' }}
                  />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{subject.name}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({subject.chapters.length} Chapters • {subTotal} Topics)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Targeted coverage: {subDone}/{subTotal} topics completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress bar */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                        style={{ width: `${subPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{subPct}%</span>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-800 text-slate-300">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Chapters & Topics Content */}
              {isExpanded && (
                <div className="p-4 sm:p-6 space-y-6 bg-slate-950/40">
                  {filteredChapters.map((chapter) => {
                    // Calculate chapter progress
                    const chapTotal = chapter.topics.length;
                    const chapDone = chapter.topics.filter((t) => t.status === 'completed').length;
                    const chapPct = chapTotal > 0 ? Math.round((chapDone / chapTotal) * 100) : 0;

                    return (
                      <div
                        key={chapter.id}
                        className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 sm:p-5 space-y-4"
                      >
                        {/* Chapter Title Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-indigo-400" />
                            <h3 className="font-semibold text-sm sm:text-base text-slate-100">
                              {chapter.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                chapter.weightage === 'high'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : chapter.weightage === 'medium'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {chapter.weightage} Weightage
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs">
                            <span className="text-slate-400 text-xs">
                              Chapter Progress: <strong className="text-emerald-400">{chapPct}%</strong>
                            </span>
                            
                            {/* Action to take chapter mock test */}
                            <button
                              onClick={() =>
                                onLaunchTest({
                                  testType: 'mock',
                                  subjectId: subject.id,
                                  chapterId: chapter.id,
                                  title: `${chapter.name} - Chapter Mock Test`,
                                })
                              }
                              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg border border-indigo-500/30 font-medium transition cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Chapter Mock</span>
                            </button>
                          </div>
                        </div>

                        {/* Topics List with Full Checklist & Workflow */}
                        <div className="space-y-3">
                          {chapter.topics.map((topic) => {
                            const topicProg = calculateTopicProgress(topic);

                            return (
                              <div
                                key={topic.id}
                                className={`rounded-xl border p-4 transition-all duration-200 ${
                                  topic.status === 'completed'
                                    ? 'bg-emerald-950/15 border-emerald-500/30'
                                    : topic.status === 'review_later'
                                    ? 'bg-amber-950/15 border-amber-500/30'
                                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                                }`}
                              >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                  
                                  {/* Topic Title & Badges */}
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-semibold text-sm text-white">
                                        {topic.name}
                                      </span>

                                      {/* Status Tag */}
                                      <span
                                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                          topic.status === 'completed'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                            : topic.status === 'review_later'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                            : topic.status === 'in_progress'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                            : 'bg-slate-700 text-slate-300'
                                        }`}
                                      >
                                        {topic.status.replace('_', ' ')}
                                      </span>

                                      {topic.priority === 'high' && (
                                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                          High Yield
                                        </span>
                                      )}

                                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>~{topic.estimatedHours} hrs</span>
                                      </span>
                                    </div>

                                    {/* Topic study notes preview */}
                                    {topic.notes && (
                                      <p className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 italic">
                                        💡 {topic.notes}
                                      </p>
                                    )}
                                  </div>

                                  {/* Step-by-Step Preparation Checklist */}
                                  <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1">
                                      Checklist:
                                    </span>

                                    {/* Theory Read Checkbox */}
                                    <button
                                      onClick={() =>
                                        onUpdateTopic(subject.id, chapter.id, topic.id, {
                                          theoryRead: !topic.theoryRead,
                                          status: !topic.theoryRead && topic.notesMade && topic.revisionDone ? 'completed' : topic.status === 'completed' ? 'in_progress' : topic.status,
                                        })
                                      }
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition cursor-pointer ${
                                        topic.theoryRead
                                          ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                      }`}
                                    >
                                      <Check className={`w-3 h-3 ${topic.theoryRead ? 'text-emerald-400' : 'text-slate-500'}`} />
                                      <span>Theory Read</span>
                                    </button>

                                    {/* Notes Made Checkbox */}
                                    <button
                                      onClick={() =>
                                        onUpdateTopic(subject.id, chapter.id, topic.id, {
                                          notesMade: !topic.notesMade,
                                          status: topic.theoryRead && !topic.notesMade && topic.revisionDone ? 'completed' : topic.status === 'completed' ? 'in_progress' : topic.status,
                                        })
                                      }
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition cursor-pointer ${
                                        topic.notesMade
                                          ? 'bg-indigo-500/20 text-indigo-300 font-medium'
                                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                      }`}
                                    >
                                      <Check className={`w-3 h-3 ${topic.notesMade ? 'text-indigo-400' : 'text-slate-500'}`} />
                                      <span>Notes Made</span>
                                    </button>

                                    {/* Revision Done Checkbox */}
                                    <button
                                      onClick={() =>
                                        onUpdateTopic(subject.id, chapter.id, topic.id, {
                                          revisionDone: !topic.revisionDone,
                                          status: topic.theoryRead && topic.notesMade && !topic.revisionDone ? 'completed' : topic.status === 'completed' ? 'in_progress' : topic.status,
                                        })
                                      }
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition cursor-pointer ${
                                        topic.revisionDone
                                          ? 'bg-purple-500/20 text-purple-300 font-medium'
                                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                      }`}
                                    >
                                      <Check className={`w-3 h-3 ${topic.revisionDone ? 'text-purple-400' : 'text-slate-500'}`} />
                                      <span>Revision Done</span>
                                    </button>
                                  </div>

                                  {/* Test Actions & Completion End Buttons */}
                                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                                    
                                    {/* Practice Drill Button */}
                                    <button
                                      onClick={() =>
                                        onLaunchTest({
                                          testType: 'practice',
                                          subjectId: subject.id,
                                          chapterId: chapter.id,
                                          topicId: topic.id,
                                          title: `${topic.name} - Practice Drill`,
                                        })
                                      }
                                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
                                      title="Solve 10-15 MCQs for this topic"
                                    >
                                      <Play className="w-3 h-3 text-indigo-400" />
                                      <span>Practice</span>
                                    </button>

                                    {/* PYQs Button */}
                                    <button
                                      onClick={() =>
                                        onLaunchTest({
                                          testType: 'pyq',
                                          subjectId: subject.id,
                                          chapterId: chapter.id,
                                          topicId: topic.id,
                                          title: `${topic.name} - Previous Year Questions`,
                                        })
                                      }
                                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
                                      title="Solve Previous Year Questions (PYQs)"
                                    >
                                      <Award className="w-3 h-3 text-amber-400" />
                                      <span>PYQs</span>
                                    </button>

                                    {/* Review for Later End Button */}
                                    <button
                                      onClick={() => handleToggleReviewLater(subject.id, chapter.id, topic)}
                                      className={`p-1.5 rounded-lg text-xs transition border cursor-pointer ${
                                        topic.status === 'review_later'
                                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border-slate-700'
                                      }`}
                                      title="Flag for later review / revision"
                                    >
                                      <Bookmark className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Mark as Completed End Button */}
                                    <button
                                      onClick={() => handleMarkCompleted(subject.id, chapter.id, topic)}
                                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        topic.status === 'completed'
                                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                          : 'bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40'
                                      }`}
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>{topic.status === 'completed' ? 'Completed' : 'Mark Done'}</span>
                                    </button>

                                  </div>

                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
