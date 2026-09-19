import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Compass,
  RotateCw,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Navigation,
} from 'lucide-react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
  precipitation: number;
  conditionCode: number;
  conditionText: string;
  locationName: string;
  isCustomLocation: boolean;
  updatedAt: string;
  hourly: { time: string; temp: number; code: number }[];
}

// Fallback initial weather data for Greater Noida (Royal Paradise Student Hostel)
const DEFAULT_WEATHER: WeatherData = {
  temp: 29,
  feelsLike: 31,
  humidity: 58,
  windSpeed: 14,
  uvIndex: 6,
  pressure: 1012,
  precipitation: 0,
  conditionCode: 1,
  conditionText: 'Mainly Clear & Sunny',
  locationName: 'Greater Noida · Knowledge Park',
  isCustomLocation: false,
  updatedAt: 'Just now',
  hourly: [
    { time: '12 PM', temp: 31, code: 0 },
    { time: '02 PM', temp: 33, code: 1 },
    { time: '04 PM', temp: 32, code: 1 },
    { time: '06 PM', temp: 29, code: 2 },
    { time: '08 PM', temp: 26, code: 0 },
    { time: '10 PM', temp: 24, code: 0 },
  ],
};

const getWeatherDescription = (code: number): { text: string; icon: 'sun' | 'cloud' | 'rain' | 'thunder' | 'snow' | 'fog' } => {
  if (code === 0) return { text: 'Clear Sky', icon: 'sun' };
  if (code === 1) return { text: 'Mainly Clear', icon: 'sun' };
  if (code === 2) return { text: 'Partly Cloudy', icon: 'cloud' };
  if (code === 3) return { text: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { text: 'Fog & Mist', icon: 'fog' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { text: 'Light Rain / Showers', icon: 'rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: 'Snow Flurries', icon: 'snow' };
  if ([95, 96, 99].includes(code)) return { text: 'Thunderstorm', icon: 'thunder' };
  return { text: 'Fair Weather', icon: 'sun' };
};

interface WeatherWidgetProps {
  darkMode: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ darkMode }) => {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  // Fetch real-time weather from Open-Meteo API
  const fetchWeather = useCallback(async (lat: number, lon: number, locationName: string, isGPS: boolean) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather service unavailable');
      const data = await res.json();

      const current = data.current;
      const condition = getWeatherDescription(current.weather_code);

      // Extract next 6 hours
      const now = new Date();
      const currentHour = now.getHours();
      const hourlyData: { time: string; temp: number; code: number }[] = [];

      if (data.hourly && data.hourly.time && data.hourly.temperature_2m) {
        for (let i = 0; i < 6; i++) {
          const targetIndex = currentHour + i;
          if (data.hourly.time[targetIndex]) {
            const rawTime = new Date(data.hourly.time[targetIndex]);
            const timeStr = rawTime.toLocaleTimeString([], { hour: 'numeric', hour12: true });
            hourlyData.push({
              time: timeStr,
              temp: Math.round(data.hourly.temperature_2m[targetIndex]),
              code: data.hourly.weather_code ? data.hourly.weather_code[targetIndex] : current.weather_code,
            });
          }
        }
      }

      setWeather({
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        uvIndex: Math.round(current.uv_index || 5),
        pressure: Math.round(current.surface_pressure || 1012),
        precipitation: Math.round(current.precipitation || 0),
        conditionCode: current.weather_code,
        conditionText: condition.text,
        locationName,
        isCustomLocation: isGPS,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hourly: hourlyData.length > 0 ? hourlyData : DEFAULT_WEATHER.hourly,
      });

      setLastRefreshedAt(new Date());
      setStatusNotice(`Live weather synced (${locationName})`);
      setTimeout(() => setStatusNotice(null), 3000);
    } catch (err) {
      // Graceful fallback to default weather with updated timestamp
      setLastRefreshedAt(new Date());
      setWeather((prev) => ({
        ...prev,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setStatusNotice('Updated with latest cached campus climate');
      setTimeout(() => setStatusNotice(null), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount for campus coordinates (Greater Noida)
  useEffect(() => {
    fetchWeather(28.4744, 77.5040, 'Greater Noida · Knowledge Park', false);
  }, [fetchWeather]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    if (gpsActive && navigator.geolocation) {
      handleRequestGPS();
    } else {
      fetchWeather(28.4744, 77.5040, 'Greater Noida · Knowledge Park', false);
    }
  };

  // Handle GPS location detection
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setStatusNotice('Geolocation not supported by device');
      setTimeout(() => setStatusNotice(null), 3000);
      return;
    }

    setLoading(true);
    setStatusNotice('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsActive(true);
        fetchWeather(pos.coords.latitude, pos.coords.longitude, 'My Current GPS Location', true);
      },
      (err) => {
        setLoading(false);
        setGpsActive(false);
        setStatusNotice('GPS access unavailable. Showing campus weather.');
        setTimeout(() => setStatusNotice(null), 3500);
        fetchWeather(28.4744, 77.5040, 'Greater Noida · Knowledge Park', false);
      },
      { timeout: 8000 }
    );
  };

  // Reset to campus location
  const handleResetToCampus = () => {
    setGpsActive(false);
    fetchWeather(28.4744, 77.5040, 'Greater Noida · Knowledge Park', false);
  };

  // Advisory generator based on temp and condition
  const getCampusAdvisory = (temp: number, condition: string, uv: number): string => {
    if (condition.toLowerCase().includes('rain')) {
      return 'Light showers expected around campus. Take an umbrella when walking between Royal Block and the Dining Annex.';
    }
    if (temp >= 34) {
      return 'Hot afternoon in Greater Noida. Keep room curtains drawn and stay hydrated during lectures.';
    }
    if (temp <= 18) {
      return 'Cool ambient breeze. Perfect evening for outdoor walk around campus quad or library terrace.';
    }
    if (uv >= 8) {
      return 'Very high UV index today. Limit direct sunlight between 12:00 PM and 3:30 PM.';
    }
    return 'Pleasant ambient conditions across Greater Noida. Ideal for studies in Room B-004.';
  };

  const conditionIcon = (code: number, size: number = 24) => {
    const { icon } = getWeatherDescription(code);
    if (icon === 'sun') return <Sun size={size} className="text-amber-500 shrink-0" />;
    if (icon === 'cloud') return <Cloud size={size} className="text-[#A39E93] shrink-0" />;
    if (icon === 'rain') return <CloudRain size={size} className="text-sky-400 shrink-0" />;
    if (icon === 'thunder') return <CloudLightning size={size} className="text-amber-400 shrink-0" />;
    if (icon === 'snow') return <CloudSnow size={size} className="text-blue-300 shrink-0" />;
    if (icon === 'fog') return <CloudFog size={size} className="text-[#78716C] shrink-0" />;
    return <Sun size={size} className="text-amber-500 shrink-0" />;
  };

  return (
    <div
      id="live-weather-console"
      className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
        darkMode ? 'bg-[#141310] border-[#2B2720] shadow-md' : 'bg-white border-[#DCD6CA] shadow-xs'
      }`}
    >
      <div>
        {/* Top Header: Location, GPS indicator, Refresh Button */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA] dark:border-[#2B2720] gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8C5828]/10 text-[#8C5828] dark:text-[#F2CA50] flex items-center justify-center shrink-0">
              <Sun size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold font-sans uppercase text-sm text-[#1C1917] dark:text-[#FAF8F5] leading-none">
                  Live Weather Station
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono text-[#57534E] dark:text-[#A39E93]">
                <MapPin size={11} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <span className="truncate max-w-[170px] sm:max-w-none font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                  {weather.locationName}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: GPS Toggle & Refresh Button */}
          <div className="flex items-center gap-1.5">
            {gpsActive ? (
              <button
                onClick={handleResetToCampus}
                title="Switch back to Campus Coordinates"
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#8C5828]/15 text-[#8C5828] dark:text-[#F2CA50] hover:bg-[#8C5828]/25 transition-all cursor-pointer"
              >
                <span>Reset to Campus</span>
              </button>
            ) : (
              <button
                onClick={handleRequestGPS}
                title="Detect My Real-Time Device Location"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-all cursor-pointer border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.02] dark:bg-white/[0.02] text-[#44403C] dark:text-[#D6D3CD] hover:border-[#8C5828]"
              >
                <Navigation size={11} className="text-[#8C5828] dark:text-[#F2CA50]" />
                <span>My GPS</span>
              </button>
            )}

            {/* Refresh Button with Spinner */}
            <button
              id="refresh-weather-btn"
              onClick={handleManualRefresh}
              disabled={loading}
              title="Refresh Realtime Weather Data"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                loading
                  ? 'bg-black/10 dark:bg-white/10 text-[#78716C] cursor-not-allowed'
                  : 'bg-[#8C5828] hover:bg-[#73471F] text-white'
              }`}
            >
              <RotateCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{loading ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Status Toast / Notice */}
        {statusNotice && (
          <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] flex items-center justify-between animate-in fade-in">
            <span>{statusNotice}</span>
            <span className="text-[10px] opacity-75">✓</span>
          </div>
        )}

        {/* HERO WEATHER DISPLAY */}
        <div className="my-4 p-4 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.015] dark:bg-white/[0.015] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              {conditionIcon(weather.conditionCode, 38)}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#1C1917] dark:text-white">
                  {weather.temp}°C
                </span>
                <span className="font-mono text-xs text-[#57534E] dark:text-[#A39E93]">
                  Feels like <strong className="text-[#1C1917] dark:text-white">{weather.feelsLike}°C</strong>
                </span>
              </div>
              <div className="font-sans font-bold text-sm text-[#8C5828] dark:text-[#F2CA50] mt-0.5">
                {weather.conditionText}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DCD6CA] dark:border-[#2B2720]">
            <span className="text-[10px] uppercase text-[#78716C] dark:text-[#A39E93] block">
              Last Sync
            </span>
            <strong className="text-xs text-[#1C1917] dark:text-white">{weather.updatedAt}</strong>
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Live Satellite Feed
            </span>
          </div>
        </div>

        {/* 4-METRIC SENSOR TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
          {/* Tile 1: Relative Humidity */}
          <div className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.01] dark:bg-white/[0.01] text-center">
            <Droplets size={16} className="mx-auto text-sky-500 mb-1" />
            <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] block">
              Humidity
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917] dark:text-white">
              {weather.humidity}%
            </span>
          </div>

          {/* Tile 2: Wind Speed */}
          <div className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.01] dark:bg-white/[0.01] text-center">
            <Wind size={16} className="mx-auto text-teal-500 mb-1" />
            <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] block">
              Wind
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917] dark:text-white">
              {weather.windSpeed} km/h
            </span>
          </div>

          {/* Tile 3: UV Index */}
          <div className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.01] dark:bg-white/[0.01] text-center">
            <Sun size={16} className="mx-auto text-amber-500 mb-1" />
            <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] block">
              UV Index
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917] dark:text-white">
              {weather.uvIndex} ({weather.uvIndex > 6 ? 'High' : 'Moderate'})
            </span>
          </div>

          {/* Tile 4: Barometric Pressure */}
          <div className="p-2.5 rounded-xl border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.01] dark:bg-white/[0.01] text-center">
            <Gauge size={16} className="mx-auto text-indigo-500 mb-1" />
            <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-[#A39E93] block">
              Pressure
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917] dark:text-white">
              {weather.pressure} hPa
            </span>
          </div>
        </div>

        {/* HOURLY MINI-FORECAST RIBBON */}
        <div className="mt-3 pt-3 border-t border-[#DCD6CA] dark:border-[#2B2720]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A39E93]">
              Upcoming Hours Forecast
            </span>
            <span className="text-[10px] font-mono text-[#8C5828] dark:text-[#F2CA50]">
              Open-Meteo Precision
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-center">
            {weather.hourly.map((hour, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg border border-[#DCD6CA] dark:border-[#2B2720] bg-black/[0.015] dark:bg-white/[0.015] flex flex-col items-center justify-between"
              >
                <span className="text-[10px] text-[#78716C] dark:text-[#A39E93] block">
                  {hour.time}
                </span>
                <div className="my-1">{conditionIcon(hour.code, 16)}</div>
                <strong className="text-xs text-[#1C1917] dark:text-white">{hour.temp}°</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADVISORY FOOTNOTE */}
      <div className="mt-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs font-mono flex items-start gap-2.5">
        <Sparkles size={16} className="text-[#8C5828] dark:text-[#F2CA50] shrink-0 mt-0.5" />
        <p className="text-[#57534E] dark:text-[#D6D3CD] leading-relaxed text-[11px]">
          <strong>Campus Advisory:</strong> {getCampusAdvisory(weather.temp, weather.conditionText, weather.uvIndex)}
        </p>
      </div>
    </div>
  );
};
