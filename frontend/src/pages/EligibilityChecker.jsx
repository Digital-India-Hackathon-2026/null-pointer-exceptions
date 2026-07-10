import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuUser as User,
  LuIndianRupee as IndianRupee,
  LuMapPin as MapPin,
  LuUsers as UsersIcon,
  LuArrowRight as ArrowRight,
  LuArrowLeft as ArrowLeft,
  LuCircleCheck as CheckCircle2,
  LuSparkles as Sparkles,
  LuGraduationCap as GraduationCap,
  LuWheat as Wheat,
  LuBriefcase as Briefcase,
  LuHeart as Heart,
  LuRocket as Rocket,
  LuRefreshCw as RefreshCw,
  LuBookmark as Bookmark,
  LuBookmarkCheck as BookmarkCheck
} from 'react-icons/lu';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { SCHEMES, STATES, setProfile as saveProfileMock, getSavedSchemes, toggleSavedScheme } from '../mock';
import { getProfiles, saveProfile as saveProfileApi, matchSchemes as matchSchemesApi } from '../api';

const occupations = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'farmer', label: 'Farmer', icon: Wheat },
  { id: 'employee', label: 'Employee', icon: Briefcase },
  { id: 'women', label: 'Homemaker', icon: Heart },
  { id: 'senior', label: 'Retired', icon: UsersIcon },
  { id: 'entrepreneur', label: 'Entrepreneur', icon: Rocket },
];

const socialCats = ['General', 'OBC', 'SC', 'ST', 'EBC', 'BPL', 'DNT'];

const matchScheme = (scheme, p) => {
  const eg = scheme.eligibility;
  const age = parseInt(p.age || '0', 10);
  const inc = parseInt(p.income || '0', 10);
  if (age < eg.age[0] || age > eg.age[1]) return false;
  if (inc > eg.income) return false;
  if (!eg.occupation.includes('any') && !eg.occupation.includes(p.occupation)) return false;
  if (!eg.gender.includes('any') && !eg.gender.includes(p.gender)) return false;
  if (!eg.categories.includes('any') && !eg.categories.includes(p.socialCategory)) return false;
  return true;
};

const EligibilityChecker = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token") || "");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCheckMode, setNewCheckMode] = useState(false);

  // Profile data
  const [step, setStep] = useState(0);
  const [profile, setProfileState] = useState({
    name: '', age: '', gender: 'any', income: '', socialCategory: 'General',
    occupation: 'student', state: 'All India',
  });
  const [showResults, setShowResults] = useState(false);
  const [backendResults, setBackendResults] = useState(null);

  // Saving Profile Modal flow
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Saved bookmark schemes tracking
  const [savedSchemes, setSavedSchemes] = useState([]);

  useEffect(() => {
    setSavedSchemes(getSavedSchemes());
  }, []);

  const onToggleSave = (id) => {
    const next = toggleSavedScheme(id);
    setSavedSchemes(next);
    toast(next.includes(id) ? 'Scheme saved to bookmarks' : 'Removed from saved');
  };

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  // Load profiles from backend if authenticated
  useEffect(() => {
    if (token) {
      setLoading(true);
      getProfiles(token)
        .then(data => setProfiles(data))
        .catch(err => console.error("Failed to load profiles", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const results = useMemo(() => {
    if (!showResults) return [];
    if (backendResults) return backendResults;
    return SCHEMES.filter((s) => matchScheme(s, profile));
  }, [showResults, profile, backendResults]);

  const groupedResults = useMemo(() => {
    const farmer = [];
    const widow = [];
    const disabled = [];
    const general = [];

    const isFarmerScheme = (s) => {
      const occ = s.eligibility?.occupation || [];
      const cats = s.categories || [];
      const titleLower = (s.title || s.name || '').toLowerCase();
      const descLower = (s.description || '').toLowerCase();
      return occ.includes('farmer') || cats.includes('farmer') || cats.includes('agriculture') ||
        titleLower.includes('farmer') || titleLower.includes('kisan') || descLower.includes('farmer');
    };

    const isWidowScheme = (s) => {
      const ms = s.eligibility?.maritalStatus || [];
      const gender = s.eligibility?.gender || 'any';
      const cats = s.categories || [];
      const titleLower = (s.title || s.name || '').toLowerCase();
      const descLower = (s.description || '').toLowerCase();
      return ms.includes('widow') || cats.includes('widow') || cats.includes('woman') || cats.includes('women') ||
        gender === 'female' || titleLower.includes('widow') || titleLower.includes('women') ||
        titleLower.includes('mahila') || descLower.includes('widow') || descLower.includes('women');
    };

    const isDisabilityScheme = (s) => {
      const dis = s.eligibility?.disabilityRequired;
      const cats = s.categories || [];
      const titleLower = (s.title || s.name || '').toLowerCase();
      const descLower = (s.description || '').toLowerCase();
      return dis === true || cats.includes('disabled') || cats.includes('disability') ||
        titleLower.includes('disab') || titleLower.includes('divyang') || descLower.includes('disab');
    };

    results.forEach((s) => {
      const score = s.matchInsights?.priorityScore || 50;

      if (isFarmerScheme(s)) {
        farmer.push({ ...s, _score: score });
      } else if (isWidowScheme(s)) {
        widow.push({ ...s, _score: score });
      } else if (isDisabilityScheme(s)) {
        disabled.push({ ...s, _score: score });
      } else {
        general.push({ ...s, _score: score });
      }
    });

    farmer.sort((a, b) => b._score - a._score);
    widow.sort((a, b) => b._score - a._score);
    disabled.sort((a, b) => b._score - a._score);
    general.sort((a, b) => b._score - a._score);

    return { farmer, widow, disabled, general };
  }, [results]);

  const update = (k, v) => setProfileState((p) => ({ ...p, [k]: v }));

  const canProceed = () => {
    if (step === 0) return profile.name.trim() && profile.age;
    if (step === 1) return profile.occupation;
    if (step === 2) return profile.income !== '';
    if (step === 3) return profile.state;
    return true;
  };

  const handleSelectSavedProfile = async (prof) => {
    try {
      setLoading(true);
      const result = await matchSchemesApi(prof);
      setProfileState({
        name: prof.label,
        age: prof.age,
        gender: prof.gender || 'any',
        income: prof.income || '',
        socialCategory: prof.socialCategory || 'General',
        occupation: prof.occupation || 'student',
        state: prof.state || 'All India',
      });
      setBackendResults(result.schemes);
      setShowResults(true);
      toast.success('Eligibility check complete', {
        description: `Found ${result.schemes.length} matching schemes for ${prof.label}.`
      });
    } catch (err) {
      toast.error("Failed to check eligibility: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = () => {
    if (token) {
      // If logged in, ask to save the profile first
      setNewProfileName(profile.name || "");
      setShowSaveModal(true);
    } else {
      // Guest user path
      saveProfileMock(profile);
      setShowResults(true);
      toast.success('Eligibility check complete', {
        description: `Found ${SCHEMES.filter(s => matchScheme(s, profile)).length} matching schemes.`
      });
    }
  };

  const handleSaveAndFinish = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      toast.error("Please enter a profile name");
      return;
    }
    try {
      setSavingProfile(true);
      const payload = {
        label: newProfileName,
        isSelf: profiles.length === 0,
        age: parseInt(profile.age, 10),
        gender: profile.gender,
        state: profile.state,
        occupation: profile.occupation,
        maritalStatus: "single",
        socialCategory: profile.socialCategory,
        hasDisability: "no",
        income: parseInt(profile.income, 10),
        incomeUnknown: false
      };

      const savedProfile = await saveProfileApi(token, payload);

      // Load backend matching scheme results
      const matchResult = await matchSchemesApi(savedProfile);
      setBackendResults(matchResult.schemes);

      toast.success("Profile saved successfully");

      // Update local profiles list
      const updated = await getProfiles(token);
      setProfiles(updated);

      setShowSaveModal(false);
      setShowResults(true);
    } catch (err) {
      toast.error("Failed to save profile: " + err.message);
      // fallback to showing results anyway
      setShowSaveModal(false);
      setShowResults(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkipSaveAndFinish = () => {
    setShowSaveModal(false);
    setShowResults(true);
    toast.success('Eligibility check complete', {
      description: `Found ${SCHEMES.filter(s => matchScheme(s, profile)).length} matching schemes.`
    });
  };

  const renderSchemeCard = (s, index) => {
    const isSaved = savedSchemes.includes(s.id || s._id);
    const isPrivate = s.providerType === 'private' || s.ministry?.startsWith('Private:');
    return (
      <Card key={s.id || s._id} className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between card-lift relative">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shrink-0">
                <CheckCircle2 size={12} className="mr-1" /> Eligible
              </Badge>
              {isPrivate ? (
                <Badge variant="outline" className="border-amber-250 bg-amber-50 text-amber-700 font-semibold shrink-0">
                  Private
                </Badge>
              ) : (
                <Badge variant="outline" className="border-blue-250 bg-blue-50 text-blue-700 font-semibold shrink-0">
                  Government
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Rank #{index + 1}
              </span>
              <button
                onClick={() => onToggleSave(s.id || s._id)}
                className="text-slate-400 hover:text-green-600 transition-colors"
                aria-label="save"
              >
                {isSaved ? <BookmarkCheck size={18} className="text-green-600" /> : <Bookmark size={18} />}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-2">
            {((s.ministry || s.provider || s.source) || '').replace('Ministry of ', '').replace('Private: ', '')}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900 leading-snug">{s.title || s.name}</h3>
          <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{s.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Benefit</div>
            <div className="text-sm font-semibold text-slate-900">{s.benefit || s.benefitDescription}</div>
          </div>
          <Button size="sm" onClick={() => navigate(`/schemes/${s.id || s._id}`)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm shrink-0">
            View details <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </Card>
    );
  };

  if (showResults) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={14} /> Results
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Hi {profile.name.split(' ')[0]}, we found {results.length} schemes for you
            </h1>
            <p className="mt-2 text-slate-600">Personalized matches based on your profile. Save any scheme for later.</p>
          </div>
          <Button variant="outline" onClick={() => { setShowResults(false); setStep(0); setBackendResults(null); }} className="border-slate-300">
            Retake check
          </Button>
        </div>

        <div className="mt-10 space-y-12">
          {results.length === 0 && (
            <Card className="col-span-full p-10 text-center border border-slate-200 rounded-2xl">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 grid place-items-center text-slate-500">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No exact matches yet</h3>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">Try adjusting your profile or explore all schemes.</p>
              <Button onClick={() => navigate('/schemes')} className="mt-6 bg-slate-900 hover:bg-slate-800 text-white">
                Browse all schemes
              </Button>
            </Card>
          )}
          {groupedResults.farmer.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                🌾 Agriculture &amp; Farming Schemes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupedResults.farmer.map((s, index) => renderSchemeCard(s, index))}
              </div>
            </div>
          )}

          {groupedResults.widow.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                👩 Women &amp; Widow Welfare Schemes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupedResults.widow.map((s, index) => renderSchemeCard(s, index))}
              </div>
            </div>
          )}

          {groupedResults.disabled.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                ♿ Disability Support Programs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupedResults.disabled.map((s, index) => renderSchemeCard(s, index))}
              </div>
            </div>
          )}

          {groupedResults.general.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                ✨ General &amp; Other Eligible Schemes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupedResults.general.map((s, index) => renderSchemeCard(s, index))}
              </div>
            </div>
          )}

          {false && results.map((s) => {
            const isSaved = savedSchemes.includes(s.id || s._id);
            const isPrivate = s.providerType === 'private' || s.ministry?.startsWith('Private:');
            return (
              <Card key={s.id || s._id} className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between card-lift">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shrink-0">
                        <CheckCircle2 size={12} className="mr-1" /> Eligible
                      </Badge>
                      {isPrivate ? (
                        <Badge variant="outline" className="border-amber-250 bg-amber-50 text-amber-700 font-semibold shrink-0">
                          Private
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-blue-250 bg-blue-50 text-blue-700 font-semibold shrink-0">
                          Government
                        </Badge>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleSave(s.id || s._id)}
                      className="text-slate-400 hover:text-green-600 transition-colors ml-auto shrink-0"
                      aria-label="save"
                    >
                      {isSaved ? <BookmarkCheck size={18} className="text-green-600" /> : <Bookmark size={18} />}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {((s.ministry || s.provider || s.source) || '').replace('Ministry of ', '').replace('Private: ', '')}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 leading-snug">{s.title || s.name}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{s.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Benefit</div>
                    <div className="text-sm font-semibold text-slate-900">{s.benefit || s.benefitDescription}</div>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/schemes/${s.id || s._id}`)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm shrink-0">
                    View details <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Load selection dashboard if logged in and user has stored profiles
  if (token && profiles.length > 0 && !newCheckMode) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Check Eligibility</h1>
            <p className="text-sm text-slate-500 mt-1">Select a profile to instantly run eligibility check, or check for others.</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map(p => (
            <div
              key={p._id}
              onClick={() => handleSelectSavedProfile(p)}
              className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/10 cursor-pointer transition-all shadow-sm group"
            >
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {p.label} {p.isSelf && <span className="text-xs text-slate-400 font-normal">(You)</span>}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 capitalizing">
                  {p.age} yrs • {p.gender} • {p.occupation} • {p.socialCategory}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">₹{p.income?.toLocaleString('en-IN') || 0}/yr</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
          <Button onClick={() => { setNewCheckMode(true); setStep(0); }} className="bg-slate-900 hover:bg-slate-800 text-white gap-2 h-11 px-6">
            Check for someone else <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Tip Banner for Guest Users */}
      {!token && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
          <span className="leading-relaxed">💡 <strong>Tip:</strong> Create an account or sign in under <strong>My Profile</strong> to save details once and check eligibility for others anytime.</span>
        </div>
      )}

      {/* Header bar back-action if check person wizard */}
      {token && profiles.length > 0 && (
        <button
          onClick={() => setNewCheckMode(false)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-650 mb-4 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to profiles list
        </button>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
          <span className="font-medium">Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <Card className="p-8 sm:p-10 border border-slate-200 rounded-2xl bg-white shadow-sm">
        {step === 0 && (
          <div className="fade-up">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 grid place-items-center text-emerald-700 mb-5">
              <User size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Let's start with the basics</h2>
            <p className="mt-1.5 text-slate-600">Enter eligibility criteria details to find eligible benefits.</p>
            <div className="mt-8 space-y-5">
              <div>
                <Label className="text-sm text-slate-700 font-medium">Full name</Label>
                <Input value={profile.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g., Ananya Verma" className="mt-2 h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-700 font-medium">Age</Label>
                  <Input
                    type="text"
                    value={profile.age}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      update('age', val);
                    }}
                    placeholder="22"
                    className="mt-2 h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-700 font-medium">Gender</Label>
                  <Select value={profile.gender} onValueChange={(v) => update('gender', v)}>
                    <SelectTrigger className="mt-2 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Prefer not to say</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 grid place-items-center text-emerald-700 mb-5">
              <Briefcase size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">What best describes you?</h2>
            <p className="mt-1.5 text-slate-600">Pick your primary occupation.</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {occupations.map((o) => {
                const Ic = o.icon;
                const active = profile.occupation === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => update('occupation', o.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${active
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-350 bg-white'
                      }`}
                  >
                    <Ic size={18} className={active ? 'text-emerald-700' : 'text-slate-600'} />
                    <div className="mt-3 text-sm font-semibold text-slate-900">{o.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 grid place-items-center text-emerald-700 mb-5">
              <IndianRupee size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Family details</h2>
            <p className="mt-1.5 text-slate-600">Used only to match income-based benefits.</p>
            <div className="mt-8 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm text-slate-700 font-medium mb-0">Annual family income (₹)</Label>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs select-none">
                    ₹{Number(profile.income || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="10000"
                  value={profile.income || 0}
                  onChange={(e) => update('income', e.target.value)}
                  className="premium-slider"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 select-none">
                  <span>₹0</span>
                  <span>₹5L</span>
                  <span>₹10L</span>
                  <span>₹15L+</span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-slate-700 font-medium mb-3 block">Social category</Label>
                <RadioGroup value={profile.socialCategory} onValueChange={(v) => update('socialCategory', v)} className="grid grid-cols-3 gap-2">
                  {socialCats.map((c) => (
                    <label key={c} className={`cursor-pointer rounded-lg border px-3 py-2.5 flex items-center gap-2 text-sm transition-colors ${profile.socialCategory === c
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}>
                      <RadioGroupItem value={c} id={c} className="sr-only" />
                      {c}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 grid place-items-center text-emerald-700 mb-5">
              <MapPin size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Where do you live?</h2>
            <p className="mt-1.5 text-slate-600">Helps us show state-specific programmes.</p>
            <div className="mt-8">
              <Label className="text-sm text-slate-700 font-medium">State</Label>
              <Select value={profile.state} onValueChange={(v) => update('state', v)}>
                <SelectTrigger className="mt-2 h-11"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 font-semibold"
            >
              Continue <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={onFinish}
              disabled={!canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 font-semibold"
            >
              Show my schemes <Sparkles size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </Card>

      {/* Save Profile Inline/Modal dialog (only for auth users) */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 border border-slate-200 bg-white shadow-xl rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900">Save Eligibility Drawer</h3>
            <p className="text-xs text-slate-500 mt-1">Name this member to save their profile and check their eligibility instantly in future.</p>

            <form onSubmit={handleSaveAndFinish} className="mt-6 flex flex-col gap-4">
              <div>
                <Label className="text-xs text-slate-700 font-semibold">Profile Label / Name</Label>
                <Input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder="e.g., Myself, Mother, Ramesh (friend)"
                  className="mt-1.5 h-11"
                />
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button type="button" variant="ghost" onClick={handleSkipSaveAndFinish} className="text-slate-500 hover:text-slate-850">
                  Show Results Without Saving
                </Button>
                <Button type="submit" disabled={savingProfile} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[80px]">
                  {savingProfile ? "Saving..." : "Save & Show"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;