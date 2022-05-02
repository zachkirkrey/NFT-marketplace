import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemFromUSDT = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bombFinance.redeemFromUSDT(amount), `Redeem ${amount} USDT from Supply`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useRedeemFromUSDT;
