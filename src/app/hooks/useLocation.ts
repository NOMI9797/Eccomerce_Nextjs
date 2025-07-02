import { useState, useEffect } from 'react';

interface LocationData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        setLocationData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { locationData, loading, error };
} 