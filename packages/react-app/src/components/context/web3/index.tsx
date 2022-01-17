import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';
import { Web3ContextProps, Web3ProviderProps } from './type';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material';
const defaultValues: Web3ContextProps = {
  disconnect: () => {},
  showConnectModal: () => {},
};

export const Web3Context = React.createContext<Web3ContextProps>(defaultValues);

export const Web3ContextProvider = ({ autoLoad = true, network = 'mainnet', providerConfig, children }: Web3ProviderProps) => {
  const theme: any = useTheme();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [account, setAccount] = useState<string>('');
  const [ensName, setAccountEns] = useState<string>('');

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      lightboxOpacity: 0.2,
      network,
      cacheProvider: true,
      providerOptions: providerConfig,
      theme: {
        background: theme.palette.background.paper,
        main: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        border: theme.palette.divider,
        hover: theme.palette.primary.lighter,
      },
    });
  }, [providerConfig, network, theme]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(newProvider);

    const accounts = await web3Provider.listAccounts();
    const account = accounts[0];
    let ensName = await web3Provider.lookupAddress(account);

    setAccount(accounts[0]);
    setAccountEns(ensName ?? '');
    setProvider(web3Provider);
    setSigner(web3Provider.getSigner());
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [autoLoad, loadWeb3Modal, web3Modal, web3Modal.cachedProvider]);

  const value: Web3ContextProps = {
    ...defaultValues,
    disconnect: logoutOfWeb3Modal,
    showConnectModal: loadWeb3Modal,
    account: account,
    ens: ensName,
    provider: provider,
    signer: signer,
  };
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
