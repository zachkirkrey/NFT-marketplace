import { BigNumber } from 'ethers';

export const DECIMALS_18 = BigNumber.from(10).pow(5);

export const BOND_REDEEM_PRICE = 1.0;
export const BOND_REDEEM_PRICE_BN = DECIMALS_18.mul(101).div(100);
