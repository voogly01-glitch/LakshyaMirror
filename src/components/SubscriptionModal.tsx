import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Tag, 
  AlertCircle,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
  Wand2,
  Sliders,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionPlan, SubscriptionTier, UserSubscription, CustomPackage, ThemeMode } from '../types';
import { INDIAN_SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: UserSubscription;
  onActivateSubscription: (subscription: UserSubscription) => void;
  theme: ThemeMode;
  customPackages?: CustomPackage[];
  targetExamId?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onActivateSubscription,
  theme,
  customPackages = [],
  targetExamId,
}) => {
  const isLight = theme === 'light';

  // Modal navigation tab: 'standard' | 'custom' | 'builder'
  const [activePackageTab, setActivePackageTab] = useState<'standard' | 'custom' | 'builder'>('standard');

  // Selected Standard Plan or Custom Package ID
  const [selectedPlanId, setSelectedPlanId] = useState<string>('target6m');
  const [selectedCustomPkg, setSelectedCustomPkg] = useState<CustomPackage | null>(null);

  // DIY Builder states
  const [diyDurationDays, setDiyDurationDays] = useState<number>(90);
  const [diyScope, setDiyScope] = useState<'single' | 'all'>('single');
  const [diyMocks, setDiyMocks] = useState(true);
  const [diyRadar, setDiyRadar] = useState(true);
  const [diyPyq, setDiyPyq] = useState(true);
  const [diyDoubt, setDiyDoubt] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'PhonePe' | 'GPay' | 'Paytm' | 'Card'>('UPI');
  const [upiId, setUpiId] = useState('aspirant@upi');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen) return null;

  // Active custom packages only
  const activeCustomList = customPackages.filter((p) => p.isActive);

  // Compute DIY Price
  const computeDiyBasePrice = () => {
    let base = diyDurationDays === 30 ? 99 : diyDurationDays === 90 ? 199 : diyDurationDays === 180 ? 349 : 599;
    if (diyScope === 'all') base += 50;
    if (diyRadar) base += 40;
    if (diyPyq) base += 30;
    if (diyDoubt) base += 60;
    return base;
  };

  // Determine current active selection pricing & metadata
  let currentTitle = 'Sankalp 6-Month Target';
  let currentBasePrice = 499;
  let currentDurationDays = 180;
  let currentFeatures: string[] = [];

  if (activePackageTab === 'standard') {
    const stdPlan = INDIAN_SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || INDIAN_SUBSCRIPTION_PLANS[2];
    currentTitle = stdPlan.name;
    currentBasePrice = stdPlan.priceINR;
    currentDurationDays = stdPlan.id === 'monthly' ? 30 : stdPlan.id === 'target6m' ? 180 : stdPlan.id === 'annual' ? 365 : 0;
    currentFeatures = stdPlan.features;
  } else if (activePackageTab === 'custom') {
    const pkg = selectedCustomPkg || activeCustomList[0];
    if (pkg) {
      currentTitle = pkg.name;
      currentBasePrice = pkg.priceINR;
      currentDurationDays = pkg.durationDays;
      currentFeatures = pkg.features;
    }
  } else {
    currentTitle = `Custom Student Package (${diyDurationDays} Days)`;
    currentBasePrice = computeDiyBasePrice();
    currentDurationDays = diyDurationDays;
    currentFeatures = [
      `Valid for ${diyDurationDays} Days`,
      diyScope === 'all' ? 'Unlocks All 6 Competitive Exams' : 'Dedicated Single Exam Focus',
      diyMocks ? 'Unlimited CBT Chapter Mocks & Drills' : 'Basic Drills Only',
      diyRadar ? 'Asli Error Mirror & Weakness Radar GPS' : 'Standard Score',
      diyPyq ? '2018–2024 PYQ Archive Access' : '',
      diyDoubt ? '1-on-1 WhatsApp Faculty Doubt Support' : '',
    ].filter(Boolean);
  }

  // Calculate final discounted price
  const discountAmount = Math.round((currentBasePrice * appliedDiscount) / 100);
  const finalPrice = Math.max(0, currentBasePrice - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === 'STUDENT50' || cleanCode === 'ASPI50') {
      setAppliedDiscount(50);
      setCouponMessage({ text: '🎉 Student Special! 50% Flat Discount Applied.', isSuccess: true });
    } else if (cleanCode === 'NEET2026' || cleanCode === 'NORCET26' || cleanCode === 'UPSC26') {
      setAppliedDiscount(30);
      setCouponMessage({ text: '🎯 Exam Cycle Bonus! 30% Discount Applied.', isSuccess: true });
    } else if (cleanCode === 'CHAI100') {
      setAppliedDiscount(20);
      setCouponMessage({ text: '☕ Chai Budget Offer! 20% Discount Applied.', isSuccess: true });
    } else {
      setCouponMessage({ text: 'Invalid coupon. Try "STUDENT50" or "NEET2026".', isSuccess: false });
    }
  };

  const handleProcessPayment = () => {
    if (activePackageTab === 'standard' && selectedPlanId === 'free') {
      const freeSub: UserSubscription = {
        tier: 'free',
        isActive: false,
        validUntil: '',
        planName: 'Shuruat (Free Starter)',
      };
      onActivateSubscription(freeSub);
      onClose();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + currentDurationDays);

      const newSub: UserSubscription = {
        tier: activePackageTab === 'standard' ? (selectedPlanId as SubscriptionTier) : 'custom',
        isActive: true,
        validUntil: expiryDate.toISOString().slice(0, 10),
        planName: currentTitle,
        transactionId: `TXN_UPI_${Date.now()}_IND`,
        paymentMethod,
        discountApplied: discountAmount,
        packageId: activePackageTab === 'custom' ? selectedCustomPkg?.id : undefined,
      };

      onActivateSubscription(newSub);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });

      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className={`w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200 border transition-colors ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-slate-900 border-slate-700/80 text-slate-100'
        }`}
      >
        
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-start sm:items-center justify-between gap-4 ${
          isLight ? 'bg-indigo-50/50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Lakshya Pro & Customised Packages
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30 uppercase tracking-wider">
                  Indian Students Special
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Pocket-money friendly pricing in INR (₹) • Instant UPI & RuPay • Unlock Mock Tests, Error Mirror & Weakness Radar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
              isLight ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Package Selection Mode Switcher */}
        <div className={`px-4 sm:px-6 pt-3 border-b flex items-center gap-2 text-xs font-bold overflow-x-auto no-scrollbar ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={() => setActivePackageTab('standard')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activePackageTab === 'standard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Standard Student Plans</span>
          </button>

          <button
            onClick={() => {
              setActivePackageTab('custom');
              if (!selectedCustomPkg && activeCustomList.length > 0) {
                setSelectedCustomPkg(activeCustomList[0]);
              }
            }}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activePackageTab === 'custom'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-indigo-500" />
            <span>Tailored Custom Packages ({activeCustomList.length})</span>
          </button>

          <button
            onClick={() => setActivePackageTab('builder')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activePackageTab === 'builder'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span>Build Your Own Custom Pack (DIY)</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: STANDARD PLANS */}
          {activePackageTab === 'standard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {INDIAN_SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrentActive = currentSubscription.tier === plan.id && currentSubscription.isActive;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-2xl border-2 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 ring-4 ring-indigo-500/20 bg-indigo-500/5 shadow-xl scale-[1.01]'
                        : isLight
                        ? 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/60'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] tracking-wider uppercase shadow-md shadow-amber-500/30">
                        Most Popular
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                          {plan.hindiBadge}
                        </span>
                        {isCurrentActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-base text-slate-900 dark:text-white mt-1">
                        {plan.name}
                      </h3>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {plan.tagline}
                      </p>

                      {/* Pricing */}
                      <div className="mt-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            ₹{plan.priceINR}
                          </span>
                          {plan.originalPriceINR > plan.priceINR && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{plan.originalPriceINR}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-500">
                            / {plan.durationLabel}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                          Effective: {plan.perMonthLabel}
                        </span>
                      </div>

                      {/* Feature list */}
                      <div className="mt-4 space-y-2 text-xs">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span className={`text-[11px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3">
                      <button
                        type="button"
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : null}
                        <span>{isSelected ? 'Selected' : 'Choose Plan'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: TAILORED CUSTOM PACKAGES (Created by Admin) */}
          {activePackageTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Specialized exam crash series and subject boosters designed by mentors</span>
                <span className="font-semibold text-indigo-600">Active Packs: {activeCustomList.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCustomList.map((pkg) => {
                  const isSelected = selectedCustomPkg?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedCustomPkg(pkg)}
                      className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 ring-4 ring-amber-500/20 bg-amber-500/5 shadow-xl'
                          : isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30">
                            {pkg.hindiBadge}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {pkg.durationLabel}
                          </span>
                        </div>

                        <h3 className="font-black text-base text-slate-900 dark:text-white">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {pkg.tagline}
                        </p>

                        <div className="mt-3 flex items-baseline gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            ₹{pkg.priceINR}
                          </span>
                          {pkg.originalPriceINR > pkg.priceINR && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{pkg.originalPriceINR}
                            </span>
                          )}
                          <span className="text-xs text-emerald-600 font-bold">
                            Save {Math.round(((pkg.originalPriceINR - pkg.priceINR) / pkg.originalPriceINR) * 100)}%
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs">
                          {pkg.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-slate-600 dark:text-slate-300">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          🔥 {pkg.enrolledStudents || 120}+ Aspirants Enrolled
                        </span>
                        <button
                          type="button"
                          className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500 text-white shadow-md'
                              : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{isSelected ? 'Selected' : 'Select Pack'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIY CUSTOM PACKAGE BUILDER */}
          {activePackageTab === 'builder' && (
            <div className={`p-5 rounded-2xl border space-y-5 text-xs ${
              isLight ? 'bg-gradient-to-br from-indigo-50/50 via-purple-50/20 to-white border-indigo-100' : 'bg-slate-800/40 border-slate-800'
            }`}>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>Build Your Own Custom Study Pass</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select only what you need. Pay for your required duration and features without paying for unwanted extras.
                </p>
              </div>

              {/* Step 1: Duration */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-2">
                  Step 1: Choose Validity Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { days: 30, label: '1 Month', cost: '₹99 Base' },
                    { days: 90, label: '3 Months (Quarter)', cost: '₹199 Base' },
                    { days: 180, label: '6 Months (Cycle)', cost: '₹349 Base' },
                    { days: 365, label: '12 Months (Annual)', cost: '₹599 Base' },
                  ].map((d) => (
                    <button
                      key={d.days}
                      type="button"
                      onClick={() => setDiyDurationDays(d.days)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        diyDurationDays === d.days
                          ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-md'
                          : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="block text-sm font-black">{d.label}</span>
                      <span className="text-[10px] opacity-80">{d.cost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Exam Scope */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-2">
                  Step 2: Choose Exam Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiyScope('single')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      diyScope === 'single'
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-md'
                        : isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="block text-sm font-black">Single Target Exam (Base)</span>
                    <span className="text-[11px] opacity-80">Full depth for your selected target exam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiyScope('all')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      diyScope === 'all'
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-md'
                        : isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">All 6 Competitive Exams (+₹50)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">VIP</span>
                    </div>
                    <span className="text-[11px] opacity-80">NEET, UPSC, NORCET, JEE, PSC & SSC</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Feature Add-ons */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-2">
                  Step 3: Select Feature Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    diyRadar ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={diyRadar}
                        onChange={(e) => setDiyRadar(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <span className="font-bold block">Asli Error Mirror & Weakness Radar</span>
                        <span className="text-[10px] text-slate-400">Categorize silly mistakes vs conceptual traps</span>
                      </div>
                    </div>
                    <span className="font-black text-xs">+₹40</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    diyPyq ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={diyPyq}
                        onChange={(e) => setDiyPyq(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <span className="font-bold block">2018–2024 PYQ Archive & Notes</span>
                        <span className="text-[10px] text-slate-400">Official previous year papers with explanations</span>
                      </div>
                    </div>
                    <span className="font-black text-xs">+₹30</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    diyDoubt ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={diyDoubt}
                        onChange={(e) => setDiyDoubt(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <div>
                        <span className="font-bold block">1-on-1 Faculty Doubt Helpline (WhatsApp)</span>
                        <span className="text-[10px] text-slate-400">Ask questions and receive step-by-step guidance</span>
                      </div>
                    </div>
                    <span className="font-black text-xs">+₹60</span>
                  </label>

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-emerald-950/30 border-emerald-800 text-emerald-300'}`}>
                    <div>
                      <span className="font-bold block">Full Mock CBT Tests & Speed GPS</span>
                      <span className="text-[10px] opacity-75">Included by default in all custom packages</span>
                    </div>
                    <span className="font-black text-xs">FREE</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* CHECKOUT & UPI PAYMENT BOX */}
          <div className={`p-5 rounded-2xl border shadow-lg space-y-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Package:</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400 block">{currentTitle}</span>
                <span className="text-xs text-slate-500">Duration: {currentDurationDays} Days Access</span>
              </div>

              {/* Coupon code box */}
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon (e.g. STUDENT50)"
                    className={`w-full px-3 py-2 rounded-xl border text-xs uppercase font-mono font-bold outline-none ${
                      isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>
            </div>

            {couponMessage && (
              <p className={`text-xs font-semibold ${couponMessage.isSuccess ? 'text-emerald-600' : 'text-rose-500'}`}>
                {couponMessage.text}
              </p>
            )}

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Choose Payment Method (Zero Surcharge):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { id: 'UPI', label: 'BHIM UPI QR', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'PhonePe', label: 'PhonePe', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'GPay', label: 'Google Pay', icon: <Zap className="w-4 h-4" /> },
                  { id: 'Paytm', label: 'Paytm UPI', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'Card', label: 'RuPay / Cards', icon: <ShieldCheck className="w-4 h-4" /> },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Total & Pay Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-500 font-semibold">Total Payable Amount:</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{finalPrice}
                </span>
                {discountAmount > 0 && (
                  <span className="text-xs text-emerald-600 font-bold">
                    (Saved ₹{discountAmount} with code!)
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure UPI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Pay ₹{finalPrice} & Unlock Package</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
