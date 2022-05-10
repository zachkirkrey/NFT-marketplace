import React,{useState,useEffect} from 'react'
import {Wrapper,PriceWrapper} from './MintRedeem.styles';
import triangle from '../../../assets/img/triangle.svg';


type MorR = 'mint' | 'redeem';

export default function MintRedeem() {
  const [mintOrRedeem, setMintOrRedeem] = useState<MorR>('mint');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(()=> setLoading(false),2000);
  }, [])
  

  return (
     <Wrapper>
              <div className='stateButtons'>
                <button onClick={()=> setMintOrRedeem('mint')} className={mintOrRedeem === 'mint'? 'select': null}>MINT</button>
                <button onClick={()=> setMintOrRedeem('redeem')} className={mintOrRedeem === 'redeem'? 'select': null}>REDEEM</button>
              </div>
              <div className='content'>
              {mintOrRedeem === 'mint'? (
                <>
                  <div className='prices'>
                    <PriceContent value={27.72} type="USDT" border="redeem" bg="divBg" color="white" loading={loading} />
                    <span>+</span>
                    <PriceContent value={27.72} type="10SHARE" border="redeem" bg="divBg" color="white" loading={loading}/>
                  </div>
                  <div className='triangleContainer'>
                    <img src={triangle} alt="triangle icon" />
                    <img src={triangle} alt="triangle icon" />
                  </div>
                  <div className='mintTo'>
                    <PriceContent value={36.01} type="10MB" border="divBgDark" bg="divBgDark" color="blue" loading={loading} />
                  </div>
                </>
              ): (
                <>
                  <PriceContent value={36.01} type="10MB" border="redeem" bg="divBg" color="white" loading={loading}/>
                  <div className='triangleContainer'>
                    <img src={triangle} alt="triangle icon" />
                    <img src={triangle} alt="triangle icon" />
                  </div>
                  <div className='redeemTo'>
                    <PriceContent value={27.72} type="USDT" border="divBgDark" bg="divBgDark" color="blue" loading={loading}/>
                    <span>+</span>
                    <PriceContent value={27.72} type="10SHARE" border="divBgDark" bg="divBgDark" color="blue" loading={loading} />
                  </div>
                  <div className='amountCollect'>
                    <p>Amount to collect</p>
                    <div>
                      <PriceContent value={27.72} type="USDT" border="yellow" bg="divBgDark" color="white" loading={loading} />
                      <span>+</span>
                      <PriceContent value={27.72} type="10SHARE" border="yellow" bg="divBgDark" color="white" loading={loading} />
                    </div>
                  </div>
                </>
              )}
              <div className='info'>
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

              {mintOrRedeem === 'mint'? (
                <div className='mintButton'>
                  <button className={loading? 'loadingBg': null}>MINT</button>
                </div>
              ): (
                <div className='redeemButtons'>
                  <button>REDEEM</button>
                  <button className={loading? 'loadingBg': null}>COLLECT</button>
                </div>
              )}
            </Wrapper>
  )
}

interface priceProps{
  bg: string;
  border: string;
  color: string;
  value: number;
  type: string;
  loading: boolean;
}


function PriceContent({ bg,border,color,value,type, loading}: priceProps) {
  return (
      <PriceWrapper bg={bg} border={border} color={color} >
       <p>{type}</p>
       <p className={loading? 'loadingColor': null}>{loading? '0.0': value}</p>
      </PriceWrapper>
  )
}