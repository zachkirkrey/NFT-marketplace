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
  [_10BOND, '0x8FEE24704e36dc27D07fE0350166281f762Ba3Ad'],
  [_10MB, '0x6c3f53f090c47e8C075C7c2fC6Ae04e668862aBB'],
  [_10MBTaxOracle, '0xa35aC5C1E0cc2AA901814037C9Bda26016e2Eb90'],
  [_10SHARE, '0x884D897638b2B3aC50454358d84059c07Efe6486'],
  [Boardroom, '0x38cd10562bbcba2B38716609457eE5ee2aB339a5'],
  [Oracle, '0xA0Ed89FF0cfAD6e26ae32104c188FdceA7Da98a6'],
  [TaxOffice, '0x29884B13214B730b592D6d2f30939b44Cf068263'],
  [Treasury, '0x5fB515bfa04329c17756afA0bEBaB0503cD509Ba'],
  [_10MBMasterchef, '0x36C2A500fffb40c1a3B3C964bdcf2631876424c6'],
  [Pool, '0x4e7Fdeb73856C7bEAA2530008d79a3eA93Abfb0c']
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
    chainId: 137,
    networkName: 'Polygon Mainnet',
    cronoscanUrl: 'https://cronoscan.com',
    defaultProvider: 'https://cronos-rpc.com/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0x0CF5Db93682CEf7aeBF115b83F3831FFbE5557C8', 18],
      USDT: ['0xC6bc6E87bD6Ff021Ff945206FA9dB56A938C72dc', 6],
      WCRO: ['0xDb6586A64Aa9Fe35059711030762bf331d97f16c', 18],
      WSMINO: ['0xF589C9a8b35FdcADaC2C0bca4ef43542B2c2c62B', 18],
      '_10MB': [deploymentsRaw['_10MB'].address, 18],
      '_10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '_10MB-USDT-LP': ['0x2aBC3983430cb02efD3B413eCf55DA7B34613B20', 18],
      '_10MB-CRO-LP': ['0x16115D1928EFF26029B8F431542a4d759c5E02BB', 18],
      'USDT-CRO-LP': ['0x2330CB09C70540278EE78E0c23580743283DE45B', 18],
      'MMF-CRO-LP': ['0x7afd7BaE7f2eCEeb624f427C36092997A9E2Ecc0', 18],
      'WSMINO-CRO-LP': ['0x21c6F066EC6f7b5faddB881e82582b75cdCd2E79', 18],
      '_10SHARE-USDT-LP': ['0x9077E068C1DB3bf6F0fF59c47848507E302Eb5C0', 18],
      '_10SHARE-CRO-LP': ['0x65Aef9331704793ac5009780D7e6E45448b1f607', 18],
    },
  },
  development: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    cronoscanUrl: 'https://cronoscan.com',
    defaultProvider: 'https://cronos-rpc.com/',
//    defaultProvider: 'http://127.0.0.1:8545/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0x0CF5Db93682CEf7aeBF115b83F3831FFbE5557C8', 18],
      USDT: ['0xC6bc6E87bD6Ff021Ff945206FA9dB56A938C72dc', 6],
      WCRO: ['0xDb6586A64Aa9Fe35059711030762bf331d97f16c', 18],
      WSMINO: ['0xF589C9a8b35FdcADaC2C0bca4ef43542B2c2c62B', 18],
      '_10MB': [deploymentsRaw['_10MB'].address, 18],
      '_10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '_10MB-USDT-LP': ['0x2aBC3983430cb02efD3B413eCf55DA7B34613B20', 18],
      '_10MB-CRO-LP': ['0x16115D1928EFF26029B8F431542a4d759c5E02BB', 18],
      'USDT-CRO-LP': ['0x2330CB09C70540278EE78E0c23580743283DE45B', 18],
      'MMF-CRO-LP': ['0x7afd7BaE7f2eCEeb624f427C36092997A9E2Ecc0', 18],
      'WSMINO-CRO-LP': ['0x21c6F066EC6f7b5faddB881e82582b75cdCd2E79', 18],
      '_10SHARE-USDT-LP': ['0x9077E068C1DB3bf6F0fF59c47848507E302Eb5C0', 18],
      '_10SHARE-CRO-LP': ['0x65Aef9331704793ac5009780D7e6E45448b1f607', 18],
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
      MMF: ['0xD0E73605e6Bb28f98c559461B48068C15A56BE3D', 18],
      USDT: ['0xA0ac5eE80daf8Ef9B7760AEdfaf69127D86f8Eb6', 6],
      WCRO: ['0x06800eA4ca1a08aA13e2b63a27b8fF636651a1d2', 18],
      WSMINO: ['0x892b6f4B56FC392207119f78724cfe8eBf9bbE68', 18],
      '10MB': [deploymentsRaw['_10MB'].address, 18],
      '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '10MB-USDT-LP': ['0xe3993092f4D6d7b20e4FCDc8ab824e22eBa81d6d', 18],
      '10MB-CRO-LP': ['0x6B659AdD6C96Da8eF2532F9998820aBB05050921', 18],
      'USDT-CRO-LP': ['0xC74EF030928A344331b87E37BE7D030CdDDe698F', 18],
      'MMF-CRO-LP': ['0x7df09f8e1e9CB885Dc9E879d5d42515373301544', 18],
      'WSMINO-CRO-LP': ['0x51e42c71D1D8aE0CFc694A3543f4425a3739EfCB', 18],
      '10SHARE-USDT-LP': ['0x524c9b78574a6d2Ae8C3061BA5469bC6b8628f76', 18],
      '10SHARE-CRO-LP': ['0x5A231580203E2E17dC2c73E6d09f918ACf060017', 18],
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
      USDT: ['0xA0ac5eE80daf8Ef9B7760AEdfaf69127D86f8Eb6', 6],
      WCRO: ['0x06800eA4ca1a08aA13e2b63a27b8fF636651a1d2', 18],
      WSMINO: ['0x892b6f4B56FC392207119f78724cfe8eBf9bbE68', 18],
      '10MB': [deploymentsRaw['_10MB'].address, 18],
      '10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '10MB-USDT-LP': ['0xe3993092f4D6d7b20e4FCDc8ab824e22eBa81d6d', 18],
      '10MB-CRO-LP': ['0x6B659AdD6C96Da8eF2532F9998820aBB05050921', 18],
      'USDT-CRO-LP': ['0xC74EF030928A344331b87E37BE7D030CdDDe698F', 18],
      'MMF-CRO-LP': ['0x7df09f8e1e9CB885Dc9E879d5d42515373301544', 18],
      'WSMINO-CRO-LP': ['0x51e42c71D1D8aE0CFc694A3543f4425a3739EfCB', 18],
      '10SHARE-USDT-LP': ['0x524c9b78574a6d2Ae8C3061BA5469bC6b8628f76', 18],
      '10SHARE-CRO-LP': ['0x5A231580203E2E17dC2c73E6d09f918ACf060017', 18],
    },
  },
  /*
  development: {
    chainId: 1234,
    networkName: 'Cronos Mainnet Dev',
    cronoscanUrl: 'https://cronoscan.com',
    defaultProvider: 'http://127.0.0.1:8545/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0x851Fb11232D73A27fE456662D167fd149fEb91fC', 18],
      USDT: ['0x0f77cA4B95D4d06BbA3477717eE53757b208601e', 18],
      WCRO: ['0x5a3f93252EE4241e6194A1D7C23aef256E3FF316', 18],
      WSMINO: ['0x8b2Be9eaEeb8fE231bfd040C00B969734b76639e', 18],
      '10MB': ['0xf4a12010D72EE00B16D3fEe56D93358Fc74AFCE5', 18],
      '10SHARE': ['0x6C3F3aDc512Cd0cf1ed422b235A42879D5E3b226', 18],
      '10MB-USDT-LP': ['0xb3b87Aa2053a561c17551c2484566Ccd1B83769F', 18],
      '10MB-CRO-LP': ['0xb05B546342e4ff96Db66266526669eDedDDf7059', 18],
      'USDT-CRO-LP': ['0xB6a04E716E9c0b1B6494C10077494420D5F3E0aD', 18],
      'MMF-CRO-LP': ['0x881C5661760b40b4f44e2924Bd5b0b225a386016', 18],
      'WSMINO-CRO-LP': ['0x1AA235287f1f72728FA86B0BAbeC9D2E12908919', 18],
      '10SHARE-USDT-LP': ['0x7D87D5c115967cCFD06Bcaa6a3022F10A190DAD6', 18],
      '10SHARE-CRO-LP': ['0x42b325eA5b9418ae5AFd40a58Bc562aD4692663B', 18],
    },
  },*/
  /*
  development: {
    chainId: 56,
    networkName: 'BSC Mainnet',
    cronoscanUrl: 'https://bscscan.com',
    defaultProvider: 'https://bsc-dataseed.binance.org/',
    deployments: require('./bomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18],
      FUSDT: ['0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18], // This is actually BUSD on mainnet not USDT
      USDT: ['0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18],
      SUSDT: ['0x1d28cd41fc594232D05F2AbdAFBb556E7F78Dc2a', 18],
      SUSD: ['0x12017c89444624C0268A1053467e22954F4fd362', 18],
      SVL: ['0x37F14E7c2FadC2A01dBD93b8a1F69D41c6c3d554', 18],
      CAKE: ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18],
      ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
      'B_10MB-_10MB': ['0xcB72214d09a1804E4eecA9C3F3bB6ca49460237b', 18],
      'B_10MB-USDT': ['0x23EFC2ff90e3423c3F84352b21b49FBcD4C3E32D', 18],
      SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      'USDT-CRO-LP': ['0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', 18],
      'USDT-USDT-LP': ['0x3f803ec2b816ea7f06ec76aa2b6f2532f9892d62', 18],
      '10MB-USDT-LP': ['0x84392649eb0bC1c1532F2180E58Bae4E1dAbd8D6', 18],
      '10MB-10SHARE-LP': ['0x54f9fE531224Fa43Feb218B20ABa84d22a8fDc0C', 18],
      '10MB-CRO-LP': ['0x107CDC0c46615C63EE4abC4E1e264D3BD12390e6', 18],
      '10SHARE-CRO-LP': ['0x1303246855b5B5EbC71F049Fdb607494e97218f8', 18],
      '10SHARE-CRO-APELP': ['0x0dE2a71b2f43CF588A00422d41E1C02D0E08D552', 18],
      '10MB-USDT-APELP': ['0xB6E85031F313563bF12ea414118978C8BD78db5D', 18],
    },
    baseLaunchDate: new Date('2021-11-20 1:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2021-11-20T00:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: 56,
    networkName: 'BSC Mainnet',
    cronoscanUrl: 'https://bscscan.com',
    defaultProvider: 'https://bsc-dataseed.binance.org/',
    deployments: require('./bomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18],
      FUSDT: ['0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18], // This is actually BUSD on mainnet not USDT
      USDT: ['0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18],
      SUSDT: ['0x1d28cd41fc594232D05F2AbdAFBb556E7F78Dc2a', 18],
      'B_10MB-_10MB': ['0xcB72214d09a1804E4eecA9C3F3bB6ca49460237b', 18],
      'B_10MB-USDT': ['0x23EFC2ff90e3423c3F84352b21b49FBcD4C3E32D', 18],
      SVL: ['0x37F14E7c2FadC2A01dBD93b8a1F69D41c6c3d554', 18],
      SUSD: ['0x12017c89444624C0268A1053467e22954F4fd362', 18],
      CAKE: ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18],
      ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
      SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      'USDT-CRO-LP': ['0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', 18],
      'USDT-USDT-LP': ['0x3f803ec2b816ea7f06ec76aa2b6f2532f9892d62', 18],
      '10MB-USDT-LP': ['0x84392649eb0bC1c1532F2180E58Bae4E1dAbd8D6', 18],
      '10MB-10SHARE-LP': ['0x54f9fE531224Fa43Feb218B20ABa84d22a8fDc0C', 18],
      '10MB-CRO-LP': ['0x107CDC0c46615C63EE4abC4E1e264D3BD12390e6', 18],
      '10SHARE-CRO-LP': ['0x1303246855b5B5EbC71F049Fdb607494e97218f8', 18],
      '10SHARE-CRO-APELP': ['0x0dE2a71b2f43CF588A00422d41E1C02D0E08D552', 18],
      '10MB-USDT-APELP': ['0xB6E85031F313563bF12ea414118978C8BD78db5D', 18],
    },
    baseLaunchDate: new Date('2021-11-20 1:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2021-11-20T00:00:00Z'),
    refreshInterval: 10000,
  },*/
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
  "10MBUSDTLPB10MBRewardPool": {
    name: 'Earn 10SHARE by 10MB-USDT LP',
    poolId: 0,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '10MB-USDT-LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  "10SHAREUSDTLPB10MBRewardPool": {
    name: 'Earn 10SHARE by 10SHARE-USDT LP',
    poolId: 1,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '10SHARE-USDT-LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
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
  USDT10MBRewardPool: {
    name: 'Earn 10MB by USDT',
    poolId: 3,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'USDT',
    earnTokenName: '10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  MMF10MBRewardPool: {
    name: 'Earn 10MB by MMF',
    poolId: 4,
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
    poolId: 5,
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
    depositTokenName: '10SHARE-CRO-LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  BombUSDTLPBShareRewardPool: {
    name: 'Earn 10SHARE by 10MB-USDT LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'BombUSDTLPBShareRewardPool',
    depositTokenName: '10MB-USDT-LP',
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
    depositTokenName: '10MB-10SHARE-LP',
    earnTokenName: '10SHARE',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },*/
};

export default configurations[process.env.NODE_ENV || 'development'];
