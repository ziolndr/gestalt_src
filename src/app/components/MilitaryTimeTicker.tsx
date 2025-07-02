import { useState, useEffect } from 'react';

const MilitaryTimeTicker = () => {
  const [times, setTimes] = useState({
    local: '',
    utc: '',
    centcom: '',
    pacom: '',
    eucom: '',
    doy: '',
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - startOfYear.getTime(); // ✅ TS-safe fix
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);

      setTimes({
        local: now.toLocaleTimeString('en-US', { hour12: false }),
        utc: now.toUTCString().slice(-12, -4),
        centcom: new Date(now.getTime() + (3 * 3600000)).toLocaleTimeString('en-US', { hour12: false }),
        pacom: new Date(now.getTime() + (9 * 3600000)).toLocaleTimeString('en-US', { hour12: false }),
        eucom: new Date(now.getTime() + (1 * 3600000)).toLocaleTimeString('en-US', { hour12: false }),
        doy: dayOfYear.toString().padStart(3, '0'),
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-[#4A90E2] font-mono text-xs sm:text-sm p-2 overflow-hidden border-b border-[#1A1A1A]">
      <div className="animate-ticker flex justify-between">
        <span>LOCAL: {times.local}</span>
        <span>UTC: {times.utc}</span>
        <span>CENTCOM: {times.centcom}</span>
        <span>PACOM: {times.pacom}</span>
        <span>EUCOM: {times.eucom}</span>
        <span>DOY: {times.doy}</span>
      </div>
    </div>
  );
};

export default MilitaryTimeTicker;
