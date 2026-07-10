import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Bookmark, BookmarkCheck, ArrowRight, Sliders, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SCHEMES, CATEGORIES, STATES, MINISTRIES, getSavedSchemes, toggleSavedScheme } from '../mock';
import { toast } from 'sonner';

const Schemes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(initialCat);
  const [state, setState] = useState('all');
  const [ministry, setMinistry] = useState('all');
  const [saved, setSaved] = useState(getSavedSchemes());

  useEffect(() => {
    if (cat !== 'all') setSearchParams({ cat }); else setSearchParams({});
  }, [cat, setSearchParams]);

  const filtered = useMemo(() => {
    return SCHEMES.filter((s) => {
      if (q && !`${s.title} ${s.description} ${s.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== 'all' && s.category !== cat) return false;
      if (state !== 'all' && s.state !== state) return false;
      if (ministry !== 'all' && s.ministry !== ministry) return false;
      return true;
    });
  }, [q, cat, state, ministry]);

  const onToggleSave = (id) => {
    const next = toggleSavedScheme(id);
    setSaved(next);
    toast(next.includes(id) ? 'Scheme saved' : 'Removed from saved');
  };

  const clearFilters = () => { setQ(''); setCat('all'); setState('all'); setMinistry('all'); };
  const hasFilter = q || cat !== 'all' || state !== 'all' || ministry !== 'all';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 font-semibold">Explore</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Browse all schemes</h1>
          <p className="mt-2 text-slate-600">{filtered.length} of {SCHEMES.length} programmes shown</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by scheme name, tag, or description..."
              className="pl-9 h-11"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 lg:flex">
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="h-11 lg:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="h-11 lg:w-40"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All States</SelectItem>
                {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={ministry} onValueChange={setMinistry}>
              <SelectTrigger className="h-11 lg:w-48"><SelectValue placeholder="Ministry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ministries</SelectItem>
                {MINISTRIES.map((m) => <SelectItem key={m} value={m}>{m.replace('Ministry of ', '')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilter && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {cat !== 'all' && <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-800">Category: {CATEGORIES.find(c=>c.id===cat)?.label}</Badge>}
              {state !== 'all' && <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-800">State: {state}</Badge>}
              {ministry !== 'all' && <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-800">{ministry.replace('Ministry of ', '')}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-600">
              <X size={14} className="mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => {
          const isSaved = saved.includes(s.id);
          return (
            <Card key={s.id} className="p-6 border border-slate-200 rounded-2xl card-lift bg-white">
              <div className="flex items-start justify-between gap-3">
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-medium">
                  {(s.ministry || s.provider || '').replace('Ministry of ', '')}
                </Badge>
                {s.type === 'private' && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-medium">
                    Private
                  </Badge>
                )}
                <button
                  onClick={() => onToggleSave(s.id)}
                  className="text-slate-400 hover:text-emerald-700 transition-colors"
                  aria-label="save"
                >
                  {isSaved ? <BookmarkCheck size={18} className="text-emerald-700" /> : <Bookmark size={18} />}
                </button>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">Benefit</div>
                  <div className="text-sm font-semibold text-slate-900">{s.benefit}</div>
                </div>
                <Link to={`/schemes/${s.id}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                  View <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 rounded-2xl border border-dashed border-slate-200">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 grid place-items-center text-slate-400">
              <Search size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No schemes match your filters</h3>
            <p className="mt-1 text-sm text-slate-600">Try clearing filters or broadening your search.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 border-slate-300">Clear filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;