import { useCallback } from 'react';
import useBombFinance from '../useBombFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapBBondToBShare = () => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapBShare = useCallback(
    (_10BONDAmount: string) => {
      const _10BONDAmountBn = parseUnits(_10BONDAmount, 18);
      handleTransactionReceipt(
        bombFinance.swap_10BONDToBShare(_10BONDAmountBn),
        `Swap ${_10BONDAmount} _10BOND to _10HSHARE`,
      );
    },
    [bombFinance, handleTransactionReceipt],
  );
  return { onSwapBShare: handleSwapBShare };
};

export default useSwapBBondToBShare;
