import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, GraduationCap, Wheat, Briefcase, Heart, Users, Rocket,
  Layers, MapPin, LayoutGrid, CheckCircle2, Sparkles, ShieldCheck,
  Search, ChevronRight, Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, SCHEMES, STATS, TESTIMONIALS, HOW_IT_WORKS } from '../mock';

const iconMap = {
  GraduationCap, Wheat, Briefcase, Heart, Users, Rocket, Layers, MapPin, LayoutGrid,
};

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const featured = SCHEMES.filter((s) => s.featured).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/60 backdrop-blur px-3 py-1 text-xs text-emerald-800">
              <Sparkles size={13} className="text-emerald-600" />
              <span className="font-medium">{t('heroTag')}</span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
              {t('heroTitle').split(' qualify ')[0]}
              <span className="text-emerald-600"> qualify </span>
              {t('heroTitle').split(' qualify ')[1] || 'for'}
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">{t('heroSubtitle')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/checker')}
                className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-6 gap-2"
              >
                {t('startChecker')} <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/schemes')}
                className="h-12 px-6 border-slate-300 text-slate-800 hover:bg-slate-50"
              >
                {t('browseAll')}
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Verified government sources</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Free forever</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles size={14} className="text-emerald-600" /> Updated monthly</span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-200 pt-10">
            {STATS.map((s) => {
              const Ic = iconMap[s.icon];
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-slate-100 grid place-items-center text-slate-700">
                    <Ic size={18} />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900 leading-none">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold">Categories</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{t('exploreByCategory')}</h2>
              <p className="mt-3 text-slate-600 max-w-2xl">{t('exploreByCategoryDesc')}</p>
            </div>
            <Link to="/schemes" className="text-sm font-medium text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1">
              {t('viewAll')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((c) => {
              const Ic = iconMap[c.icon];
              return (
                <Link
                  key={c.id}
                  to={`/schemes?cat=${c.id}`}
                  className="card-lift group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-300"
                >
                  <div className="h-11 w-11 rounded-xl bg-slate-50 grid place-items-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    <Ic size={20} />
                  </div>
                  <div className="mt-4 text-[15px] font-semibold text-slate-900">{c.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{c.count} schemes</div>
                  <ArrowRight size={16} className="absolute top-5 right-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="py-20 sm:py-24 bg-slate-50/60 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold">Featured</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{t('featuredSchemes')}</h2>
              <p className="mt-3 text-slate-600 max-w-2xl">{t('featuredDesc')}</p>
            </div>
            <Link to="/schemes" className="text-sm font-medium text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1">
              {t('viewAll')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((s) => (
              <Card key={s.id} className="card-lift p-6 bg-white border border-slate-200 rounded-2xl">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
                    {s.ministry.replace('Ministry of ', '')}
                  </Badge>
                  <div className="text-xs text-slate-500">{s.state}</div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{s.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">Benefit</div>
                    <div className="text-sm font-semibold text-slate-900">{s.benefit}</div>
                  </div>
                  <Link to={`/schemes/${s.id}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                    {t('viewDetails')} <ArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold">Process</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{t('howItWorks')}</h2>
            <p className="mt-3 text-slate-600">{t('howItWorksDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((h, idx) => (
              <div key={h.step} className="relative rounded-2xl border border-slate-200 bg-white p-8 card-lift">
                <div className="text-5xl font-semibold text-emerald-100 leading-none">{h.step}</div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{h.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{h.desc}</p>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight size={18} className="hidden md:block absolute top-1/2 -right-3 text-slate-300 bg-white" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button size="lg" onClick={() => navigate('/checker')} className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 gap-2">
              <Search size={18} /> {t('startChecker')}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50/60 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold">Impact</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{t('testimonials')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm) => (
              <Card key={tm.name} className="p-7 bg-white border border-slate-200 rounded-2xl card-lift">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 leading-relaxed text-[15px]">“{tm.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center text-xs font-semibold">
                    {tm.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{tm.name}</div>
                    <div className="text-xs text-slate-500">{tm.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Your next benefit is 2 minutes away.</h3>
              <p className="mt-4 text-slate-300 max-w-xl mx-auto">Answer a few simple questions and get a personalized list of schemes you can apply to today.</p>
              <Button
                size="lg"
                onClick={() => navigate('/checker')}
                className="mt-8 bg-white text-slate-900 hover:bg-slate-100 h-12 px-6 gap-2"
              >
                {t('startChecker')} <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;