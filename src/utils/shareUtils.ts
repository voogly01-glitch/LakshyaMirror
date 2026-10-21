/**
 * Native Web Share API utility with graceful clipboard & download fallbacks
 */

export async function shareLink(shareTitle: string, shareText: string, link: string): Promise<boolean> {
  const shareData = {
    title: shareTitle,
    text: shareText,
    url: link,
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    }
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      console.error('navigator.share error:', e);
    } else {
      // User cancelled share sheet
      return false;
    }
  }

  // Fallback to Clipboard copy if navigator.share is unavailable
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}\n${link}`);
      return true;
    }
  } catch (e) {
    console.error('Clipboard copy fallback failed:', e);
  }

  return false;
}

export async function shareFiles(filesArray: File[], shareTitle: string, shareText: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: filesArray })) {
    try {
      await navigator.share({
        files: filesArray,
        title: shareTitle,
        text: shareText,
      });
      return true;
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.log('Sharing failed', error);
      }
      return false;
    }
  } else {
    console.log(`System doesn't support sharing.`);
    // Fallback: Trigger direct file download
    try {
      filesArray.forEach((file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      return true;
    } catch (e) {
      console.error('File download fallback failed:', e);
      return false;
    }
  }
}

export async function shareApp(): Promise<boolean> {
  const url = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-yb2eecutudq4444ecq22ho-714115691077.asia-east1.run.app';
  return shareLink(
    'LakshyaMirror - Complete Exam Prep & Error Analytics',
    'Crack your target exam with LakshyaMirror! Track hierarchical syllabus progress, test MCQs with negative marking, and identify exact mistake patterns with the Asli Mirror diagnostic engine.',
    url
  );
}

export async function shareScorecard(
  examName: string,
  testTitle: string,
  score: number,
  maxScore: number,
  accuracy: number
): Promise<boolean> {
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  return shareLink(
    `${examName} Test Result - LakshyaMirror`,
    `🎯 I just finished "${testTitle}"!\n• Score: ${score}/${maxScore}\n• Accuracy: ${accuracy}%\nPractice authentic CBT mocks & diagnose errors on LakshyaMirror:`,
    url
  );
}

export async function sharePreparationReport(
  examName: string,
  studentName: string,
  completionPct: number,
  accuracy: number
): Promise<boolean> {
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  return shareLink(
    `${studentName}'s Preparation Progress Dossier - LakshyaMirror`,
    `📊 Target Exam: ${examName}\n• Syllabus Covered: ${completionPct}%\n• Average Accuracy: ${accuracy}%\nTrack your exam syllabus and mistakes with LakshyaMirror:`,
    url
  );
}

export async function shareReportAsFile(
  examName: string,
  studentName: string,
  reportText: string
): Promise<boolean> {
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const fileName = `${studentName.replace(/\s+/g, '_')}_${examName.replace(/[^a-zA-Z0-9]/g, '_')}_Dossier.txt`;
  const file = new File([blob], fileName, { type: 'text/plain' });

  return shareFiles(
    [file],
    `${studentName} - LakshyaMirror Dossier`,
    `Attached is the verified preparation and error audit dossier for ${examName}.`
  );
}

export async function shareScorecardAsFile(
  examName: string,
  testTitle: string,
  scoreCardText: string
): Promise<boolean> {
  const blob = new Blob([scoreCardText], { type: 'text/plain;charset=utf-8' });
  const fileName = `${examName.replace(/[^a-zA-Z0-9]/g, '_')}_Scorecard.txt`;
  const file = new File([blob], fileName, { type: 'text/plain' });

  return shareFiles(
    [file],
    `${testTitle} - Scorecard`,
    `Attached test scorecard for ${testTitle} (${examName}).`
  );
}
