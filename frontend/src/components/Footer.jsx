import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" size={16} />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-slate-900">SchemeSaathi</div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Eligibility Engine</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">{t('footerTag')}</p>
            <div className="mt-5 flex items-center gap-4 text-slate-500">
              <a href="https://github.com/Digital-India-Hackathon-2026" target="_blank" rel="noreferrer" className="hover:text-slate-900"><FaGithub size={18} /></a>
              <a href="mailto:hello@schemesaathi.in" className="hover:text-slate-900"><Mail size={18} /></a>
              <span className="inline-flex items-center gap-1.5 text-xs"><MapPin size={14} /> New Delhi, India</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link className="hover:text-slate-900" to="/checker">{t('checker')}</Link></li>
              <li><Link className="hover:text-slate-900" to="/schemes">{t('schemes')}</Link></li>
              <li><Link className="hover:text-slate-900" to="/profile">{t('profile')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">{t('resources')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="https://scholarships.gov.in" target="_blank" rel="noreferrer">National Scholarships</a></li>
              <li><a className="hover:text-slate-900" href="https://myscheme.gov.in" target="_blank" rel="noreferrer">MyScheme Portal</a></li>
              <li><a className="hover:text-slate-900" href="https://india.gov.in" target="_blank" rel="noreferrer">India.gov.in</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} SchemeSaathi. A citizen initiative.</div>
          <div>Built for Digital India Hackathon 2026</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;