import { useEffect, useState } from 'react';
import useBombFinance from './useBombFinance';
//import {TokenStat} from '../bomb-finance/types';
import useRefresh from './useRefresh';

const useUSDCStats = () => {
  const [stat, setStat] = useState<Number>();
  const { slowRefresh } = useRefresh();
  const bombFinance = useBombFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        let usdtPrice: any = await bombFinance.getUSDCPriceUSD();
        setStat(usdtPrice);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, bombFinance, slowRefresh]);

  return stat;
};

export default useUSDCStats;
