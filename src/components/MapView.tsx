import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { hackathons } from '../data/hackathons';
import { CATEGORY_COLORS, type Category, type Hackathon } from '../data/types';

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const DEFAULT_ICON_SVG =
  '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 14l-6 6 6 6M26 14l6 6-6 6M22.5 11l-5 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function popupEntryHtml(h: Hackathon) {
  const iconHtml = h.logoUrl
    ? `<img src="${escapeHtml(h.logoUrl)}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
       <span class="popup-icon-fallback">${DEFAULT_ICON_SVG}</span>`
    : DEFAULT_ICON_SVG;

  return `
    <div class="popup-entry">
      <div class="popup-icon" style="color:${CATEGORY_COLORS[h.category]}">${iconHtml}</div>
      <div class="popup-text">
        <strong>${escapeHtml(h.name)}</strong>
        <span>${escapeHtml(h.duration)} · ${escapeHtml(h.date)} · ${escapeHtml(h.place)}</span>
      </div>
    </div>`;
}

interface MapViewProps {
  activeCategory: Category | 'all';
}

export default function MapView({ activeCategory }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: [10, 40],
      zoom: 2.3,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyMarkers = () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const grouped = new Map<string, { coords: [number, number]; entries: typeof hackathons }>();

      hackathons
        .filter((h) => h.coords && (activeCategory === 'all' || h.category === activeCategory))
        .forEach((h) => {
          const key = h.coords!.join(',');
          if (!grouped.has(key)) grouped.set(key, { coords: h.coords!, entries: [] });
          grouped.get(key)!.entries.push(h);
        });

      grouped.forEach(({ coords, entries }) => {
        const dominant = entries[0].category;
        const el = document.createElement('div');
        el.className = 'map-pin';
        el.style.setProperty('--pin-color', CATEGORY_COLORS[dominant]);

        const popupHtml = entries.map(popupEntryHtml).join('<hr/>');

        const marker = new Marker({ element: el })
          .setLngLat([coords[1], coords[0]])
          .setPopup(new Popup({ offset: 18, closeButton: false }).setHTML(popupHtml))
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    if (map.isStyleLoaded()) {
      applyMarkers();
    } else {
      map.once('load', applyMarkers);
    }
  }, [activeCategory]);

  return <div ref={containerRef} className="map-view" />;
}
