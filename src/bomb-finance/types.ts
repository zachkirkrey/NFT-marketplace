import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  poolId: number;
  sectionInUI: number;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  closedForStaking: boolean;
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
}

export type PoolStats = {
  dailyAPR: string;
  yearlyAPR: string;
  TVL: string;
};

export type TokenStat = {
  tokenInUSDC: string;
  priceInDollars: string;
  totalSupply: string;
  circulatingSupply: string;
};

export type LPStat = {
  tokenAmount: string;
  croAmount: string;
  priceOfOne: string;
  totalLiquidity: string;
  totalSupply: string;
};

// export type BorrowableStats = {
//   totalSupply: string;
//   totalBalance: string;
//   totalBorrows: string;
//   exchangeRate: string;
//   kinkBorrowRate: string;
//   borrowRate: string;
// };

export type AllocationTime = {
  from: Date;
  to: Date;
};

export type BShareSwapperStat = {
  bshareBalance: string;
  _10BONDBalance: string;
  // bombPrice: string;
  // bsharePrice: string;
  rateBSharePerBomb: string;
};
