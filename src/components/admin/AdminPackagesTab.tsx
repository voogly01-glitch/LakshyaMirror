import React, { useState } from 'react';
import { 
  PackageCheck, 
  Plus, 
  Trash2, 
  Crown, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Users, 
  IndianRupee, 
  Flame, 
  Sparkles, 
  Award,
  Layers,
  Check,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { CustomPackage, Exam, ThemeMode } from '../../types';

interface AdminPackagesTabProps {
  customPackages: CustomPackage[];
  onAddCustomPackage: (pkg: CustomPackage) => void;
  onUpdateCustomPackage: (pkg: CustomPackage) => void;
  onDeleteCustomPackage: (pkgId: string) => void;
  exams: Exam[];
  theme: ThemeMode;
  showFlash: (msg: string) => void;
}

export const AdminPackagesTab: React.FC<AdminPackagesTabProps> = ({
  customPackages,
  onAddCustomPackage,
  onUpdateCustomPackage,
  onDeleteCustomPackage,
  exams,
  theme,
  showFlash,
}) => {
  const isLight = theme === 'light';

  // Form states for creating a new custom package
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgHindiBadge, setPkgHindiBadge] = useState('स्पेशल पैकेज');
  const [pkgTagline, setPkgTagline] = useState('');
  const [pkgPrice, setPkgPrice] = useState<number>(149);
  const [pkgMrp, setPkgMrp] = useState<number>(599);
  const [pkgDurationDays, setPkgDurationDays] = useState<number>(90);
  const [pkgDurationLabel, setPkgDurationLabel] = useState('90 Days Access');
  const [pkgTargetExam, setPkgTargetExam] = useState<string>('all');
  const [pkgBadge, setPkgBadge] = useState('Recommended');
  
  // Feature options
  const [allowMocks, setAllowMocks] = useState(true);
  const [allowRadar, setAllowRadar] = useState(true);
  const [allowPyq, setAllowPyq] = useState(true);
  const [allowPdf, setAllowPdf] = useState(true);
  const [allowDoubt, setAllowDoubt] = useState(false);
  const [rawFeatures, setRawFeatures] = useState(
    'Complete Chapter MCQs & Practice Drills\nImage-Based Questions (ECG & Clinical)\nPYQ Archive with detailed explanations\nAsli Error Mirror & Weakness Radar'
  );

  // KPIs
  const totalPackages = customPackages.length;
  const activePackages = customPackages.filter((p) => p.isActive).length;
  const totalEnrolled = customPackages.reduce((acc, p) => acc + (p.enrolledStudents || 0), 0);
  const totalRevenue = customPackages.reduce((acc, p) => acc + (p.priceINR * (p.enrolledStudents || 0)), 0);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) {
      alert('Please enter a package name');
      return;
    }

    const featuresList = rawFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const newPkg: CustomPackage = {
      id: `pack-${Date.now()}`,
      name: pkgName.trim(),
      hindiBadge: pkgHindiBadge.trim() || `सिर्फ ₹${pkgPrice}`,
      tagline: pkgTagline.trim() || `Tailored package for competitive exam success`,
      priceINR: Number(pkgPrice),
      originalPriceINR: Number(pkgMrp),
      durationDays: Number(pkgDurationDays),
      durationLabel: pkgDurationLabel.trim() || `${pkgDurationDays} Days Access`,
      targetExamId: pkgTargetExam,
      badge: pkgBadge,
      enrolledStudents: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      isActive: true,
      features: featuresList.length > 0 ? featuresList : [
        'Complete Chapter Mock Tests & Practice Drills',
        'Asli Error Mirror & Weakness Radar',
        'Detailed Explanations & Notes'
      ],
      allowMockTests: allowMocks,
      allowWeaknessRadar: allowRadar,
      allowPyqArchive: allowPyq,
      allowPdfDossier: allowPdf,
      allowWhatsAppSupport: allowDoubt,
    };

    onAddCustomPackage(newPkg);
    showFlash(`✓ Custom Package "${newPkg.name}" created & published successfully!`);
    setIsCreatingNew(false);
    
    // Reset form
    setPkgName('');
    setPkgTagline('');
    setPkgPrice(149);
    setPkgMrp(599);
  };

  const handleToggleActive = (pkg: CustomPackage) => {
    const updated = { ...pkg, isActive: !pkg.isActive };
    onUpdateCustomPackage(updated);
    showFlash(`✓ Package status updated: ${updated.name} is now ${updated.isActive ? 'Active' : 'Inactive'}.`);
  };

  const handleDelete = (pkgId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete package "${name}"?`)) {
      onDeleteCustomPackage(pkgId);
      showFlash(`✓ Package "${name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Custom Packages</span>
            <PackageCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalPackages}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">{activePackages} Active in Student Store</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Enrolled Aspirants</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">
            {totalEnrolled}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Students in Custom Packs</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Estimated Package Sales</span>
            <Crown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">UPI / Cashfree Volume</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase text-[10px]">Avg Package Price</span>
            <Tag className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            ₹{totalPackages > 0 ? Math.round(customPackages.reduce((acc, p) => acc + p.priceINR, 0) / totalPackages) : 0}
          </div>
          <span className="text-[11px] text-purple-500 font-medium">Student Friendly Pricing</span>
        </div>
      </div>

      {/* Control Banner: Create Custom Package Button */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-indigo-500" />
            <span>Customised Packages Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Design tailored exam bundles (e.g. NEET Biology Booster, UPSC Prelims Test Series, or AIIMS Clinical Kit) with custom pricing.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew((prev) => !prev)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
        >
          {isCreatingNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isCreatingNew ? 'Close Form' : 'Create Custom Package'}</span>
        </button>
      </div>

      {/* FORM: CREATE NEW CUSTOM PACKAGE */}
      {isCreatingNew && (
        <form onSubmit={handleCreatePackage} className={`p-5 rounded-2xl border shadow-lg space-y-4 text-xs animate-in slide-in-from-top-4 duration-200 ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>New Custom Package Builder</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Package will appear instantly in the student subscription modal
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Package Name *
              </label>
              <input
                type="text"
                required
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                placeholder="e.g. NEET 90-Day High-Yield Biology Booster"
                className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Hindi Badge / Discount Callout
              </label>
              <input
                type="text"
                value={pkgHindiBadge}
                onChange={(e) => setPkgHindiBadge(e.target.value)}
                placeholder="e.g. बायोलॉजी स्पेशल (₹149)"
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">
              Package Tagline / Value Proposition
            </label>
            <input
              type="text"
              value={pkgTagline}
              onChange={(e) => setPkgTagline(e.target.value)}
              placeholder="e.g. Target 360/360 in NEET Biology with NCERT-line-by-line MCQs & Image Questions"
              className={`w-full p-2.5 rounded-xl border outline-none ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={pkgPrice}
                onChange={(e) => setPkgPrice(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border outline-none font-black text-indigo-600 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                min={0}
                value={pkgMrp}
                onChange={(e) => setPkgMrp(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border outline-none text-slate-400 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                min={1}
                value={pkgDurationDays}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setPkgDurationDays(d);
                  setPkgDurationLabel(`${d} Days Access`);
                }}
                className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Target Exam
              </label>
              <select
                value={pkgTargetExam}
                onChange={(e) => setPkgTargetExam(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                <option value="all">All Exams (Universal)</option>
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Module Permissions Checkboxes */}
          <div>
            <label className="block text-slate-500 font-semibold mb-2">
              Unlocked Modules in this Package:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                allowMocks ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={allowMocks}
                  onChange={(e) => setAllowMocks(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-xs">Full Mock Tests</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                allowRadar ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={allowRadar}
                  onChange={(e) => setAllowRadar(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-xs">Asli Error Radar</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                allowPyq ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={allowPyq}
                  onChange={(e) => setAllowPyq(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-xs">PYQs 2018–2024</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                allowPdf ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={allowPdf}
                  onChange={(e) => setAllowPdf(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-xs">Printable PDF Dossier</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                allowDoubt ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={allowDoubt}
                  onChange={(e) => setAllowDoubt(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-xs">WhatsApp Doubt Help</span>
              </label>
            </div>
          </div>

          {/* Bullet Features (One per line) */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">
              Key Features List (One feature per line):
            </label>
            <textarea
              rows={3}
              value={rawFeatures}
              onChange={(e) => setRawFeatures(e.target.value)}
              placeholder="Enter key features, one line each"
              className={`w-full p-2.5 rounded-xl border outline-none font-mono text-xs ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Publish Custom Package</span>
            </button>
          </div>

        </form>
      )}

      {/* CUSTOM PACKAGES LIST / CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customPackages.map((pkg) => {
          const examObj = exams.find((e) => e.id === pkg.targetExamId);
          const discountPct = pkg.originalPriceINR > pkg.priceINR 
            ? Math.round(((pkg.originalPriceINR - pkg.priceINR) / pkg.originalPriceINR) * 100)
            : 0;

          return (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl border transition shadow-sm relative flex flex-col justify-between ${
                pkg.isActive
                  ? isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  : 'opacity-60 bg-slate-100 dark:bg-slate-950 border-dashed border-slate-300 dark:border-slate-800'
              }`}
            >
              <div>
                
                {/* Header row with badges & toggle */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                      {pkg.hindiBadge}
                    </span>
                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        {discountPct}% OFF
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {pkg.targetExamId === 'all' ? 'All Exams' : (examObj?.name || pkg.targetExamId)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                        pkg.isActive ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                      title={pkg.isActive ? 'Deactivate package' : 'Activate package'}
                    >
                      {pkg.isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-[10px]">{pkg.isActive ? 'Active' : 'Inactive'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Package Title & Tagline */}
                <h3 className="font-black text-base text-slate-900 dark:text-white mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {pkg.tagline}
                </p>

                {/* Pricing Box */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{pkg.priceINR}
                  </span>
                  {pkg.originalPriceINR > pkg.priceINR && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{pkg.originalPriceINR}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-500">
                    / {pkg.durationLabel}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 mb-4 text-xs">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom footer: Enrolled stats */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {pkg.enrolledStudents || 0} Aspirants Enrolled
                  </span>
                </div>
                <span>Created {pkg.createdAt}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
