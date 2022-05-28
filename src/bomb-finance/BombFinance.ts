// import { Fetcher, Route, Token } from '@uniswap/sdk';
//import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@spiritswap/sdk';
import { Fetcher, Route, Token } from '@pancakeswap/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, BShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import IBombBorrowableABI from './IBombBorrowable.abi.json';

import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { CRO_TICKER, SPOOKY_ROUTER_ADDR, _10MB_TICKER } from '../utils/constants';

import { abi as LpReserveContract } from '../../src/bomb-finance/deployments/LpContract.json';
import { abi as UniswapV2Factory } from '../../src/bomb-finance/deployments/UniswapV2Factory.json';

/**
 * An API module of Bomb Money contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class BombFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  "10MBUSDT_LP": Contract;
  "10MB": ERC20;
  "10SHARE": ERC20;
  "10BOND": ERC20;
  CRO: ERC20;
  USDT: ERC20;
  Pool: Contract;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this["10MB"] = new ERC20(deployments["_10MB"].address, provider, '10MB');
    this["10SHARE"] = new ERC20(deployments["_10SHARE"].address, provider, '10SHARE');
    this["10BOND"] = new ERC20(deployments["_10BOND"].address, provider, '10BOND');
    this.CRO = this.externalTokens['WCRO'];
    this.USDT = this.externalTokens['USDT'];
    this.Pool = new Contract(deployments['Pool'].address, deployments['Pool'].abi, provider);
    this.Pool = this.Pool.connect(this.signer);
    // Uniswap V2 Pair

    this["10MBUSDT_LP"] = new Contract(externalTokens['10MB-USDT-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this["10MB"], this["10SHARE"], this["10BOND"], ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this["10MBUSDT_LP"] = this["10MBUSDT_LP"].connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM APE TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getBombStat(): Promise<TokenStat> {
    const { _10MBMasterChef } = this.contracts;
    const supply = await this["10MB"].totalSupply();
    const _10MBMasterchefSupply = await this["10MB"].balanceOf(_10MBMasterChef.address);
    const bombCirculatingSupply = supply.sub(_10MBMasterchefSupply);
    //const priceInCRO = await this.getTokenPriceFromMMFInCRO(this["10MB"]);
    //const priceInCROstring = priceInCRO.toString();
    const price10MBInCRO = await this.getTokenPriceFromMMFInCRO(this["10MB"]);
    // const priceOfOneBNB = await this.getWBNBPriceFromPancakeswap();
    const priceOfOneFtmInDollars = await this.getWCROPriceFromMMF();
    console.log('price10MBInCRO ', price10MBInCRO);
    console.log('priceOfOneFtmInDollars ', priceOfOneFtmInDollars);
    const priceOf10MBInDollars = (Number(price10MBInCRO) * Number(priceOfOneFtmInDollars)).toFixed(2);
    //console.log('priceOfBombInDollars', priceOfBombInDollars);

    return {
      //tokenInUSDT: (Number(priceInCRO) * 100).toString(),
      tokenInUSDT: priceOf10MBInDollars.toString(),
      priceInDollars: priceOf10MBInDollars.toString(),
      totalSupply: getDisplayBalance(supply, this["10MB"].decimal, 0),
      circulatingSupply: getDisplayBalance(bombCirculatingSupply, this["10MB"].decimal, 0),
    };
  }

  async getUSDTPriceUSD(): Promise<Number> {
    const priceOfOneUSDT = await this.getUSDTPriceFromMMF();
    return Number(priceOfOneUSDT);
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    console.log('NAME', name);

    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('10MB') ? this["10MB"] : this["10SHARE"];
    //console.log('NAME', name);
    const isBomb = name.startsWith('10MB');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const croAmountBN = await this.CRO.balanceOf(lpToken.address);
    const croAmount = getDisplayBalance(croAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const croAmountInOneLP = Number(croAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isBomb);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      croAmount: croAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  async getLPStatUSDT(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('10MB') ? this["10MB"] : this["10SHARE"];
    const isBomb = name.startsWith('10MB');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const USDTAmountBN = await this.USDT.balanceOf(lpToken.address);

    console.log("name ", name)
    console.log("USDTAmountBN ", USDTAmountBN.toString())
    const USDTAmount = getDisplayBalance(USDTAmountBN, 6);
    console.log("USDTAmount ", USDTAmount.toString())
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const croAmountInOneLP = Number(USDTAmount) / Number(lpTokenSupply);
    console.log("croAmountInOneLP ", croAmountInOneLP.toString())
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isBomb);

    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();

    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();

    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      croAmount: croAmountInOneLP.toFixed(7).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }
  /**
   * Use this method to get price for Bomb
   * @returns TokenStat for _10BOND
   * priceInCRO
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const bombStat = await this.getBombStat();
    console.log('bombStat 1', bombStat);
    const bondBombRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondBombRatioBN / 1e13 > 1 ? bondBombRatioBN / 1e13 : 1;
    const priceOf_10BONDInDollars = (Number(bombStat.priceInDollars) * modifier).toFixed(4);
    const supply = await this["10BOND"].displayedTotalSupply();
    return {
      tokenInUSDT: priceOf_10BONDInDollars,
      priceInDollars: priceOf_10BONDInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for _10SHARE
   * priceInCRO
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { _10MBMasterChef } = this.contracts;

    const supply = await this["10SHARE"].totalSupply();

    const priceInCRO = await this.getTokenPriceFromMMFInCRO(this["10SHARE"]);
    console.log('10SHARE priceInCRO ', priceInCRO);
    const _10MBMasterchefSupply = await this["10SHARE"].balanceOf(_10MBMasterChef.address);
    const tShareCirculatingSupply = supply.sub(_10MBMasterchefSupply);
    const priceOfOneCRO = await this.getWCROPriceFromMMF();
    console.log('10SHARE priceOfOneCRO ', priceOfOneCRO);
    const priceOfSharesInDollars = (Number(priceInCRO) * Number(priceOfOneCRO)).toFixed(2);

    return {
      tokenInUSDT: priceOfSharesInDollars,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this["10SHARE"].decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this["10SHARE"].decimal, 0),
    };
  }

  async getBombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { Oracle, _10MBMasterChef } = this.contracts;
    const expectedPrice = await Oracle.twap(this["10MB"].address, ethers.utils.parseEther('10'));

    const supply = await this["10MB"].totalSupply();
    const _10MBMasterchefSupply = await this["10MB"].balanceOf(_10MBMasterChef.address);
    const bombCirculatingSupply = supply.sub(_10MBMasterchefSupply);
    return {
      tokenInUSDT: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this["10MB"].decimal, 0),
      circulatingSupply: getDisplayBalance(bombCirculatingSupply, this["10MB"].decimal, 0),
    };
  }

  async get10MBPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.get10MBUpdatedPrice();
  }

  // async getBombPegTWAP(): Promise<any> {
  //   const { Treasury } = this.contracts;
  //   const updatedPrice = Treasury.get10MBUpdatedPrice();
  //   const updatedPrice2 = updatedPrice * 10000;
  //   return updatedPrice2;
  // }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    // const burnableBomb = (Number(Treasury.getBurnable10MBLeft()) * 1000).toFixed(2).toString();
    return Treasury.getBurnable10MBLeft();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const stat = bank.earnTokenName === '10MB' ? await this.getBombStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === '10MB') {
      return await poolContract._10MBPerSecond();
    } else if (earnTokenName === '10SHARE') {
      return await poolContract._10SHAREPerSecond();
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getWCROPriceFromMMF();
    console.log('getDepositTokenPriceInDollars 1 ', tokenName);
    console.log('getDepositTokenPriceInDollars 2 ', token.address);
    if (tokenName === 'WCRO') {
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      if (tokenName === '10MB-USDT-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this["10MB"], true);
      } else if (tokenName === '10SHARE-CRO-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this["10SHARE"], false);
      } else if (tokenName === '10MB-10SHARE-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this["10MB"], true);
      } else if (tokenName === '10SHARE-USDT-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this["10MB"], true);
      } else if (tokenName === '10SHARE-CRO-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this["10SHARE"], true);
      } else if (tokenName === 'USDT-CRO-LP') {
        tokenPrice = await this.getNonNativeLPTokenPrice(token, this.USDT);
      } else {
        tokenPrice = await this.getTokenPriceFromMMFInCRO(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryBombPrice = await Treasury.get10MBPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryBombPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForBomb = await Treasury.get10MBPrice();

    return await Treasury.redeemBonds(decimalToBalance(amount), priceForBomb);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const _10SHAREPrice = (await this.getShareStat()).priceInDollars;
    const _10MBPrice = (await this.getBombStat()).priceInDollars;

    const boardroomtShareBalanceOf = await this["10SHARE"].balanceOf(this.currentBoardroom().address);
    const bombStakeBalanceOf = '0'; //await this["10MB"].balanceOf(this.X_10MB.address);

    const boardroomTVL =
      Number(getDisplayBalance(boardroomtShareBalanceOf, this["10SHARE"].decimal)) * Number(_10SHAREPrice);
    const bombTVL =
      Number(getDisplayBalance(BigNumber.from(bombStakeBalanceOf), this["10MB"].decimal)) * Number(_10MBPrice);

    return totalValue + boardroomTVL + bombTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be CRO in most cases)
   * @param isBomb sanity check for usage of bomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isBomb: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isBomb === true ? await this.getBombStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async getNonNativeLPTokenPrice(lpToken: ERC20, token: ERC20): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const priceOfOneFtmInDollars = await this.getWCROPriceFromMMF();
    const tokenPriceCro = await this.getTokenPriceFromMMFInCRO(token);
    const tokenPriceDollarNumber = Number(tokenPriceCro) * Number(priceOfOneFtmInDollars);
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(tokenPriceDollarNumber) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === '10MB') {
        return await pool.pending10MB(poolId, account);
      } else {
        return await pool.pending10SHARE(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call pendingShare() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 USDT * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 USDT * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    console.log('pool ', pool);
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Boardroom;
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async getTokenPriceFromMMFInCRO(tokenContract: ERC20): Promise<string> {
    const { WCRO, USDT } = this.config.externalTokens;

    const mmfFactoryAddress = '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4';

    const mmfFactory = new ethers.Contract(mmfFactoryAddress, UniswapV2Factory, this.provider);

    const lpAddress = await mmfFactory.getPair(WCRO[0], tokenContract.address);

    console.log('tokenContract.address ', tokenContract.address);
    console.log('WCRO[0] ', WCRO[0]);
    console.log('lpAddress ', lpAddress);

    const pairContract = new ethers.Contract(lpAddress, LpReserveContract, this.provider);

    const reserves = await pairContract.getReserves();
    let marketPrice = 0;
    let marketPriceBN = BigNumber.from(0);

    const token0 = await pairContract.token0();

    if (token0 == tokenContract.address) {
      marketPriceBN = BigNumber.from(reserves[1]).mul(BigNumber.from(10).pow(9)).div(reserves[0]).div('1000000');
    } else {
      marketPriceBN = BigNumber.from(reserves[0]).mul(BigNumber.from(10).pow(9)).div(reserves[1]).div('1000000');
    }

    if (tokenContract.address.toLocaleLowerCase() == USDT[0].toLocaleLowerCase()) {
      marketPrice = marketPriceBN.div(BigNumber.from(10).pow(12)).toNumber() / 1000;
    } else {
      marketPrice = marketPriceBN.toNumber() / 1000;
    }

    console.log('marketPrice ', marketPrice);

    return marketPrice + '';
  }

  async getTokenPriceFromMMFInUSD(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;

    const { USDT } = this.config.externalTokens;

    const mmfFactoryAddress = '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4'

    const mmfFactory = new ethers.Contract(mmfFactoryAddress, UniswapV2Factory, this.provider);

    const lpAddress = mmfFactory.getPair(tokenContract.address, USDT[0]);

    const pairContract = new ethers.Contract(lpAddress, LpReserveContract, this.provider);

    const reserves = await pairContract.getReserves();
    let marketPrice = 0;

    const token0 = await pairContract.token0();

    if (token0 == tokenContract.address) {
      marketPrice = BigNumber.from(reserves[1]).mul(BigNumber.from(10).pow(9)).div(reserves[0]).toNumber() / 1000000000;
    } else {
      marketPrice = BigNumber.from(reserves[0]).mul(BigNumber.from(10).pow(9)).div(reserves[1]).toNumber() / 1000000000;
    }

    return marketPrice + '';
  }

  async getTokenPriceFromMMF10MBUSD(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;

    return this.getTokenPriceFromMMFInUSD(this["10MB"]);
  }

  // async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { chainId } = this.config;

  //   const { WCRO } = this.externalTokens;

  //   const cro = new TokenSpirit(chainId, WCRO.address, WCRO.decimal);
  //   const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
  //   try {
  //     const croToToken = await FetcherSpirit.fetchPairData(cro, token, this.provider);
  //     const liquidityToken = croToToken.liquidityToken;
  //     let croBalanceInLP = await WCRO.balanceOf(liquidityToken.address);
  //     let croAmount = Number(getFullDisplayBalance(croBalanceInLP, WCRO.decimal));
  //     let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
  //     let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
  //     const priceOfOneFtmInDollars = await this.getWCROPriceFromMMF();
  //     let priceOfShiba = (croAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
  //     return priceOfShiba.toString();
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
  //   }
  // }

  async getWCROPriceFromMMF(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WCRO, USDT } = this.externalTokens;

    try {
      const dai_cro_lp_pair = this.externalTokens['USDT-CRO-LP'];
      let cro_amount_BN = await WCRO.balanceOf(dai_cro_lp_pair.address);
      let cro_amount = Number(getFullDisplayBalance(cro_amount_BN, WCRO.decimal));
      let DAI_amount_BN = await USDT.balanceOf(dai_cro_lp_pair.address);
      let DAI_amount = Number(getFullDisplayBalance(DAI_amount_BN, USDT.decimal));
      return (DAI_amount / cro_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WCRO: ${err}`);
    }
  }

  async getUSDTPriceFromMMF(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { USDT } = this.externalTokens;
    try {
      const USDTPriceInCRO = await this.getTokenPriceFromMMFInCRO(USDT);

      const wbnbPrice = await this.getWCROPriceFromMMF();

      const USDTprice = (Number(USDTPriceInCRO) * Number(wbnbPrice)).toFixed(2).toString();
      //console.log('USDTprice', USDTprice);
      return USDTprice;
    } catch (err) {
      console.error(`Failed to fetch token price of USDT: ${err}`);
    }
  }

  // async getUSDTPriceFromMMF(): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { USDT, FUSDT } = this.externalTokens;
  //   try {
  //     const USDT_USDT_lp_pair = this.externalTokens['USDT-USDT-LP'];
  //     let cro_amount_BN = await USDT.balanceOf(USDT_USDT_lp_pair.address);
  //     let cro_amount = Number(getFullDisplayBalance(cro_amount_BN, USDT.decimal));
  //     let USDT_amount_BN = await FUSDT.balanceOf(USDT_USDT_lp_pair.address);
  //     let USDT_amount = Number(getFullDisplayBalance(USDT_amount_BN, FUSDT.decimal));
  //     console.log('USDT price', (USDT_amount / cro_amount).toString());
  //     return (USDT_amount / cro_amount).toString();
  //     console.log('USDT price');
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of USDT: ${err}`);
  //   }
  // }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getBoardroomAPR() {
    const Boardroom = this.currentBoardroom();
    console.log('getBoardroomAPR 1 ', Boardroom);
    let latestSnapshotIndex;
    try {
      latestSnapshotIndex = await Boardroom.latestSnapshotIndex();
    } catch (err) {
      latestSnapshotIndex = BigNumber.from(0);
    }
    console.log('getBoardroomAPR 2 ', Boardroom);
    const lastHistory = await Boardroom.boardHistory(latestSnapshotIndex);
    console.log('getBoardroomAPR 3');
    const lastRewardsReceived = lastHistory[1];
    console.log('getBoardroomAPR 4');
    const _10SHAREPrice = (await this.getShareStat()).priceInDollars;
    console.log('getBoardroomAPR 5');
    const _10MBPrice = (await this.getBombStat()).priceInDollars;
    console.log('getBoardroomAPR 6');
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(_10MBPrice) * 4;
    console.log('getBoardroomAPR 7');
    const boardroomtShareBalanceOf = await this["10SHARE"].balanceOf(Boardroom.address);
    console.log('getBoardroomAPR 8');
    const boardroomTVL =
      Number(getDisplayBalance(boardroomtShareBalanceOf, this["10SHARE"].decimal)) * Number(_10SHAREPrice);
    console.log('getBoardroomAPR 9');
    const realAPR = ((amountOfRewardsPerDay * 100) / boardroomTVL) * 365;
    return realAPR;
  }

  async getBombStakeAPR() {
    /*
    const Boardroom = this.currentBoardroom();
    const latestSnapshotIndex = await Boardroom.latestSnapshotIndex();
    const lastHistory = await Boardroom.boardroomHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const _10MBPrice = (await this.getBombStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(_10MBPrice) * 4;
    const xBombBombBalanceOf = await this["10MB"].balanceOf(this..address);
    const bombTVL = Number(getDisplayBalance(xBombBombBalanceOf, this.X_10MB.decimal)) * Number(_10MBPrice);
    const realAPR = ((amountOfRewardsPerDay * 20) / bombTVL) * 365;

    return realAPR;
    */
   return 0
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromBoardroom(): Promise<boolean> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromBoardroom(): Promise<boolean> {
    console.log('canUserUnstakeFromBoardroom 1');
    const Boardroom = this.currentBoardroom();
    console.log('Boardroom ', Boardroom);
    console.log('this.myAccount ', this.myAccount);
    const canWithdraw = await Boardroom.canWithdraw(this.myAccount);
    console.log('canUserUnstakeFromBoardroom 2');
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    const notStaked = Number(getDisplayBalance(stakedAmount, this["10SHARE"].decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromBoardroom(): Promise<BigNumber> {
    // const Boardroom = this.currentBoardroom();
    // const mason = await Boardroom.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.totalSupply();
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old boardroom. please withdraw and deposit the 10SHARE again.");
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async stakeToBomb(amount: string): Promise<TransactionResponse> {
    const Xbomb = this.contracts.x_10MB;
    return await Xbomb.enter(decimalToBalance(amount));
  }

  async redeemFromBomb(amount: string): Promise<TransactionResponse> {
    const BombRouter = this.contracts.BombRouter;
    const expiry = new Date(Date.now() + 2880);
    return await BombRouter.redeem(
      '',
      decimalToBalance(amount),
      this.myAccount,
      expiry.getTime(),
      '0x',
    );
  }

  async redeemFromUSDT(amount: string): Promise<TransactionResponse> {
    const BombRouter = this.contracts.BombRouter;
    const expiry = new Date(Date.now() + 2880);
    return await BombRouter.redeem(
      '',
      decimalToBalance(amount),
      this.myAccount,
      expiry.getTime(),
      '0x',
    );
  }
  async supplyToUSDT(amount: string): Promise<TransactionResponse> {
    const BombRouter = this.contracts.BombRouter;
    const expiry = new Date(Date.now() + 2880);
    return await BombRouter.mint('', decimalToBalance(amount), this.myAccount, expiry.getTime());
  }

  async supplyToBomb(amount: string): Promise<TransactionResponse> {
    const BombRouter = this.contracts.BombRouter;
    const expiry = new Date(Date.now() + 2880);
    return await BombRouter.mint('', decimalToBalance(amount), this.myAccount, expiry.getTime());
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getStakedBomb(): Promise<BigNumber> {
    const Xbomb = this.contracts.x_10MB;
    return await Xbomb.balanceOf(this.myAccount);
  }

  async getTotalStakedBomb(): Promise<BigNumber> {
    const Xbomb = this.contracts.x_10MB;
    const bomb = this["10MB"];
    return await bomb.balanceOf(Xbomb.address);
  }

  async getTotalSuppliedBomb(): Promise<BigNumber> {
    //const bbombBomb = this._10MB_BORROWABLE;
    // const bomb = this["10MB"];
    //const totalBomb = await bbombBomb.totalBalance();
    //  const borrowBomb = await bbombBomb.totalBorrows();
    // const totalSupplied = totalBomb + borrowBomb;
    //return totalBomb;
    return BigNumber.from(0)
  }

  async getTotalSuppliedUSDT(): Promise<BigNumber> {
    //const bbombBomb = this.USDT_BORROWABLE;
    // const bomb = this["10MB"];
    //const totalUSDT = await bbombBomb.totalBalance();
    //const borrowUSDT = await bbombBomb.totalBorrows();
    //  const totalSupplied = totalUSDT + borrowUSDT;
    //return totalUSDT;
    return BigNumber.from(0)
  }

  async getXbombExchange(): Promise<BigNumber> {
    const Xbomb = this.contracts.x_10MB;
    const XbombExchange = await Xbomb.getExchangeRate();

    const xBombPerBomb = parseFloat(XbombExchange) / 1000000000000000000;
    const xBombRate = xBombPerBomb.toString();
    return parseUnits(xBombRate, 18);
  }

  async withdrawFromBomb(amount: string): Promise<TransactionResponse> {
    const Xbomb = this.contracts.x_10MB;
    return await Xbomb.leave(decimalToBalance(amount));
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    console.log('getEarningsOnBoardroom ', Boardroom);
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    console.log('getUserClaimRewardTime 1');
    const nextEpochTimestamp = await Boardroom.nextEpochPoint(); //in unix timestamp
    console.log('getUserClaimRewardTime 2');
    const currentEpoch = await Boardroom.epoch();
    console.log('getUserClaimRewardTime 3');
    const mason = await Boardroom.directors(this.myAccount);
    console.log('getUserClaimRewardTime 4');
    const startTimeEpoch = mason.epochTimerStart;
    console.log('getUserClaimRewardTime 5');
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    console.log('getUserClaimRewardTime 6');
    const rewardLockupEpochs = await Boardroom.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const nextEpochTimestamp = await Boardroom.nextEpochPoint();
    const currentEpoch = await Boardroom.epoch();
    const mason = await Boardroom.directors(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Boardroom.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === '10MB') {
        asset = this["10MB"];
        assetUrl = 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bomb-512.png';
      } else if (assetName === '10SHARE') {
        asset = this["10SHARE"];
        assetUrl = 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/bshare-512.png';
      } else if (assetName === '10BOND') {
        asset = this["10BOND"];
        assetUrl = 'https://raw.githubusercontent.com/bombmoney/bomb-assets/master/_10BOND-512.png';
      } else if (assetName === 'USDT') {
        asset = this.USDT;
        assetUrl = 'https://bscscan.com/token/images/USDT_32.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  async provideBombFtmLP(croAmount: string, bombAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(croAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(
      bombAmount,
      bombAmount.mul(992).div(1000),
      parseUnits(croAmount, 18).mul(992).div(1000),
      overrides,
    );
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this["10MBUSDT_LP"].getReserves();
    let quote;
    if (tokenName === '10MB') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryBoardroomFundedFilter = Treasury.filters.BoardroomFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let boardroomFundEvents = await Treasury.queryFilter(treasuryBoardroomFundedFilter);
    var events: any[] = [];
    boardroomFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].boardroomFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === CRO_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === _10MB_TICKER ? this["10MB"] : this["10SHARE"];
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === CRO_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === _10MB_TICKER ? this["10MB"] : this["10SHARE"];
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async swap_10BONDToBShare(_10BONDAmount: BigNumber): Promise<TransactionResponse> {
    const { BShareSwapper } = this.contracts;
    return await BShareSwapper.swap_10BONDToBShare(_10BONDAmount);
  }
  async estimateAmountOfBShare(_10BONDAmount: string): Promise<string> {
    const { BShareSwapper } = this.contracts;
    try {
      const estimateBN = await BShareSwapper.estimateAmountOfBShare(parseUnits(_10BONDAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate bshare amount: ${err}`);
    }
  }

  async getBShareSwapperStat(address: string): Promise<BShareSwapperStat> {
    const { BShareSwapper } = this.contracts;
    const bshareBalanceBN = await BShareSwapper.getBShareBalance();
    const _10BONDBalanceBN = await BShareSwapper.get_10BONDBalance(address);
    // const bombPriceBN = await BShareSwapper.get10MBPrice();
    // const bsharePriceBN = await BShareSwapper.getBSharePrice();
    const rateBSharePerBombBN = await BShareSwapper.getBShareAmountPerBomb();
    const bshareBalance = getDisplayBalance(bshareBalanceBN, 18, 5);
    const _10BONDBalance = getDisplayBalance(_10BONDBalanceBN, 18, 5);
    return {
      bshareBalance: bshareBalance.toString(),
      _10BONDBalance: _10BONDBalance.toString(),
      // bombPrice: bombPriceBN.toString(),
      // bsharePrice: bsharePriceBN.toString(),
      rateBSharePerBomb: rateBSharePerBombBN.toString(),
    };
  }
}
