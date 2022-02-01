import { IProviderOptions } from 'web3modal';
import { ethers } from 'ethers';

export interface Web3ContextProps {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  ens?: string;
  account?: string;
  disconnect: VoidFunction;
  showConnectModal: VoidFunction;
}
export interface Web3ProviderProps {
  network?: string;
  providerConfig: IProviderOptions;
  children: any;
}
