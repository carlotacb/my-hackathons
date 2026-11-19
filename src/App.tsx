import { useMemo, useState } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import YearFilter from './components/YearFilter';
import MapView from './components/MapView';
import HackathonCard from './components/HackathonCard';
import Footer from './components/Footer';
import { hackathons } from './data/hackathons';
import { CATEGORY_LABELS, getYear, type Category } from './data/types';

const CATEGORIES: Category[] = ['organized', 'attended', 'volunteered', 'coached'];

const YEARS = Array.from(new Set(hackathons.map(getYear))).sort((a, b) => b - a);

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');

  const matchesCategory = (category: Category) => activeCategory === 'all' || category === activeCategory;
  const matchesYear = (year: number) => activeYear === 'all' || year === activeYear;

  // Category counts respect the selected year; year counts respect the selected category.
  const categoryCounts = useMemo(() => {
    const base: Record<Category, number> = { organized: 0, attended: 0, volunteered: 0, coached: 0 };
    hackathons.forEach((h) => {
      if (matchesYear(getYear(h))) base[h.category] += 1;
    });
    return base;
  }, [activeYear]);

  const yearCounts = useMemo(() => {
    const base: Record<number, number> = {};
    hackathons.forEach((h) => {
      if (matchesCategory(h.category)) {
        const y = getYear(h);
        base[y] = (base[y] ?? 0) + 1;
      }
    });
    return base;
  }, [activeCategory]);

  const filtered = useMemo(
    () => hackathons.filter((h) => matchesCategory(h.category) && matchesYear(getYear(h))),
    [activeCategory, activeYear],
  );

  const visibleCategories = activeCategory === 'all' ? CATEGORIES : [activeCategory];

  return (
    <div className="app">
      <Header />
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} counts={categoryCounts} />
      <div className="map-toolbar">
        <YearFilter years={YEARS} active={activeYear} onChange={setActiveYear} counts={yearCounts} />
      </div>
      <MapView items={filtered} />

      <main className="hackathon-sections">
        {visibleCategories.map((category) => {
          const items = filtered.filter((h) => h.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="hackathon-section">
              <h2>
                {CATEGORY_LABELS[category]} <span className="section-count">({items.length})</span>
              </h2>
              <div className="card-grid">
                {items.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} />
                ))}
              </div>
            </section>
          );
        })}
        {filtered.length === 0 && <p className="empty-state">No hackathons match these filters.</p>}
      </main>

      <Footer />
    </div>
  );
}

export default App;
