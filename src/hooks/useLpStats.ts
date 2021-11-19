import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { LPStat } from '../bomb-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const bombFinance = useTombFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await bombFinance.getLPStat(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, bombFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
