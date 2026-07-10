import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, IndianRupee, Calendar, MapPin, Users as UsersIcon, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, GraduationCap, Wheat, Briefcase, Heart, Rocket
} from 'lucide-react';
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
import { SCHEMES, STATES, CATEGORIES, setProfile as saveProfile } from '../mock';

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
  const [step, setStep] = useState(0);
  const [profile, setProfileState] = useState({
    name: '', age: '', gender: 'any', income: '', socialCategory: 'General',
    occupation: 'student', state: 'All India',
  });
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const results = useMemo(() => {
    if (!showResults) return [];
    return SCHEMES.filter((s) => matchScheme(s, profile));
  }, [showResults, profile]);

  const update = (k, v) => setProfileState((p) => ({ ...p, [k]: v }));

  const canProceed = () => {
    if (step === 0) return profile.name.trim() && profile.age;
    if (step === 1) return profile.occupation;
    if (step === 2) return profile.income !== '';
    if (step === 3) return profile.state;
    return true;
  };

  const onFinish = () => {
    saveProfile(profile);
    setShowResults(true);
    toast.success('Eligibility check complete', { description: `Found ${SCHEMES.filter(s => matchScheme(s, profile)).length} matching schemes.` });
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
          <Button variant="outline" onClick={() => { setShowResults(false); setStep(0); }} className="border-slate-300">
            Retake check
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.length === 0 && (
            <Card className="col-span-full p-10 text-center border border-slate-200 rounded-2xl">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 grid place-items-center text-slate-500">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No exact matches yet</h3>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">Try adjusting your profile or explore all schemes. New programmes are added every month.</p>
              <Button onClick={() => navigate('/schemes')} className="mt-6 bg-slate-900 hover:bg-slate-800 text-white">
                Browse all schemes
              </Button>
            </Card>
          )}
          {results.map((s) => (
            <Card key={s.id} className="p-6 border border-slate-200 rounded-2xl card-lift">
              <div className="flex items-start justify-between gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                  <CheckCircle2 size={12} className="mr-1" /> Eligible
                </Badge>
                <div className="text-xs text-slate-500">{(s.ministry || s.provider || '').replace('Ministry of ', '')}</div>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">Benefit</div>
                  <div className="text-sm font-semibold text-slate-900">{s.benefit}</div>
                </div>
                <Button size="sm" onClick={() => navigate(`/schemes/${s.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white">
                  View details <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
          <span className="font-medium">Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <Card className="p-8 sm:p-10 border border-slate-200 rounded-2xl bg-white">
        {step === 0 && (
          <div className="fade-up">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 grid place-items-center text-emerald-700 mb-5">
              <User size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Let's start with the basics</h2>
            <p className="mt-1.5 text-slate-600">Your data stays on your device. We never share it.</p>
            <div className="mt-8 space-y-5">
              <div>
                <Label className="text-sm text-slate-700">Full name</Label>
                <Input value={profile.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g., Ananya Verma" className="mt-1.5 h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-700">Age</Label>
                  <Input type="number" value={profile.age} onChange={(e) => update('age', e.target.value)} placeholder="22" className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-sm text-slate-700">Gender</Label>
                  <Select value={profile.gender} onValueChange={(v) => update('gender', v)}>
                    <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
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
                    className={`text-left p-4 rounded-xl border transition-all ${
                      active
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
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
                <Label className="text-sm text-slate-700">Annual family income (₹)</Label>
                <Input type="number" value={profile.income} onChange={(e) => update('income', e.target.value)} placeholder="e.g., 250000" className="mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-sm text-slate-700 mb-2 block">Social category</Label>
                <RadioGroup value={profile.socialCategory} onValueChange={(v) => update('socialCategory', v)} className="grid grid-cols-3 gap-2">
                  {socialCats.map((c) => (
                    <label key={c} className={`cursor-pointer rounded-lg border px-3 py-2.5 flex items-center gap-2 text-sm ${
                      profile.socialCategory === c
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
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
              <Label className="text-sm text-slate-700">State</Label>
              <Select value={profile.state} onValueChange={(v) => update('state', v)}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
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
              className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6"
            >
              Continue <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={onFinish}
              disabled={!canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6"
            >
              Show my schemes <Sparkles size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EligibilityChecker;