'use client';

import { Fragment, useState } from 'react';

interface Opportunity {
  name: string;
  'deal type': string;
  Size: string;
  EHR: string;
  'Deal phase': string;
  why_exciting: string;
  'Key notes': string[];
  next_steps: string[];
}

interface MonarchData {
  generated_at: string;
  summary: { total: number; high: number; medium: number; low: number };
  Opportunities: Opportunity[];
}

const PHASE_ORDER: Record<string, number> = {
  'Paper Process': 0,
  Paused: 1,
  Stalled: 2,
  'Removed from pipeline': 3,
};

const PHASE_STYLES: Record<string, string> = {
  'Paper Process': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  Paused: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  Stalled: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
  'Removed from pipeline': 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200',
};

function PhaseBadge({ phase }: { phase: string }) {
  const cls = PHASE_STYLES[phase] ?? 'bg-slate-100 text-slate-500';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {phase}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor = 'text-slate-800',
}: {
  label: string;
  value: number;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-4xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

export default function Dashboard({ data }: { data: MonarchData }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...data.Opportunities].sort(
    (a, b) => (PHASE_ORDER[a['Deal phase']] ?? 99) - (PHASE_ORDER[b['Deal phase']] ?? 99),
  );

  const generatedDate = new Date(data.generated_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      {/* ── Header ── */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-slate-900">Project Monarch</h1>
              <p className="text-xs text-slate-400">Deal Pipeline · Solv Health</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Last Updated</p>
            <p className="text-sm font-medium text-slate-600">{generatedDate}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* ── Summary bar ── */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <StatCard
            label="Total Deals"
            value={data.summary.total}
            sub="In Monarch pipeline"
            valueColor="text-blue-600"
          />
          <StatCard
            label="Paper Process"
            value={data.summary.high}
            sub="Active · contract stage"
            valueColor="text-emerald-600"
          />
          <StatCard
            label="Paused / Stalled"
            value={data.summary.medium}
            sub="Temporarily blocked"
            valueColor="text-amber-600"
          />
          <StatCard
            label="Removed"
            value={data.summary.low}
            sub="Pipeline exits"
            valueColor="text-slate-400"
          />
        </div>

        {/* ── Opportunities table ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* table header bar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5">
            <h2 className="text-sm font-semibold text-slate-700">All Opportunities</h2>
            <p className="text-xs text-slate-400">Sorted by deal stage · Click any row to expand</p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="w-60 px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  EHR
                </th>
                <th className="w-36 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Phase
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Why Exciting
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((opp) => {
                const isOpen = expanded === opp.name;
                return (
                  <Fragment key={opp.name}>
                    {/* ── Main row ── */}
                    <tr
                      onClick={() => setExpanded(isOpen ? null : opp.name)}
                      className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-blue-50/40 ${
                        isOpen ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <Chevron open={isOpen} />
                          <span className="font-semibold text-slate-900">{opp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{opp['deal type']}</td>
                      <td className="max-w-[180px] px-4 py-4 text-slate-600">{opp.Size}</td>
                      <td className="px-4 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                          {opp.EHR}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <PhaseBadge phase={opp['Deal phase']} />
                      </td>
                      <td className="max-w-xs px-4 py-4 leading-relaxed text-slate-600">
                        {opp.why_exciting}
                      </td>
                    </tr>

                    {/* ── Expanded detail row ── */}
                    {isOpen && (
                      <tr className="border-b border-slate-100">
                        <td colSpan={6} className="bg-slate-50/80 px-8 py-7">
                          <div className="grid max-w-4xl grid-cols-2 gap-10">
                            {/* Key Notes */}
                            <div>
                              <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Key Notes
                              </h4>
                              <ul className="space-y-2.5">
                                {opp['Key notes'].map((note, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-300" />
                                    {note}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Next Steps */}
                            <div>
                              <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Next Steps
                              </h4>
                              <ol className="space-y-3">
                                {opp.next_steps.map((step, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-slate-800">
                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                      {i + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Data sourced from Slack (#mon-prosp-*), Granola, and Gong · Generated {generatedDate}
        </p>
      </main>
    </div>
  );
}
