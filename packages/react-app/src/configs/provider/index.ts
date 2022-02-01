import { IProviderOptions } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const providers: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '9790bda3dc49412ea06c22055b3489b7',
    },
  },
};
