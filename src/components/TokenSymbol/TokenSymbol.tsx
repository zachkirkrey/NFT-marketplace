import React from 'react';

//Graveyard ecosystem logos
import bombLogo from '../../assets/img/10mb_bomb_2.png';
import tShareLogo from '../../assets/img/10mb_share.png';
import bombLogoPNG from '../../assets/img/10mb_bomb_2.png';
import xbombLogo from '../../assets/img/xbomb.png';

import tShareLogoPNG from '../../assets/img/10mb_share.png';
import tBondLogo from '../../assets/img/10mb_bond.png';

import bombFtmLpLogo from '../../assets/img/bomb-bitcoin-LP.png';
import bshareFtmLpLogo from '../../assets/img/bshare-bnb-LP.png';

import _10shareUSDCLP from '../../assets/img/10share-USDC-LP.png';
import _10mbUSDCLP from '../../assets/img/10mb-USDC-LP.png';

import bnbLogo from '../../assets/img/bnb.png';
import USDCLogo from '../../assets/img/USDC.png';
import WSMINOLogo from '../../assets/img/wsmino.svg';
import MMFLogo from '../../assets/img/mmf.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  "10MB": bombLogo,
  "10MBPNG": bombLogoPNG,
  "10SHAREPNG": tShareLogoPNG,
  "10SHARE": tShareLogo,
  "10BOND": tBondLogo,
  WCRO: bnbLogo,
  USDC: USDCLogo,
  WSMINO: WSMINOLogo,
  MMF: MMFLogo,
  '10MB-CRO LP': bombFtmLpLogo,
  '10MB-USDC LP': _10mbUSDCLP,
  '10SHARE-10MB LP': bombFtmLpLogo,
  '10MB-10SHARE LP': bombFtmLpLogo,
  '10SHARE-USDC LP': _10shareUSDCLP,
  '10SHARE-CRO LP': bshareFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} height={size} />;
};

export default TokenSymbol;
