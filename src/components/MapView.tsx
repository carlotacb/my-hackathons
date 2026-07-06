import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { hackathons } from '../data/hackathons';
import { CATEGORY_COLORS, type Category } from '../data/types';

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

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

        const popupHtml = entries
          .map(
            (h) =>
              `<strong>${h.name}</strong><br/><span>${h.date} · ${h.place}</span>`,
          )
          .join('<hr/>');

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
