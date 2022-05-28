import { useCallback, useEffect, useState } from 'react';
import useBombFinance from '../useBombFinance';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateBShare = (_10BONDAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const bombFinance = useBombFinance();

  const estimateAmountOfBShare = useCallback(async () => {
    const _10BONDAmountBn = parseUnits(_10BONDAmount);
    const amount = await bombFinance.estimateAmountOfBShare(_10BONDAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfBShare().catch((err) => console.error(`Failed to get estimateAmountOfBShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfBShare]);

  return estimateAmount;
};

export default useEstimateBShare;
