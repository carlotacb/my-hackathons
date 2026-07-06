import { CATEGORY_COLORS, CATEGORY_LABELS, type Category } from '../data/types';

interface CategoryFilterProps {
  active: Category | 'all';
  onChange: (category: Category | 'all') => void;
  counts: Record<Category, number>;
}

const CATEGORIES: Category[] = ['organized', 'attended', 'volunteered', 'coached'];

export default function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <nav className="category-filter" aria-label="Filter hackathons by category">
      <button
        className={`pill ${active === 'all' ? 'pill-active' : ''}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`pill ${active === category ? 'pill-active' : ''}`}
          style={{ '--pill-color': CATEGORY_COLORS[category] } as React.CSSProperties}
          onClick={() => onChange(category)}
        >
          <span className="pill-dot" />
          {CATEGORY_LABELS[category]}
          <span className="pill-count">{counts[category]}</span>
        </button>
      ))}
    </nav>
  );
}
