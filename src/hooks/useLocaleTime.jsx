import { useState, useEffect } from 'react';

export function useLocaleTime(timezone) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { timeZone: timezone, month: 'short', day: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return { timeStr, dateStr };
}
