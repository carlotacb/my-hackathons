interface YearFilterProps {
  years: number[];
  active: number | 'all';
  onChange: (year: number | 'all') => void;
  counts: Record<number, number>;
}

export default function YearFilter({ years, active, onChange, counts }: YearFilterProps) {
  const total = years.reduce((sum, y) => sum + (counts[y] ?? 0), 0);
  return (
    <label className={`year-select ${active !== 'all' ? 'year-select-active' : ''}`}>
      <span className="sr-only">Filter hackathons by year</span>
      <select
        value={active}
        onChange={(e) => onChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
      >
        <option value="all">All years ({total})</option>
        {years.map((year) => (
          <option key={year} value={year} disabled={!counts[year] && active !== year}>
            {year} ({counts[year] ?? 0})
          </option>
        ))}
      </select>
      <svg className="year-select-chevron" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
