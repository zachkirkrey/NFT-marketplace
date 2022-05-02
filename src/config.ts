import { Configuration } from './bomb-finance/config';
import { BankInfo } from './bomb-finance';

import _10BOND from "../src/bomb-finance/deployments/_10BOND.json";
import _10MB from "../src/bomb-finance/deployments/_10MB.json";
import _10MBTaxOracle from "../src/bomb-finance/deployments/_10MBTaxOracle.json";

import _10SHARE from "../src/bomb-finance/deployments/_10SHARE.json";
import Boardroom from "../src/bomb-finance/deployments/Boardroom.json";

import Oracle from "../src/bomb-finance/deployments/Oracle.json";
import TaxOffice from "../src/bomb-finance/deployments/TaxOffice.json";

import Treasury from "../src/bomb-finance/deployments/Treasury.json";

import _10MBMasterchef from "../src/bomb-finance/deployments/_10MBMasterchef.json"

import Pool from "../src/bomb-finance/deployments/Pool.json"

const contractsArray = [
  [_10BOND, '0xd812803de72C6a5993606F962D0144B7FB25A1aE'],
  [_10MB, '0xbae02065Aa194DA124f656f55fb723Ddce798f19'],
  [_10MBTaxOracle, '0xe4f6fd7C24E8c0F08582833D7067277b693901B8'],
  [_10SHARE, '0x54145fE9400E36DCD2a5De0b95214dBd119c1D91'],
  [Boardroom, '0x11C1F7fd68b359C1A870F98d0D09AB257Abf5dcA'],
  [Oracle, '0x185C7eB7eEf1D5E640d7547f3aE26fE7b5C8F46c'],
  [TaxOffice, '0xA9179fEf1f74605e83FD9317a1B4aF154FDD0896'],
  [Treasury, '0x81AB6D37F2A332064A9146Dde676ECBF6f904B24'],
  [_10MBMasterchef, '0x72f80bF818359c1215561Ee92fFd5EE003424924'],
  [Pool, '0x25A7958c976bD5e73788c82CEd3F9Bc28a175072']
]

interface DeploymentMapType  {
  [contractName: string]: {
    address: string;
    abi: any[];
  };
};
let deploymentsRaw: DeploymentMapType = {}

for (const contract of contractsArray) {
  deploymentsRaw[(contract[0] as any).contractName ] = {"abi": (contract[0] as any).abi, "address": contract[1] as string}
}


const configurations: { [env: string]: Configuration } = {
  /*
  production: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    cronoscanUrl: 'https://polygonscan.com',
    defaultProvider: 'https://polygon-rpc.com',
    deployments: deploymentsRaw,
    externalTokens: {
    },
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
  },
  */
  production: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    cronoscanUrl: 'https://polygonscan.com',
    defaultProvider: 'https://polygon-rpc.com/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0xf603A6353A3831826D36128c6351358fcda139Ee', 18],
      USDT: ['0x5C623485a00934e46698B81520f8bA2b8f8B3339', 6],
      WCRO: ['0x594EBf69f8d731aEBf9b2C8892DC11B888131046', 18],
      WSMINO: ['0xc9332BC1f891BC17e633Df670Ac1B1d40Cd68e88', 18],
      '_10MB': [deploymentsRaw['_10MB'].address, 18],
      '_10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '_10MB-USDT-LP': ['0x9dD5f66dCfB94A9f8A7e4FfEFBB282f39b6087fF', 18],
      '_10MB-CRO-LP': ['0x53288433D2b3017Df6612075ee7C43bB73C02D74', 18],
      'USDT-CRO-LP': ['0x9c58645396F353D9f4862aa63dEE4ab0Ed32dAC9', 18],
      'MMF-CRO-LP': ['0xFc40Dd016cC003BA2138d85EC2DdD1E743c3A9e5', 18],
      'WSMINO-CRO-LP': ['0x47B531302a264018ed5f4E04A5fE4fA6c4999eFA', 18],
      '_10SHARE-USDT-LP': ['0x1457db49F4B938d6bA36E71168bcf9C1C053d135', 18],
      '_10SHARE-CRO-LP': ['0xb3bd11A8f923f7272eb6cda1BdE5C689856590EB', 18],
    },
  },
  development: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    cronoscanUrl: 'https://polygonscan.com',
    defaultProvider: 'https://polygon-rpc.com/',
//    defaultProvider: 'http://127.0.0.1:8545/',
    deployments: deploymentsRaw,
    baseLaunchDate: new Date('2022-04-09 1:00:00Z'),
    bondLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    boardroomLaunchesAt: new Date('2022-04-09 1:00:00Z'),
    refreshInterval: 10000,
    externalTokens: {
      MMF: ['0xf603A6353A3831826D36128c6351358fcda139Ee', 18],
      USDT: ['0x5C623485a00934e46698B81520f8bA2b8f8B3339', 6],
      WCRO: ['0x594EBf69f8d731aEBf9b2C8892DC11B888131046', 18],
      WSMINO: ['0xc9332BC1f891BC17e633Df670Ac1B1d40Cd68e88', 18],
      '_10MB': [deploymentsRaw['_10MB'].address, 18],
      '_10SHARE': [deploymentsRaw['_10SHARE'].address, 18],
      '_10MB-USDT-LP': ['0x9dD5f66dCfB94A9f8A7e4FfEFBB282f39b6087fF', 18],
      '_10MB-CRO-LP': ['0x53288433D2b3017Df6612075ee7C43bB73C02D74', 18],
      'USDT-CRO-LP': ['0x9c58645396F353D9f4862aa63dEE4ab0Ed32dAC9', 18],
      'MMF-CRO-LP': ['0xFc40Dd016cC003BA2138d85EC2DdD1E743c3A9e5', 18],
      'WSMINO-CRO-LP': ['0x47B531302a264018ed5f4E04A5fE4fA6c4999eFA', 18],
      '_10SHARE-USDT-LP': ['0x1457db49F4B938d6bA36E71168bcf9C1C053d135', 18],
      '_10SHARE-CRO-LP': ['0xb3bd11A8f923f7272eb6cda1BdE5C689856590EB', 18],
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
      '_10MB': ['0xf4a12010D72EE00B16D3fEe56D93358Fc74AFCE5', 18],
      '_10SHARE': ['0x6C3F3aDc512Cd0cf1ed422b235A42879D5E3b226', 18],
      '_10MB-USDT-LP': ['0xb3b87Aa2053a561c17551c2484566Ccd1B83769F', 18],
      '_10MB-CRO-LP': ['0xb05B546342e4ff96Db66266526669eDedDDf7059', 18],
      'USDT-CRO-LP': ['0xB6a04E716E9c0b1B6494C10077494420D5F3E0aD', 18],
      'MMF-CRO-LP': ['0x881C5661760b40b4f44e2924Bd5b0b225a386016', 18],
      'WSMINO-CRO-LP': ['0x1AA235287f1f72728FA86B0BAbeC9D2E12908919', 18],
      '_10SHARE-USDT-LP': ['0x7D87D5c115967cCFD06Bcaa6a3022F10A190DAD6', 18],
      '_10SHARE-CRO-LP': ['0x42b325eA5b9418ae5AFd40a58Bc562aD4692663B', 18],
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
      '_10MB-USDT-LP': ['0x84392649eb0bC1c1532F2180E58Bae4E1dAbd8D6', 18],
      '_10MB-_10SHARE-LP': ['0x54f9fE531224Fa43Feb218B20ABa84d22a8fDc0C', 18],
      '_10MB-CRO-LP': ['0x107CDC0c46615C63EE4abC4E1e264D3BD12390e6', 18],
      '_10SHARE-CRO-LP': ['0x1303246855b5B5EbC71F049Fdb607494e97218f8', 18],
      '_10SHARE-CRO-APELP': ['0x0dE2a71b2f43CF588A00422d41E1C02D0E08D552', 18],
      '_10MB-USDT-APELP': ['0xB6E85031F313563bF12ea414118978C8BD78db5D', 18],
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
      '_10MB-USDT-LP': ['0x84392649eb0bC1c1532F2180E58Bae4E1dAbd8D6', 18],
      '_10MB-_10SHARE-LP': ['0x54f9fE531224Fa43Feb218B20ABa84d22a8fDc0C', 18],
      '_10MB-CRO-LP': ['0x107CDC0c46615C63EE4abC4E1e264D3BD12390e6', 18],
      '_10SHARE-CRO-LP': ['0x1303246855b5B5EbC71F049Fdb607494e97218f8', 18],
      '_10SHARE-CRO-APELP': ['0x0dE2a71b2f43CF588A00422d41E1C02D0E08D552', 18],
      '_10MB-USDT-APELP': ['0xB6E85031F313563bF12ea414118978C8BD78db5D', 18],
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
  _10MBUSDTLPB10MBRewardPool: {
    name: 'Earn _10SHARE by _10MB-USDT LP',
    poolId: 0,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '_10MB-USDT-LP',
    earnTokenName: '_10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  _10SHAREUSDTLPB10MBRewardPool: {
    name: 'Earn _10SHARE by _10SHARE-USDT LP',
    poolId: 1,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '_10SHARE-USDT-LP',
    earnTokenName: '_10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  _10SHARE10MBRewardPool: {
    name: 'Earn _10MB by _10SHARE',
    poolId: 2,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: '_10SHARE',
    earnTokenName: '_10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  USDT10MBRewardPool: {
    name: 'Earn _10MB by USDT',
    poolId: 3,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'USDT',
    earnTokenName: '_10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  MMF10MBRewardPool: {
    name: 'Earn _10MB by MMF',
    poolId: 4,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'MMF',
    earnTokenName: '_10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  WSMINO10MBRewardPool: {
    name: 'Earn _10MB by WSMINO',
    poolId: 5,
    sectionInUI: 2,
    contract: '_10MBMasterChef',
    depositTokenName: 'WSMINO',
    earnTokenName: '_10MB',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  /*
  BshareBnbLPBShareRewardPool: {
    name: 'Earn _10SHARE by _10SHARE-CRO LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'BshareBnbLPBShareRewardPool',
    depositTokenName: '_10SHARE-CRO-LP',
    earnTokenName: '_10SHARE',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  BombUSDTLPBShareRewardPool: {
    name: 'Earn _10SHARE by _10MB-USDT LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'BombUSDTLPBShareRewardPool',
    depositTokenName: '_10MB-USDT-LP',
    earnTokenName: '_10SHARE',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  BombBshareLPBShareRewardPool: {
    name: 'Earn _10SHARE by _10MB-_10SHARE LP',
    poolId: 4,
    sectionInUI: 2,
    contract: 'BombBshareLPBShareRewardPool',
    depositTokenName: '_10MB-_10SHARE-LP',
    earnTokenName: '_10SHARE',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },*/
};

export default configurations[process.env.NODE_ENV || 'development'];
