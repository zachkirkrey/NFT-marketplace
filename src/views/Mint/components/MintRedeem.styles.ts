import styled from 'styled-components';

export const Wrapper = styled.div`
  width: min(95%, 710px);
  min-height: 580px;
  display: flex;
  flex-direction: column;
  margin-inline: auto;
  background-color: ${({ theme }) => theme.color.mint.bg};
  box-shadow: -4px -4px 15px rgba(119, 117, 117, 0.21), 4px 4px 15px rgba(0, 0, 0, 0.9);
  border-radius: 23px;
  & .stateButtons {
    width: 100%;
    display: flex;
    background-color: ${({ theme }) => theme.color.mint.bg};
    box-shadow: -4px -4px 15px rgba(119, 117, 117, 0.21), 4px 4px 15px rgba(0, 0, 0, 0.9);
    border-radius: 23px;
    margin-bottom: 20px;
    & button {
      flex: 1;
      height: 60px;
      background-color: transparent;
      border-radius: 23px;
      border: none;
      color: ${({ theme }) => theme.color.white};
      font-weight: 600;
      font-size: 1.25rem;
      cursor: pointer;
    }
    & .select {
      background-color: ${({ theme }) => theme.color.mint.redeem};
    }
  }
  & .content {
    flex: 1;
    padding: 0 20px;
    & .prices,
    .redeemTo {
      display: flex;
      gap: 7px;
      & > span {
        color: ${({ theme }) => theme.color.mint.yellow};
        font-size: 3rem;
      }
    }

    & .triangleContainer {
      width: 55%;
      margin: 11px auto 17px;
      display: flex;
      justify-content: space-between;
    }
    & .mintTo {
      margin-bottom: 15px;
    }

    & .amountCollect {
      padding: 9px 0 15px;
      & > p {
        color: ${({ theme }) => theme.color.white};
        font-size: 0.8rem;
        padding-left: 20px;
        margin-bottom: 6px;
      }
      & > div {
        display: flex;
        gap: 7px;
      }
    }
    & span {
      color: ${({ theme }) => theme.color.mint.yellow};
      font-size: 3rem;
    }

    & .info {
      display: flex;
      margin: 0 20px;
      & > div {
        flex: 1;
        & > :first-child {
          font-size: 0.7rem;
          font-weight: 700;
          color: ${({ theme }) => theme.color.mint.yellow};
        }
        & > :last-child {
          font-size: 0.5rem;
          font-weight: 400;
          color: ${({ theme }) => theme.color.white};
        }
      }
      & > :last-child {
        padding-left: 90px;
      }
    }
  }

  & .mintButton {
    margin: 0 20px 30px;
    & button {
      width: 100%;
      height: 40px;
      background-color: ${({ theme }) => theme.color.mint.yellow};
      color: ${({ theme }) => theme.color.black};
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: 800;
      border: none;
      border-radius: 23px;
    }
    & .loadingBg {
      background-color: ${({ theme }) => theme.color.mint.gray};
    }
    & button:hover{
      box-shadow: -4px -4px 15px rgba(255, 255, 255, 0.36), 4px 4px 15px #000000;
      color: ${({ theme }) => theme.color.black};
    }
  }
  & .redeemButtons {
    margin: 30px 20px;
    & button {
      width: 100%;
      height: 40px;
      background-color: ${({ theme }) => theme.color.mint.yellow};
      color: ${({ theme }) => theme.color.black};
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: 800;
      border: none;
      border-radius: 23px;
    }
    & > :first-child {
      background-color: ${({ theme }) => theme.color.mint.redeem};
      color: ${({ theme }) => theme.color.white};
      margin-bottom: 10px;
    }
    & .loadingBg {
      background-color: ${({ theme }) => theme.color.mint.gray};
      color: ${({ theme }) => theme.color.black};
    }
    & button:hover{
      box-shadow: -4px -4px 15px rgba(255, 255, 255, 0.36), 4px 4px 15px #000000;
      color: ${({ theme }) => theme.color.black};
    }
  }
  & p,
  button,
  span ,
  input{
    font-family: 'Montserrat';
  }
  & p {
    margin: 0;
  }
  @media (min-width: 650px) {
    & .content {
      & .info {
        & > div {
          & > :first-child {
            font-size: 1rem;
          }
          & > :last-child {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
  @media (min-width: 1600px) {
    width: 900px;
    min-height: 700px;
  }
`;

export const PriceWrapper = styled.div<{ color: string; border: string }>`
  flex: 1;
  height: 70px;
  border-radius: 23px;
  border: 1px solid ${({ theme, border }) => theme.color.mint[border]};
  background-color: ${({ theme }) => theme.color.mint.divBgDark};
  padding-top: 8px;
  & > p {
    color: ${({ theme }) => theme.color.white};
  }
  & > :first-child {
    padding-left: 10px;
    font-size: 0.8rem;
    font-weight: 400;
  }
  & > :last-child {
    margin-left: 10px;
    font-size: 2.2rem;
    font-weight: 800;
    color: ${({ theme, color }) => theme.color.mint[color]};
    background-color: transparent;
    border: none;
  }
  & .loadingColor {
    color: ${({ theme }) => theme.color.mint.gray};
  }
  @media (min-width: 600px) {
    & > :first-child {
      padding-left: 20px;
    }
    & > :last-child {
      margin-left: 20px;
    }
  }
`;

export const InputWrapper = styled.div`
  flex: 1;
  height: 70px;
  border-radius: 23px;
  border: 1px solid ${({ theme }) => theme.color.mint.redeem};
  background-color: ${({ theme }) => theme.color.mint.divBg};
  padding-top: 8px;
  & > :first-child {
    color: ${({ theme }) => theme.color.white};
    padding-left: 20px;
    font-size: 0.8rem;
    font-weight: 400;
  }
  & > :last-child {
    width: 70%;
    margin-left: 20px;
    font-size: 2.2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.color.white};
    background-color: transparent;
    border: none;
  }
  & > :last-child:focus {
    outline: none;
  }
  & .loadingColor {
    color: ${({ theme }) => theme.color.mint.gray};
  }
`;
