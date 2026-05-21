import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

export const getWeatherIcon = (code) => {
  if (code === 0) return React.createElement(Sun, { className: "w-8 h-8 text-amber-500" });
  if ([1, 2, 3].includes(code)) return React.createElement(Cloud, { className: "w-8 h-8 text-slate-400" });
  return React.createElement(CloudRain, { className: "w-8 h-8 text-blue-400" });
};

export const getWeatherDesc = (code) => {
  if (code === 0) return 'Clear sky';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  return 'Rainy / Showers';
};

export const formatDateString = (date) => date.toISOString().split('T')[0];
