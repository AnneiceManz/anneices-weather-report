import { useState, useEffect } from 'react';
import { ChevronRight, Thermometer } from 'lucide-react';
import LocationCard from './components/LocationCard';
import WeatherChart from './components/WeatherChart';
import { CITIES } from './utils/weatherLocationConfig';
import { formatDateString } from './utils/weatherDisplay';
import '../src/styles/App.css'

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [historicalData, setHistoricalData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    setHistoryLoading(true);
    const today = new Date();
    const pastStart = new Date();
    pastStart.setDate(today.getDate() - 8);
    const pastEnd = new Date();
    pastEnd.setDate(today.getDate() - 1);
    
    fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&start_date=${formatDateString(pastStart)}&end_date=${formatDateString(pastEnd)}&daily=temperature_2m_max&timezone=${selectedCity.timezone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.daily) {
          setHistoricalData({
            dates: data.daily.time.map((t) => new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })),
            temperatures: data.daily.temperature_2m_max,
          });
        }
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Dashboard Title Block Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">MeteoHub</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time localized metrics & historical analysis workspace.</p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Open-Meteo Live API
          </div>
        </header>

        {/* Global Live City Grid Row */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            Live Global Monitors <ChevronRight className="w-3.5 h-3.5" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CITIES.map((city) => (
              <LocationCard
                key={city.name}
                city={city}
                isSelected={selectedCity.name === city.name}
                onSelect={() => setSelectedCity(city)}
              />
            ))}
          </div>
        </section>

        {/* Deep Dive Trend Vector Chart Section */}
        <main className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Historical Analytics</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Past 7 Days Max Temperature</h3>
              <p className="text-sm text-slate-400">Deep historical timeline mapping for {selectedCity.name}.</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-blue-500" /> Max Daily (°C)</span>
            </div>
          </div>

          {/* Component Graph Injection */}
          <div className="relative min-h-[220px]">
            <WeatherChart historicalData={historicalData} loading={historyLoading} />
          </div>
        </main>
      </div>
    </div>
  );
}
