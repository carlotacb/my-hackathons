import { useMemo, useState } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import MapView from './components/MapView';
import HackathonCard from './components/HackathonCard';
import Footer from './components/Footer';
import { hackathons } from './data/hackathons';
import { CATEGORY_LABELS, type Category } from './data/types';

const CATEGORIES: Category[] = ['organized', 'attended', 'volunteered', 'coached'];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const counts = useMemo(() => {
    const base: Record<Category, number> = { organized: 0, attended: 0, volunteered: 0, coached: 0 };
    hackathons.forEach((h) => {
      base[h.category] += 1;
    });
    return base;
  }, []);

  const visibleCategories = activeCategory === 'all' ? CATEGORIES : [activeCategory];

  return (
    <div className="app">
      <Header />
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} counts={counts} />
      <MapView activeCategory={activeCategory} />

      <main className="hackathon-sections">
        {visibleCategories.map((category) => {
          const items = hackathons.filter((h) => h.category === category);
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
      </main>

      <Footer />
    </div>
  );
}

export default App;
