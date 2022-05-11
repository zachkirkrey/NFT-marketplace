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
  _10MB: bombLogo,
  _10MBPNG: bombLogoPNG,
  _10SHAREPNG: tShareLogoPNG,
  X_10MB: xbombLogo,
  _10SHARE: tShareLogo,
  _10BOND: tBondLogo,
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
  '_10MB-CRO-LP': bombFtmLpLogo,
  '_10MB-USDT-LP': bombFtmLpLogo,
  '_10SHARE-_10MB-LP': bombFtmLpLogo,
  '_10MB-_10SHARE-LP': bombFtmLpLogo,
  '_10SHARE-USDT-LP': bombFtmLpLogo,
  '_10SHARE-CRO-LP': bshareFtmLpLogo,
  '_10SHARE-CRO-APELP': bshareFtmLpLogo,
  '_10MB-USDT-APELP': bombFtmLpLogo,
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
