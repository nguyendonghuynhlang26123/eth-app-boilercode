import { ethers } from 'ethers';

export interface StoredToken {
  network: string;
  contractAddress: string;
  symbol: string;
  tokenDecimal: number;
  image?: string;
}

export interface TokenItemPropsType {
  handleOnClick: () => any;
  selected: boolean;
  token: StoredToken;
  account: string;
  provider: ethers.providers.Web3Provider;
}

export interface TokenPanelPropsType {
  onSelectedItem: (address?: string) => any;
  selectedAddress?: string;
}
