import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Crown, 
  Gift, 
  Flame, 
  CheckCircle2, 
  RotateCcw, 
  Plus, 
  X, 
  Award, 
  Clock, 
  Calendar,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';
import { StudentUser, Exam, CustomPackage, ThemeMode } from '../../types';

interface AdminStudentsTabProps {
  students: StudentUser[];
  onUpdateStudents: (students: StudentUser[]) => void;
  exams: Exam[];
  customPackages: CustomPackage[];
  theme: ThemeMode;
  showFlash: (msg: string) => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  students,
  onUpdateStudents,
  exams,
  customPackages,
  theme,
  showFlash,
}) => {
  const isLight = theme === 'light';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [subFilter, setSubFilter] = useState<'all' | 'pro' | 'free'>('all');

  // Modals state
  const [selectedStudentForGrant, setSelectedStudentForGrant] = useState<StudentUser | null>(null);
  const [grantPlanId, setGrantPlanId] = useState<string>('monthly');
  const [grantDays, setGrantDays] = useState<number>(30);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStuName, setNewStuName] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuPhone, setNewStuPhone] = useState('');
  const [newStuExam, setNewStuExam] = useState(exams[0]?.id || 'exam-neet-ug');
  const [newStuYear, setNewStuYear] = useState('2026');
  const [newStuState, setNewStuState] = useState('Delhi (NCR)');
  const [newStuCategory, setNewStuCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [newStuAvatar, setNewStuAvatar] = useState('👨‍⚕️');

  // Filter students
  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.phone.includes(searchTerm);

    const matchesExam = examFilter === 'all' || stu.targetExamId === examFilter;

    const isPro = stu.subscriptionTier && stu.subscriptionTier !== 'free';
    const matchesSub =
      subFilter === 'all' ||
      (subFilter === 'pro' && isPro) ||
      (subFilter === 'free' && !isPro);

    return matchesSearch && matchesExam && matchesSub;
  });

  // KPI Calculations
  const totalStudents = students.length;
  const proStudentsCount = students.filter((s) => s.subscriptionTier && s.subscriptionTier !== 'free').length;
  const totalTestsAttempted = students.reduce((acc, s) => acc + s.testsCompletedCount, 0);
  const avgAccuracy = totalStudents > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.averageAccuracy, 0) / totalStudents)
    : 0;

  // Handle Grant Package
  const handleConfirmGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrant) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(grantDays));

    let planName = 'Lakshya Pro';
    if (grantPlanId === 'monthly') planName = 'Lakshya Monthly Pro (₹199)';
    else if (grantPlanId === 'target6m') planName = 'Sankalp 6-Month Target (₹499)';
    else if (grantPlanId === 'annual') planName = 'Arjun Super Ranker (₹999)';
    else {
      const customP = customPackages.find((cp) => cp.id === grantPlanId);
      if (customP) planName = customP.name;
    }

    const updated = students.map((s) => {
      if (s.id === selectedStudentForGrant.id) {
        return {
          ...s,
          subscriptionTier: grantPlanId === 'monthly' ? 'monthly' : grantPlanId === 'target6m' ? 'target6m' : grantPlanId === 'annual' ? 'annual' : 'custom',
          subscriptionPlanId: grantPlanId,
          subscriptionPlanName: planName,
          subscriptionExpiry: expiryDate.toISOString().slice(0, 10),
          notes: `${s.notes || ''} [Admin granted ${planName} on ${new Date().toLocaleDateString()}]`.trim(),
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    showFlash(`✓ Package "${planName}" successfully granted to ${selectedStudentForGrant.name}!`);
    setSelectedStudentForGrant(null);
  };

  // Handle Add Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStuName.trim() || !newStuEmail.trim()) return;

    const newStudent: StudentUser = {
      id: `stu-${Date.now()}`,
      name: newStuName.trim(),
      email: newStuEmail.trim(),
      phone: newStuPhone.trim() || '+91 98000 00000',
      targetExamId: newStuExam,
      targetYear: newStuYear,
      state: newStuState,
      category: newStuCategory,
      avatar: newStuAvatar,
      isLoggedIn: false,
      registeredAt: new Date().toISOString().slice(0, 10),
      testsCompletedCount: 0,
      averageAccuracy: 0,
      studyMinutes: 0,
      streakDays: 1,
      subscriptionPlanId: 'free',
      subscriptionTier: 'free',
      subscriptionExpiry: '',
      notes: 'Added via Admin Student Directory.',
    };

    onUpdateStudents([newStudent, ...students]);
    showFlash(`✓ New student ${newStudent.name} registered successfully!`);
    setIsAddStudentOpen(false);
    setNewStuName('');
    setNewStuEmail('');
    setNewStuPhone('');
  };

  // Reset student test records
  const handleResetStudentTests = (studentId: string, studentName: string) => {
    if (window.confirm(`Reset all test attempt counts and accuracy history for ${studentName}?`)) {
      const updated = students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            testsCompletedCount: 0,
            averageAccuracy: 0,
            studyMinutes: 0,
          };
        }
        return s;
      });
      onUpdateStudents(updated);
      showFlash(`✓ Test history reset for ${studentName}.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Total Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Pan-India Aspirants</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Pro Subscribers</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">
            {proStudentsCount} <span className="text-xs text-slate-400 font-normal">({totalStudents > 0 ? Math.round((proStudentsCount / totalStudents) * 100) : 0}%)</span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Active Paid & Custom Passes</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Total Tests Solved</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            {totalTestsAttempted}
          </div>
          <span className="text-[11px] text-purple-500 font-medium">Chapter Drills & Mocks</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Avg Cohort Accuracy</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {avgAccuracy}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Asli Mirror Benchmark</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Add Student Button */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, email, or mobile..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Exam Filter */}
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <option value="all">All Exams</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Subscription Filter */}
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-xl border text-xs outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <option value="all">All Tiers (Paid & Free)</option>
            <option value="pro">Pro & Custom Passes Only</option>
            <option value="free">Free Starter Tier Only</option>
          </select>
        </div>

        {/* Add Student Button */}
        <button
          onClick={() => setIsAddStudentOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Students Table / Cards List */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between text-xs font-bold ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <span>Student Directory ({filteredStudents.length} Aspirants)</span>
          <span className="text-slate-400 font-normal">Manage student subscriptions, progress & targets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b uppercase font-bold text-[10px] tracking-wider ${
              isLight ? 'bg-slate-100/70 border-slate-200 text-slate-500' : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <tr>
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Target Exam & Year</th>
                <th className="py-3 px-4">State & Category</th>
                <th className="py-3 px-4">Tests & Accuracy</th>
                <th className="py-3 px-4">Active Package</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const examObj = exams.find((e) => e.id === stu.targetExamId);
                  const isPro = stu.subscriptionTier && stu.subscriptionTier !== 'free';

                  return (
                    <tr key={stu.id} className={isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'}>
                      
                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                            {stu.avatar}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{stu.name}</span>
                              {isPro && (
                                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>{stu.email}</span>
                              <span>•</span>
                              <span>{stu.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Exam */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {examObj ? examObj.name : stu.targetExamId}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-bold">
                          Class of {stu.targetYear}
                        </span>
                      </td>

                      {/* State & Category */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300 block">{stu.state}</span>
                        <span className="text-[10px] text-slate-400">Category: {stu.category || 'GEN'}</span>
                      </td>

                      {/* Tests & Accuracy */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-indigo-600">{stu.testsCompletedCount} tests</span>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <span className="font-bold text-emerald-600">{stu.averageAccuracy}% acc</span>
                        </div>
                        <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          <span>{stu.streakDays}d Streak</span>
                        </div>
                      </td>

                      {/* Active Package */}
                      <td className="py-3 px-4">
                        {isPro ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">
                              <Crown className="w-3 h-3" />
                              <span>{stu.subscriptionPlanName || stu.subscriptionTier.toUpperCase()}</span>
                            </span>
                            {stu.subscriptionExpiry && (
                              <p className="text-[10px] text-slate-400">Till: {stu.subscriptionExpiry}</p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Free Starter
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForGrant(stu)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                            title="Grant Pro or Custom Package to this student"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>Grant Pack</span>
                          </button>

                          <button
                            onClick={() => handleResetStudentTests(stu.id, stu.name)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isLight ? 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200' : 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border-slate-700'
                            }`}
                            title="Reset student test attempts"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: GRANT CUSTOM PACKAGE / PRO PASS */}
      {selectedStudentForGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm">
                  Grant Subscription Package
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForGrant(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmGrant} className="p-5 space-y-4 text-xs">
              
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'}`}>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Aspirant Beneficiary:</span>
                <span className="font-black text-sm text-indigo-600 block">{selectedStudentForGrant.name}</span>
                <span className="text-[11px] text-slate-500">{selectedStudentForGrant.email} • {selectedStudentForGrant.targetYear}</span>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Select Package to Grant:
                </label>
                <select
                  value={grantPlanId}
                  onChange={(e) => setGrantPlanId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  <optgroup label="Standard Indian Student Plans">
                    <option value="monthly">Lakshya Monthly Pro (₹199 Value)</option>
                    <option value="target6m">Sankalp 6-Month Target (₹499 Value)</option>
                    <option value="annual">Arjun 1-Year Super Ranker (₹999 Value)</option>
                  </optgroup>
                  {customPackages.length > 0 && (
                    <optgroup label="Admin Customised Packages">
                      {customPackages.map((cp) => (
                        <option key={cp.id} value={cp.id}>
                          {cp.name} (₹{cp.priceINR} Value)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Validity Duration:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 90, 180, 365].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setGrantDays(d)}
                      className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                        grantDays === d
                          ? 'bg-amber-500 text-white border-amber-500'
                          : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForGrant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-md hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Grant Package Now</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm">
                  Register New Student (Admin Enrolment)
                </h3>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStuName}
                    onChange={(e) => setNewStuName(e.target.value)}
                    placeholder="e.g. Rahul Gupta"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    value={newStuPhone}
                    onChange={(e) => setNewStuPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newStuEmail}
                  onChange={(e) => setNewStuEmail(e.target.value)}
                  placeholder="rahul.aspirant@gmail.com"
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Target Exam</label>
                  <select
                    value={newStuExam}
                    onChange={(e) => setNewStuExam(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Target Year</label>
                  <select
                    value={newStuYear}
                    onChange={(e) => setNewStuYear(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">State / Coaching Hub</label>
                  <input
                    type="text"
                    value={newStuState}
                    onChange={(e) => setNewStuState(e.target.value)}
                    placeholder="e.g. Rajasthan (Kota)"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Category</label>
                  <select
                    value={newStuCategory}
                    onChange={(e) => setNewStuCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    <option value="General">General / UR</option>
                    <option value="OBC">OBC</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Student</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
