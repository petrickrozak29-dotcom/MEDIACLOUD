"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GradientBg from '../../components/gradient-bg';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Dynamic import leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Destination {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  category: string;
}

interface DestinationWithDistance {
  destination: Destination;
  distance: number;
  estimatedTravelTime: number;
}

export default function SmartMapPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyDestinations, setNearbyDestinations] = useState<DestinationWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(10); // km

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Silakan login terlebih dahulu');
      setLoading(false);
      return;
    }

    // Get user location from geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);

          // Update location in backend
          try {
            await fetch(`${API_BASE_URL}/api/locations/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                latitude: coords.lat,
                longitude: coords.lng,
                accuracy: position.coords.accuracy
              })
            });

            // Fetch nearby destinations
            fetchNearbyDestinations();
          } catch (err) {
            console.error('Failed to update location:', err);
          }
        },
        (err) => {
          setError('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation tidak tersedia di browser Anda');
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchNearbyDestinations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/locations/nearby?radius=${radius}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil data destinasi');
      }

      const data = await response.json();
      setNearbyDestinations(data.destinations || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (token) {
      fetchNearbyDestinations();
    }
  };

  if (!isAuthenticated) {
    return (
      <GradientBg>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-20 text-white text-center">
          <h1 className="text-4xl font-bold text-cyan-300 mb-4">Smart Map</h1>
          <p>Silakan login terlebih dahulu untuk menggunakan Smart Map</p>
          <a href="/login" className="inline-block mt-6 px-6 py-3 bg-cyan-500 text-black rounded-full font-bold">
            Login
          </a>
        </main>
        <Footer />
      </GradientBg>
    );
  }

  return (
    <GradientBg>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20 text-white">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">🗺️ Smart Map</h1>

        {/* Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <label className="text-white">Radius:</label>
          <select
            value={radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={20}>20 km</option>
          </select>
          <span className="text-gray-400">
            {nearbyDestinations.length} destinasi ditemukan
          </span>
        </div>

        {loading && <p>Memuat peta...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Map */}
        {!loading && userLocation && (
          <div className="rounded-2xl overflow-hidden border border-slate-700 mb-8">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className="text-center">
                    <b>📍 Lokasi Anda</b>
                  </div>
                </Popup>
              </Marker>

              {/* Destination markers */}
              {nearbyDestinations.map((item) => (
                <Marker
                  key={item.destination.id}
                  position={[item.destination.latitude, item.destination.longitude]}
                >
                  <Popup>
                    <div>
                      <b>{item.destination.name}</b>
                      <br />
                      <span className="text-sm text-gray-600">{item.destination.category}</span>
                      <br />
                      <span className="text-sm">📏 {item.distance.toFixed(1)} km</span>
                      <br />
                      <span className="text-sm">🕐 ~{item.estimatedTravelTime} menit</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Destination List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyDestinations.map((item) => (
            <div
              key={item.destination.id}
              className="bg-slate-900/80 rounded-xl p-6 border border-slate-800"
            >
              <img
                src={item.destination.image}
                alt={item.destination.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-cyan-300 mb-2">
                {item.destination.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {item.destination.description.substring(0, 100)}...
              </p>
              <div className="space-y-1 text-sm">
                <p>📂 {item.destination.category}</p>
                <p>📏 {item.distance.toFixed(1)} km dari Anda</p>
                <p>🕐 Perjalanan: ~{item.estimatedTravelTime} menit</p>
              </div>
            </div>
          ))}
        </div>

        {nearbyDestinations.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-12">
            Tidak ada destinasi dalam radius {radius} km. Coba perbesar radius pencarian.
          </p>
        )}
      </main>
      <Footer />
    </GradientBg>
  );
}
