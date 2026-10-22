import { SubscriptionPlan, UserSubscription } from '../types';

export const INDIAN_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Shuruat (Free Starter)',
    hindiBadge: 'मुफ़्त शुरुआत',
    tagline: 'Basic syllabus checklist & daily concept practice',
    priceINR: 0,
    originalPriceINR: 0,
    durationLabel: 'Forever Free',
    perMonthLabel: '₹0 / month',
    unlockCount: 'Core Features',
    features: [
      'Hierarchical Syllabus Roadmap Checklist',
      'Theory, Notes & Revision Status Tracking',
      '3 Practice Drill Questions per Day',
      'Basic Readiness Meter & Score Tracker',
      'Pan-India Leaderboard & Peer Rank'
    ],
  },
  {
    id: 'monthly',
    name: 'Lakshya Monthly Pro',
    hindiBadge: 'मंथली चाय बजट (₹6.5/दिन)',
    tagline: 'Affordable monthly boost with unlimited mock tests & error mirror',
    priceINR: 199,
    originalPriceINR: 499,
    durationLabel: '1 Month Access',
    perMonthLabel: '₹199 / month',
    unlockCount: '15+ Pro Features',
    badge: 'Chai Budget',
    features: [
      'Unlimited Chapter Mock Tests & Practice Drills',
      'Full Image-Based MCQs (ECGs, Clinical & Circuits)',
      'Real-time Asli Mirror & Negative Mark Penalty GPS',
      'Question-by-Question Mistake Self-Diagnosis Tags',
      'Daily Work Efficiency & Streak Target Tracker',
      'High-Yield Concept Notes & Detailed Explanations'
    ],
  },
  {
    id: 'target6m',
    name: 'Sankalp 6-Month Target',
    hindiBadge: 'एग्जाम चक्र (₹83/महीना) ⭐',
    tagline: 'Perfect for complete exam preparation cycle (NEET / NORCET / PSC)',
    priceINR: 499,
    originalPriceINR: 1499,
    durationLabel: '6 Months Access',
    perMonthLabel: '₹83 / month',
    popular: true,
    badge: 'Most Popular for Aspirants',
    unlockCount: 'All Pro + Weakness Drills',
    features: [
      'Everything in Monthly Pro included',
      'Weakness Radar: Pinpoint exact <60% weak topics',
      'One-Click Targeted Recovery Drills (10-Q focused)',
      'Previous Year Papers (PYQ 2018–2024 Archive)',
      'Official Printable Preparation Dossier (PDF Download)',
      'Unlimited Web Share & File Exports',
      'Review Later Flagged Question Vault'
    ],
  },
  {
    id: 'annual',
    name: 'Arjun Super Ranker (1 Year)',
    hindiBadge: 'सुपर रैंकर (₹2.7/दिन) 🔥 70% OFF',
    tagline: 'Ultimate all-access pass for serious top-rank aspirants',
    priceINR: 999,
    originalPriceINR: 2999,
    durationLabel: '12 Months (Full Year)',
    perMonthLabel: '₹83 / month',
    badge: 'Best Value • 70% Off',
    unlockCount: '100% Unlocked VIP Access',
    features: [
      'All National, State, District & International Exams unlocked',
      'Unlimited Full-Length Major CBT Mock Exam Simulator',
      'AI & Statistical Mistake Pattern Analysis',
      'Admin Portal Access: Create custom subjects, tests & PYQs',
      'Priority Offline PWA & Play Store Android App Sync',
      'Exclusive Topper Strategy & AIR Comparison Radar',
      'VIP Verified Aspirant Badge on Leaderboard'
    ],
  },
];

export const INITIAL_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  isActive: false,
  validUntil: '',
  planName: 'Shuruat (Free Starter)',
};
