"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  category: string;
}

interface Props {
  markers: MapMarker[];
  userLocation?: { lat: number; lng: number } | null; // 🔥 TAMBAHAN
}

export default function LeafletMap({ markers, userLocation }: Props) {
  
  // 🔥 Center map ke user (kalau ada)
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-7.6079, 110.2038];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      className="h-[500px] w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔹 Marker biasa */}
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <b>{m.title}</b>
            <br />
            {m.category}
          </Popup>
        </Marker>
      ))}

      {/* 🔥 Marker user (opsional highlight) */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <b>📍 Lokasi Anda</b>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}