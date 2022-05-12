import React, { useState } from 'react';
import { Wrapper, PriceWrapper, InputWrapper } from './MintRedeem.styles';
import triangle from '../../../assets/img/triangle.svg';
import { Button} from '@material-ui/core';


type MorR = 'mint' | 'redeem';

export default function MintRedeem() {
  const [mintOrRedeem, setMintOrRedeem] = useState<MorR>('mint');
  const [redeem, setRedeem] = useState('');
  const [mintUsdt, setMintUsdt] = useState('');
  const [mintShare, setMintShare] = useState('');

  return (
    <Wrapper>
      <div className="stateButtons">
        <button onClick={() => setMintOrRedeem('mint')} className={mintOrRedeem === 'mint' ? 'select' : null}>
          MINT
        </button>
        <button onClick={() => setMintOrRedeem('redeem')} className={mintOrRedeem === 'redeem' ? 'select' : null}>
          REDEEM
        </button>
      </div>
      <div className="content">
        {mintOrRedeem === 'mint' ? (
          <>
            <div className="prices">
              <Input type="USDT" inputState={mintUsdt} setInputState={setMintUsdt} />
              <span>+</span>
              <Input type="10SHARE" inputState={mintShare} setInputState={setMintShare} />
            </div>
            <div className="triangleContainer">
              <img src={triangle} alt="triangle icon" />
              <img src={triangle} alt="triangle icon" />
            </div>
            <div className="mintTo">
              <PriceContent
                value={Number((Number(+mintUsdt * 0.77) + Number(+mintShare * 0.77)).toFixed(2))}
                type="10MB"
                border="divBgDark"
                color="blue"
              />
            </div>
          </>
        ) : (
          <>
            <Input type="10MB" inputState={redeem} setInputState={setRedeem} />
            <div className="triangleContainer">
              <img src={triangle} alt="triangle icon" />
              <img src={triangle} alt="triangle icon" />
            </div>
            <div className="redeemTo">
              <PriceContent value={+(Number(redeem) * 0.77).toFixed(2)} type="USDT" border="divBgDark" color="blue" />
              <span>+</span>
              <PriceContent
                value={+(Number(redeem) * 0.77).toFixed(2)}
                type="10SHARE"
                border="divBgDark"
                color="blue"
              />
            </div>
            <div className="amountCollect">
              <p>Amount to collect</p>
              <div>
                <PriceContent value={+(Number(redeem) * 0.77).toFixed(2)} type="USDT" border="yellow" color="white" />
                <span>+</span>
                <PriceContent
                  value={+(Number(redeem) * 0.77).toFixed(2)}
                  type="10SHARE"
                  border="yellow"
                  color="white"
                />
              </div>
            </div>
          </>
        )}
        <div className="info">
          <div>
            <p>10_10MB = 0.77 USDT</p>
            <p>Last-Hour TWAP Price</p>
          </div>
          <div>
            <p>10_10BOND = 0.77 USDT</p>
            <p>Current Price: (_10MB)*2</p>
          </div>
        </div>
      </div>

      {mintOrRedeem === 'mint' ? (
        <div className="mintButton">
          <Button disabled={mintUsdt === '' && mintShare === '' } className={mintUsdt || mintShare ? null : 'loadingBg'}>MINT</Button>
        </div>
      ) : (
        <div className="redeemButtons">
          <Button disabled={redeem === ''} className={redeem ? null : 'loadingBg'}>
            REDEEM
          </Button>
          <Button disabled={redeem === ''} className={redeem ? null : 'loadingBg'}>COLLECT</Button>
        </div>
      )}
    </Wrapper>
  );
}

interface InputProps {
  type: string;
  inputState: string;
  setInputState: React.Dispatch<React.SetStateAction<string>>;
}

function Input({ inputState, setInputState, type }: InputProps) {
  return (
    <InputWrapper>
      <p>{type}</p>
      <input
        type="text"
        onChange={(e) => setInputState(e.target.value)}
        className={inputState ? null : 'loadingColor'}
        placeholder="0.0"
        value={inputState}
      />
    </InputWrapper>
  );
}

interface PriceProps {
  border: string;
  color: string;
  type: string;
  value: number;
}

function PriceContent({ border, color, value, type }: PriceProps) {
  return (
    <PriceWrapper border={border} color={color}>
      <p>{type}</p>
      <p className={value > 0 ? null : 'loadingColor'}>{value > 0 ? value : '0.0'}</p>
    </PriceWrapper>
  );
}
