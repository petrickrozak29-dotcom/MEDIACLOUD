"use client";

import { useEffect, useRef } from 'react';

interface MarkerItem {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  category: string;
}

export default function LeafletMap({ markers }: { markers: MarkerItem[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any | null>(null);
  const markerLayer = useRef<any | null>(null);
  const leafletRef = useRef<any | null>(null);
  const defaultIconRef = useRef<any | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      if (!mapRef.current || mapInstance.current || !mounted) return;

      const L = (await import('leaflet')).default;
      // @ts-ignore - dynamic CSS import for client-only Leaflet styles
      await import('leaflet/dist/leaflet.css');

      leafletRef.current = L;

      defaultIconRef.current = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      mapInstance.current = L.map(mapRef.current, {
        center: [-7.6079, 110.2038],
        zoom: 11,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      markerLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    initMap();

    return () => {
      mounted = false;
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!markerLayer.current || !leafletRef.current) return;

    markerLayer.current.clearLayers();

    markers.forEach((marker) => {
      leafletRef.current
        .marker([marker.lat, marker.lng], { icon: defaultIconRef.current })
        .bindPopup(`<strong>${marker.title}</strong><br/>${marker.category}`)
        .addTo(markerLayer.current!);
    });
  }, [markers]);

  return <div ref={mapRef} className="h-[540px] w-full rounded-3xl border border-slate-800" />;
}
