import {useCallback} from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBomb = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bombFinance.stakeToBomb(amount), `Stake ${amount} _10MB for x_10MB`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToBomb;
