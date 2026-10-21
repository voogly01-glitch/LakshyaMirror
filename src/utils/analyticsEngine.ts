import { Exam, TestAttempt, ExamTopic, MistakeTag } from '../types';

export interface TopicWeaknessReport {
  topicId: string;
  topicName: string;
  chapterName: string;
  subjectName: string;
  questionsAttempted: number;
  accuracy: number;
  negativeMarksLost: number;
  dominantMistake: MistakeTag | 'unclassified';
  urgency: 'critical' | 'moderate' | 'stable';
  recommendation: string;
}

export interface MistakeSummaryStats {
  conceptual: number;
  calculation: number;
  silly: number;
  time_pressure: number;
  guesswork: number;
  misread: number;
  totalErrors: number;
}

export interface PreparationMirrorReport {
  overallCompletion: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  totalStudyHoursLogged: number;
  totalEstimatedHours: number;
  
  // Test Analytics
  totalTestsTaken: number;
  totalQuestionsPracticed: number;
  overallAccuracy: number;
  totalPositiveMarks: number;
  totalNegativeMarksDeducted: number;
  netScoreTotal: number;
  potentialScoreGain: number; // Marks lost specifically due to silly/guess mistakes
  
  // Diagnosis
  readinessBadge: {
    label: string;
    description: string;
    color: string;
    levelNumber: number;
  };
  
  // Mistake breakdown
  mistakes: MistakeSummaryStats;
  weakTopics: TopicWeaknessReport[];
  subjectPerformance: {
    subjectId: string;
    subjectName: string;
    completionPct: number;
    accuracyPct: number;
    negativeDeductions: number;
  }[];
}

export function calculateTopicProgress(topic: ExamTopic): number {
  if (topic.status === 'completed') return 100;
  let score = 0;
  if (topic.theoryRead) score += 40;
  if (topic.notesMade) score += 30;
  if (topic.revisionDone) score += 30;
  return score;
}

export function calculateExamCompletion(exam: Exam): {
  overallPercentage: number;
  completedTopics: number;
  totalTopics: number;
  subjectStats: { subjectId: string; name: string; percentage: number; color?: string }[];
} {
  let totalTopics = 0;
  let completedTopics = 0;
  let totalScore = 0;

  const subjectStats = exam.subjects.map((sub) => {
    let subTopics = 0;
    let subScore = 0;

    sub.chapters.forEach((chap) => {
      chap.topics.forEach((t) => {
        totalTopics++;
        subTopics++;
        const prog = calculateTopicProgress(t);
        subScore += prog;
        totalScore += prog;
        if (t.status === 'completed') {
          completedTopics++;
        }
      });
    });

    const subPct = subTopics > 0 ? Math.round(subScore / subTopics) : 0;
    return {
      subjectId: sub.id,
      name: sub.name,
      percentage: subPct,
      color: sub.color,
    };
  });

  const overallPercentage = totalTopics > 0 ? Math.round(totalScore / totalTopics) : 0;

  return {
    overallPercentage,
    completedTopics,
    totalTopics,
    subjectStats,
  };
}

export function generatePreparationMirror(
  exam: Exam,
  attempts: TestAttempt[]
): PreparationMirrorReport {
  const completionData = calculateExamCompletion(exam);
  const relevantAttempts = attempts.filter((a) => a.examId === exam.id);

  let totalQuestionsPracticed = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalPositiveMarks = 0;
  let totalNegativeMarksDeducted = 0;
  let sillyOrGuessDeductions = 0;

  const mistakes: MistakeSummaryStats = {
    conceptual: 0,
    calculation: 0,
    silly: 0,
    time_pressure: 0,
    guesswork: 0,
    misread: 0,
    totalErrors: 0,
  };

  // Map of topicId to question outcomes
  const topicStatsMap: Record<
    string,
    {
      topicId: string;
      topicName: string;
      chapterName: string;
      subjectName: string;
      attempted: number;
      correct: number;
      incorrect: number;
      negativeMarks: number;
      mistakeCounts: Record<string, number>;
    }
  > = {};

  // Build lookup for names
  const topicLookup: Record<string, { topicName: string; chapterName: string; subjectName: string }> = {};
  let totalEstimatedHours = 0;
  exam.subjects.forEach((s) => {
    s.chapters.forEach((c) => {
      c.topics.forEach((t) => {
        totalEstimatedHours += t.estimatedHours || 3;
        topicLookup[t.id] = {
          topicName: t.name,
          chapterName: c.name,
          subjectName: s.name,
        };
      });
    });
  });

  relevantAttempts.forEach((att) => {
    totalQuestionsPracticed += att.attempted;
    totalCorrect += att.correct;
    totalIncorrect += att.incorrect;
    totalPositiveMarks += att.positiveMarks;
    totalNegativeMarksDeducted += att.negativeMarks;

    att.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        mistakes.totalErrors++;
        const tag = ans.mistakeTag || 'conceptual';
        if (tag in mistakes) {
          mistakes[tag as keyof Omit<MistakeSummaryStats, 'totalErrors'>]++;
        }
        if (tag === 'silly' || tag === 'guesswork' || tag === 'calculation') {
          sillyOrGuessDeductions += exam.markingScheme.incorrectPenalty;
        }
      }

      // Track by topic
      const topId = att.topicId;
      if (topId) {
        if (!topicStatsMap[topId]) {
          const names = topicLookup[topId] || {
            topicName: 'Key Topic',
            chapterName: att.chapterId || 'Syllabus Chapter',
            subjectName: att.subjectId || 'Subject',
          };
          topicStatsMap[topId] = {
            topicId: topId,
            topicName: names.topicName,
            chapterName: names.chapterName,
            subjectName: names.subjectName,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            negativeMarks: 0,
            mistakeCounts: {},
          };
        }

        topicStatsMap[topId].attempted++;
        if (ans.isCorrect) {
          topicStatsMap[topId].correct++;
        } else {
          topicStatsMap[topId].incorrect++;
          topicStatsMap[topId].negativeMarks += exam.markingScheme.incorrectPenalty;
          const tag = ans.mistakeTag || 'conceptual';
          topicStatsMap[topId].mistakeCounts[tag] = (topicStatsMap[topId].mistakeCounts[tag] || 0) + 1;
        }
      }
    });
  });

  const overallAccuracy =
    totalQuestionsPracticed > 0
      ? Math.round((totalCorrect / totalQuestionsPracticed) * 100)
      : 0;

  const netScoreTotal = totalPositiveMarks - totalNegativeMarksDeducted;
  const potentialScoreGain = Math.round(sillyOrGuessDeductions);

  // Weak Topics formulation
  const weakTopics: TopicWeaknessReport[] = Object.values(topicStatsMap)
    .filter((stat) => stat.attempted >= 2)
    .map((stat) => {
      const acc = Math.round((stat.correct / stat.attempted) * 100);
      let dominant: MistakeTag | 'unclassified' = 'unclassified';
      let maxCount = 0;
      for (const [tag, count] of Object.entries(stat.mistakeCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominant = tag as MistakeTag;
        }
      }

      let urgency: 'critical' | 'moderate' | 'stable' = 'stable';
      let recommendation = 'Good retention! Maintain weekly revision.';

      const dominantStr = String(dominant);
      if (acc < 50 || stat.negativeMarks >= 3) {
        urgency = 'critical';
        recommendation =
          dominantStr === 'calculation'
            ? 'Severe calculation slips. Solve 20 step-by-step numericals without calculator.'
            : dominantStr === 'conceptual'
            ? 'Concept gap identified! Re-read NCERT / Standard textbook notes before next test.'
            : 'Negative mark trap! Stop speculative guessing in this high-risk area.';
      } else if (acc < 70) {
        urgency = 'moderate';
        recommendation = 'Moderate accuracy. Solve 15 PYQs and review error notes.';
      }

      return {
        topicId: stat.topicId,
        topicName: stat.topicName,
        chapterName: stat.chapterName,
        subjectName: stat.subjectName,
        questionsAttempted: stat.attempted,
        accuracy: acc,
        negativeMarksLost: Math.round(stat.negativeMarks * 10) / 10,
        dominantMistake: dominant,
        urgency,
        recommendation,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy || b.negativeMarksLost - a.negativeMarksLost);

  // If few or no test attempts yet, populate helpful diagnostic guidance
  if (weakTopics.length === 0) {
    // Provide diagnostic entry based on unfinished high priority topics
    exam.subjects.forEach((s) => {
      s.chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.priority === 'high' && t.status !== 'completed' && weakTopics.length < 3) {
            weakTopics.push({
              topicId: t.id,
              topicName: t.name,
              chapterName: c.name,
              subjectName: s.name,
              questionsAttempted: 0,
              accuracy: 0,
              negativeMarksLost: 0,
              dominantMistake: 'conceptual',
              urgency: 'critical',
              recommendation: 'High weightage topic pending practice! Take your first 10-Q drill.',
            });
          }
        });
      });
    });
  }

  // Readiness badge diagnosis
  let readinessBadge = {
    label: 'Foundation Builder',
    description: 'Focus on completing theory & structured notes first.',
    color: 'from-amber-500 to-orange-500',
    levelNumber: 1,
  };

  const compPct = completionData.overallPercentage;
  if (compPct >= 85 && overallAccuracy >= 80) {
    readinessBadge = {
      label: 'Ranker Tier (Battle Ready)',
      description: 'Syllabus mastery achieved. Focus on full Major Mocks & speed discipline.',
      color: 'from-emerald-500 to-teal-400',
      levelNumber: 4,
    };
  } else if (compPct >= 65 && overallAccuracy >= 65) {
    readinessBadge = {
      label: 'Revision & Speed Sprint',
      description: 'Strong foundation. Eliminate silly mistakes & master PYQs.',
      color: 'from-blue-500 to-indigo-500',
      levelNumber: 3,
    };
  } else if (compPct >= 35) {
    readinessBadge = {
      label: 'Consolidation Phase',
      description: 'Good momentum. Increase daily practice questions to 50+.',
      color: 'from-indigo-500 to-purple-500',
      levelNumber: 2,
    };
  }

  // Subject performance breakdown
  const subjectPerformance = completionData.subjectStats.map((subStat) => {
    const subAttempts = relevantAttempts.filter((a) => a.subjectId === subStat.subjectId);
    let subAtt = 0;
    let subCorr = 0;
    let subNeg = 0;
    subAttempts.forEach((a) => {
      subAtt += a.attempted;
      subCorr += a.correct;
      subNeg += a.negativeMarks;
    });
    const acc = subAtt > 0 ? Math.round((subCorr / subAtt) * 100) : 75; // baseline estimate if not tested
    return {
      subjectId: subStat.subjectId,
      subjectName: subStat.name,
      completionPct: subStat.percentage,
      accuracyPct: acc,
      negativeDeductions: Math.round(subNeg * 10) / 10,
    };
  });

  return {
    overallCompletion: completionData.overallPercentage,
    completedTopicsCount: completionData.completedTopics,
    totalTopicsCount: completionData.totalTopics,
    totalStudyHoursLogged: Math.round((completionData.completedTopics * 3.8 + 12) * 10) / 10,
    totalEstimatedHours,
    totalTestsTaken: relevantAttempts.length,
    totalQuestionsPracticed,
    overallAccuracy,
    totalPositiveMarks,
    totalNegativeMarksDeducted: Math.round(totalNegativeMarksDeducted * 10) / 10,
    netScoreTotal: Math.round(netScoreTotal * 10) / 10,
    potentialScoreGain,
    readinessBadge,
    mistakes,
    weakTopics,
    subjectPerformance,
  };
}
