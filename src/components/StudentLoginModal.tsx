import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  Crown, 
  Flame, 
  Award, 
  BarChart3, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Compass
} from 'lucide-react';
import { StudentUser, Exam, UserSubscription, ThemeMode } from '../types';
import { INITIAL_STUDENTS } from '../data/studentsData';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onLogin: (user: StudentUser) => void;
  onLogout: () => void;
  onUpdateUser: (user: StudentUser) => void;
  exams: Exam[];
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  theme: ThemeMode;
}

const AVATAR_OPTIONS = ['👨‍⚕️', '👩‍⚕️', '👨‍💼', '👩‍💼', '🧑‍🔬', '👩‍🎓', '👨‍💻', '🎯'];

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateUser,
  exams,
  subscription,
  onOpenSubscriptionModal,
  theme,
}) => {
  const isLight = theme === 'light';
  
  // Navigation tabs within modal: 'signin' | 'register' | 'profile'
  const [modalTab, setModalTab] = useState<'signin' | 'register' | 'profile'>(
    currentUser?.isLoggedIn ? 'profile' : 'signin'
  );

  // Sign in state
  const [signInIdentifier, setSignInIdentifier] = useState('aarav.neet@gmail.com');
  const [signInPassword, setSignInPassword] = useState('student123');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTargetExam, setRegTargetExam] = useState(exams[0]?.id || 'exam-neet-ug');
  const [regTargetYear, setRegTargetYear] = useState('2026');
  const [regState, setRegState] = useState('Rajasthan (Kota)');
  const [regCategory, setRegCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [regAvatar, setRegAvatar] = useState('👨‍⚕️');

  if (!isOpen) return null;

  // Handle Quick Demo Login
  const handleDemoLogin = (student: StudentUser) => {
    onLogin({ ...student, isLoggedIn: true });
    setSuccessMsg(`Switched to student: ${student.name}`);
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 600);
  };

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const match = INITIAL_STUDENTS.find(
      (s) => s.email.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
             s.phone.replace(/\s+/g, '') === signInIdentifier.trim().replace(/\s+/g, '')
    );

    if (match) {
      onLogin({ ...match, isLoggedIn: true });
      setSuccessMsg(`Welcome back, ${match.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    } else {
      // Create ad-hoc student if email looks valid
      const newAdHoc: StudentUser = {
        id: `stu-${Date.now()}`,
        name: signInIdentifier.split('@')[0] || 'Student',
        email: signInIdentifier.includes('@') ? signInIdentifier : `${signInIdentifier}@lakshya.in`,
        phone: signInIdentifier.includes('@') ? '+91 98000 00000' : signInIdentifier,
        targetExamId: exams[0]?.id || 'exam-neet-ug',
        targetYear: '2026',
        state: 'Delhi (NCR)',
        category: 'General',
        avatar: '🎯',
        isLoggedIn: true,
        registeredAt: new Date().toISOString().slice(0, 10),
        testsCompletedCount: 1,
        averageAccuracy: 75.0,
        studyMinutes: 120,
        streakDays: 1,
        subscriptionPlanId: 'free',
        subscriptionTier: 'free',
        subscriptionExpiry: '',
      };
      onLogin(newAdHoc);
      onClose();
    }
  };

  // Handle Registration submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please enter your full name and valid email.');
      return;
    }

    const newStudent: StudentUser = {
      id: `stu-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+91 98000 12345',
      targetExamId: regTargetExam,
      targetYear: regTargetYear,
      state: regState,
      category: regCategory,
      avatar: regAvatar,
      isLoggedIn: true,
      registeredAt: new Date().toISOString().slice(0, 10),
      testsCompletedCount: 0,
      averageAccuracy: 0,
      studyMinutes: 0,
      streakDays: 1,
      subscriptionPlanId: 'free',
      subscriptionTier: 'free',
      subscriptionExpiry: '',
    };

    onLogin(newStudent);
    setSuccessMsg(`Account created for ${newStudent.name}! You are on the Starter Free tier.`);
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 800);
  };

  // Request Phone OTP
  const handleSendOtp = () => {
    if (!signInIdentifier.trim()) {
      setErrorMsg('Please enter mobile number or email first.');
      return;
    }
    setOtpSent(true);
    setSuccessMsg('OTP sent to your number: 1234 (Demo)');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234' || otpCode === '7860' || otpCode.length >= 4) {
      const match = INITIAL_STUDENTS[0];
      onLogin({ ...match, isLoggedIn: true });
      onClose();
    } else {
      setErrorMsg('Invalid OTP. Please enter 1234.');
    }
  };

  const currentExamObj = exams.find((e) => e.id === currentUser?.targetExamId) || exams[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden my-auto transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Top Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>{currentUser?.isLoggedIn ? 'Student Profile & Pass' : 'Student Portal'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  {currentUser?.isLoggedIn ? 'Active Aspirant' : 'Aspirant Login'}
                </span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentUser?.isLoggedIn ? 'Manage subscription, targets & test progress' : 'Log in to sync tests, custom packages & rank analytics'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not logged in */}
        {!currentUser?.isLoggedIn && (
          <div className={`flex border-b text-xs font-semibold ${isLight ? 'border-slate-200 bg-slate-100/60' : 'border-slate-800 bg-slate-950/60'}`}>
            <button
              onClick={() => { setModalTab('signin'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 ${
                modalTab === 'signin'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In (लॉग इन)
            </button>
            <button
              onClick={() => { setModalTab('register'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 ${
                modalTab === 'register'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              New Registration (नया छात्र खाता)
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW: LOGGED IN PROFILE */}
          {currentUser?.isLoggedIn && (
            <div className="space-y-4">
              
              {/* Profile Card Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isLight ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-100' : 'bg-slate-800/80 border-slate-700'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2 rounded-2xl bg-white shadow-sm border border-indigo-100 shrink-0">
                    {currentUser.avatar || '👨‍⚕️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        {currentUser.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentUser.email} • {currentUser.phone}
                    </p>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      Target: {currentExamObj.name} ({currentUser.targetYear})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-xs">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    <span>{currentUser.streakDays}d Streak</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {currentUser.state}
                  </span>
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className={`p-4 rounded-2xl border transition ${
                subscription.isActive
                  ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30'
                  : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${subscription.isActive ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm">
                          {subscription.isActive ? subscription.planName : 'Free Starter Tier'}
                        </span>
                        {subscription.isActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                            PRO UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {subscription.isActive 
                          ? `Valid until ${subscription.validUntil} • Full Access`
                          : 'Limited to basic checklist & 3 practice drills/day'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenSubscriptionModal();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-sm cursor-pointer"
                  >
                    {subscription.isActive ? 'View / Change Pack' : 'Upgrade to Pro'}
                  </button>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tests Solved</span>
                  <span className="text-lg font-black text-indigo-600">{currentUser.testsCompletedCount}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Accuracy</span>
                  <span className="text-lg font-black text-emerald-600">{currentUser.averageAccuracy}%</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                  <span className="text-lg font-black text-purple-600">{currentUser.category || 'GEN'}</span>
                </div>
              </div>

              {/* Switch Demo Student Profile (Fast Testing for Evaluators) */}
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-700'}`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  🔄 Switch Aspirant Profile (Quick Testing):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INITIAL_STUDENTS.map((stu) => (
                    <button
                      key={stu.id}
                      onClick={() => handleDemoLogin(stu)}
                      className={`text-left p-2 rounded-lg text-xs border flex items-center justify-between transition cursor-pointer ${
                        stu.id === currentUser.id
                          ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                          : isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{stu.avatar}</span>
                        <div className="truncate">
                          <p className="font-semibold truncate">{stu.name}</p>
                          <p className="text-[10px] opacity-75">{stu.targetYear} • {stu.state.split(' ')[0]}</p>
                        </div>
                      </div>
                      {stu.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    onLogout();
                    setSuccessMsg('Logged out successfully.');
                    setTimeout(() => {
                      setSuccessMsg(null);
                      setModalTab('signin');
                    }, 500);
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold px-3 py-2 rounded-xl hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Student Account</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Close & Continue
                </button>
              </div>

            </div>
          )}

          {/* VIEW: SIGN IN */}
          {!currentUser?.isLoggedIn && modalTab === 'signin' && (
            <div className="space-y-4">
              
              {/* Quick Demo Login Pill for Fast Review */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-indigo-50/70 border-indigo-200' : 'bg-indigo-950/30 border-indigo-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👨‍⚕️</span>
                  <div>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                      Quick Demo: Aarav Sharma (NEET Aspirant)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pre-filled with test history, streak, and Pro pass
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDemoLogin(INITIAL_STUDENTS[0])}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm"
                >
                  1-Click Login
                </button>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Student Email or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      placeholder="e.g. aarav.neet@gmail.com or 9876543210"
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs pl-9 outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-600 dark:text-slate-300 font-semibold">
                      Password / Security PIN
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                    >
                      Login with OTP instead
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs pl-9 outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {otpSent && (
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/40 border-emerald-800'}`}>
                    <label className="block text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                      Enter 4-Digit OTP (Demo OTP: 1234)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="1234"
                        className={`w-32 px-3 py-2 rounded-lg border text-center font-mono font-bold tracking-widest outline-none ${
                          isLight ? 'bg-white border-emerald-300' : 'bg-slate-800 border-slate-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        Verify & Login
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>Student Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Profiles Bar */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
                  Or select any student profile directly:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {INITIAL_STUDENTS.slice(1, 5).map((stu) => (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => handleDemoLogin(stu)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                        isLight ? 'bg-slate-50 hover:bg-indigo-50 border-slate-200' : 'bg-slate-800/60 hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{stu.avatar}</span>
                      <div className="truncate">
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{stu.name}</p>
                        <p className="text-[10px] text-slate-400">{stu.targetExamId.replace('exam-', '').toUpperCase()} • {stu.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW: NEW REGISTRATION */}
          {!currentUser?.isLoggedIn && modalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Choose Aspirant Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setRegAvatar(av)}
                      className={`text-2xl p-2 rounded-xl border transition cursor-pointer ${
                        regAvatar === av 
                          ? 'bg-indigo-600/20 border-indigo-600 scale-110 shadow-sm' 
                          : isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    WhatsApp / Mobile (+91)
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. priya.aspirant@gmail.com"
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>

              {/* Target Exam & Target Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Target Competitive Exam
                  </label>
                  <select
                    value={regTargetExam}
                    onChange={(e) => setRegTargetExam(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.tier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Target Exam Year
                  </label>
                  <select
                    value={regTargetYear}
                    onChange={(e) => setRegTargetYear(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    <option value="2025">2025 (Immediate Target)</option>
                    <option value="2026">2026 (Next Year)</option>
                    <option value="2027">2027 (Foundation)</option>
                  </select>
                </div>
              </div>

              {/* State & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Home State / Coaching Hub
                  </label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    placeholder="e.g. Rajasthan, Kota / Delhi"
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Category (Cutoff Benchmarking)
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    <option value="General">General / UR</option>
                    <option value="OBC">OBC (Non-Creamy)</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Student Account & Start Free</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
