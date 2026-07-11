import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Calendar, Building2,
  MapPin, CheckCircle2, FileText, Share2, IndianRupee, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { SCHEMES, getSavedSchemes, toggleSavedScheme } from '../mock';
import { getSchemeById } from '../api';
import { toast } from 'sonner';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 1. Try to check local mock data
    const localScheme = SCHEMES.find((s) => s.id === id);
    if (localScheme) {
      setScheme(localScheme);
      setSaved(getSavedSchemes().includes(localScheme.id));
      setLoading(false);
      return;
    }

    // 2. Fetch from backend if not a mock slug
    if (id && id !== "undefined") {
      setLoading(true);
      getSchemeById(id)
        .then((dbScheme) => {
          // Map database scheme to frontend fields
          const mapped = {
            id: dbScheme._id,
            title: dbScheme.name,
            type: dbScheme.providerType,
            ministry: dbScheme.source,
            provider: dbScheme.source,
            category: dbScheme.categories[0] || 'general',
            tags: dbScheme.categories || [],
            benefit: dbScheme.benefitDescription || `₹${dbScheme.benefitAmount?.toLocaleString('en-IN')}`,
            deadline: dbScheme.deadline ? new Date(dbScheme.deadline).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : 'Ongoing',
            description: dbScheme.description || '',
            eligibility: {
              age: [dbScheme.eligibility.minAge, dbScheme.eligibility.maxAge],
              income: dbScheme.eligibility.maxIncome || 9999999,
              categories: dbScheme.eligibility.socialCategory && dbScheme.eligibility.socialCategory.length > 0 ? dbScheme.eligibility.socialCategory : ['any'],
              occupation: dbScheme.eligibility.occupation && dbScheme.eligibility.occupation.length > 0 ? dbScheme.eligibility.occupation : ['any'],
              gender: [dbScheme.eligibility.gender || 'any']
            },
            benefits: dbScheme.applicationSteps || [],
            documents: dbScheme.documentsRequired || [],
            applyLink: dbScheme.applyUrl || '#'
          };
          setScheme(mapped);
          setSaved(getSavedSchemes().includes(dbScheme._id));
        })
        .catch((err) => {
          console.error("Failed to load backend scheme", err);
          setScheme(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setScheme(null);
      setLoading(false);
    }
  }, [id]);

  const onSave = () => {
    if (!scheme) return;
    const next = toggleSavedScheme(scheme.id);
    setSaved(next.includes(scheme.id));
    toast(next.includes(scheme.id) ? 'Saved to your list' : 'Removed from saved');
  };

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast('Unable to copy');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading details...</span>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Scheme not found</h1>
        <Button onClick={() => navigate('/schemes')} className="mt-6 bg-slate-900 hover:bg-slate-800 text-white">Back to schemes</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-205 hover:bg-emerald-50">{(scheme.ministry || scheme.provider || '').replace('Ministry of ', '')}</Badge>
            {scheme.type === 'private' && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Private</span>
            )}
            {scheme.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{t}</span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">{scheme.title}</h1>
          <p className="mt-4 text-slate-700 leading-relaxed">{scheme.description}</p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Benefit</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{scheme.benefit}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Deadline</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{scheme.deadline}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">State</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{scheme.state}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Age Range</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{scheme.eligibility.age[0]} – {scheme.eligibility.age[1]} yrs</div>
            </div>
          </div>

          <Card className="mt-8 p-6 border border-slate-200 rounded-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Key benefits</h2>
            <ul className="mt-4 space-y-3">
              {scheme.benefits.length > 0 ? (
                scheme.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-slate-700">
                    <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))
              ) : (
                <li className="flex gap-3 text-sm text-slate-750">
                  <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                  <span>{scheme.benefit}</span>
                </li>
              )}
            </ul>
          </Card>

          <Card className="mt-6 p-6 border border-slate-200 rounded-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Documents required</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {scheme.documents.length > 0 ? (
                scheme.documents.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <FileText size={13} /> {d}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <FileText size={13} /> Aadhaar Card or Identity Proof
                </span>
              )}
            </div>
          </Card>

          <Card className="mt-6 p-6 border border-slate-200 rounded-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Eligibility criteria</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5" /> Age between {scheme.eligibility.age[0]} and {scheme.eligibility.age[1]} years</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5" /> Annual income up to ₹{scheme.eligibility.income.toLocaleString('en-IN')}</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5" /> Occupation: {scheme.eligibility.occupation.join(', ')}</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-605 mt-0.5" /> Categories: {scheme.eligibility.categories.join(', ')}</li>
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 border border-slate-200 rounded-2xl sticky top-24">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Est. benefit</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{scheme.benefit}</div>
            <Separator className="my-5" />
            <a href={scheme.applyLink} target="_blank" rel="noreferrer" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 gap-2">
                Apply on official portal <ExternalLink size={16} />
              </Button>
            </a>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={onSave} className="flex-1 border-slate-300">
                {saved ? <><BookmarkCheck size={16} className="mr-1 text-emerald-700" /> Saved</> : <><Bookmark size={16} className="mr-1" /> Save</>}
              </Button>
              <Button variant="outline" onClick={onShare} className="border-slate-300">
                <Share2 size={16} />
              </Button>
            </div>

            <Separator className="my-5" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Building2 size={15} /> {scheme.ministry || scheme.provider}</div>
              <div className="flex items-center gap-2 text-slate-600"><MapPin size={15} /> {scheme.state}</div>
              <div className="flex items-center gap-2 text-slate-600"><Calendar size={15} /> {scheme.deadline}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;