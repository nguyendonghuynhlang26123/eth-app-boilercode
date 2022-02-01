import { envConfig } from 'configs';
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
type ExpectNetworks = string[];
type EthScanProvider = ethers.providers.EtherscanProvider | undefined;
type Web3Provider = ethers.providers.Web3Provider;
type ExplorerError = string | undefined;

export const useEthScanProvider = (
  provider: ethers.providers.Web3Provider | undefined,
  networks: ExpectNetworks,
): [EthScanProvider, ExplorerError] => {
  const [ethScanProvider, setEthScanProvider] = useState<EthScanProvider>();
  const [errorMessage, setErrorMessage] = useState<ExplorerError>();

  useEffect(() => {
    if (provider && networks) {
      fetchEtherScan(provider, networks);
    }
  }, [provider, networks.toString()]);

  const fetchEtherScan = async (web3Provider: Web3Provider, allowedNetworks: ExpectNetworks) => {
    const network = await web3Provider.getNetwork();
    if (network.name) {
      if (allowedNetworks.includes(network.name)) {
        setErrorMessage(undefined);
        setEthScanProvider(new ethers.providers.EtherscanProvider(network.name, envConfig.ETHSCAN_KEY));
      } else setErrorMessage(`Dapp only supports networks ${allowedNetworks.join(', ')}, provided: ${network.name}`);
    } else {
      setErrorMessage('Not found block scan for network id = ' + network.chainId);
    }
  };

  return [ethScanProvider, errorMessage];
};
