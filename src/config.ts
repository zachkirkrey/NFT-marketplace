import { Configuration } from './bomb-finance/config';
import { BankInfo } from './bomb-finance';

import _10BOND from '../src/bomb-finance/deployments/_10BOND.json';
import _10MB from '../src/bomb-finance/deployments/_10MB.json';
import _10MBTaxOracle from '../src/bomb-finance/deployments/_10MBTaxOracle.json';

import _10SHARE from '../src/bomb-finance/deployments/_10SHARE.json';
import Boardroom from '../src/bomb-finance/deployments/Boardroom.json';

import Oracle from '../src/bomb-finance/deployments/Oracle.json';
import TaxOffice from '../src/bomb-finance/deployments/TaxOffice.json';

import Treasury from '../src/bomb-finance/deployments/Treasury.json';

import _10MBMasterchef from '../src/bomb-finance/deployments/_10MBMasterchef.json';

import Pool from '../src/bomb-finance/deployments/Pool.json';

const contractsArray = [
  [_10BOND, '0x32c64775c0D7f200E42e65BBbF4F0c1927670F71'],
  [_10MB, '0x6186a2cc9A159E01534131e5e0608b2497a89105'],
  [_10MBTaxOracle, '0x062137F6F6f7bADBc05C07532b926D0c0B7b1eaE'],
  [_10SHARE, '0x91Be48BA96DCB9E8cF45974AbeF1E12D59557672'],
  [Boardroom, '0x36753711DdCbE22bF35d84DDcc5f0043772668d6'],
  [Oracle, '0x1a2c4997fD0BaeD38CC269B870120EAA21B858b0'],
  [TaxOffice, '0x062137F6F6f7bADBc05C07532b926D0c0B7b1eaE'],
  [Treasury, '0x4F71528b7C79c6f60861094f43b76D650b2844FF'],
  [_10MBMasterchef, '0x6A1Dd90EFceb8aB860bF02d58DbF9EFE13Fc9096'],
  [Pool, '0x5d5d21F39d917FD71EDbB3898162004aB0e40872']
]

interface DeploymentMapType {
  [contractName: string]: {
    address: string;
    abi: any[];
  };
}
let deploymentsRaw: DeploymentMapType = {};

for (const contract of contractsArray) {
  deploymentsRaw[(contract[0] as any).contractName] = { abi: (contract[0] as any).abi, address: contract[1] as string };
}

const configurations: { [env: string]: Configuration } = {
/*
  production: {
    chainId: 25,
    networkName: 'Cronos Mainnet',
    cronoscanUrl: 'https://cronoscan.com',
    defaultProvider: 'https://gateway.nebkas.ro/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0xD0E73605e6Bb28f98c559461B48068C15A56BE3D', 18],
      USDC: ['0xA0ac5eE80daf8Ef9B7760AEdfaf69127D86f8Eb6', 6],
      WCRO: ['0x06800eA4ca1a08aA13e2b63a27b8fF636651a1d2', 18],
      WSMINO: ['0x892b6f4B56FC392207119f78724cfe8eBf9bbE68', 18],
      '10MB': [deploymentsRaw['_10MB'].address, 18],
      '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '10MB-USDC LP': ['0xe3993092f4D6d7b20e4FCDc8ab824e22eBa81d6d', 18],
      '10MB-CRO LP': ['0x6B659AdD6C96Da8eF2532F9998820aBB05050921', 18],
      'USDC-CRO LP': ['0xC74EF030928A344331b87E37BE7D030CdDDe698F', 18],
      'MMF-CRO LP': ['0x7df09f8e1e9CB885Dc9E879d5d42515373301544', 18],
      'WSMINO-CRO LP': ['0x51e42c71D1D8aE0CFc694A3543f4425a3739EfCB', 18],
      '10SHARE-USDC LP': ['0x524c9b78574a6d2Ae8C3061BA5469bC6b8628f76', 18],
      '10SHARE-CRO LP': ['0x5A231580203E2E17dC2c73E6d09f918ACf060017', 18],
    },
  },
  development: {
    chainId: 25,
    networkName: 'Cronos Mainnet',
    cronoscanUrl: 'https://cronoscan.com',
    defaultProvider: 'https://gateway.nebkas.ro/',
//    defaultProvider: 'http://127.0.0.1:8545/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0xD0E73605e6Bb28f98c559461B48068C15A56BE3D', 18],
      USDC: ['0xA0ac5eE80daf8Ef9B7760AEdfaf69127D86f8Eb6', 6],
      WCRO: ['0x06800eA4ca1a08aA13e2b63a27b8fF636651a1d2', 18],
      WSMINO: ['0x892b6f4B56FC392207119f78724cfe8eBf9bbE68', 18],
      '10MB': [deploymentsRaw['_10MB'].address, 18],
      '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '10MB-USDC LP': ['0xe3993092f4D6d7b20e4FCDc8ab824e22eBa81d6d', 18],
      '10MB-CRO LP': ['0x6B659AdD6C96Da8eF2532F9998820aBB05050921', 18],
      'USDC-CRO LP': ['0xC74EF030928A344331b87E37BE7D030CdDDe698F', 18],
      'MMF-CRO LP': ['0x7df09f8e1e9CB885Dc9E879d5d42515373301544', 18],
      'WSMINO-CRO LP': ['0x51e42c71D1D8aE0CFc694A3543f4425a3739EfCB', 18],
      '10SHARE-USDC LP': ['0x524c9b78574a6d2Ae8C3061BA5469bC6b8628f76', 18],
      '10SHARE-CRO LP': ['0x5A231580203E2E17dC2c73E6d09f918ACf060017', 18],
    },
  },
*/
production: {
  chainId: 25,
  networkName: 'Cronos Mainnet',
  cronoscanUrl: 'https://cronoscan.com',
  defaultProvider: 'https://gateway.nebkas.ro/',
  deployments: deploymentsRaw,
  baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
  bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
  boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
  refreshInterval: 10000,
  externalTokens: {
    MMF: ['0x52ff6450fe151101111d2bE39AAfD8E7F32B99Eb', 18],
    USDC: ['0xf747E317AeB04e8Ea14dA3f71b3746D481D39359', 6],
    WCRO: ['0x0337d830a201132E06F032bDef88E70447250927', 18],
    WSMINO: ['0xd00e1fd877f3e988b8f0c1546853d14dcd6728fa', 18],
    '10MB': [deploymentsRaw['_10MB'].address, 18],
    '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
    '10MB-USDC LP': ['0xe7dd231d214cA6921BEDD885127b794214261911', 18],
    '10MB-CRO LP': ['0x641a5898E685D77C9e2aD0cA6Dd7E2F48c8657Af', 18],
    'USDC-CRO LP': ['0xC407210c0B9F13aEc4D673b9897cEA97F9FBE9da', 18],
    'MMF-CRO LP': ['0xa9517bD9040c1B9Fc69488aabf63Ca02764e4439', 18],
    'WSMINO-CRO LP': ['0x20a8D96dff10A759BcfD423f57D65D1CFE45EFb8', 18],
    '10SHARE-USDC LP': ['0x98C51E459851d9Dc5eF0cE05A2Aa9FaE7e6C1d53', 18],
    '10SHARE-CRO LP': ['0x236040EBd483917489423A03E1ef732f42620edD', 18],
  },
},
development: {
  chainId: 25,
  networkName: 'Cronos Mainnet',
  cronoscanUrl: 'https://cronoscan.com',
  defaultProvider: 'https://gateway.nebkas.ro/',
//    defaultProvider: 'http://127.0.0.1:8545/',
  deployments: deploymentsRaw,
  baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
  bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
  boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
  refreshInterval: 10000,
  externalTokens: {
    MMF: ['0x52ff6450fe151101111d2bE39AAfD8E7F32B99Eb', 18],
    USDC: ['0xf747E317AeB04e8Ea14dA3f71b3746D481D39359', 6],
    WCRO: ['0x0337d830a201132E06F032bDef88E70447250927', 18],
    WSMINO: ['0xd00e1fd877f3e988b8f0c1546853d14dcd6728fa', 18],
    '10MB': [deploymentsRaw['_10MB'].address, 18],
    '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
    '10MB-USDC LP': ['0xe7dd231d214cA6921BEDD885127b794214261911', 18],
    '10MB-CRO LP': ['0x641a5898E685D77C9e2aD0cA6Dd7E2F48c8657Af', 18],
    'USDC-CRO LP': ['0xC407210c0B9F13aEc4D673b9897cEA97F9FBE9da', 18],
    'MMF-CRO LP': ['0xa9517bD9040c1B9Fc69488aabf63Ca02764e4439', 18],
    'WSMINO-CRO LP': ['0x20a8D96dff10A759BcfD423f57D65D1CFE45EFb8', 18],
    '10SHARE-USDC LP': ['0x98C51E459851d9Dc5eF0cE05A2Aa9FaE7e6C1d53', 18],
    '10SHARE-CRO LP': ['0x236040EBd483917489423A03E1ef732f42620edD', 18],
  },
},
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding _10MB
        - 2 = LP asset staking rewarding _10SHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  "10MBUSDCLPB10MBRewardPool": {
    name: 'Earn 10SHARE by 10MB-USDC LP',
    poolId: 0,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '10MB-USDC LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  "10SHAREUSDCLPB10MBRewardPool": {
    name: 'Earn 10SHARE by 10SHARE-USDC LP',
    poolId: 1,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '10SHARE-USDC LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
/*
  "10SHARE10MBRewardPool": {
    name: 'Earn 10MB by 10SHARE',
    poolId: 2,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '10SHARE',
    earnTokenName: '10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  */
  USDC10MBRewardPool: {
    name: 'Earn 10MB by USDC',
    poolId: 2,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'USDC',
    earnTokenName: '10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  MMF10MBRewardPool: {
    name: 'Earn 10MB by MMF',
    poolId: 3,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'MMF',
    earnTokenName: '10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  WSMINO10MBRewardPool: {
    name: 'Earn 10MB by WSMINO',
    poolId: 4,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'WSMINO',
    earnTokenName: '10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  /*
  BshareBnbLPBShareRewardPool: {
    name: 'Earn 10SHARE by 10SHARE-CRO LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'BshareBnbLPBShareRewardPool',
    depositTokenName: '10SHARE-CRO LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  BombUSDCLPBShareRewardPool: {
    name: 'Earn 10SHARE by 10MB-USDC LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'BombUSDCLPBShareRewardPool',
    depositTokenName: '10MB-USDC LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  BombBshareLPBShareRewardPool: {
    name: 'Earn 10SHARE by 10MB-10SHARE LP',
    poolId: 4,
    sectionInUI: 2,
    contract: 'BombBshareLPBShareRewardPool',
    depositTokenName: '10MB-10SHARE LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },*/
};

export default configurations[process.env.NODE_ENV || 'development'];
