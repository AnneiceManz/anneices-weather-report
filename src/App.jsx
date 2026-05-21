import { useState, useEffect } from 'react';
import LocationCard from './components/LocationCard';
import WeatherChart from './components/WeatherChart';
import { CITIES } from './utils/weatherLocationConfig';
import { formatDateString } from './utils/weatherDisplay';

import '../src/styles/App.css';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [historicalData, setHistoricalData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    setHistoryLoading(true);
    
    const today = new Date();
    const startRange = new Date();
    startRange.setDate(today.getDate() - 7);
    const endRange = new Date();
    endRange.setDate(today.getDate() - 1);

    fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&start_date=${formatDateString(startRange)}&end_date=${formatDateString(endRange)}&daily=temperature_2m_max&timezone=${selectedCity.timezone}`)
      .then(res => res.json())
      .then(data => {
        if (data.daily) {
          setHistoricalData({
            dates: data.daily.time.map(t => new Date(t).toLocaleDateString('en-US', { weekday: 'short' })),
            temperatures: data.daily.temperature_2m_max
          });
        }
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, [selectedCity]);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        
        {/* Top Header Row Panel */}
        <header className="app-header">
          <h1>WeatherHub</h1>
          <p>Real-time localized metrics & historical trend workspace.</p>
        </header>

        {/* Dashboard Dynamic Split Screen Grid Layout */}
        <div className="dashboard-grid">
          
          {/* Left Block Side Panel Grid */}
          <section className="cities-sidebar">
            {CITIES.map(city => (
              <LocationCard
                key={city.name}
                city={city}
                isSelected={selectedCity.name === city.name}
                onSelect={() => setSelectedCity(city)}
              />
            ))}
          </section>

          {/* Right Block Detail Vector Graph Panel */}
          <main className="details-panel">
            <div className="panel-header">
              <h2>{selectedCity.name} Weather Trend</h2>
              <p>Historical daily maximum temperature changes over the past 7 days.</p>
            </div>

            <WeatherChart historicalData={historicalData} loading={historyLoading} />
          </main>

        </div>
      </div>
    </div>
  );
}
