import { BigNumber } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
type ConvertToUsdFunction = (eth: number | BigNumber) => Promise<BigNumber>;
type UsdPrice = number;

export const useUsdPrice = (): [UsdPrice, ConvertToUsdFunction] => {
  const [usd, setUsdPrice] = useState<number>(0);

  useEffect(() => {
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`)
      .then((res: any) => res.json())
      .then((data: any) => {
        if (data['USD']) setUsdPrice(Number(data['USD']));
      });
  }, []);

  const converting = async (eth: number | BigNumber): Promise<BigNumber> => {
    const { USD } = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`).then((res: any) => res.json());
    const ethBigNum = BigNumber.from(eth.toString());
    return ethBigNum.mul(BigNumber.from(USD));
  };

  return [usd, converting];
};
