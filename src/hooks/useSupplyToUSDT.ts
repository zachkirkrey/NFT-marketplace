import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useSupplyToUSDT = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bombFinance.supplyToUSDT(amount), `Supply  ${amount} USDT`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useSupplyToUSDT;
