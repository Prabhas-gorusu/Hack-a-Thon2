'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, Clock, LocateFixed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock weather data structure. In a real app, this would be a more robust type.
type WeatherData = {
  temperature: string;
  condition: string;
  location: string;
};

export default function WeatherDisplay() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeatherAndLocation = (latitude: number, longitude: number) => {
      // In a real app, you would use the lat/lng to call a weather API.
      // We will use mock data for the weather itself.
      const mockTemperature = `${(22 + Math.random() * 8).toFixed(0)}°C`;
      const conditions = ['Partly Cloudy', 'Sunny', 'Clear'];
      const mockCondition = conditions[Math.floor(Math.random() * conditions.length)];

      // Fetch location from reverse geocoding service
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
          const state = data.address.state || 'Unknown State';
          setWeather({
            temperature: mockTemperature,
            condition: mockCondition,
            location: `${city}, ${state}`
          });
        })
        .catch(() => {
          // Fallback if geocoding fails
          setWeather({
             temperature: mockTemperature,
             condition: mockCondition,
             location: 'Could not fetch location'
          });
        })
        .finally(() => setLoading(false));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherAndLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location Error',
            description: 'Could not get your location. Displaying default weather.',
            variant: 'destructive',
          });
          // Fallback to a default if location is denied
           setWeather({
            temperature: '25°C',
            condition: 'Partly Cloudy',
            location: 'Default Location',
          });
          setLoading(false);
        }
      );
    } else {
       toast({
          title: 'Geolocation Not Supported',
          description: 'Your browser does not support geolocation.',
          variant: 'destructive',
        });
       setWeather({
            temperature: '25°C',
            condition: 'Partly Cloudy',
            location: 'Default Location',
       });
       setLoading(false);
    }
  }, [toast]);


  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Cloudy')) return <Cloud className="h-8 w-8 text-accent" />;
    if (condition.includes('Rain')) return <CloudRain className="h-8 w-8 text-accent" />;
    return <Sun className="h-8 w-8 text-accent" />;
  };

  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xl font-bold font-headline">{time || '...'}</p>
            <p className="text-sm text-muted-foreground">{date || '...'}</p>
          </div>
        </div>

        {loading ? (
            <div className="flex items-center gap-4 animate-pulse">
                <LocateFixed className="h-8 w-8 text-muted-foreground" />
                <div>
                    <div className="h-7 w-20 bg-muted rounded-md"></div>
                    <div className="h-4 w-40 bg-muted rounded-md mt-1"></div>
                </div>
            </div>
        ) : weather && (
            <div className="flex items-center gap-4">
            {getWeatherIcon(weather.condition)}
            <div>
                <p className="text-xl font-bold font-headline">{weather.temperature}</p>
                <p className="text-sm text-muted-foreground">{weather.condition} - {weather.location}</p>
            </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
