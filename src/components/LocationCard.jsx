import { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { useLocaleTime } from '../hooks/useLocaleTime';
import { getWeatherIcon, getWeatherDesc } from '../utils/weatherDisplay';
import '../styles/LocationCard.css'

export default function LocationCard({ city, isSelected, onSelect }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { timeStr, dateStr } = useLocaleTime(city.timezone);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=${city.timezone}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.current_weather) {
          setWeather(data.current_weather);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [city]);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border cursor-pointer flex flex-col justify-between h-40 ${
        isSelected 
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.01]' 
          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-lg">
            <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
            {city.name}
          </div>
          <div className={`text-xs mt-1 flex flex-col gap-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeStr}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateStr}</span>
          </div>
        </div>
        {!loading && weather && (
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            {getWeatherIcon(weather.weathercode)}
          </div>
        )}
      </div>

      <div className="flex justify-between items-end w-full mt-4">
        {loading ? (
          <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
        ) : weather ? (
          <>
            <span className="text-3xl font-black tracking-tight">{Math.round(weather.temperature)}°C</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {getWeatherDesc(weather.weathercode)}
            </span>
          </>
        ) : (
          <span className="text-xs text-red-400">Error loading</span>
        )}
      </div>
    </button>
  );
}
