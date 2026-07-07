import { useState } from 'react';
import { Database, Copy, ShieldCheck, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../data';

export default function DatabaseTab() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Supabase DB Matrix Schema Hub <ShieldCheck className="h-6 w-6 text-blue-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review normalized tables, indexes, Row Level Security (RLS) policies, triggers, and migrations ready to execute in your Supabase Dashboard SQL Editor.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
        >
          {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
          {copied ? 'Copied SQL Script!' : 'Copy Schema Script'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core RLS Policies Highlights */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Tenant isolation mechanism
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every table is hardened with native PostgreSQL Row Level Security (RLS). When a Hostel Owner logs in, they are assigned a unique <code className="bg-slate-50 px-1 py-0.5 rounded font-mono font-bold text-slate-700">owner_id</code> which is isolated using policies.
          </p>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-950">Active Security Rules:</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-emerald-800 font-semibold">
              <li>Automatic isolation check for hostels, rooms, and students</li>
              <li>Cascade protections for tenant deletes</li>
              <li>Parameter injection prevention</li>
              <li>Prevent cross-tenant listings</li>
            </ul>
          </div>

          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 pt-2 flex items-center gap-1.5">
            <Terminal className="h-5 w-5 text-blue-600" /> System benchmarks
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600 font-semibold">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span>DB Provider:</span>
              <span className="text-slate-900">PostgreSQL 15 (Supabase)</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span>ORM Compliant:</span>
              <span className="text-slate-900">Drizzle, Prisma, SQL</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span>Performance Indexes:</span>
              <span className="text-slate-900">10 Created</span>
            </div>
            <div className="flex justify-between">
              <span>Schema Version:</span>
              <span className="text-blue-600 font-mono font-black">v2.4-PROD</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-600">
            <HelpCircle className="h-4.5 w-4.5 shrink-0" />
            <a href="https://supabase.com" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
              Learn about Supabase RLS <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* SQL Script Viewer */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg md:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              supabase-schema.sql
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition"
              title="Copy SQL code block"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="p-5 font-mono text-[10px] text-slate-300 overflow-y-auto max-h-[460px] leading-relaxed whitespace-pre-wrap select-text">
            {SUPABASE_SQL_SCHEMA}
          </div>
        </div>
      </div>
    </div>
  );
}
