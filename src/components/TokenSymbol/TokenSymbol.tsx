import React from 'react';

//Graveyard ecosystem logos
import bombLogo from '../../assets/img/bomb.png';
import tShareLogo from '../../assets/img/bshares.png';
import bombLogoPNG from '../../assets/img/bomb.png';
import xbombLogo from '../../assets/img/xbomb.png';

import tShareLogoPNG from '../../assets/img/bshares.png';
import tBondLogo from '../../assets/img/bbond.png';

import bombFtmLpLogo from '../../assets/img/bomb-bitcoin-LP.png';
import bshareFtmLpLogo from '../../assets/img/bshare-bnb-LP.png';

import bnbLogo from '../../assets/img/bnb.png';
import USDTLogo from '../../assets/img/BCTB-icon.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  "10MB": bombLogo,
  "10MBPNG": bombLogoPNG,
  "10SHAREPNG": tShareLogoPNG,
  X_10MB: xbombLogo,
  "10SHARE": tShareLogo,
  "10BOND": tBondLogo,
  WCRO: bnbLogo,
  BOO: bnbLogo,
  SHIBA: bnbLogo,
  ZOO: bnbLogo,
  CAKE: bnbLogo,
  SUSD: bnbLogo,
  SUSDT: USDTLogo,
  USDT: USDTLogo,
  WSMINO: USDTLogo,
  MMF: USDTLogo,
  SVL: bnbLogo,
  '10MB-CRO-LP': bombFtmLpLogo,
  '10MB-USDT-LP': bombFtmLpLogo,
  '10SHARE-_10MB-LP': bombFtmLpLogo,
  '10MB-10SHARE-LP': bombFtmLpLogo,
  '10SHARE-USDT-LP': bombFtmLpLogo,
  '10SHARE-CRO-LP': bshareFtmLpLogo,
  '10SHARE-CRO-APELP': bshareFtmLpLogo,
  '10MB-USDT-APELP': bombFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
