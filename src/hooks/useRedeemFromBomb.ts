import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemFromBomb = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bombFinance.redeemFromBomb(amount), `Redeem ${amount} 10MB from Supply`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useRedeemFromBomb;
