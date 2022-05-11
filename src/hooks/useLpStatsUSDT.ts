import { useEffect, useState } from 'react';
import useBombFinance from './useBombFinance';
import { LPStat } from '../bomb-finance/types';
import useRefresh from './useRefresh';

const useLpStatsUSDT = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const bombFinance = useBombFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await bombFinance.getLPStatUSDT(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, bombFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStatsUSDT;
