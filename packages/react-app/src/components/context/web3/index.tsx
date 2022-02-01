import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';
import { Web3ContextProps, Web3ProviderProps } from './type';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material';
import { toast } from 'react-toastify';
import { useLoading } from 'hooks';
const defaultValues: Web3ContextProps = {
  disconnect: () => {},
  showConnectModal: () => {},
};

export const Web3Context = React.createContext<Web3ContextProps>(defaultValues);

export const Web3ContextProvider = ({ network = 'mainnet', providerConfig, children }: Web3ProviderProps) => {
  const theme: any = useTheme();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [account, setAccount] = useState<string>('');
  const [ensName, setAccountEns] = useState<string>('');
  const [, setLoading] = useLoading();

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

  const handleSyncProvider = async (web3Provider: ethers.providers.Web3Provider) => {
    const accounts = await web3Provider.listAccounts();
    const account = accounts[0];
    let ensName = null;
    try {
      ensName = await web3Provider.lookupAddress(account);
    } catch (err) {
      console.log('WEB3 PROVIDER: This network does not support ENS lookup');
    }

    setAccount(accounts[0]);
    setAccountEns(ensName ?? '');
    setSigner(web3Provider.getSigner());
    setLoading(false);
  };

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new ethers.providers.Web3Provider(newProvider));

    newProvider.on('chainChanged', (chainId: string) => {
      setProvider(new ethers.providers.Web3Provider(newProvider));
      toast.info(`Chain switched to chain ${chainId}`);
    });

    newProvider.on('accountsChanged', () => {
      setProvider(new ethers.providers.Web3Provider(newProvider));
      toast.info('Account chained');
    });

    // Subscribe to session disconnection
    newProvider.on('disconnect', (code: string, reason: string) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
      toast.info('Disconnect');
    });
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  useEffect(() => {
    setLoading(true);
  }, []);

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
      console.group('Loading Web3 provider...');
    } else setLoading(false);
  }, [loadWeb3Modal, web3Modal, web3Modal.cachedProvider]);

  useEffect(() => {
    if (provider) {
      setLoading(true);
      handleSyncProvider(provider);
    }
  }, [provider]);

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
